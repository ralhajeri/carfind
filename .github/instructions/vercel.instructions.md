---
description: Instructions for working with Vercel AI Chatbot template features and extensions
applyTo: "**/*.{ts,tsx,js,jsx,md}"
---

# Vercel AI Chatbot Template Instructions

## Project Context

This project is based on the **Vercel Next.js AI Chatbot Template** - a full-featured, hackable Next.js AI chatbot built by Vercel. The template provides a comprehensive foundation for building AI-powered conversational applications with modern web technologies.

### Template Source
- **Repository**: https://github.com/vercel/ai-chatbot
- **Live Demo**: https://chat.vercel.ai
- **Template URL**: https://vercel.com/templates/ai/nextjs-ai-chatbot

## Core Architecture & Features

### 🏗️ Foundation Technologies
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Auth.js (NextAuth.js) for secure user management
- **Database**: Neon Serverless Postgres for chat history and user data
- **Storage**: Vercel Blob for efficient file storage
- **Deployment**: Optimized for Vercel platform

### 🤖 AI Integration
- **AI SDK**: Vercel AI SDK for unified LLM integration
- **Default Model**: xAI Grok-2-1212 (easily switchable)
- **Supported Providers**: OpenAI, Anthropic, Cohere, Fireworks, Hugging Face, LangChain
- **Features**: 
  - Streaming chat UI
  - React Server Components (RSCs)
  - Server Actions for real-time interactions
  - Generative UI capabilities

### 🎨 UI Components
- **Component Library**: shadcn/ui with Radix UI primitives
- **Design System**: Tailwind CSS for consistent styling
- **Icons**: Phosphor Icons integration
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Built-in accessibility features via Radix UI

### 💾 Data & State Management
- **Chat History**: Persistent conversation storage
- **Rate Limiting**: Built-in protection against abuse
- **Session Storage**: Vercel KV for session management
- **State Management**: useUIState for AI state management

## Out-of-the-Box Extensible Features

### 🔌 Multi-Model AI Provider Support

**Quick Provider Switch Example:**
```typescript
// Switch from xAI to OpenAI
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4-turbo'),
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
});
```

**Supported Providers:**
- **xAI**: `grok-2-1212`, `grok-beta`
- **OpenAI**: `gpt-4-turbo`, `gpt-3.5-turbo`, `gpt-4o`
- **Anthropic**: `claude-3.5-sonnet`, `claude-3-haiku`
- **Fireworks**: Various open-source models
- **Cohere**: `command-r-plus`, `command-r`
- **Custom**: LangChain integration for any provider

### 🎯 Pre-built UI Components

**Chat Interface Components:**
```typescript
// Message components
<ChatMessage message={message} />
<ChatPanel />
<ChatScrollAnchor />

// Input components
<PromptForm />
<ButtonScrollToBottom />

// UI utilities
<Sidebar />
<Header />
<FooterText />
```

**Customizable Themes:**
- Light/Dark mode toggle
- Custom color schemes via CSS variables
- shadcn/ui theme customization

### 🔐 Authentication & User Management

**Built-in Auth Features:**
```typescript
// Session management
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return <ChatInterface user={session.user} />
}
```

**Supported Auth Providers:**
- Google OAuth
- GitHub OAuth
- Email/Password
- Custom providers via Auth.js

### 📊 Data Persistence & Management

**Chat History API:**
```typescript
// Save conversation
await saveChat({
  id: chatId,
  title: 'Chat Title',
  userId: user.id,
  messages: messages,
  createdAt: new Date()
})

// Retrieve user chats
const userChats = await getChats(user.id)
```

**File Upload & Storage:**
```typescript
// File upload to Vercel Blob
import { put } from '@vercel/blob';

const blob = await put('filename.pdf', file, {
  access: 'public',
});
```

## 🚀 Quick Setup

**Required Environment Variables:**
```env
# AI Provider (choose one)
XAI_API_KEY=your_xai_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Database
DATABASE_URL=your_neon_postgres_url

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Auth
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_oauth_id
AUTH_GOOGLE_SECRET=your_google_oauth_secret
```

### 🧩 Extension Patterns

**Adding Custom Tools:**
```typescript
// Define custom tool
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: z.object({
    location: z.string().describe('The city name'),
  }),
  execute: async ({ location }) => {
    // Implementation
    return await getWeatherData(location)
  }
}

// Use in chat
const result = await streamText({
  model: xai('grok-2-1212'),
  tools: { get_weather: weatherTool },
  messages: messages,
});
```

**Custom UI Components:**
```typescript
// Extend chat with custom message types
function CustomMessage({ message }: { message: Message }) {
  if (message.type === 'weather') {
    return <WeatherCard data={message.content} />
  }
  return <ChatMessage message={message} />
}
```

**Database Schema Extensions:**
```sql
-- Add custom fields to conversations
ALTER TABLE chats ADD COLUMN category VARCHAR(50);
ALTER TABLE chats ADD COLUMN tags JSONB;
ALTER TABLE chats ADD COLUMN metadata JSONB;
```

### 🎨 UI Customization

**Theme Customization:**
```css
/* Custom CSS variables */
:root {
  --primary: 220 14.3% 95.9%;
  --primary-foreground: 220.9 39.3% 11%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
}

[data-theme="dark"] {
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 220 14.3% 95.9%;
}
```

**Component Styling:**
```typescript
// Custom chat bubble styles
const messageVariants = cva(
  "relative rounded-lg px-3 py-2 text-sm",
  {
    variants: {
      variant: {
        user: "ml-auto bg-primary text-primary-foreground",
        assistant: "bg-muted",
        system: "bg-yellow-100 border-yellow-300",
      },
    },
  }
)
```

## Best Practices

### 🔧 Development Workflow

**Code Structure:**
- Keep AI logic in `lib/` directory
- Store UI components in `components/`
- Place API routes in `app/api/`
- Organize types in `types/` directory

**Error Handling:**
```typescript
// Implement robust error handling
try {
  const result = await streamText({...});
} catch (error) {
  console.error('AI generation failed:', error);
  return { error: 'Failed to generate response' };
}
```


### 🧪 Testing Strategy

**Unit Testing:**
```typescript
// Test AI components
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@/components/chat-message'

test('renders user message correctly', () => {
  render(<ChatMessage message={{
    role: 'user',
    content: 'Hello world'
  }} />)
  expect(screen.getByText('Hello world')).toBeInTheDocument()
})
```

**Integration Testing:**
- Test API routes with mock AI responses
- Verify database operations
- Test authentication flows

### 🔒 Security Considerations

**API Key Management:**
- Never expose API keys in client-side code
- Use environment variables for all secrets
- Implement rate limiting for API endpoints
- Validate user inputs and sanitize outputs

**Data Privacy:**
- Implement proper user data encryption
- Follow GDPR/privacy regulations
- Provide data export/deletion features
- Log security events appropriately

## Common Extension Patterns

### 📱 Multi-Modal Support

**Image Processing:**
```typescript
// Add image analysis capabilities
const result = await streamText({
  model: openai('gpt-4-vision-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        { type: 'image', image: imageUrl }
      ]
    }
  ]
});
```

### 🔗 External API Integration

**Web Search Integration:**
```typescript
// Add web search tool
const searchTool = {
  name: 'web_search',
  description: 'Search the web for current information',
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const results = await searchAPI(query);
    return results;
  }
}
```

### 📊 Analytics & Monitoring

**Usage Tracking:**
```typescript
// Track chat interactions
import { track } from '@/lib/analytics'

await track('chat_message_sent', {
  userId: user.id,
  messageLength: message.length,
  modelUsed: 'grok-2-1212',
  timestamp: new Date()
})
```

## Troubleshooting

### 🐛 Common Issues

**AI Provider Errors:**
```typescript
// Handle provider rate limits
if (error.code === 'rate_limit_exceeded') {
  return { 
    error: 'Too many requests. Please try again later.',
    retryAfter: error.retryAfter 
  };
}
```

**Database Connection Issues:**
```typescript
// Implement connection retry logic
const connectWithRetry = async (retries = 3) => {
  try {
    return await db.connect();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return connectWithRetry(retries - 1);
    }
    throw error;
  }
};
```

### 📞 Support Resources

- **Documentation**: https://sdk.vercel.ai/docs
- **Examples**: https://github.com/vercel/ai/tree/main/examples
- **Community**: Vercel Discord server
- **Issues**: GitHub repository issues
