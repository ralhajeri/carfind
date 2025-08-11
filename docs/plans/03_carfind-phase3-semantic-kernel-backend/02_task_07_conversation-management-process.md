---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Conversation Management Process

## Task Meta

- **Task ID:** 02_task_07
- **Task Name:** Conversation Management Process
- **Phase:** Phase 3.2
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Create ConversationProcess class for intelligent dialogue handling with multi-turn conversation management, intent classification, context preservation, and search criteria extraction using AI for natural language processing.

## 2. Objectives

- Implement ConversationProcess class with sophisticated conversation flow management
- Create intent classification system for routing user requests appropriately
- Add conversation context preservation with session-based chat history
- Develop search criteria extraction using AI for natural language processing
- Create response generation tailored to user intent and conversation flow

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 06 (Car Search Process Framework) completed successfully
- [ ] CarSearchProcess operational with AI recommendations
- [ ] Semantic Kernel conversation plugins understood and available
- [ ] Conversation flow patterns from Phase 1 and Phase 2 analyzed for compatibility
- [ ] Natural language processing requirements defined for search criteria extraction

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 1: `CarFind/app/api/chat/route.ts` - Original chat API implementation
- Phase 2: Supabase integration for chat history persistence
- Backend: `carfind-backend/app/processes/car_search_process.py` - Car search integration
- Backend: `carfind-backend/app/processes/conversation_process.py` - New conversation implementation

### 4.2 Framework Dependencies

- Microsoft Semantic Kernel ConversationSummaryPlugin for conversation management
- Natural language processing for intent classification and criteria extraction
- Session-based context preservation with conversation history
- Integration with CarSearchProcess for search request handling
- Response generation tailored to conversation flow and user intent

---

## 5. Testing Strategy

- **Unit Tests:** Validate ConversationProcess logic and intent classification
- **Integration Tests:** Verify Semantic Kernel integration and conversation flow
- **Manual Tests:** Confirm conversation quality and context preservation

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-004`                  | Conversation management implementation | `carfind-backend/app/processes/conversation_process.py` | `TEST-U-001` |
| `REQ-001`                  | Phase 2 compatibility maintenance | Conversation context and session management | `TEST-I-002` |
| `NFR-001`                  | Performance requirements | Async conversation processing | `TEST-P-003` |
| `NFR-003`                  | SOLID principles compliance | Process class design and separation | `TEST-M-004` |

---

## 7. Implementation Plan

### 7.1 Design

Intelligent conversation management using Semantic Kernel with natural language processing, intent classification, and context-aware response generation while maintaining compatibility with existing chat systems.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Conversation Data Models**
  - **Description:** Create conversation and intent classification models

    ```python
    # File Path: carfind-backend/app/models/conversation_models.py
    # Conversation management data models

    """CarFind Conversation Management Models."""

    from enum import Enum
    from typing import Any, Dict, List, Optional
    from datetime import datetime

    from pydantic import BaseModel, Field


    class MessageRole(str, Enum):
        """Message roles in conversation."""

        USER = "user"
        ASSISTANT = "assistant"
        SYSTEM = "system"


    class ConversationIntent(str, Enum):
        """User intent classification."""

        SEARCH_CARS = "search_cars"
        GET_CAR_DETAILS = "get_car_details"
        COMPARE_CARS = "compare_cars"
        GENERAL_INQUIRY = "general_inquiry"
        GREETING = "greeting"
        FAREWELL = "farewell"
        HELP = "help"
        UNKNOWN = "unknown"


    class ConversationMessage(BaseModel):
        """Individual conversation message."""

        id: str = Field(..., description="Unique message identifier")
        role: MessageRole = Field(..., description="Message sender role")
        content: str = Field(..., description="Message content")
        timestamp: datetime = Field(default_factory=datetime.now, description="Message timestamp")
        metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


    class ConversationContext(BaseModel):
        """Conversation context and state."""

        session_id: str = Field(..., description="Conversation session identifier")
        messages: List[ConversationMessage] = Field(default_factory=list, description="Message history")
        current_intent: Optional[ConversationIntent] = Field(None, description="Current conversation intent")
        extracted_criteria: Optional[Dict[str, Any]] = Field(None, description="Extracted search criteria")
        conversation_summary: Optional[str] = Field(None, description="Conversation summary")
        created_at: datetime = Field(default_factory=datetime.now, description="Context creation time")
        updated_at: datetime = Field(default_factory=datetime.now, description="Last update time")

        def add_message(self, message: ConversationMessage) -> None:
            """Add message to conversation history."""
            self.messages.append(message)
            self.updated_at = datetime.now()

        def get_recent_messages(self, count: int = 5) -> List[ConversationMessage]:
            """Get recent messages for context."""
            return self.messages[-count:] if self.messages else []


    class ConversationResponse(BaseModel):
        """Generated conversation response."""

        content: str = Field(..., description="Response content")
        intent: ConversationIntent = Field(..., description="Detected intent")
        action_taken: Optional[str] = Field(None, description="Action performed")
        search_results: Optional[List[Dict[str, Any]]] = Field(None, description="Car search results")
        suggestions: List[str] = Field(default_factory=list, description="Response suggestions")
        requires_followup: bool = Field(default=False, description="Whether followup is needed")
    ```

- [ ] **Sub-Task 2: Intent Classification System**
  - **Description:** Implement AI-powered intent classification

    ```python
    # File Path: carfind-backend/app/services/intent_classifier.py
    # Intent classification service for conversation management

    """Intent Classification Service for CarFind Conversations."""

    import re
    from typing import Dict, List

    import semantic_kernel as sk
    from semantic_kernel.functions import kernel_function

    from app.models.conversation_models import ConversationIntent


    class IntentClassifier:
        """AI-powered intent classification for conversation management."""

        def __init__(self, kernel: sk.Kernel) -> None:
            """Initialize with Semantic Kernel instance."""
            self.kernel = kernel
            self._intent_patterns = self._build_intent_patterns()

        def _build_intent_patterns(self) -> Dict[ConversationIntent, List[str]]:
            """Build pattern matching rules for intent classification."""
            return {
                ConversationIntent.SEARCH_CARS: [
                    r"(?i)\b(search|find|look|show|need|want)\b.*\b(car|vehicle|auto)\b",
                    r"(?i)\b(toyota|honda|ford|bmw|mercedes|audi|nissan|hyundai)\b",
                    r"(?i)\b(sedan|suv|truck|coupe|hatchback)\b",
                    r"(?i)\$([\d,]+)|under \$|budget|price",
                    r"(?i)\b(mpg|fuel|gas|electric|hybrid)\b",
                ],
                ConversationIntent.GET_CAR_DETAILS: [
                    r"(?i)\b(tell me|details|info|information|specs|features)\b.*\b(about|for)\b",
                    r"(?i)\b(more info|learn more|details)\b",
                ],
                ConversationIntent.COMPARE_CARS: [
                    r"(?i)\b(compare|versus|vs|difference|better)\b",
                    r"(?i)\b(which|what.*better|recommend)\b",
                ],
                ConversationIntent.GREETING: [
                    r"(?i)\b(hello|hi|hey|good morning|good afternoon|good evening)\b",
                    r"(?i)\b(start|begin|help me)\b",
                ],
                ConversationIntent.FAREWELL: [
                    r"(?i)\b(goodbye|bye|thanks|thank you|that's all|done)\b",
                    r"(?i)\b(exit|quit|stop|end)\b",
                ],
                ConversationIntent.HELP: [
                    r"(?i)\b(help|how|what can|assist|guide)\b",
                    r"(?i)\b(don't know|not sure|confused)\b",
                ],
            }

        @kernel_function(
            description="Classify user intent from message content",
            name="classify_intent",
        )
        async def classify_intent(self, message_content: str) -> ConversationIntent:
            """Classify user intent using pattern matching and AI."""
            # First, try pattern matching for quick classification
            pattern_intent = self._pattern_match_intent(message_content)
            if pattern_intent != ConversationIntent.UNKNOWN:
                return pattern_intent

            # If pattern matching fails, use AI classification
            return await self._ai_classify_intent(message_content)

        def _pattern_match_intent(self, message: str) -> ConversationIntent:
            """Use pattern matching for intent classification."""
            for intent, patterns in self._intent_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, message):
                        return intent
            return ConversationIntent.UNKNOWN

        async def _ai_classify_intent(self, message: str) -> ConversationIntent:
            """Use AI for intent classification when patterns fail."""
            try:
                # Create classification prompt
                classification_prompt = f"""
                Classify the following user message into one of these intents:
                - search_cars: User wants to search for cars
                - get_car_details: User wants details about a specific car
                - compare_cars: User wants to compare different cars
                - general_inquiry: General questions about cars
                - greeting: Greeting or starting conversation
                - farewell: Ending conversation or saying goodbye
                - help: User needs help or guidance
                - unknown: Intent cannot be determined

                User message: "{message}"

                Respond with only the intent name.
                """

                # For MVP, use simplified classification
                # In production, this would use Semantic Kernel's text classification
                message_lower = message.lower()
                
                if any(word in message_lower for word in ["search", "find", "show", "need", "want"]):
                    return ConversationIntent.SEARCH_CARS
                elif any(word in message_lower for word in ["hello", "hi", "hey", "start"]):
                    return ConversationIntent.GREETING
                elif any(word in message_lower for word in ["bye", "thanks", "done", "exit"]):
                    return ConversationIntent.FAREWELL
                elif any(word in message_lower for word in ["help", "how", "what can"]):
                    return ConversationIntent.HELP
                else:
                    return ConversationIntent.GENERAL_INQUIRY

            except Exception:
                return ConversationIntent.UNKNOWN

        @kernel_function(
            description="Extract search criteria from natural language",
            name="extract_criteria",
        )
        async def extract_search_criteria(self, message: str) -> Dict[str, any]:
            """Extract car search criteria from natural language."""
            criteria = {}

            # Extract price information
            price_patterns = [
                r"\$?([\d,]+)",
                r"under \$?([\d,]+)",
                r"budget.*\$?([\d,]+)",
                r"max.*\$?([\d,]+)",
            ]
            for pattern in price_patterns:
                match = re.search(pattern, message, re.IGNORECASE)
                if match:
                    try:
                        price = int(match.group(1).replace(",", ""))
                        criteria["max_price"] = price
                        break
                    except ValueError:
                        continue

            # Extract car makes
            makes = ["toyota", "honda", "ford", "chevrolet", "nissan", "bmw", "mercedes", "audi", "volkswagen"]
            for make in makes:
                if make in message.lower():
                    criteria["make"] = make.title()

            # Extract car types
            type_mapping = {
                "sedan": "Sedan",
                "suv": "SUV",
                "truck": "Truck",
                "coupe": "Coupe",
                "hatchback": "Hatchback",
                "convertible": "Convertible",
            }
            for type_key, type_value in type_mapping.items():
                if type_key in message.lower():
                    criteria["car_type"] = type_value

            # Extract fuel types
            if any(word in message.lower() for word in ["electric", "ev"]):
                criteria["fuel_type"] = "Electric"
            elif "hybrid" in message.lower():
                criteria["fuel_type"] = "Hybrid"

            # Extract year information
            year_pattern = r"(19|20)\d{2}"
            year_match = re.search(year_pattern, message)
            if year_match:
                criteria["min_year"] = int(year_match.group())

            return criteria
    ```

- [ ] **Sub-Task 3: Core Conversation Process**
  - **Description:** Implement main ConversationProcess class

    ```python
    # File Path: carfind-backend/app/processes/conversation_process.py
    # Main conversation management process

    """CarFind Conversation Management Process."""

    import uuid
    from typing import Dict, Optional

    import semantic_kernel as sk
    from semantic_kernel.functions import kernel_function

    from app.models.conversation_models import (
        ConversationContext,
        ConversationIntent,
        ConversationMessage,
        ConversationResponse,
        MessageRole,
    )
    from app.models.car_models import CarSearchCriteria
    from app.processes.car_search_process import CarSearchProcess
    from app.services.intent_classifier import IntentClassifier


    class ConversationProcess:
        """AI-powered conversation management for CarFind."""

        def __init__(self, kernel: sk.Kernel) -> None:
            """Initialize with Semantic Kernel and integrated processes."""
            self.kernel = kernel
            self.intent_classifier = IntentClassifier(kernel)
            self.car_search_process = CarSearchProcess(kernel)
            self._active_contexts: Dict[str, ConversationContext] = {}

        @kernel_function(
            description="Process user message and generate response",
            name="process_message",
        )
        async def process_message(
            self, 
            session_id: str, 
            user_message: str
        ) -> ConversationResponse:
            """Process user message and generate appropriate response."""
            # Get or create conversation context
            context = self._get_or_create_context(session_id)

            # Add user message to context
            message_id = str(uuid.uuid4())
            user_msg = ConversationMessage(
                id=message_id,
                role=MessageRole.USER,
                content=user_message,
            )
            context.add_message(user_msg)

            # Classify intent
            intent = await self.intent_classifier.classify_intent(user_message)
            context.current_intent = intent

            # Process based on intent
            response = await self._process_by_intent(context, user_message, intent)

            # Add assistant response to context
            response_msg = ConversationMessage(
                id=str(uuid.uuid4()),
                role=MessageRole.ASSISTANT,
                content=response.content,
                metadata={"intent": intent.value},
            )
            context.add_message(response_msg)

            return response

        def _get_or_create_context(self, session_id: str) -> ConversationContext:
            """Get existing or create new conversation context."""
            if session_id not in self._active_contexts:
                self._active_contexts[session_id] = ConversationContext(
                    session_id=session_id
                )
            return self._active_contexts[session_id]

        async def _process_by_intent(
            self, 
            context: ConversationContext, 
            message: str, 
            intent: ConversationIntent
        ) -> ConversationResponse:
            """Process message based on classified intent."""
            if intent == ConversationIntent.GREETING:
                return await self._handle_greeting(context)
            elif intent == ConversationIntent.SEARCH_CARS:
                return await self._handle_car_search(context, message)
            elif intent == ConversationIntent.GET_CAR_DETAILS:
                return await self._handle_car_details(context, message)
            elif intent == ConversationIntent.HELP:
                return await self._handle_help_request(context)
            elif intent == ConversationIntent.FAREWELL:
                return await self._handle_farewell(context)
            else:
                return await self._handle_general_inquiry(context, message)

        async def _handle_greeting(self, context: ConversationContext) -> ConversationResponse:
            """Handle greeting messages."""
            return ConversationResponse(
                content="Hello! I'm here to help you find the perfect car. You can tell me about your preferences like budget, car type, brand, or any specific features you're looking for. How can I assist you today?",
                intent=ConversationIntent.GREETING,
                suggestions=[
                    "I'm looking for a reliable sedan under $30,000",
                    "Show me electric SUVs",
                    "I need a truck for work",
                    "What cars do you have available?",
                ],
                requires_followup=True,
            )

        async def _handle_car_search(
            self, 
            context: ConversationContext, 
            message: str
        ) -> ConversationResponse:
            """Handle car search requests."""
            # Extract search criteria
            extracted_criteria = await self.intent_classifier.extract_search_criteria(message)
            context.extracted_criteria = extracted_criteria

            # Convert to CarSearchCriteria
            search_criteria = CarSearchCriteria(**extracted_criteria)

            # Perform search
            search_result = await self.car_search_process.search_cars(search_criteria)

            if search_result.cars:
                # Format results
                response_content = f"I found {len(search_result.cars)} car(s) matching your criteria:\n\n"
                for car in search_result.cars[:5]:  # Show top 5
                    response_content += f"• {car.display_name} - {car.price_formatted}\n"
                    response_content += f"  {car.car_type.value} | {car.fuel_type.value} | {car.mileage:,} miles\n"
                    response_content += f"  📍 {car.location}\n\n"

                if search_result.ai_recommendations:
                    response_content += "\n💡 Recommendations:\n"
                    for rec in search_result.ai_recommendations:
                        response_content += f"• {rec}\n"

                return ConversationResponse(
                    content=response_content,
                    intent=ConversationIntent.SEARCH_CARS,
                    action_taken="car_search_performed",
                    search_results=[car.model_dump() for car in search_result.cars],
                    suggestions=[
                        "Tell me more about the first car",
                        "Refine my search criteria",
                        "Compare the top options",
                        "Find cars in a different price range",
                    ],
                )
            else:
                response_content = "I couldn't find any cars matching your exact criteria. "
                if search_result.alternative_suggestions:
                    response_content += "Here are some suggestions:\n\n"
                    for suggestion in search_result.alternative_suggestions:
                        response_content += f"• {suggestion}\n"

                return ConversationResponse(
                    content=response_content,
                    intent=ConversationIntent.SEARCH_CARS,
                    action_taken="no_results_found",
                    suggestions=[
                        "Expand my search criteria",
                        "Try a different car type",
                        "Increase my budget",
                        "Search in a different location",
                    ],
                    requires_followup=True,
                )

        async def _handle_car_details(
            self, 
            context: ConversationContext, 
            message: str
        ) -> ConversationResponse:
            """Handle requests for car details."""
            return ConversationResponse(
                content="I'd be happy to provide more details about specific cars. Could you tell me which car you're interested in learning more about?",
                intent=ConversationIntent.GET_CAR_DETAILS,
                suggestions=[
                    "Tell me about the Toyota Camry",
                    "What features does the Honda CR-V have?",
                    "Show me specs for the BMW X3",
                ],
                requires_followup=True,
            )

        async def _handle_help_request(self, context: ConversationContext) -> ConversationResponse:
            """Handle help requests."""
            return ConversationResponse(
                content="I can help you find cars based on your preferences! Here's what I can do:\n\n• Search for cars by make, model, price, year, and type\n• Provide detailed information about specific vehicles\n• Compare different car options\n• Give recommendations based on your needs\n\nJust tell me what you're looking for, like 'I need a reliable SUV under $35,000' or 'Show me hybrid sedans'.",
                intent=ConversationIntent.HELP,
                suggestions=[
                    "Search for cars under $25,000",
                    "Show me all Toyota models",
                    "Find electric vehicles",
                    "I need a family car",
                ],
            )

        async def _handle_farewell(self, context: ConversationContext) -> ConversationResponse:
            """Handle farewell messages."""
            return ConversationResponse(
                content="Thank you for using CarFind! I hope I was able to help you find some great car options. Feel free to come back anytime if you need more assistance with your car search. Have a great day!",
                intent=ConversationIntent.FAREWELL,
                action_taken="conversation_ended",
            )

        async def _handle_general_inquiry(
            self, 
            context: ConversationContext, 
            message: str
        ) -> ConversationResponse:
            """Handle general inquiries and unknown intents."""
            return ConversationResponse(
                content="I'm here to help you find cars! I can search for vehicles based on your preferences like budget, car type, brand, or features. What kind of car are you looking for?",
                intent=ConversationIntent.GENERAL_INQUIRY,
                suggestions=[
                    "Show me cars under $30,000",
                    "I'm looking for a sedan",
                    "Find me electric vehicles",
                    "What's the most fuel-efficient car?",
                ],
                requires_followup=True,
            )

        @kernel_function(
            description="Get conversation history for session",
            name="get_conversation_history",
        )
        async def get_conversation_history(self, session_id: str) -> Optional[ConversationContext]:
            """Get conversation history for a session."""
            return self._active_contexts.get(session_id)

        @kernel_function(
            description="Clear conversation context for session",
            name="clear_conversation",
        )
        async def clear_conversation(self, session_id: str) -> bool:
            """Clear conversation context for a session."""
            if session_id in self._active_contexts:
                del self._active_contexts[session_id]
                return True
            return False
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- ConversationProcess class successfully implemented with multi-turn dialogue management
- Intent classification system operational and accurately routing user requests
- Conversation context preservation working with session-based chat history
- Search criteria extraction functional for natural language processing
- Response generation tailored to user intent and conversation flow
- Integration with CarSearchProcess seamless and maintaining SOLID principles

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Conversation data models implemented with comprehensive validation
- [ ] Intent classification system operational with pattern matching and AI fallback
- [ ] ConversationProcess class implemented following Single Responsibility Principle
- [ ] Multi-turn conversation management functional with context preservation
- [ ] Search criteria extraction working for natural language inputs
- [ ] Response generation tailored to conversation flow and user intent
- [ ] Integration with CarSearchProcess tested and functional
- [ ] Code follows SOLID principles with comprehensive type hints

---

## 9. Risks & Mitigations

- **Risk**: Intent classification accuracy issues → **Mitigation**: Pattern matching fallback with comprehensive intent patterns
- **Risk**: Context management memory overhead → **Mitigation**: Session-based cleanup and context size limits
- **Risk**: Natural language processing complexity → **Mitigation**: Simplified extraction with clear patterns and fallbacks
- **Risk**: Conversation flow logic complexity → **Mitigation**: Clear intent-based routing with comprehensive error handling
- **Risk**: Integration complexity with car search → **Mitigation**: Well-defined interfaces and dependency injection

---

## 10. Self-Assessment Checklist

- [ ] Conversation management provides natural and contextual dialogue experience
- [ ] Intent classification accurately routes user requests to appropriate handlers
- [ ] Context preservation maintains conversation continuity across multiple turns
- [ ] Natural language processing effectively extracts search criteria from user input
- [ ] Process integration maintains compatibility with existing car search functionality

---
