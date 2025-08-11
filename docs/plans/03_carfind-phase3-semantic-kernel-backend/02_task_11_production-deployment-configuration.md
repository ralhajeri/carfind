---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Production Deployment Configuration

## Task Meta

- **Task ID:** 02_task_11
- **Task Name:** Production Deployment Configuration
- **Phase:** Phase 3.3
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Create production-ready Dockerfile with proper Python environment setup, Docker Compose configuration for development and production environments, CI/CD pipeline configuration, and deployment documentation with environment-specific settings.

## 2. Objectives

- Create production-ready Dockerfile with multi-stage build and Python 3.12+ environment
- Implement Docker Compose configuration for development and production deployment
- Setup CI/CD pipeline configuration for automated testing and deployment
- Create comprehensive deployment documentation with environment-specific settings
- Configure environment variables and secrets management for production security

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 10 (Next.js Service Integration) completed successfully
- [ ] Complete FastAPI backend application operational and tested
- [ ] Production requirements understood including security and performance
- [ ] Deployment target environment available (local Docker or cloud platform)
- [ ] CI/CD pipeline requirements and tools identified

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Backend: `carfind-backend/` - Complete FastAPI application for containerization
- Backend: `carfind-backend/pyproject.toml` - Poetry configuration for dependency management
- Frontend: `CarFind/` - Next.js application requiring environment configuration
- Config: Environment variables and secrets for production deployment
- CI/CD: GitHub Actions workflow files for automated deployment

### 4.2 Framework Dependencies

- Docker for containerization with multi-stage builds
- Docker Compose for orchestration and environment management
- Poetry for Python dependency management in containers
- GitHub Actions for CI/CD pipeline automation
- Environment variable management for configuration
- Production monitoring and logging configuration

---

## 5. Testing Strategy

- **Unit Tests:** Validate Docker build process and container functionality
- **Integration Tests:** Verify complete deployment pipeline and service communication
- **Manual Tests:** Confirm production deployment scenarios and rollback procedures

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `NFR-003`                  | Production deployment readiness | Docker configuration and compose files | `TEST-D-001` |
| `NFR-004`                  | CI/CD pipeline automation | GitHub Actions workflow configuration | `TEST-CI-002` |
| `NFR-005`                  | Security and environment management | Environment variables and secrets | `TEST-S-003` |
| `REQ-003`                  | Production monitoring and logging | Monitoring configuration and health checks | `TEST-M-004` |

---

## 7. Implementation Plan

### 7.1 Design

Production deployment configuration using Docker containerization with multi-stage builds, Docker Compose orchestration, CI/CD automation via GitHub Actions, and comprehensive environment management for security and scalability.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Production Dockerfile**
  - **Description:** Create multi-stage Dockerfile for Python FastAPI application

    ```dockerfile
    # File Path: carfind-backend/Dockerfile
    # Production-ready multi-stage Dockerfile for CarFind Backend

    # Build stage
    FROM python:3.12-slim as builder

    # Set environment variables
    ENV PYTHONUNBUFFERED=1 \
        PYTHONDONTWRITEBYTECODE=1 \
        PIP_NO_CACHE_DIR=1 \
        PIP_DISABLE_PIP_VERSION_CHECK=1

    # Install system dependencies
    RUN apt-get update && apt-get install -y \
        build-essential \
        curl \
        && rm -rf /var/lib/apt/lists/*

    # Install Poetry
    RUN pip install poetry==1.7.1

    # Configure Poetry
    ENV POETRY_NO_INTERACTION=1 \
        POETRY_VENV_IN_PROJECT=1 \
        POETRY_CACHE_DIR=/tmp/poetry_cache

    # Set work directory
    WORKDIR /app

    # Copy Poetry files
    COPY pyproject.toml poetry.lock ./

    # Install dependencies
    RUN poetry install --no-dev && rm -rf $POETRY_CACHE_DIR

    # Production stage
    FROM python:3.12-slim as production

    # Set environment variables
    ENV PYTHONUNBUFFERED=1 \
        PYTHONDONTWRITEBYTECODE=1 \
        PATH="/app/.venv/bin:$PATH"

    # Install system dependencies
    RUN apt-get update && apt-get install -y \
        curl \
        && rm -rf /var/lib/apt/lists/* \
        && apt-get clean

    # Create non-root user
    RUN groupadd --gid 1000 appuser \
        && useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

    # Set work directory
    WORKDIR /app

    # Copy virtual environment from builder stage
    COPY --from=builder --chown=appuser:appuser /app/.venv /app/.venv

    # Copy application code
    COPY --chown=appuser:appuser . .

    # Switch to non-root user
    USER appuser

    # Health check
    HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
        CMD curl -f http://localhost:8000/api/health || exit 1

    # Expose port
    EXPOSE 8000

    # Default command
    CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```

- [ ] **Sub-Task 2: Docker Compose Configuration**
  - **Description:** Create development and production Docker Compose configurations

    ```yaml
    # File Path: carfind-backend/docker-compose.yml
    # Development Docker Compose configuration

    version: '3.8'

    services:
      carfind-backend:
        build:
          context: .
          dockerfile: Dockerfile
          target: production
        ports:
          - "8000:8000"
        environment:
          - ENVIRONMENT=development
          - FASTAPI_DEBUG=true
          - OPENAI_API_KEY=${OPENAI_API_KEY}
          - CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
        volumes:
          - ./app:/app/app:ro
          - ./logs:/app/logs
        restart: unless-stopped
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
          interval: 30s
          timeout: 10s
          retries: 3
          start_period: 40s

      carfind-frontend:
        image: node:18-alpine
        working_dir: /app
        ports:
          - "3000:3000"
        environment:
          - NEXT_PUBLIC_BACKEND_URL=http://carfind-backend:8000
          - NODE_ENV=development
        volumes:
          - ../CarFind:/app
        command: npm run dev
        depends_on:
          - carfind-backend
        restart: unless-stopped

    networks:
      default:
        name: carfind-network
    ```

    ```yaml
    # File Path: carfind-backend/docker-compose.prod.yml
    # Production Docker Compose configuration

    version: '3.8'

    services:
      carfind-backend:
        build:
          context: .
          dockerfile: Dockerfile
          target: production
        ports:
          - "8000:8000"
        environment:
          - ENVIRONMENT=production
          - FASTAPI_DEBUG=false
          - OPENAI_API_KEY=${OPENAI_API_KEY}
          - CORS_ORIGINS=${CORS_ORIGINS}
          - LOG_LEVEL=INFO
        volumes:
          - ./logs:/app/logs
          - /etc/ssl/certs:/etc/ssl/certs:ro
        restart: always
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
          interval: 30s
          timeout: 10s
          retries: 3
          start_period: 40s
        deploy:
          resources:
            limits:
              cpus: '1.0'
              memory: 1G
            reservations:
              cpus: '0.5'
              memory: 512M

      nginx:
        image: nginx:alpine
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf:ro
          - ./ssl:/etc/nginx/ssl:ro
        depends_on:
          - carfind-backend
        restart: always

    networks:
      default:
        name: carfind-prod-network
    ```

- [ ] **Sub-Task 3: CI/CD Pipeline Configuration**
  - **Description:** Setup GitHub Actions workflow for automated testing and deployment

    ```yaml
    # File Path: .github/workflows/backend-ci-cd.yml
    # CI/CD pipeline for CarFind Backend

    name: CarFind Backend CI/CD

    on:
      push:
        branches: [ main, develop ]
        paths:
          - 'carfind-backend/**'
          - '.github/workflows/backend-ci-cd.yml'
      pull_request:
        branches: [ main ]
        paths:
          - 'carfind-backend/**'

    env:
      REGISTRY: ghcr.io
      IMAGE_NAME: carfind/backend

    jobs:
      test:
        runs-on: ubuntu-latest
        defaults:
          run:
            working-directory: ./carfind-backend

        strategy:
          matrix:
            python-version: [3.12]

        steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Set up Python ${{ matrix.python-version }}
          uses: actions/setup-python@v4
          with:
            python-version: ${{ matrix.python-version }}

        - name: Install Poetry
          uses: snok/install-poetry@v1
          with:
            version: 1.7.1
            virtualenvs-create: true
            virtualenvs-in-project: true

        - name: Load cached venv
          id: cached-poetry-dependencies
          uses: actions/cache@v3
          with:
            path: carfind-backend/.venv
            key: venv-${{ runner.os }}-${{ matrix.python-version }}-${{ hashFiles('**/poetry.lock') }}

        - name: Install dependencies
          if: steps.cached-poetry-dependencies.outputs.cache-hit != 'true'
          run: poetry install --no-interaction --no-root

        - name: Install project
          run: poetry install --no-interaction

        - name: Run linting
          run: |
            poetry run ruff check .
            poetry run black --check .

        - name: Run type checking
          run: poetry run mypy .

        - name: Run tests
          run: poetry run pytest --cov=app --cov-report=xml

        - name: Upload coverage to Codecov
          uses: codecov/codecov-action@v3
          with:
            file: ./carfind-backend/coverage.xml
            flags: backend
            name: backend-coverage

      build:
        needs: test
        runs-on: ubuntu-latest
        if: github.event_name == 'push'

        steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v3

        - name: Log in to Container Registry
          uses: docker/login-action@v3
          with:
            registry: ${{ env.REGISTRY }}
            username: ${{ github.actor }}
            password: ${{ secrets.GITHUB_TOKEN }}

        - name: Extract metadata
          id: meta
          uses: docker/metadata-action@v5
          with:
            images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
            tags: |
              type=ref,event=branch
              type=ref,event=pr
              type=sha,prefix={{branch}}-
              type=raw,value=latest,enable={{is_default_branch}}

        - name: Build and push Docker image
          uses: docker/build-push-action@v5
          with:
            context: ./carfind-backend
            push: true
            tags: ${{ steps.meta.outputs.tags }}
            labels: ${{ steps.meta.outputs.labels }}
            cache-from: type=gha
            cache-to: type=gha,mode=max

      deploy-staging:
        needs: build
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/develop'
        environment: staging

        steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Deploy to staging
          run: |
            echo "Deploying to staging environment"
            # Add staging deployment commands here

      deploy-production:
        needs: build
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'
        environment: production

        steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Deploy to production
          run: |
            echo "Deploying to production environment"
            # Add production deployment commands here
    ```

- [ ] **Sub-Task 4: Environment Configuration Management**
  - **Description:** Create comprehensive environment configuration files

    ```bash
    # File Path: carfind-backend/.env.example
    # Example environment variables for CarFind Backend

    # Application Environment
    ENVIRONMENT=development
    FASTAPI_DEBUG=true
    FASTAPI_HOST=0.0.0.0
    FASTAPI_PORT=8000

    # OpenAI Configuration
    OPENAI_API_KEY=your_openai_api_key_here
    OPENAI_MODEL_NAME=gpt-4
    OPENAI_MAX_TOKENS=2000
    OPENAI_TEMPERATURE=0.7

    # CORS Configuration
    CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    CORS_CREDENTIALS=true
    CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
    CORS_HEADERS=*

    # Logging Configuration
    LOG_LEVEL=INFO
    LOG_FORMAT=json
    ENABLE_UVICORN_LOGGING=true

    # Performance Configuration
    REQUEST_TIMEOUT=30
    MAX_CONNECTIONS=100
    KEEPALIVE_TIMEOUT=5

    # Security Configuration
    ALLOWED_HOSTS=localhost,127.0.0.1
    API_RATE_LIMIT=100

    # Monitoring Configuration
    ENABLE_METRICS=true
    HEALTH_CHECK_INTERVAL=30
    ```

    ```bash
    # File Path: carfind-backend/.env.production
    # Production environment variables template

    # Application Environment
    ENVIRONMENT=production
    FASTAPI_DEBUG=false
    FASTAPI_HOST=0.0.0.0
    FASTAPI_PORT=8000

    # OpenAI Configuration (Use secrets in production)
    OPENAI_API_KEY=${OPENAI_API_KEY_SECRET}
    OPENAI_MODEL_NAME=gpt-4
    OPENAI_MAX_TOKENS=2000
    OPENAI_TEMPERATURE=0.7

    # CORS Configuration (Restrict in production)
    CORS_ORIGINS=${PRODUCTION_FRONTEND_URLS}
    CORS_CREDENTIALS=true
    CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
    CORS_HEADERS=Content-Type,Authorization

    # Logging Configuration
    LOG_LEVEL=WARNING
    LOG_FORMAT=json
    ENABLE_UVICORN_LOGGING=false

    # Performance Configuration
    REQUEST_TIMEOUT=30
    MAX_CONNECTIONS=200
    KEEPALIVE_TIMEOUT=5

    # Security Configuration
    ALLOWED_HOSTS=${PRODUCTION_HOSTS}
    API_RATE_LIMIT=50

    # Monitoring Configuration
    ENABLE_METRICS=true
    HEALTH_CHECK_INTERVAL=60
    ```

- [ ] **Sub-Task 5: Deployment Documentation**
  - **Description:** Create comprehensive deployment and operations documentation

    ```markdown
    # File Path: carfind-backend/DEPLOYMENT.md
    # CarFind Backend Deployment Guide

    # CarFind Backend Deployment Guide

    ## Overview

    This guide covers the deployment of the CarFind Semantic Kernel Backend using Docker and Docker Compose.

    ## Prerequisites

    - Docker Engine 20.10+
    - Docker Compose 2.0+
    - Python 3.12+ (for local development)
    - Poetry 1.7+ (for dependency management)

    ## Quick Start

    ### Development Environment

    1. **Clone and Setup**
       ```bash
       git clone <repository-url>
       cd carfind-backend
       cp .env.example .env
       # Edit .env with your configuration
       ```

    2. **Start with Docker Compose**

       ```bash
       docker-compose up --build
       ```

    3. **Verify Deployment**

       ```bash
       curl http://localhost:8000/api/health
       ```

    ### Production Environment

    1. **Prepare Environment**

       ```bash
       cp .env.example .env.production
       # Configure production settings
       export OPENAI_API_KEY="your-production-key"
       export CORS_ORIGINS="https://your-frontend-domain.com"
       ```

    2. **Deploy with Production Compose**

       ```bash
       docker-compose -f docker-compose.prod.yml up -d
       ```

    3. **Verify Production Deployment**

       ```bash
       curl http://localhost:8000/api/health
       ```

    ## Configuration

    ### Environment Variables

    | Variable | Description | Default | Required |
    |----------|-------------|---------|----------|
    | `ENVIRONMENT` | Deployment environment | `development` | Yes |
    | `OPENAI_API_KEY` | OpenAI API key | - | Yes |
    | `CORS_ORIGINS` | Allowed CORS origins | `*` | Yes |
    | `LOG_LEVEL` | Logging level | `INFO` | No |

    ### Security Considerations

    - **API Keys**: Store in secure environment variables or secret management
    - **CORS**: Restrict origins in production
    - **HTTPS**: Use reverse proxy (nginx) for SSL termination
    - **Rate Limiting**: Configure appropriate limits for your use case

    ## Monitoring and Health Checks

    ### Health Endpoint

    ```bash
    GET /api/health
    ```

    ### Docker Health Checks

    ```bash
    docker ps --format "table {{.Names}}\t{{.Status}}"
    ```

    ### Logs

    ```bash
    # View logs
    docker-compose logs -f carfind-backend

    # Production logs
    docker-compose -f docker-compose.prod.yml logs -f carfind-backend
    ```

    ## Troubleshooting

    ### Common Issues

    1. **Service Won't Start**
       - Check environment variables
       - Verify Docker resources
       - Review logs for errors

    2. **OpenAI API Errors**
       - Verify API key validity
       - Check rate limits
       - Ensure network connectivity

    3. **CORS Issues**
       - Verify CORS_ORIGINS configuration
       - Check frontend URL configuration

    ### Debug Commands

    ```bash
    # Check container status
    docker-compose ps

    # Access container shell
    docker-compose exec carfind-backend bash

    # View detailed logs
    docker-compose logs --tail=100 carfind-backend
    ```

    ## Scaling and Performance

    ### Resource Requirements

    - **CPU**: 0.5-1.0 cores per instance
    - **Memory**: 512MB-1GB per instance
    - **Storage**: 100MB for application + log space

    ### Horizontal Scaling

    ```yaml
    # Scale backend service
    docker-compose up --scale carfind-backend=3
    ```

    ## Backup and Recovery

    ### Configuration Backup

    - Store environment files securely
    - Version control Docker configurations
    - Document custom configurations

    ### Service Recovery

    ```bash
    # Stop services
    docker-compose down

    # Rebuild and restart
    docker-compose up --build -d
    ```

    ## CI/CD Integration

    The project includes GitHub Actions workflows for:
    - Automated testing on pull requests
    - Docker image building and pushing
    - Deployment to staging and production

    ### Manual Deployment

    ```bash
    # Pull latest image
    docker pull ghcr.io/carfind/backend:latest

    # Update deployment
    docker-compose pull
    docker-compose up -d
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Production-ready Dockerfile operational with multi-stage build and Python 3.12+ environment
- Docker Compose configuration functional for both development and production environments
- CI/CD pipeline operational with automated testing and deployment capabilities
- Comprehensive deployment documentation available with environment-specific settings
- Environment variables and secrets management configured for production security

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Multi-stage Dockerfile created with proper Python environment setup
- [ ] Docker Compose configurations implemented for development and production
- [ ] CI/CD pipeline configured with GitHub Actions for automated deployment
- [ ] Environment configuration management implemented with secure secrets handling
- [ ] Comprehensive deployment documentation created with troubleshooting guides
- [ ] Health checks and monitoring configured for production readiness
- [ ] Security best practices implemented including non-root user and HTTPS support
- [ ] Resource limits and scaling configuration documented
- [ ] Backup and recovery procedures documented

---

## 9. Risks & Mitigations

- **Risk**: Docker image size and build time → **Mitigation**: Multi-stage builds and optimized layer caching
- **Risk**: Secret management in production → **Mitigation**: Environment variable patterns and secret management integration
- **Risk**: Deployment downtime → **Mitigation**: Health checks and rolling deployment strategies
- **Risk**: Resource consumption in production → **Mitigation**: Resource limits and monitoring configuration
- **Risk**: CI/CD pipeline failures → **Mitigation**: Comprehensive testing stages and rollback mechanisms

---

## 10. Self-Assessment Checklist

- [ ] Deployment configuration enables reliable production operations
- [ ] CI/CD pipeline provides automated quality assurance and deployment
- [ ] Security measures protect sensitive configuration and secrets
- [ ] Monitoring and health checks enable proactive issue detection
- [ ] Documentation provides clear guidance for operations and troubleshooting

---
