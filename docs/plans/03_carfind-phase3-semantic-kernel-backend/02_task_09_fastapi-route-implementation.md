---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: FastAPI Route Implementation

## Task Meta

- **Task ID:** 02_task_09
- **Task Name:** FastAPI Route Implementation
- **Phase:** Phase 3.3
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Create chat endpoint that exactly matches Phase 2 API specification with request/response models, proper error handling, dependency injection for Kernel service, and session management integration.

## 2. Objectives

- Create chat API endpoint maintaining exact Phase 2 API contract compatibility
- Implement request/response models compatible with existing frontend integration
- Add comprehensive error handling with user-friendly messages and status codes
- Setup dependency injection for Kernel service throughout API routes
- Implement session management integration with conversation processes

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 08 (Process Integration Architecture) completed successfully
- [ ] Process orchestrator and factory operational with all processes
- [ ] Phase 2 API contracts understood and documented for compatibility
- [ ] FastAPI application structure ready for route integration
- [ ] Error handling patterns established for production readiness

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 2: `CarFind/app/api/chat/route.ts` - Original chat API implementation
- Phase 2: `CarFind/lib/services/ai-service-factory.ts` - Service factory pattern
- Backend: `carfind-backend/app/main.py` - FastAPI application with middleware
- Backend: `carfind-backend/app/api/routes/chat.py` - New chat endpoint implementation

### 4.2 Framework Dependencies

- FastAPI for HTTP API implementation with automatic documentation
- Pydantic for request/response validation and type safety
- Process orchestrator for Semantic Kernel process execution
- Session management for conversation context preservation
- Error handling middleware for consistent error responses

---

## 5. Testing Strategy

- **Unit Tests:** Validate API route logic and request/response handling
- **Integration Tests:** Verify Process orchestrator integration and Phase 2 compatibility
- **Manual Tests:** Confirm API contract compatibility with existing frontend

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-002`                  | Phase 2 API compatibility | `carfind-backend/app/api/routes/chat.py` | `TEST-U-001` |
| `REQ-001`                  | Frontend compatibility maintenance | API contract and response format | `TEST-I-002` |
| `NFR-002`                  | API contract compatibility | Request/response models | `TEST-M-003` |
| `NFR-005`                  | Security and error handling | Input validation and error responses | `TEST-S-004` |

---

## 7. Implementation Plan

### 7.1 Design

FastAPI chat endpoint implementation maintaining exact Phase 2 API compatibility while integrating Semantic Kernel processes through orchestrator pattern with comprehensive error handling.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: API Models Implementation**
  - **Description:** Create request/response models compatible with Phase 2

    ```python
    # File Path: carfind-backend/app/models/api_models.py
    # API request/response models for Phase 2 compatibility

    """CarFind API Models for Phase 2 Compatibility."""

    from typing import Any, Dict, List, Optional
    from datetime import datetime

    from pydantic import BaseModel, Field


    class ChatMessage(BaseModel):
        """Chat message model compatible with Phase 2."""

        id: str = Field(..., description="Message identifier")
        role: str = Field(..., description="Message role (user, assistant, system)")
        content: str = Field(..., description="Message content")
        createdAt: datetime = Field(default_factory=datetime.now, description="Creation timestamp")


    class ChatRequest(BaseModel):
        """Chat request model maintaining Phase 2 API contract."""

        messages: List[ChatMessage] = Field(..., description="Conversation messages")
        sessionId: Optional[str] = Field(None, description="Session identifier")
        userId: Optional[str] = Field(None, description="User identifier")
        stream: bool = Field(default=True, description="Enable streaming response")
        metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


    class ChatResponse(BaseModel):
        """Chat response model for Phase 2 compatibility."""

        id: str = Field(..., description="Response identifier")
        role: str = Field(default="assistant", description="Response role")
        content: str = Field(..., description="Response content")
        createdAt: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
        metadata: Dict[str, Any] = Field(default_factory=dict, description="Response metadata")


    class StreamingChatResponse(BaseModel):
        """Streaming chat response chunk."""

        id: str = Field(..., description="Response identifier")
        delta: Dict[str, Any] = Field(..., description="Response delta")
        choices: List[Dict[str, Any]] = Field(default_factory=list, description="Response choices")
        created: int = Field(..., description="Unix timestamp")
        model: str = Field(default="carfind-sk", description="Model identifier")
        object: str = Field(default="chat.completion.chunk", description="Object type")


    class ErrorResponse(BaseModel):
        """Error response model for consistent error handling."""

        error: Dict[str, Any] = Field(..., description="Error details")
        status: int = Field(..., description="HTTP status code")
        timestamp: datetime = Field(default_factory=datetime.now, description="Error timestamp")


    class HealthCheckResponse(BaseModel):
        """Enhanced health check response."""

        status: str = Field(..., description="Service status")
        version: str = Field(..., description="Service version")
        timestamp: datetime = Field(default_factory=datetime.now, description="Check timestamp")
        services: Dict[str, Any] = Field(..., description="Service status details")
    ```

- [ ] **Sub-Task 2: Chat API Route Implementation**
  - **Description:** Implement main chat endpoint with Process orchestrator integration

    ```python
    # File Path: carfind-backend/app/api/routes/chat.py
    # Main chat API endpoint with Semantic Kernel integration

    """CarFind Chat API Routes with Semantic Kernel Integration."""

    import json
    import uuid
    from typing import Any, Dict

    from fastapi import APIRouter, Depends, HTTPException, Request, status
    from fastapi.responses import StreamingResponse
    from pydantic import ValidationError

    from app.interfaces.process_interfaces import ProcessInput
    from app.models.api_models import (
        ChatRequest,
        ChatResponse,
        ErrorResponse,
        StreamingChatResponse,
    )
    from app.services.kernel_service import KernelService, get_kernel_service
    from app.services.process_orchestrator import ProcessOrchestrator


    router = APIRouter()


    @router.post("/chat")
    async def chat_endpoint(
        request: ChatRequest,
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> StreamingResponse | ChatResponse:
        """Main chat endpoint maintaining Phase 2 API compatibility."""
        try:
            # Validate request
            if not request.messages:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Messages cannot be empty",
                )

            # Get latest user message
            user_message = None
            for msg in reversed(request.messages):
                if msg.role == "user":
                    user_message = msg
                    break

            if not user_message:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No user message found",
                )

            # Create process orchestrator
            kernel = await kernel_service.get_kernel()
            orchestrator = ProcessOrchestrator(kernel)

            # Prepare process input
            process_input = ProcessInput(
                session_id=request.sessionId or str(uuid.uuid4()),
                user_id=request.userId,
                timestamp=user_message.createdAt,
                metadata={
                    "message": user_message.content,
                    "conversation_history": [msg.model_dump() for msg in request.messages],
                },
            )

            # Execute conversation workflow
            result = await orchestrator.execute_workflow(
                "car_search_conversation",
                process_input
            )

            if not result.success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Process execution failed: {result.error_message}",
                )

            # Format response
            conversation_result = result.result.get("conversation", {})
            response_content = conversation_result.get("content", "I'm sorry, I couldn't process your request.")

            # Handle streaming vs non-streaming
            if request.stream:
                return StreamingResponse(
                    _stream_response(response_content, request.sessionId),
                    media_type="text/plain",
                    headers={
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                        "Content-Type": "text/plain; charset=utf-8",
                    },
                )
            else:
                return ChatResponse(
                    id=str(uuid.uuid4()),
                    content=response_content,
                    metadata={
                        "sessionId": request.sessionId,
                        "executionTime": result.execution_time_ms,
                        "intent": conversation_result.get("intent"),
                    },
                )

        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Validation error: {e}",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}",
            )


    async def _stream_response(content: str, session_id: str | None):
        """Stream response content for compatibility with frontend."""
        try:
            # Send response in chunks for streaming effect
            words = content.split()
            response_id = str(uuid.uuid4())
            
            for i, word in enumerate(words):
                chunk_data = {
                    "id": response_id,
                    "object": "chat.completion.chunk",
                    "created": int(datetime.now().timestamp()),
                    "model": "carfind-semantic-kernel",
                    "choices": [
                        {
                            "index": 0,
                            "delta": {"content": word + " " if i < len(words) - 1 else word},
                            "finish_reason": None if i < len(words) - 1 else "stop",
                        }
                    ],
                }
                
                yield f"data: {json.dumps(chunk_data)}\n\n"
                
                # Small delay for streaming effect
                import asyncio
                await asyncio.sleep(0.05)
            
            # Send final chunk
            final_chunk = {
                "id": response_id,
                "object": "chat.completion.chunk",
                "created": int(datetime.now().timestamp()),
                "model": "carfind-semantic-kernel",
                "choices": [
                    {
                        "index": 0,
                        "delta": {},
                        "finish_reason": "stop",
                    }
                ],
            }
            yield f"data: {json.dumps(final_chunk)}\n\n"
            yield "data: [DONE]\n\n"

        except Exception as e:
            error_chunk = {
                "error": {
                    "message": str(e),
                    "type": "stream_error",
                }
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"


    @router.post("/chat/search")
    async def search_cars_endpoint(
        request: Dict[str, Any],
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> Dict[str, Any]:
        """Dedicated car search endpoint."""
        try:
            # Create process orchestrator
            kernel = await kernel_service.get_kernel()
            orchestrator = ProcessOrchestrator(kernel)

            # Prepare search input
            process_input = ProcessInput(
                session_id=request.get("sessionId", str(uuid.uuid4())),
                timestamp=datetime.now(),
                metadata={"search_criteria": request.get("criteria", {})},
            )

            # Execute search workflow
            result = await orchestrator.execute_workflow(
                "search_and_recommend",
                process_input
            )

            if result.success:
                return {
                    "success": True,
                    "data": result.result,
                    "executionTime": result.execution_time_ms,
                }
            else:
                return {
                    "success": False,
                    "error": result.error_message,
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }


    @router.get("/chat/session/{session_id}")
    async def get_session_history(
        session_id: str,
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> Dict[str, Any]:
        """Get conversation history for session."""
        try:
            # Create process orchestrator
            kernel = await kernel_service.get_kernel()
            orchestrator = ProcessOrchestrator(kernel)

            # Get conversation process
            conversation_process = await orchestrator.process_factory.get_process("conversation")
            if not conversation_process:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Conversation service unavailable",
                )

            # Get conversation history
            history = await conversation_process.get_conversation_history(session_id)
            
            if history:
                return {
                    "success": True,
                    "sessionId": session_id,
                    "messages": [msg.model_dump() for msg in history.messages],
                    "metadata": {
                        "messageCount": len(history.messages),
                        "createdAt": history.created_at.isoformat(),
                        "updatedAt": history.updated_at.isoformat(),
                    },
                }
            else:
                return {
                    "success": True,
                    "sessionId": session_id,
                    "messages": [],
                    "metadata": {"messageCount": 0},
                }

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve session history: {str(e)}",
            )


    @router.delete("/chat/session/{session_id}")
    async def clear_session(
        session_id: str,
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> Dict[str, Any]:
        """Clear conversation session."""
        try:
            # Create process orchestrator
            kernel = await kernel_service.get_kernel()
            orchestrator = ProcessOrchestrator(kernel)

            # Get conversation process
            conversation_process = await orchestrator.process_factory.get_process("conversation")
            if not conversation_process:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Conversation service unavailable",
                )

            # Clear conversation
            success = await conversation_process.clear_conversation(session_id)
            
            return {
                "success": success,
                "sessionId": session_id,
                "message": "Session cleared successfully" if success else "Session not found",
            }

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to clear session: {str(e)}",
            )
    ```

- [ ] **Sub-Task 3: Error Handling Middleware**
  - **Description:** Implement comprehensive error handling for API routes

    ```python
    # File Path: carfind-backend/app/middleware/error_handling.py
    # Error handling middleware for consistent API responses

    """Error Handling Middleware for CarFind API."""

    import json
    import logging
    from typing import Callable

    from fastapi import Request, Response, status
    from fastapi.responses import JSONResponse
    from starlette.middleware.base import BaseHTTPMiddleware

    from app.models.api_models import ErrorResponse


    logger = logging.getLogger("carfind.error_handling")


    class ErrorHandlingMiddleware(BaseHTTPMiddleware):
        """Middleware for consistent error handling across all API routes."""

        async def dispatch(self, request: Request, call_next: Callable) -> Response:
            """Process request with comprehensive error handling."""
            try:
                response = await call_next(request)
                return response

            except ValueError as e:
                return await self._handle_validation_error(request, e)
            except PermissionError as e:
                return await self._handle_permission_error(request, e)
            except TimeoutError as e:
                return await self._handle_timeout_error(request, e)
            except Exception as e:
                return await self._handle_general_error(request, e)

        async def _handle_validation_error(self, request: Request, error: ValueError) -> JSONResponse:
            """Handle validation errors."""
            logger.warning(f"Validation error for {request.url}: {error}")
            
            error_response = ErrorResponse(
                error={
                    "type": "validation_error",
                    "message": str(error),
                    "code": "INVALID_INPUT",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
            
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=error_response.model_dump(),
            )

        async def _handle_permission_error(self, request: Request, error: PermissionError) -> JSONResponse:
            """Handle permission errors."""
            logger.warning(f"Permission error for {request.url}: {error}")
            
            error_response = ErrorResponse(
                error={
                    "type": "permission_error",
                    "message": "Access denied",
                    "code": "INSUFFICIENT_PERMISSIONS",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
            
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content=error_response.model_dump(),
            )

        async def _handle_timeout_error(self, request: Request, error: TimeoutError) -> JSONResponse:
            """Handle timeout errors."""
            logger.error(f"Timeout error for {request.url}: {error}")
            
            error_response = ErrorResponse(
                error={
                    "type": "timeout_error",
                    "message": "Request timeout",
                    "code": "REQUEST_TIMEOUT",
                },
                status=status.HTTP_408_REQUEST_TIMEOUT,
            )
            
            return JSONResponse(
                status_code=status.HTTP_408_REQUEST_TIMEOUT,
                content=error_response.model_dump(),
            )

        async def _handle_general_error(self, request: Request, error: Exception) -> JSONResponse:
            """Handle general unexpected errors."""
            logger.error(f"Unexpected error for {request.url}: {error}", exc_info=True)
            
            error_response = ErrorResponse(
                error={
                    "type": "internal_error",
                    "message": "An unexpected error occurred",
                    "code": "INTERNAL_SERVER_ERROR",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=error_response.model_dump(),
            )
    ```

- [ ] **Sub-Task 4: FastAPI Application Integration**
  - **Description:** Integrate chat routes with main FastAPI application

    ```python
    # File Path: carfind-backend/app/main.py
    # Updated FastAPI application with chat routes integration

    """CarFind MVP Semantic Kernel Backend - Complete API Integration."""

    from contextlib import asynccontextmanager
    from typing import AsyncGenerator

    import uvicorn
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.middleware.trustedhost import TrustedHostMiddleware

    from app.api.routes import chat, health
    from app.config import settings
    from app.middleware.error_handling import ErrorHandlingMiddleware
    from app.middleware.logging import LoggingMiddleware
    from app.services.kernel_service import cleanup_kernel_service, get_kernel_service


    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
        """Application lifespan management with complete service initialization."""
        # Startup: Initialize all services
        print(f"🚀 Starting CarFind Backend ({settings.environment})")
        print(f"📊 OpenAI Model: {settings.openai.model_name}")
        print(f"🌐 CORS Origins: {settings.cors.origins}")
        print(f"📝 Log Level: {settings.logging.level}")
        
        try:
            # Initialize Kernel service
            kernel_service = await get_kernel_service()
            app.state.kernel_service = kernel_service
            print("✅ Semantic Kernel service initialized")
            
            # Perform health check
            health_status = await kernel_service.health_check()
            print(f"🏥 Service health: {health_status.get('status', 'unknown')}")
            
        except Exception as e:
            print(f"❌ Failed to initialize services: {e}")
            raise
        
        yield
        
        # Shutdown: Cleanup all resources
        print("🔄 Shutting down CarFind Backend")
        try:
            await cleanup_kernel_service()
            print("✅ All services cleaned up successfully")
        except Exception as e:
            print(f"❌ Service cleanup failed: {e}")


    def create_app() -> FastAPI:
        """Create and configure complete FastAPI application."""
        app = FastAPI(
            title="CarFind MVP Semantic Kernel Backend",
            description="AI-powered car search system using Microsoft Semantic Kernel Process Framework",
            version="0.1.0",
            debug=settings.fastapi.debug,
            lifespan=lifespan,
            docs_url="/docs" if settings.is_development else None,
            redoc_url="/redoc" if settings.is_development else None,
        )

        # Security middleware
        if not settings.is_development:
            app.add_middleware(
                TrustedHostMiddleware,
                allowed_hosts=["localhost", "127.0.0.1"],
            )

        # CORS middleware for Next.js frontend integration
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors.origins,
            allow_credentials=settings.cors.credentials,
            allow_methods=settings.cors.methods,
            allow_headers=settings.cors.headers,
        )

        # Error handling middleware
        app.add_middleware(ErrorHandlingMiddleware)

        # Logging middleware
        app.add_middleware(LoggingMiddleware)

        # Include API routers
        app.include_router(health.router, prefix="/api", tags=["health"])
        app.include_router(chat.router, prefix="/api", tags=["chat"])

        return app


    app = create_app()


    if __name__ == "__main__":
        uvicorn.run(
            "app.main:app",
            host=settings.fastapi.host,
            port=settings.fastapi.port,
            reload=settings.is_development,
            log_level=settings.logging.level.lower(),
            access_log=settings.logging.enable_uvicorn_logging,
        )
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Chat API endpoint operational and maintaining exact Phase 2 compatibility
- Request/response models validated and compatible with existing frontend integration
- Error handling comprehensive with user-friendly messages and proper status codes
- Dependency injection working correctly for Kernel service throughout API routes
- Session management integrated with conversation processes and working seamlessly
- Streaming response functionality operational for real-time user experience

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Chat API endpoint implemented with Phase 2 contract compatibility
- [ ] Request/response models created with comprehensive validation
- [ ] Error handling middleware implemented with consistent error responses
- [ ] FastAPI application integrated with chat routes and middleware
- [ ] Streaming response functionality tested and operational
- [ ] Session management endpoints functional
- [ ] Dependency injection working correctly throughout API layer
- [ ] Code follows SOLID principles with comprehensive type hints

---

## 9. Risks & Mitigations

- **Risk**: API contract compatibility breaking frontend integration → **Mitigation**: Exact Phase 2 contract replication with comprehensive testing
- **Risk**: Streaming response implementation complexity → **Mitigation**: Simple chunk-based streaming with error handling
- **Risk**: Error handling consistency across routes → **Mitigation**: Centralized middleware with standardized error responses
- **Risk**: Session management performance issues → **Mitigation**: Efficient conversation context handling with cleanup
- **Risk**: Dependency injection circular dependencies → **Mitigation**: Clear service initialization order and proper lifecycle management

---

## 10. Self-Assessment Checklist

- [ ] API endpoints provide seamless integration with existing Phase 1 and Phase 2 frontend
- [ ] Error handling provides clear feedback for debugging and user experience
- [ ] Streaming functionality enhances real-time interaction quality
- [ ] Session management maintains conversation continuity effectively
- [ ] API implementation ready for production deployment and scaling

---
