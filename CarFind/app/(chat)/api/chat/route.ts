import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
import { auth, type UserType } from '@/app/(auth)/auth';
import type { RequestHints } from '@/lib/ai/prompts';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { convertToUIMessages, generateUUID } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
// Removed unused template tool imports - using carTools instead
import { carTools } from '@/lib/tools';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from './schema';
import { CAR_ASSISTANT_SYSTEM_PROMPT } from '@/lib/prompts/car-assistant-prompt';
import { geolocation } from '@vercel/functions';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { after } from 'next/server';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage } from '@/lib/types';
import type { ChatModel } from '@/lib/ai/models';
import type { VisibilityType } from '@/components/visibility-selector';

// Enhanced error handling utilities for car search integration
function validateCarToolsAvailability() {
  const requiredTools = ['searchCars', 'getCarDetails', 'getRecommendations'];
  const availableTools = Object.keys(carTools);

  const missingTools = requiredTools.filter(
    (tool) => !availableTools.includes(tool),
  );

  if (missingTools.length > 0) {
    throw new Error(
      `Missing required car search tools: ${missingTools.join(', ')}`,
    );
  }

  return true;
}

function logCarToolError(toolName: string, error: any, context?: any) {
  console.error(`🚨 Car Tool Error [${toolName}]:`, {
    error: error.message || error,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}

function createCarSearchErrorMessage(error: any): string {
  if (error.message?.includes('car search')) {
    return "I'm having trouble searching for cars right now. Please try rephrasing your request or try again in a moment.";
  }

  if (error.message?.includes('car details')) {
    return "I couldn't retrieve the details for that specific car. Please try searching for cars first or provide a different car ID.";
  }

  if (error.message?.includes('recommendations')) {
    return "I'm having difficulty generating car recommendations at the moment. Please try describing your needs differently.";
  }

  return 'I encountered an issue while helping you find cars. Please try again or rephrase your request.';
}

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    console.error('Invalid request body:', error);
    return new ChatSDKError(
      'bad_request:api',
      'Invalid request format. Please check your message data.',
    ).toResponse();
  }

  try {
    // Validate car tools availability before processing
    validateCarToolsAvailability();

    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel['id'];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    // Enhanced validation for car search context
    if (!id || typeof id !== 'string') {
      return new ChatSDKError(
        'bad_request:api',
        'Invalid chat ID provided.',
      ).toResponse();
    }

    if (!message || !message.parts || message.parts.length === 0) {
      return new ChatSDKError(
        'bad_request:api',
        'Empty message content is not allowed.',
      ).toResponse();
    }

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError('rate_limit:chat').toResponse();
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError('forbidden:chat').toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        try {
          const result = streamText({
            model: myProvider.languageModel(selectedChatModel),
            system: CAR_ASSISTANT_SYSTEM_PROMPT, // 🔄 CHANGED: Use external prompt file
            messages: convertToModelMessages(uiMessages),
            stopWhen: stepCountIs(5),
            experimental_activeTools:
              selectedChatModel === 'chat-model-reasoning'
                ? []
                : ['searchCars', 'getCarDetails', 'getRecommendations'],
            experimental_transform: smoothStream({ chunking: 'word' }),
            tools: {
              searchCars: carTools.searchCars,
              getCarDetails: carTools.getCarDetails,
              getRecommendations: carTools.getRecommendations,
            },
            experimental_telemetry: {
              isEnabled: isProductionEnvironment,
              functionId: 'stream-text',
            },
            onError: (error) => {
              // Enhanced error handling for car search tool failures
              logCarToolError('StreamText', error.error, {
                chatId: id,
                userId: session.user.id,
              });

              const errorMessage = error.error as any;
              if (errorMessage?.message?.includes('tool')) {
                console.error('Car tool execution failed:', errorMessage);
              }

              // Return void as expected by the callback
            },
          });

          result.consumeStream();

          dataStream.merge(
            result.toUIMessageStream({
              sendReasoning: true,
            }),
          );
        } catch (toolError) {
          // Handle tool-specific errors
          logCarToolError('ToolExecution', toolError, { chatId: id });

          // Create a fallback response for tool failures
          console.error(
            'Car search tool execution failed, providing fallback message',
          );
        }
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        try {
          await saveMessages({
            messages: messages.map((message) => ({
              id: message.id,
              role: message.role,
              parts: message.parts,
              createdAt: new Date(),
              attachments: [],
              chatId: id,
            })),
          });
          console.log(
            `✅ Successfully saved ${messages.length} messages for chat ${id}`,
          );
        } catch (saveError) {
          // Don't fail the response if message saving fails
          console.error('Failed to save messages to database:', saveError);
          logCarToolError('MessageSaving', saveError, {
            chatId: id,
            messageCount: messages.length,
          });
        }
      },
      onError: (error) => {
        // Enhanced error handling for car search integration
        const errorMessage = createCarSearchErrorMessage(error);
        console.error('Chat stream error:', error);
        logCarToolError('ChatStream', error, { chatId: id });
        return errorMessage;
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream()),
        ),
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    console.error('Chat API error:', error);
    logCarToolError('ChatAPI', error, { timestamp: new Date().toISOString() });

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    // Enhanced error response for unknown errors
    if (error instanceof Error) {
      const errorMessage = error.message.includes('car')
        ? createCarSearchErrorMessage(error)
        : 'An unexpected error occurred. Please try again.';

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fallback for any other error types
    return new Response(
      JSON.stringify({
        error:
          'An unexpected error occurred while processing your car search request. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
