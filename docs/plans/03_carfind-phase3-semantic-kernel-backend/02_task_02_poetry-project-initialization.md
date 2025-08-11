---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Poetry Project Initialization

## Task Meta

- **Task ID:** 02_task_02
- **Task Name:** Poetry Project Initialization
- **Phase:** Phase 3.1
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Create production-ready Python backend structure using Poetry with Semantic Kernel dependencies and CoE-compliant development tools for CarFind MVP completion.

## 2. Objectives

- Initialize Poetry project with proper metadata and semantic versioning
- Install Semantic Kernel version 1.20.0 with FastAPI and production dependencies
- Configure development dependencies including Ruff, Black, MyPy for CoE compliance
- Setup pyproject.toml with strict linting rules and comprehensive type checking
- Create environment configuration with proper variable validation following zero magic strings policy

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 01 (Prerequisites Validation) completed successfully
- [ ] Python 3.12+ confirmed available and functional
- [ ] Poetry package manager validated and operational
- [ ] OpenAI API key tested and ready for Semantic Kernel integration
- [ ] Project directory structure planning completed

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 2: `CarFind/lib/services/ai-service-factory.ts` - Service factory pattern for AI service management
- Phase 2: `CarFind/lib/config/ai-config.ts` - Configuration management with zero magic strings
- Phase 2: `CarFind/lib/types/ai-service.ts` - TypeScript interfaces for AI service contracts
- Backend: `carfind-backend/` - New Python backend directory structure

### 4.2 Framework Dependencies

- Python 3.12+ for optimal Semantic Kernel 1.20.0 compatibility
- Poetry for dependency management and virtual environment isolation
- Semantic Kernel 1.20.0 for Microsoft AI process framework integration
- FastAPI for maintaining Phase 2 API contract compatibility
- Development tools: Ruff, Black, MyPy, Pytest for CoE compliance

---

## 5. Testing Strategy

- **Unit Tests:** Validate Poetry project initialization and dependency resolution
- **Integration Tests:** Verify Semantic Kernel installation and import functionality
- **Manual Tests:** Confirm project structure and development environment setup

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | Python backend foundation setup | `carfind-backend/pyproject.toml` | `TEST-U-001` |
| `REQ-005`                  | Production deployment preparation | `carfind-backend/app/`, development dependencies | `TEST-I-002` |
| `NFR-003`                  | SOLID principles compliance | Ruff, Black, MyPy configuration | `TEST-M-003` |
| `NFR-005`                  | Environment security setup | Environment template and validation | `TEST-S-004` |

---

## 7. Implementation Plan

### 7.1 Design

Production-ready Poetry project initialization following Microsoft Semantic Kernel best practices with comprehensive development toolchain for CoE compliance and zero magic strings policy.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Poetry Project Creation**
  - **Description:** Initialize Poetry project with proper metadata and semantic versioning

    ```bash
    # File Path: c:\projects\carbot\06\
    # Poetry project initialization

    # Create backend directory
    mkdir carfind-backend
    cd carfind-backend

    # Initialize Poetry project with comprehensive metadata
    poetry init --name carfind-backend --version 0.1.0 --description "CarFind MVP Semantic Kernel Backend" --author "GitHub Copilot <copilot@github.com>" --license MIT --no-interaction
    ```

- [ ] **Sub-Task 2: Production Dependencies Installation**
  - **Description:** Install Semantic Kernel and production runtime dependencies

    ```toml
    # File Path: carfind-backend/pyproject.toml
    # Production dependencies configuration

    [tool.poetry.dependencies]
    python = "^3.12"
    semantic-kernel = "1.20.0"
    fastapi = "^0.104.0"
    uvicorn = {extras = ["standard"], version = "^0.24.0"}
    pydantic = "^2.5.0"
    python-dotenv = "^1.0.0"
    httpx = "^0.26.0"
    aiofiles = "^23.2.0"
    ```

- [ ] **Sub-Task 3: Development Dependencies Configuration**
  - **Description:** Setup CoE-compliant development tools for code quality

    ```toml
    # File Path: carfind-backend/pyproject.toml
    # Development dependencies for CoE compliance

    [tool.poetry.group.dev.dependencies]
    ruff = "^0.1.6"
    black = "^23.11.0"
    mypy = "^1.7.0"
    pytest = "^7.4.0"
    pytest-asyncio = "^0.21.0"
    pytest-cov = "^4.1.0"
    bandit = "^1.7.5"
    safety = "^2.3.0"
    ```

- [ ] **Sub-Task 4: Linting and Type Checking Configuration**
  - **Description:** Configure strict linting rules and comprehensive type checking

    ```toml
    # File Path: carfind-backend/pyproject.toml
    # Ruff configuration for CoE compliance

    [tool.ruff]
    line-length = 100
    target-version = "py312"
    select = ["E", "F", "W", "C", "I", "N", "UP", "YTT", "ANN", "S", "BLE", "FBT", "B", "A", "COM", "DTZ", "DJ", "EM", "EXE", "FA", "ISC", "ICN", "G", "INP", "PIE", "T20", "PYI", "PT", "Q", "RSE", "RET", "SLF", "SLOT", "SIM", "TID", "TCH", "INT", "ARG", "PTH", "ERA", "PD", "PGH", "PL", "TRY", "FLY", "NPY", "AIR", "PERF", "FURB", "LOG", "RUF"]
    ignore = ["ANN101", "ANN102", "COM812", "ISC001"]

    [tool.ruff.format]
    quote-style = "double"
    indent-style = "space"
    skip-magic-trailing-comma = false
    line-ending = "auto"

    [tool.mypy]
    python_version = "3.12"
    strict = true
    warn_return_any = true
    warn_unused_configs = true
    disallow_untyped_defs = true
    disallow_incomplete_defs = true
    check_untyped_defs = true
    disallow_untyped_decorators = true
    no_implicit_optional = true
    warn_redundant_casts = true
    warn_unused_ignores = true
    warn_no_return = true
    warn_unreachable = true
    strict_equality = true
    ```

- [ ] **Sub-Task 5: Environment Configuration Template**
  - **Description:** Create environment template with proper variable validation

    ```python
    # File Path: carfind-backend/.env.example
    # Environment variables template for production deployment

    # OpenAI Configuration
    OPENAI_API_KEY=your_openai_api_key_here

    # FastAPI Configuration
    FASTAPI_HOST=0.0.0.0
    FASTAPI_PORT=8000
    API_SECRET_KEY=your_secret_key_here

    # CORS Configuration
    CORS_ORIGINS=["http://localhost:3000"]

    # Logging Configuration
    LOG_LEVEL=INFO
    LOG_FORMAT=json

    # Semantic Kernel Configuration
    SK_SERVICE_TYPE=OpenAI
    SK_MODEL_NAME=gpt-4o
    ```

- [ ] **Sub-Task 6: Project Structure Creation**
  - **Description:** Establish production-ready directory structure

    ```bash
    # File Path: carfind-backend/
    # Directory structure creation

    # Create application directories
    mkdir -p app/api/routes
    mkdir -p app/services
    mkdir -p app/processes
    mkdir -p app/middleware
    mkdir -p tests

    # Create configuration and scripts directories
    mkdir -p scripts

    # Create main application entry points
    touch app/__init__.py
    touch app/main.py
    touch app/config.py
    ```

- [ ] **Sub-Task 7: Poetry Installation and Validation**
  - **Description:** Install dependencies and validate project setup

    ```bash
    # File Path: carfind-backend/
    # Poetry dependency installation and validation

    # Install all dependencies
    poetry install

    # Validate installation
    poetry run python -c "import semantic_kernel; print('✅ Semantic Kernel installed successfully')"
    poetry run python -c "import fastapi; print('✅ FastAPI installed successfully')"
    
    # Run development tools validation
    poetry run ruff --version
    poetry run black --version
    poetry run mypy --version
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Poetry project initialized with proper metadata and dependencies
- Semantic Kernel 1.20.0 successfully installed and importable
- All production and development dependencies resolved without conflicts
- Linting and type checking tools configured with strict CoE-compliant rules
- Environment configuration template created with proper variable structure
- Project directory structure established following production best practices

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Poetry project created with comprehensive pyproject.toml configuration
- [ ] Semantic Kernel 1.20.0 installed and import validation passing
- [ ] FastAPI and all production dependencies installed successfully
- [ ] Development tools (Ruff, Black, MyPy) configured with strict rules
- [ ] Environment template created with all required variables
- [ ] Project directory structure established and validated
- [ ] Poetry installation and validation scripts executed successfully
- [ ] Zero dependency conflicts or installation errors

---

## 9. Risks & Mitigations

- **Risk**: Semantic Kernel version compatibility issues → **Mitigation**: Use pinned version 1.20.0 with Python 3.12+ requirement
- **Risk**: Poetry dependency resolution conflicts → **Mitigation**: Clear dependency specification with version constraints
- **Risk**: Development tools configuration complexity → **Mitigation**: Proven CoE-compliant configurations with comprehensive testing
- **Risk**: Environment variable security concerns → **Mitigation**: Template-based approach with clear security guidelines
- **Risk**: Project structure inconsistency → **Mitigation**: Follow established FastAPI and Python project conventions

---

## 10. Self-Assessment Checklist

- [ ] Poetry project properly initialized with complete metadata and dependencies
- [ ] Semantic Kernel installation validated and ready for process implementation
- [ ] Development environment configured for optimal productivity and code quality
- [ ] Environment configuration prepared for secure production deployment
- [ ] Project structure established following industry best practices and SOLID principles

---
