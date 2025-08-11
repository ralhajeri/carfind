---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Environment Configuration Management

## Task Meta

- **Task ID:** 02_task_04
- **Task Name:** Environment Configuration Management
- **Phase:** Phase 3.1
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Eliminate magic strings with centralized configuration management implementing Pydantic settings for type-safe environment variables, OpenAI service configuration, and production security.

## 2. Objectives

- Create Pydantic settings model for comprehensive environment variable validation
- Configure OpenAI and Azure OpenAI service settings with proper security
- Setup CORS origins configuration for Next.js frontend integration
- Implement API security configuration with secret key management
- Add logging level and format configuration for production monitoring following zero magic strings policy

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 03 (FastAPI Application Structure) completed successfully
- [ ] Pydantic and python-dotenv dependencies installed via Poetry
- [ ] Environment template (.env.example) created in Poetry initialization
- [ ] OpenAI API key available for configuration validation
- [ ] Configuration patterns from Phase 2 understood for consistency

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 2: `CarFind/lib/config/ai-config.ts` - Configuration management pattern for consistency
- Backend: `carfind-backend/app/config.py` - Centralized configuration module
- Backend: `carfind-backend/app/main.py` - Configuration consumption in FastAPI app
- Backend: `carfind-backend/.env.example` - Environment template for deployment

### 4.2 Framework Dependencies

- Pydantic v2 for type-safe settings management and validation
- Python-dotenv for secure environment variable loading
- Semantic Kernel configuration for AI service integration
- FastAPI settings integration for application configuration
- Environment validation for production deployment security

---

## 5. Testing Strategy

- **Unit Tests:** Validate Pydantic settings models and environment variable processing
- **Integration Tests:** Verify configuration loading and validation with missing/invalid values
- **Manual Tests:** Confirm environment template completeness and security practices

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-002`                  | API compatibility configuration | `carfind-backend/app/config.py` | `TEST-U-001` |
| `REQ-005`                  | Production security setup | Environment variable validation | `TEST-S-002` |
| `NFR-003`                  | Zero magic strings compliance | Centralized configuration model | `TEST-M-003` |
| `NFR-005`                  | Environment security validation | Secret key and API key management | `TEST-S-004` |

---

## 7. Implementation Plan

### 7.1 Design

Comprehensive environment configuration management using Pydantic BaseSettings for type-safe validation, zero magic strings policy, and production-ready security practices.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Enhanced Configuration Model**
  - **Description:** Extend existing config.py with comprehensive settings validation

    ```python
    # File Path: carfind-backend/app/config.py
    # Enhanced environment configuration with comprehensive validation

    """CarFind Backend Configuration Management with Zero Magic Strings."""

    import os
    from typing import List, Literal, Optional

    from pydantic import Field, field_validator, model_validator
    from pydantic_settings import BaseSettings, SettingsConfigDict


    class OpenAISettings(BaseSettings):
        """OpenAI-specific configuration settings."""

        api_key: str = Field(..., description="OpenAI API key for Semantic Kernel")
        model_name: str = Field(
            default="gpt-4o",
            description="OpenAI model name for AI processing",
        )
        max_tokens: int = Field(
            default=1000,
            ge=1,
            le=4096,
            description="Maximum tokens per AI request",
        )
        temperature: float = Field(
            default=0.7,
            ge=0.0,
            le=2.0,
            description="AI response creativity temperature",
        )

        @field_validator("api_key")
        @classmethod
        def validate_api_key(cls, v: str) -> str:
            """Validate OpenAI API key format."""
            if not v.startswith("sk-"):
                raise ValueError("OpenAI API key must start with 'sk-'")
            if len(v) < 20:
                raise ValueError("OpenAI API key appears to be invalid (too short)")
            return v


    class FastAPISettings(BaseSettings):
        """FastAPI application configuration settings."""

        host: str = Field(
            default="0.0.0.0",
            description="FastAPI host address",
        )
        port: int = Field(
            default=8000,
            ge=1024,
            le=65535,
            description="FastAPI port number",
        )
        secret_key: str = Field(
            ...,
            min_length=32,
            description="Secret key for API security",
        )
        debug: bool = Field(
            default=False,
            description="Debug mode for development",
        )

        @field_validator("secret_key")
        @classmethod
        def validate_secret_key(cls, v: str) -> str:
            """Validate API secret key strength."""
            if len(v) < 32:
                raise ValueError("Secret key must be at least 32 characters long")
            return v


    class CORSSettings(BaseSettings):
        """CORS configuration for frontend integration."""

        origins: List[str] = Field(
            default=["http://localhost:3000"],
            description="Allowed CORS origins for frontend integration",
        )
        credentials: bool = Field(
            default=True,
            description="Allow credentials in CORS requests",
        )
        methods: List[str] = Field(
            default=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            description="Allowed HTTP methods",
        )
        headers: List[str] = Field(
            default=["*"],
            description="Allowed request headers",
        )

        @field_validator("origins")
        @classmethod
        def validate_origins(cls, v: List[str]) -> List[str]:
            """Validate CORS origins format."""
            for origin in v:
                if not (origin.startswith("http://") or origin.startswith("https://")):
                    raise ValueError(f"Invalid origin format: {origin}")
            return v


    class LoggingSettings(BaseSettings):
        """Logging configuration for production monitoring."""

        level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
            default="INFO",
            description="Application logging level",
        )
        format: Literal["json", "text"] = Field(
            default="json",
            description="Log output format for production monitoring",
        )
        enable_uvicorn_logging: bool = Field(
            default=True,
            description="Enable Uvicorn access logging",
        )


    class SemanticKernelSettings(BaseSettings):
        """Semantic Kernel configuration settings."""

        service_type: Literal["OpenAI", "AzureOpenAI"] = Field(
            default="OpenAI",
            description="Semantic Kernel AI service type",
        )
        max_concurrent_requests: int = Field(
            default=10,
            ge=1,
            le=100,
            description="Maximum concurrent AI requests",
        )
        request_timeout: int = Field(
            default=30,
            ge=5,
            le=300,
            description="AI request timeout in seconds",
        )


    class Settings(BaseSettings):
        """Main application settings with comprehensive validation."""

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            case_sensitive=False,
            extra="ignore",
            env_nested_delimiter="__",
        )

        # Nested settings
        openai: OpenAISettings = Field(default_factory=OpenAISettings)
        fastapi: FastAPISettings = Field(default_factory=FastAPISettings)
        cors: CORSSettings = Field(default_factory=CORSSettings)
        logging: LoggingSettings = Field(default_factory=LoggingSettings)
        semantic_kernel: SemanticKernelSettings = Field(default_factory=SemanticKernelSettings)

        # Environment information
        environment: Literal["development", "staging", "production"] = Field(
            default="development",
            description="Application environment",
        )

        @model_validator(mode="after")
        def validate_environment_consistency(self) -> "Settings":
            """Validate environment-specific configuration consistency."""
            if self.environment == "production":
                if self.fastapi.debug:
                    raise ValueError("Debug mode must be disabled in production")
                if self.logging.level == "DEBUG":
                    raise ValueError("Debug logging not recommended for production")
            return self

        @property
        def is_production(self) -> bool:
            """Check if running in production environment."""
            return self.environment == "production"

        @property
        def is_development(self) -> bool:
            """Check if running in development environment."""
            return self.environment == "development"


    # Global settings instance with validation
    def load_settings() -> Settings:
        """Load and validate application settings."""
        try:
            return Settings()
        except Exception as e:
            print(f"Configuration validation failed: {e}")
            raise


    settings = load_settings()
    ```

- [ ] **Sub-Task 2: Environment Variables Template Enhancement**
  - **Description:** Create comprehensive environment template with security guidelines

    ```bash
    # File Path: carfind-backend/.env.example
    # Comprehensive environment variables template with security guidelines

    # =============================================================================
    # CarFind MVP Semantic Kernel Backend Environment Configuration
    # =============================================================================
    # SECURITY WARNING: Never commit .env files to version control
    # Copy this file to .env and configure with actual values
    # =============================================================================

    # Environment Configuration
    ENVIRONMENT=development

    # OpenAI Configuration
    # Get your API key from: https://platform.openai.com/api-keys
    OPENAI__API_KEY=sk-your_openai_api_key_here
    OPENAI__MODEL_NAME=gpt-4o
    OPENAI__MAX_TOKENS=1000
    OPENAI__TEMPERATURE=0.7

    # FastAPI Configuration
    FASTAPI__HOST=0.0.0.0
    FASTAPI__PORT=8000
    # Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
    FASTAPI__SECRET_KEY=your_32_character_minimum_secret_key_here
    FASTAPI__DEBUG=false

    # CORS Configuration for Next.js Frontend Integration
    CORS__ORIGINS=["http://localhost:3000"]
    CORS__CREDENTIALS=true

    # Logging Configuration
    LOGGING__LEVEL=INFO
    LOGGING__FORMAT=json
    LOGGING__ENABLE_UVICORN_LOGGING=true

    # Semantic Kernel Configuration
    SEMANTIC_KERNEL__SERVICE_TYPE=OpenAI
    SEMANTIC_KERNEL__MAX_CONCURRENT_REQUESTS=10
    SEMANTIC_KERNEL__REQUEST_TIMEOUT=30

    # =============================================================================
    # Production Environment Additional Variables
    # =============================================================================
    # Uncomment and configure for production deployment:
    #
    # ENVIRONMENT=production
    # FASTAPI__DEBUG=false
    # LOGGING__LEVEL=WARNING
    # CORS__ORIGINS=["https://your-production-domain.com"]
    # =============================================================================
    ```

- [ ] **Sub-Task 3: Configuration Validation Script**
  - **Description:** Create comprehensive validation script for environment setup

    ```python
    # File Path: carfind-backend/scripts/validate_config.py
    # Configuration validation and environment setup verification

    """Configuration validation script for CarFind backend."""

    import os
    import sys
    from pathlib import Path
    from typing import List, Tuple

    import httpx


    def validate_environment_file() -> Tuple[bool, List[str]]:
        """Validate .env file exists and contains required variables."""
        errors = []
        env_path = Path(".env")
        
        if not env_path.exists():
            errors.append("❌ .env file not found. Copy .env.example to .env")
            return False, errors
        
        required_vars = [
            "OPENAI__API_KEY",
            "FASTAPI__SECRET_KEY",
        ]
        
        with open(env_path, "r", encoding="utf-8") as f:
            env_content = f.read()
        
        for var in required_vars:
            if var not in env_content:
                errors.append(f"❌ Required variable {var} not found in .env")
            elif f"{var}=your_" in env_content or f"{var}=sk-your_" in env_content:
                errors.append(f"❌ Variable {var} contains placeholder value")
        
        if not errors:
            print("✅ Environment file validation passed")
        
        return len(errors) == 0, errors


    def validate_configuration_loading() -> Tuple[bool, List[str]]:
        """Validate configuration can be loaded successfully."""
        errors = []
        
        try:
            sys.path.append(str(Path(__file__).parent.parent))
            from app.config import settings
            
            print(f"✅ Configuration loaded successfully")
            print(f"  - Environment: {settings.environment}")
            print(f"  - OpenAI Model: {settings.openai.model_name}")
            print(f"  - FastAPI Port: {settings.fastapi.port}")
            print(f"  - Log Level: {settings.logging.level}")
            
            return True, []
            
        except Exception as e:
            errors.append(f"❌ Configuration loading failed: {e}")
            return False, errors


    async def validate_openai_connectivity() -> Tuple[bool, List[str]]:
        """Validate OpenAI API connectivity and quota."""
        errors = []
        
        try:
            sys.path.append(str(Path(__file__).parent.parent))
            from app.config import settings
            
            headers = {
                "Authorization": f"Bearer {settings.openai.api_key}",
                "Content-Type": "application/json",
            }
            
            # Test API connectivity with minimal request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": settings.openai.model_name,
                        "messages": [{"role": "user", "content": "test"}],
                        "max_tokens": 5,
                    },
                    timeout=10.0,
                )
            
            if response.status_code == 200:
                print("✅ OpenAI API connectivity validated")
                return True, []
            else:
                errors.append(f"❌ OpenAI API returned status {response.status_code}")
                return False, errors
                
        except Exception as e:
            errors.append(f"❌ OpenAI API validation failed: {e}")
            return False, errors


    def generate_secret_key() -> str:
        """Generate a secure secret key for API security."""
        import secrets
        return secrets.token_urlsafe(32)


    async def main() -> None:
        """Run comprehensive configuration validation."""
        print("CarFind Backend Configuration Validation")
        print("=" * 50)
        
        all_passed = True
        
        # Validate environment file
        env_passed, env_errors = validate_environment_file()
        all_passed &= env_passed
        
        if env_errors:
            for error in env_errors:
                print(error)
            
            if "SECRET_KEY" in str(env_errors):
                print(f"\nGenerate a secret key with: {generate_secret_key()}")
        
        # Validate configuration loading
        if env_passed:
            config_passed, config_errors = validate_configuration_loading()
            all_passed &= config_passed
            
            for error in config_errors:
                print(error)
        
            # Validate OpenAI connectivity
            if config_passed:
                openai_passed, openai_errors = await validate_openai_connectivity()
                all_passed &= openai_passed
                
                for error in openai_errors:
                    print(error)
        
        print("\n" + "=" * 50)
        if all_passed:
            print("✅ All configuration validation checks passed!")
        else:
            print("❌ Configuration validation failed. Please fix the errors above.")
        
        sys.exit(0 if all_passed else 1)


    if __name__ == "__main__":
        import asyncio
        asyncio.run(main())
    ```

- [ ] **Sub-Task 4: Configuration Usage Integration**
  - **Description:** Update FastAPI application to use enhanced configuration

    ```python
    # File Path: carfind-backend/app/main.py
    # Updated FastAPI application with enhanced configuration usage

    """CarFind MVP Semantic Kernel Backend - Enhanced Configuration Integration."""

    from contextlib import asynccontextmanager
    from typing import AsyncGenerator

    import uvicorn
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.middleware.trustedhost import TrustedHostMiddleware

    from app.api.routes import health
    from app.config import settings
    from app.middleware.logging import LoggingMiddleware


    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
        """Application lifespan management with enhanced configuration."""
        # Startup: Log configuration status
        print(f"🚀 Starting CarFind Backend ({settings.environment})")
        print(f"📊 OpenAI Model: {settings.openai.model_name}")
        print(f"🌐 CORS Origins: {settings.cors.origins}")
        print(f"📝 Log Level: {settings.logging.level}")
        
        yield
        
        # Shutdown: Cleanup resources
        print("🔄 Shutting down CarFind Backend")


    def create_app() -> FastAPI:
        """Create and configure FastAPI application with enhanced settings."""
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

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Comprehensive Pydantic settings model implemented with validation
- Environment template created with security guidelines and placeholder values
- Configuration validation script operational and passing all checks
- Zero magic strings in configuration management system
- OpenAI API connectivity validated through configuration system
- FastAPI application updated to use enhanced configuration model

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Enhanced configuration model with nested settings implemented
- [ ] Environment template updated with comprehensive variables
- [ ] Configuration validation script created and functional
- [ ] FastAPI application integrated with enhanced configuration
- [ ] Zero magic strings throughout configuration system
- [ ] Environment variable validation working correctly
- [ ] OpenAI API connectivity tested through configuration
- [ ] Configuration follows SOLID principles with proper separation of concerns

---

## 9. Risks & Mitigations

- **Risk**: Environment variable validation complexity → **Mitigation**: Comprehensive Pydantic validators with clear error messages
- **Risk**: Configuration security vulnerabilities → **Mitigation**: Secret key validation and security guidelines in template
- **Risk**: OpenAI API key validation failures → **Mitigation**: Graceful error handling with clear remediation steps
- **Risk**: CORS configuration blocking requests → **Mitigation**: Flexible origins configuration with validation
- **Risk**: Production configuration inconsistencies → **Mitigation**: Environment-specific validation rules

---

## 10. Self-Assessment Checklist

- [ ] Configuration management system follows zero magic strings policy completely
- [ ] Environment variable validation provides clear error messages and remediation guidance
- [ ] Security best practices implemented for API keys and secret management
- [ ] Configuration model extensible for future Semantic Kernel settings
- [ ] FastAPI application properly integrated with enhanced configuration system

---
