---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Kernel Service Implementation

## Task Meta

- **Task ID:** 02_task_05
- **Task Name:** Kernel Service Implementation
- **Phase:** Phase 3.2
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Create KernelService class following Single Responsibility Principle with Azure OpenAI and OpenAI service configuration, Semantic Kernel initialization, and process registration system for car search and conversation management.

## 2. Objectives

- Implement KernelService class with dependency injection and proper error handling
- Configure Azure OpenAI and OpenAI service based on environment settings
- Add Semantic Kernel initialization with comprehensive logging and monitoring
- Setup process registration system for car search and conversation management processes
- Implement resource cleanup methods for proper lifecycle management

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 04 (Environment Configuration Management) completed successfully
- [ ] Semantic Kernel 1.20.0 installed and importable
- [ ] Enhanced configuration system operational with OpenAI settings
- [ ] FastAPI application structure ready for service integration
- [ ] OpenAI API key validated and functional

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 2: `CarFind/lib/services/ai-service-factory.ts` - Service factory pattern to replicate
- Backend: `carfind-backend/app/config.py` - Configuration management for service initialization
- Backend: `carfind-backend/app/main.py` - FastAPI lifespan management for service lifecycle
- Backend: `carfind-backend/app/services/kernel_service.py` - Core Semantic Kernel service implementation

### 4.2 Framework Dependencies

- Microsoft Semantic Kernel 1.20.0 for AI process framework
- OpenAI or Azure OpenAI services for LLM integration
- Pydantic settings for type-safe configuration management
- FastAPI dependency injection for service lifecycle management
- Asyncio for concurrent request handling and process management

---

## 5. Testing Strategy

- **Unit Tests:** Validate KernelService initialization and configuration handling
- **Integration Tests:** Verify Semantic Kernel process registration and execution
- **Manual Tests:** Confirm service lifecycle management and error handling

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | Maintain Phase 2 compatibility | `carfind-backend/app/services/kernel_service.py` | `TEST-U-001` |
| `REQ-003`                  | Semantic Kernel process implementation | Service initialization and registration | `TEST-I-002` |
| `NFR-001`                  | Performance requirements | Async service implementation | `TEST-P-003` |
| `NFR-003`                  | SOLID principles compliance | Single responsibility service design | `TEST-M-004` |
| `NFR-004`                  | Scalability architecture | Concurrent request handling | `TEST-S-005` |

---

## 7. Implementation Plan

### 7.1 Design

Core Semantic Kernel service implementation using dependency injection, async/await patterns, and comprehensive error handling while maintaining Phase 2 API compatibility and following SOLID principles.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Core KernelService Class Implementation**
  - **Description:** Create base KernelService with initialization and lifecycle management

    ```python
    # File Path: carfind-backend/app/services/kernel_service.py
    # Core Semantic Kernel service with dependency injection

    """CarFind Semantic Kernel Service Implementation."""

    import asyncio
    import logging
    from typing import Any, Dict, Optional

    import semantic_kernel as sk
    from semantic_kernel.connectors.ai.open_ai import (
        AzureChatCompletion,
        OpenAIChatCompletion,
    )
    from semantic_kernel.core_plugins import (
        ConversationSummaryPlugin,
        TextMemoryPlugin,
    )

    from app.config import settings


    logger = logging.getLogger("carfind.kernel_service")


    class KernelServiceError(Exception):
        """Custom exception for Kernel service errors."""

        pass


    class KernelService:
        """Semantic Kernel service for CarFind AI processing."""

        def __init__(self) -> None:
            """Initialize Kernel service with configuration."""
            self.kernel: Optional[sk.Kernel] = None
            self.is_initialized = False
            self._initialization_lock = asyncio.Lock()
            self._registered_processes: Dict[str, Any] = {}

        async def initialize(self) -> None:
            """Initialize Semantic Kernel with AI service configuration."""
            async with self._initialization_lock:
                if self.is_initialized:
                    logger.info("Kernel service already initialized")
                    return

                try:
                    logger.info("Initializing Semantic Kernel service")
                    
                    # Create kernel instance
                    self.kernel = sk.Kernel()
                    
                    # Configure AI service based on settings
                    await self._configure_ai_service()
                    
                    # Add core plugins
                    await self._add_core_plugins()
                    
                    # Register processes
                    await self._register_processes()
                    
                    self.is_initialized = True
                    logger.info("✅ Semantic Kernel service initialized successfully")
                    
                except Exception as e:
                    logger.error(f"❌ Kernel service initialization failed: {e}")
                    raise KernelServiceError(f"Failed to initialize Kernel service: {e}") from e

        async def _configure_ai_service(self) -> None:
            """Configure OpenAI or Azure OpenAI service."""
            if not self.kernel:
                raise KernelServiceError("Kernel not initialized")

            try:
                if settings.semantic_kernel.service_type == "AzureOpenAI":
                    # Azure OpenAI configuration (for future use)
                    logger.info("Configuring Azure OpenAI service")
                    # Note: Azure configuration would be added here when needed
                    raise NotImplementedError("Azure OpenAI not implemented in MVP")
                else:
                    # OpenAI configuration
                    logger.info(f"Configuring OpenAI service with model: {settings.openai.model_name}")
                    
                    chat_completion = OpenAIChatCompletion(
                        service_id="carfind_openai",
                        api_key=settings.openai.api_key,
                        ai_model_id=settings.openai.model_name,
                    )
                    
                    self.kernel.add_service(chat_completion)
                    
                logger.info("✅ AI service configured successfully")
                
            except Exception as e:
                logger.error(f"❌ AI service configuration failed: {e}")
                raise KernelServiceError(f"Failed to configure AI service: {e}") from e

        async def _add_core_plugins(self) -> None:
            """Add core Semantic Kernel plugins."""
            if not self.kernel:
                raise KernelServiceError("Kernel not initialized")

            try:
                logger.info("Adding core Semantic Kernel plugins")
                
                # Add conversation summary plugin
                conversation_plugin = self.kernel.add_plugin(
                    ConversationSummaryPlugin(self.kernel),
                    plugin_name="ConversationSummary",
                )
                
                # Add text memory plugin
                memory_plugin = self.kernel.add_plugin(
                    TextMemoryPlugin(),
                    plugin_name="TextMemory",
                )
                
                logger.info("✅ Core plugins added successfully")
                
            except Exception as e:
                logger.error(f"❌ Core plugins setup failed: {e}")
                raise KernelServiceError(f"Failed to add core plugins: {e}") from e

        async def _register_processes(self) -> None:
            """Register CarFind-specific processes."""
            try:
                logger.info("Registering CarFind processes")
                
                # Process registration will be implemented in subsequent tasks
                # This is a placeholder for Task 06 and Task 07 implementations
                self._registered_processes = {
                    "car_search": "Placeholder for Car Search Process",
                    "conversation": "Placeholder for Conversation Management Process",
                }
                
                logger.info("✅ Processes registered successfully")
                
            except Exception as e:
                logger.error(f"❌ Process registration failed: {e}")
                raise KernelServiceError(f"Failed to register processes: {e}") from e

        async def get_kernel(self) -> sk.Kernel:
            """Get initialized Kernel instance."""
            if not self.is_initialized or not self.kernel:
                await self.initialize()
            
            if not self.kernel:
                raise KernelServiceError("Kernel initialization failed")
                
            return self.kernel

        async def health_check(self) -> Dict[str, Any]:
            """Perform health check on Kernel service."""
            try:
                status = {
                    "kernel_initialized": self.is_initialized,
                    "registered_processes": list(self._registered_processes.keys()),
                    "ai_service_type": settings.semantic_kernel.service_type,
                    "model_name": settings.openai.model_name,
                }
                
                if self.is_initialized and self.kernel:
                    # Test basic kernel functionality
                    services = self.kernel.services
                    status["services_count"] = len(services)
                    status["status"] = "healthy"
                else:
                    status["status"] = "not_initialized"
                
                return status
                
            except Exception as e:
                logger.error(f"Health check failed: {e}")
                return {
                    "status": "unhealthy",
                    "error": str(e),
                }

        async def cleanup(self) -> None:
            """Cleanup Kernel service resources."""
            try:
                logger.info("Cleaning up Kernel service resources")
                
                if self.kernel:
                    # Cleanup kernel resources
                    self.kernel = None
                
                self._registered_processes.clear()
                self.is_initialized = False
                
                logger.info("✅ Kernel service cleanup completed")
                
            except Exception as e:
                logger.error(f"❌ Kernel service cleanup failed: {e}")
                raise KernelServiceError(f"Failed to cleanup Kernel service: {e}") from e


    # Global service instance for dependency injection
    _kernel_service_instance: Optional[KernelService] = None


    async def get_kernel_service() -> KernelService:
        """Get singleton KernelService instance for dependency injection."""
        global _kernel_service_instance
        
        if _kernel_service_instance is None:
            _kernel_service_instance = KernelService()
            await _kernel_service_instance.initialize()
        
        return _kernel_service_instance


    async def cleanup_kernel_service() -> None:
        """Cleanup singleton KernelService instance."""
        global _kernel_service_instance
        
        if _kernel_service_instance:
            await _kernel_service_instance.cleanup()
            _kernel_service_instance = None
    ```

- [ ] **Sub-Task 2: FastAPI Integration with Dependency Injection**
  - **Description:** Integrate KernelService with FastAPI dependency injection system

    ```python
    # File Path: carfind-backend/app/main.py
    # Enhanced FastAPI integration with KernelService

    """CarFind MVP Semantic Kernel Backend - KernelService Integration."""

    from contextlib import asynccontextmanager
    from typing import AsyncGenerator

    import uvicorn
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.middleware.trustedhost import TrustedHostMiddleware

    from app.api.routes import health
    from app.config import settings
    from app.middleware.logging import LoggingMiddleware
    from app.services.kernel_service import cleanup_kernel_service, get_kernel_service


    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
        """Application lifespan management with KernelService integration."""
        # Startup: Initialize Semantic Kernel services
        print(f"🚀 Starting CarFind Backend ({settings.environment})")
        print(f"📊 OpenAI Model: {settings.openai.model_name}")
        print(f"🌐 CORS Origins: {settings.cors.origins}")
        print(f"📝 Log Level: {settings.logging.level}")
        
        try:
            # Initialize Kernel service
            kernel_service = await get_kernel_service()
            app.state.kernel_service = kernel_service
            print("✅ Semantic Kernel service initialized")
        except Exception as e:
            print(f"❌ Failed to initialize Kernel service: {e}")
            raise
        
        yield
        
        # Shutdown: Cleanup Semantic Kernel resources
        print("🔄 Shutting down CarFind Backend")
        try:
            await cleanup_kernel_service()
            print("✅ Kernel service cleanup completed")
        except Exception as e:
            print(f"❌ Kernel service cleanup failed: {e}")


    def create_app() -> FastAPI:
        """Create and configure FastAPI application with KernelService."""
        app = FastAPI(
            title="CarFind MVP Semantic Kernel Backend",
            description="AI-powered car search system using Microsoft Semantic Kernel",
            version="0.1.0",
            debug=settings.fastapi.debug,
            lifespan=lifespan,
        )

        # Security middleware with configuration
        if not settings.is_development:
            app.add_middleware(
                TrustedHostMiddleware,
                allowed_hosts=["localhost", "127.0.0.1"],
            )

        # CORS middleware with enhanced configuration
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors.origins,
            allow_credentials=settings.cors.credentials,
            allow_methods=settings.cors.methods,
            allow_headers=settings.cors.headers,
        )

        # Custom logging middleware
        app.add_middleware(LoggingMiddleware)

        # Include routers
        app.include_router(health.router, prefix="/api", tags=["health"])

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

- [ ] **Sub-Task 3: Enhanced Health Check Integration**
  - **Description:** Update health endpoints to include KernelService status

    ```python
    # File Path: carfind-backend/app/api/routes/health.py
    # Enhanced health check with KernelService integration

    """Health check endpoints with KernelService monitoring."""

    from typing import Any, Dict

    from fastapi import APIRouter, Depends, HTTPException, status
    from pydantic import BaseModel

    from app.services.kernel_service import KernelService, get_kernel_service


    class HealthResponse(BaseModel):
        """Health check response model."""

        status: str
        version: str
        services: Dict[str, str]


    class DetailedHealthResponse(BaseModel):
        """Detailed health check response with service status."""

        status: str
        version: str
        services: Dict[str, Dict[str, Any]]


    router = APIRouter()


    @router.get("/health", response_model=HealthResponse)
    async def health_check() -> HealthResponse:
        """Basic health check endpoint."""
        return HealthResponse(
            status="healthy",
            version="0.1.0",
            services={
                "fastapi": "running",
                "semantic_kernel": "initialized",
            },
        )


    @router.get("/health/detailed", response_model=DetailedHealthResponse)
    async def detailed_health_check(
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> DetailedHealthResponse:
        """Detailed health check with KernelService validation."""
        try:
            # Get kernel service health status
            kernel_health = await kernel_service.health_check()
            
            services_status = {
                "fastapi": {
                    "status": "running",
                    "uptime": "available",
                },
                "semantic_kernel": kernel_health,
            }

            overall_status = "healthy" if kernel_health.get("status") == "healthy" else "degraded"

            return DetailedHealthResponse(
                status=overall_status,
                version="0.1.0",
                services=services_status,
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Health check failed: {e}",
            )


    @router.get("/health/ready")
    async def readiness_check(
        kernel_service: KernelService = Depends(get_kernel_service),
    ) -> Dict[str, str]:
        """Kubernetes-style readiness probe with KernelService validation."""
        try:
            # Verify kernel service is ready
            health_status = await kernel_service.health_check()
            
            if health_status.get("status") == "healthy":
                return {"status": "ready"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Kernel service not ready",
                )
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Readiness check failed: {e}",
            )


    @router.get("/health/live")
    async def liveness_check() -> Dict[str, str]:
        """Kubernetes-style liveness probe."""
        return {"status": "alive"}
    ```

- [ ] **Sub-Task 4: KernelService Validation Script**
  - **Description:** Create comprehensive validation for KernelService functionality

    ```python
    # File Path: carfind-backend/scripts/validate_kernel_service.py
    # KernelService functionality validation script

    """KernelService validation and testing script."""

    import asyncio
    import sys
    from pathlib import Path


    async def validate_kernel_service() -> bool:
        """Validate KernelService functionality comprehensively."""
        try:
            # Add app to path for imports
            sys.path.append(str(Path(__file__).parent.parent))
            
            print("CarFind KernelService Validation")
            print("=" * 40)
            
            # Test 1: Import validation
            print("📦 Testing imports...")
            from app.services.kernel_service import KernelService, get_kernel_service
            print("✅ KernelService imports successful")
            
            # Test 2: Service instantiation
            print("🔧 Testing service instantiation...")
            service = KernelService()
            print("✅ KernelService instantiation successful")
            
            # Test 3: Service initialization
            print("🚀 Testing service initialization...")
            await service.initialize()
            print("✅ KernelService initialization successful")
            
            # Test 4: Health check
            print("🏥 Testing health check...")
            health_status = await service.health_check()
            print(f"✅ Health check result: {health_status}")
            
            # Test 5: Kernel access
            print("🧠 Testing kernel access...")
            kernel = await service.get_kernel()
            print(f"✅ Kernel access successful: {type(kernel)}")
            
            # Test 6: Singleton pattern
            print("🔄 Testing singleton pattern...")
            singleton_service = await get_kernel_service()
            print(f"✅ Singleton service accessed: {id(singleton_service)}")
            
            # Test 7: Cleanup
            print("🧹 Testing cleanup...")
            await service.cleanup()
            print("✅ Service cleanup successful")
            
            print("\n" + "=" * 40)
            print("✅ All KernelService validation tests passed!")
            return True
            
        except Exception as e:
            print(f"❌ KernelService validation failed: {e}")
            return False


    if __name__ == "__main__":
        success = asyncio.run(validate_kernel_service())
        sys.exit(0 if success else 1)
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- KernelService class successfully implemented with proper dependency injection
- Semantic Kernel 1.20.0 initialized with OpenAI service configuration
- Service lifecycle management integrated with FastAPI application lifespan
- Health check endpoints operational and reporting KernelService status
- Process registration system prepared for car search and conversation processes
- Resource cleanup working correctly for proper application shutdown

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] KernelService class implemented following Single Responsibility Principle
- [ ] Semantic Kernel initialized successfully with OpenAI integration
- [ ] FastAPI dependency injection configured for KernelService
- [ ] Enhanced health check endpoints reporting service status
- [ ] Service validation script created and passing all tests
- [ ] Error handling comprehensive with proper logging
- [ ] Resource cleanup implemented for application lifecycle management
- [ ] Code follows SOLID principles with comprehensive type hints

---

## 9. Risks & Mitigations

- **Risk**: Semantic Kernel initialization failures → **Mitigation**: Comprehensive error handling with detailed logging and graceful degradation
- **Risk**: OpenAI API connectivity issues → **Mitigation**: Connection validation with retry logic and clear error messages
- **Risk**: Memory leaks from improper cleanup → **Mitigation**: Explicit resource cleanup in lifespan management
- **Risk**: Service dependency injection complexity → **Mitigation**: Singleton pattern with clear initialization lifecycle
- **Risk**: Performance impact from service initialization → **Mitigation**: Async initialization with proper concurrency handling

---

## 10. Self-Assessment Checklist

- [ ] KernelService properly implements Single Responsibility Principle with clear separation of concerns
- [ ] Service initialization follows best practices with comprehensive error handling
- [ ] FastAPI integration maintains compatibility with existing Phase 2 patterns
- [ ] Health monitoring provides meaningful status information for production deployment
- [ ] Service foundation ready for car search and conversation process integration

---
