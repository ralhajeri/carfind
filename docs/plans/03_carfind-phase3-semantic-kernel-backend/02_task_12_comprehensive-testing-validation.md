---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Comprehensive Testing & Validation

## Task Meta

- **Task ID:** 02_task_12
- **Task Name:** Comprehensive Testing & Validation
- **Phase:** Phase 3.3
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Implement comprehensive unit tests for all Semantic Kernel processes, create integration tests validating API contract compatibility with Phase 2, setup end-to-end testing for complete workflow validation, and establish performance testing for production readiness.

## 2. Objectives

- Implement unit tests for all Semantic Kernel processes with comprehensive coverage
- Create integration tests validating API contract compatibility with Phase 2 frontend
- Setup end-to-end testing for complete workflow validation and user scenarios
- Establish performance testing for production readiness and scalability
- Create automated testing pipeline with quality gates and coverage reporting

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 11 (Production Deployment Configuration) completed successfully
- [ ] All Phase 3 backend implementation completed and operational
- [ ] Test framework and tools identified for comprehensive testing strategy
- [ ] Phase 2 API contracts documented for compatibility validation
- [ ] Testing environment available for integration and end-to-end testing

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Backend: `carfind-backend/app/` - Complete application requiring test coverage
- Backend: `carfind-backend/tests/` - Test directory structure to create
- Phase 2: `CarFind/` - Frontend application for integration testing
- CI/CD: `.github/workflows/` - Testing pipeline integration
- Config: `carfind-backend/pytest.ini` - Test configuration and coverage settings

### 4.2 Framework Dependencies

- pytest for Python unit and integration testing framework
- pytest-asyncio for async test support with Semantic Kernel
- pytest-cov for code coverage reporting and quality gates
- httpx for HTTP client testing with FastAPI TestClient
- pytest-mock for mocking external dependencies and services
- Locust or similar for performance and load testing

---

## 5. Testing Strategy

- **Unit Tests:** Validate individual Semantic Kernel processes and service components
- **Integration Tests:** Verify API contract compatibility and inter-service communication
- **End-to-End Tests:** Confirm complete user workflows and system behavior
- **Performance Tests:** Validate system performance under load and stress conditions

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`, `REQ-002`       | API contract compatibility validation | Integration tests for Phase 2 compatibility | `TEST-INT-001` |
| `NFR-001`                  | Performance and scalability validation | Performance tests and load testing | `TEST-PERF-002` |
| `NFR-005`                  | Quality assurance and reliability | Unit tests with comprehensive coverage | `TEST-UNIT-003` |
| `REQ-003`                  | Complete workflow validation | End-to-end tests for user scenarios | `TEST-E2E-004` |

---

## 7. Implementation Plan

### 7.1 Design

Comprehensive testing strategy covering unit tests for all Semantic Kernel processes, integration tests for API contract validation, end-to-end tests for complete workflows, and performance tests for production readiness.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Unit Test Framework Setup**
  - **Description:** Configure pytest framework with async support and coverage reporting

    ```python
    # File Path: carfind-backend/pytest.ini
    # pytest configuration for CarFind Backend testing

    [tool:pytest]
    minversion = 6.0
    addopts = 
        -ra
        --strict-markers
        --strict-config
        --cov=app
        --cov-report=term-missing
        --cov-report=html
        --cov-report=xml
        --cov-fail-under=85
        --asyncio-mode=auto
    python_files = tests/*.py
    testpaths = tests
    asyncio_mode = auto
    markers =
        unit: Unit tests
        integration: Integration tests
        e2e: End-to-end tests
        slow: Slow running tests
        performance: Performance tests
    ```

    ```python
    # File Path: carfind-backend/tests/conftest.py
    # pytest configuration and fixtures for testing

    """Pytest configuration and shared fixtures for CarFind Backend testing."""

    import asyncio
    import pytest
    import pytest_asyncio
    from fastapi.testclient import TestClient
    from httpx import AsyncClient

    from app.main import create_app
    from app.services.kernel_service import KernelService
    from app.config import settings


    @pytest.fixture(scope="session")
    def event_loop():
        """Create an instance of the default event loop for the test session."""
        loop = asyncio.get_event_loop_policy().new_event_loop()
        yield loop
        loop.close()


    @pytest.fixture
    def app():
        """Create FastAPI test application."""
        test_app = create_app()
        return test_app


    @pytest.fixture
    def client(app):
        """Create test client for FastAPI application."""
        return TestClient(app)


    @pytest_asyncio.fixture
    async def async_client(app):
        """Create async test client for FastAPI application."""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac


    @pytest_asyncio.fixture
    async def mock_kernel_service():
        """Create mock kernel service for testing."""
        from unittest.mock import AsyncMock, MagicMock
        
        mock_service = AsyncMock(spec=KernelService)
        mock_service.get_kernel.return_value = MagicMock()
        mock_service.health_check.return_value = {
            "status": "healthy",
            "version": "test",
            "services": {"kernel": "operational"}
        }
        return mock_service


    @pytest.fixture
    def sample_chat_messages():
        """Sample chat messages for testing."""
        return [
            {
                "id": "msg_1",
                "role": "user",
                "content": "I'm looking for a reliable family car under $30,000",
                "createdAt": "2024-01-01T10:00:00Z"
            },
            {
                "id": "msg_2",
                "role": "assistant",
                "content": "I'd be happy to help you find a family car! What size family are you shopping for?",
                "createdAt": "2024-01-01T10:00:05Z"
            }
        ]


    @pytest.fixture
    def sample_car_data():
        """Sample car data for testing."""
        return [
            {
                "id": "car_1",
                "make": "Toyota",
                "model": "Camry",
                "year": 2023,
                "price": 28000,
                "category": "Sedan",
                "fuel_type": "Gasoline",
                "safety_rating": 5
            },
            {
                "id": "car_2",
                "make": "Honda",
                "model": "CR-V",
                "year": 2023,
                "price": 32000,
                "category": "SUV",
                "fuel_type": "Gasoline",
                "safety_rating": 5
            }
        ]


    @pytest.fixture
    def test_settings():
        """Test-specific settings."""
        test_settings = settings.copy()
        test_settings.environment = "test"
        test_settings.fastapi.debug = True
        test_settings.openai.api_key = "test-key"
        return test_settings
    ```

- [ ] **Sub-Task 2: Semantic Kernel Process Unit Tests**
  - **Description:** Create comprehensive unit tests for all Semantic Kernel processes

    ```python
    # File Path: carfind-backend/tests/unit/test_car_search_process.py
    # Unit tests for CarSearchProcess

    """Unit tests for CarSearchProcess."""

    import pytest
    from unittest.mock import AsyncMock, MagicMock
    from datetime import datetime

    from app.processes.car_search_process import CarSearchProcess
    from app.interfaces.process_interfaces import ProcessInput, ProcessResult
    from app.models.car_models import CarSearchCriteria


    @pytest.mark.unit
    class TestCarSearchProcess:
        """Test cases for CarSearchProcess."""

        @pytest_asyncio.fixture
        async def process(self):
            """Create CarSearchProcess instance for testing."""
            mock_kernel = MagicMock()
            process = CarSearchProcess(mock_kernel)
            return process

        @pytest.mark.asyncio
        async def test_process_initialization(self, process):
            """Test process initialization."""
            assert process.name == "car_search"
            assert process.description == "AI-powered car search and recommendation process"
            assert hasattr(process, 'kernel')

        @pytest.mark.asyncio
        async def test_search_cars_basic_criteria(self, process, sample_car_data):
            """Test basic car search functionality."""
            # Setup
            process._mock_car_database = sample_car_data
            criteria = CarSearchCriteria(
                max_price=30000,
                category="Sedan",
                fuel_type="Gasoline"
            )

            # Execute
            result = await process.search_cars(criteria)

            # Verify
            assert result is not None
            assert len(result) > 0
            assert all(car["price"] <= 30000 for car in result)
            assert all(car["category"] == "Sedan" for car in result)

        @pytest.mark.asyncio
        async def test_get_recommendations(self, process, sample_car_data):
            """Test AI recommendation functionality."""
            # Setup
            process._mock_car_database = sample_car_data
            user_context = {
                "budget": 30000,
                "family_size": 4,
                "preferences": ["reliability", "fuel_efficiency"]
            }

            # Execute
            recommendations = await process.get_recommendations(user_context)

            # Verify
            assert recommendations is not None
            assert isinstance(recommendations, list)
            assert len(recommendations) > 0
            for rec in recommendations:
                assert "car" in rec
                assert "score" in rec
                assert "reasoning" in rec

        @pytest.mark.asyncio
        async def test_process_execution_success(self, process):
            """Test successful process execution."""
            # Setup
            process_input = ProcessInput(
                session_id="test_session",
                timestamp=datetime.now(),
                metadata={
                    "action": "search",
                    "criteria": {
                        "max_price": 30000,
                        "category": "Sedan"
                    }
                }
            )

            # Execute
            result = await process.execute(process_input)

            # Verify
            assert isinstance(result, ProcessResult)
            assert result.success is True
            assert result.result is not None
            assert "cars" in result.result
            assert result.execution_time_ms > 0

        @pytest.mark.asyncio
        async def test_process_execution_invalid_input(self, process):
            """Test process execution with invalid input."""
            # Setup
            process_input = ProcessInput(
                session_id="test_session",
                timestamp=datetime.now(),
                metadata={}  # Missing required metadata
            )

            # Execute
            result = await process.execute(process_input)

            # Verify
            assert isinstance(result, ProcessResult)
            assert result.success is False
            assert result.error_message is not None
            assert "action" in result.error_message

        @pytest.mark.asyncio
        async def test_search_cars_no_results(self, process):
            """Test search with criteria that return no results."""
            # Setup
            process._mock_car_database = []
            criteria = CarSearchCriteria(max_price=10000, category="Luxury")

            # Execute
            result = await process.search_cars(criteria)

            # Verify
            assert result is not None
            assert len(result) == 0
    ```

    ```python
    # File Path: carfind-backend/tests/unit/test_conversation_process.py
    # Unit tests for ConversationProcess

    """Unit tests for ConversationProcess."""

    import pytest
    from unittest.mock import AsyncMock, MagicMock
    from datetime import datetime

    from app.processes.conversation_process import ConversationProcess
    from app.interfaces.process_interfaces import ProcessInput, ProcessResult
    from app.models.conversation_models import ConversationHistory, ChatMessage


    @pytest.mark.unit
    class TestConversationProcess:
        """Test cases for ConversationProcess."""

        @pytest_asyncio.fixture
        async def process(self):
            """Create ConversationProcess instance for testing."""
            mock_kernel = MagicMock()
            process = ConversationProcess(mock_kernel)
            return process

        @pytest.mark.asyncio
        async def test_intent_classification(self, process):
            """Test intent classification functionality."""
            # Test cases for different intents
            test_cases = [
                ("I want to buy a car", "car_search"),
                ("What are your hours?", "general_inquiry"),
                ("Can you help me find a Toyota?", "car_search"),
                ("Hello there", "greeting"),
                ("Thank you", "gratitude")
            ]

            for message, expected_intent in test_cases:
                intent = await process.classify_intent(message)
                assert intent == expected_intent

        @pytest.mark.asyncio
        async def test_process_user_message(self, process, sample_chat_messages):
            """Test processing user messages."""
            # Setup
            user_message = sample_chat_messages[0]["content"]
            session_id = "test_session"

            # Execute
            response = await process.process_user_message(user_message, session_id)

            # Verify
            assert response is not None
            assert "content" in response
            assert "intent" in response
            assert len(response["content"]) > 0

        @pytest.mark.asyncio
        async def test_conversation_history_management(self, process):
            """Test conversation history storage and retrieval."""
            # Setup
            session_id = "test_session_history"
            message1 = ChatMessage(
                id="msg_1",
                role="user",
                content="Hello",
                created_at=datetime.now()
            )
            message2 = ChatMessage(
                id="msg_2",
                role="assistant",
                content="Hi there!",
                created_at=datetime.now()
            )

            # Add messages to history
            await process.add_to_history(session_id, message1)
            await process.add_to_history(session_id, message2)

            # Retrieve history
            history = await process.get_conversation_history(session_id)

            # Verify
            assert history is not None
            assert len(history.messages) == 2
            assert history.messages[0].content == "Hello"
            assert history.messages[1].content == "Hi there!"

        @pytest.mark.asyncio
        async def test_clear_conversation(self, process):
            """Test clearing conversation history."""
            # Setup
            session_id = "test_session_clear"
            message = ChatMessage(
                id="msg_1",
                role="user",
                content="Test message",
                created_at=datetime.now()
            )
            await process.add_to_history(session_id, message)

            # Clear conversation
            success = await process.clear_conversation(session_id)

            # Verify
            assert success is True
            history = await process.get_conversation_history(session_id)
            assert history is None or len(history.messages) == 0
    ```

- [ ] **Sub-Task 3: API Contract Integration Tests**
  - **Description:** Create integration tests validating Phase 2 API compatibility

    ```python
    # File Path: carfind-backend/tests/integration/test_chat_api.py
    # Integration tests for Chat API Phase 2 compatibility

    """Integration tests for Chat API Phase 2 compatibility."""

    import pytest
    import json
    from fastapi.testclient import TestClient

    from app.main import create_app


    @pytest.mark.integration
    class TestChatAPIIntegration:
        """Integration tests for Chat API."""

        @pytest.fixture
        def client(self):
            """Create test client."""
            app = create_app()
            return TestClient(app)

        def test_chat_endpoint_post_request(self, client, sample_chat_messages):
            """Test chat endpoint with POST request matching Phase 2 contract."""
            # Setup request payload matching Phase 2 format
            request_payload = {
                "messages": sample_chat_messages,
                "sessionId": "test_session_123",
                "userId": "test_user_456",
                "stream": False,
                "metadata": {"source": "integration_test"}
            }

            # Execute
            response = client.post("/api/chat", json=request_payload)

            # Verify Phase 2 contract compliance
            assert response.status_code == 200
            response_data = response.json()
            
            # Validate response structure
            required_fields = ["id", "role", "content", "createdAt"]
            for field in required_fields:
                assert field in response_data, f"Missing required field: {field}"
            
            # Validate response content
            assert response_data["role"] == "assistant"
            assert len(response_data["content"]) > 0
            assert response_data["id"] is not None

        def test_chat_endpoint_streaming_request(self, client, sample_chat_messages):
            """Test chat endpoint with streaming response."""
            # Setup streaming request
            request_payload = {
                "messages": sample_chat_messages,
                "sessionId": "test_session_stream",
                "stream": True
            }

            # Execute
            response = client.post("/api/chat", json=request_payload)

            # Verify streaming response
            assert response.status_code == 200
            assert response.headers.get("content-type") == "text/plain; charset=utf-8"
            
            # Parse streaming response
            response_text = response.text
            assert len(response_text) > 0

        def test_chat_search_endpoint(self, client):
            """Test dedicated car search endpoint."""
            # Setup search request
            request_payload = {
                "sessionId": "test_search_session",
                "criteria": {
                    "max_price": 30000,
                    "category": "SUV",
                    "fuel_type": "Gasoline"
                }
            }

            # Execute
            response = client.post("/api/chat/search", json=request_payload)

            # Verify
            assert response.status_code == 200
            response_data = response.json()
            assert "success" in response_data
            assert response_data["success"] is True
            assert "data" in response_data

        def test_session_history_endpoint(self, client):
            """Test session history retrieval."""
            session_id = "test_history_session"
            
            # Execute
            response = client.get(f"/api/chat/session/{session_id}")

            # Verify
            assert response.status_code == 200
            response_data = response.json()
            assert "success" in response_data
            assert "sessionId" in response_data
            assert "messages" in response_data
            assert response_data["sessionId"] == session_id

        def test_clear_session_endpoint(self, client):
            """Test session clearing."""
            session_id = "test_clear_session"
            
            # Execute
            response = client.delete(f"/api/chat/session/{session_id}")

            # Verify
            assert response.status_code == 200
            response_data = response.json()
            assert "success" in response_data
            assert "sessionId" in response_data
            assert response_data["sessionId"] == session_id

        def test_error_handling_invalid_request(self, client):
            """Test error handling for invalid requests."""
            # Test with empty messages
            request_payload = {"messages": []}

            response = client.post("/api/chat", json=request_payload)
            assert response.status_code == 400

            # Test with missing required fields
            request_payload = {"invalid": "data"}

            response = client.post("/api/chat", json=request_payload)
            assert response.status_code == 422  # Validation error

        def test_health_endpoint(self, client):
            """Test health check endpoint."""
            response = client.get("/api/health")
            
            assert response.status_code == 200
            response_data = response.json()
            assert "status" in response_data
            assert "version" in response_data
            assert "timestamp" in response_data
    ```

- [ ] **Sub-Task 4: End-to-End Workflow Tests**
  - **Description:** Create comprehensive end-to-end tests for user scenarios

    ```python
    # File Path: carfind-backend/tests/e2e/test_complete_workflows.py
    # End-to-end tests for complete user workflows

    """End-to-end tests for complete CarFind user workflows."""

    import pytest
    import asyncio
    from httpx import AsyncClient
    from fastapi.testclient import TestClient

    from app.main import create_app


    @pytest.mark.e2e
    class TestCompleteWorkflows:
        """End-to-end workflow tests."""

        @pytest.fixture
        def client(self):
            """Create test client."""
            app = create_app()
            return TestClient(app)

        @pytest_asyncio.fixture
        async def async_client(self):
            """Create async test client."""
            app = create_app()
            async with AsyncClient(app=app, base_url="http://test") as ac:
                yield ac

        @pytest.mark.asyncio
        async def test_complete_car_search_workflow(self, async_client):
            """Test complete car search workflow from greeting to recommendation."""
            session_id = "e2e_workflow_session"
            
            # Step 1: Initial greeting
            greeting_request = {
                "messages": [
                    {
                        "id": "msg_1",
                        "role": "user",
                        "content": "Hi there!",
                        "createdAt": "2024-01-01T10:00:00Z"
                    }
                ],
                "sessionId": session_id,
                "stream": False
            }

            response = await async_client.post("/api/chat", json=greeting_request)
            assert response.status_code == 200
            greeting_response = response.json()
            assert "content" in greeting_response

            # Step 2: Express car search intent
            search_intent_request = {
                "messages": [
                    greeting_request["messages"][0],
                    {
                        "id": "msg_2",
                        "role": "assistant",
                        "content": greeting_response["content"],
                        "createdAt": "2024-01-01T10:00:05Z"
                    },
                    {
                        "id": "msg_3",
                        "role": "user",
                        "content": "I'm looking for a reliable family car under $30,000",
                        "createdAt": "2024-01-01T10:00:10Z"
                    }
                ],
                "sessionId": session_id,
                "stream": False
            }

            response = await async_client.post("/api/chat", json=search_intent_request)
            assert response.status_code == 200
            search_response = response.json()
            assert "content" in search_response

            # Step 3: Provide specific criteria
            criteria_request = {
                "messages": search_intent_request["messages"] + [
                    {
                        "id": "msg_4",
                        "role": "assistant",
                        "content": search_response["content"],
                        "createdAt": "2024-01-01T10:00:15Z"
                    },
                    {
                        "id": "msg_5",
                        "role": "user",
                        "content": "I prefer SUVs with good safety ratings and fuel efficiency",
                        "createdAt": "2024-01-01T10:00:20Z"
                    }
                ],
                "sessionId": session_id,
                "stream": False
            }

            response = await async_client.post("/api/chat", json=criteria_request)
            assert response.status_code == 200
            final_response = response.json()
            assert "content" in final_response

            # Step 4: Verify session history
            history_response = await async_client.get(f"/api/chat/session/{session_id}")
            assert history_response.status_code == 200
            history_data = history_response.json()
            assert history_data["success"] is True
            assert len(history_data["messages"]) >= 5

        @pytest.mark.asyncio
        async def test_car_search_and_recommendation_workflow(self, async_client):
            """Test dedicated car search and recommendation workflow."""
            session_id = "e2e_search_workflow"

            # Step 1: Direct car search
            search_request = {
                "sessionId": session_id,
                "criteria": {
                    "max_price": 35000,
                    "category": "SUV",
                    "fuel_type": "Gasoline",
                    "min_safety_rating": 4
                }
            }

            response = await async_client.post("/api/chat/search", json=search_request)
            assert response.status_code == 200
            search_data = response.json()
            assert search_data["success"] is True
            assert "data" in search_data

            # Verify search results
            cars = search_data["data"].get("cars", [])
            assert len(cars) > 0
            for car in cars:
                assert car["price"] <= 35000
                assert car["category"] == "SUV"
                assert car["safety_rating"] >= 4

            # Step 2: Follow-up conversation about search results
            followup_request = {
                "messages": [
                    {
                        "id": "msg_1",
                        "role": "user",
                        "content": "Tell me more about the first car in the search results",
                        "createdAt": "2024-01-01T10:00:00Z"
                    }
                ],
                "sessionId": session_id,
                "stream": False,
                "metadata": {"previous_search_results": cars}
            }

            response = await async_client.post("/api/chat", json=followup_request)
            assert response.status_code == 200
            followup_response = response.json()
            assert "content" in followup_response
            assert len(followup_response["content"]) > 0

        @pytest.mark.asyncio
        async def test_error_recovery_workflow(self, async_client):
            """Test error handling and recovery workflow."""
            session_id = "e2e_error_workflow"

            # Step 1: Send invalid request
            invalid_request = {
                "messages": [],  # Empty messages should trigger error
                "sessionId": session_id
            }

            response = await async_client.post("/api/chat", json=invalid_request)
            assert response.status_code == 400

            # Step 2: Send valid request after error
            valid_request = {
                "messages": [
                    {
                        "id": "msg_1",
                        "role": "user",
                        "content": "Hello, can you help me find a car?",
                        "createdAt": "2024-01-01T10:00:00Z"
                    }
                ],
                "sessionId": session_id,
                "stream": False
            }

            response = await async_client.post("/api/chat", json=valid_request)
            assert response.status_code == 200
            valid_response = response.json()
            assert "content" in valid_response

            # Step 3: Verify session is working normally
            history_response = await async_client.get(f"/api/chat/session/{session_id}")
            assert history_response.status_code == 200

        def test_concurrent_sessions_workflow(self, client):
            """Test handling multiple concurrent sessions."""
            import threading
            import time

            results = []
            
            def create_session_workflow(session_id):
                """Create a workflow for a specific session."""
                request = {
                    "messages": [
                        {
                            "id": f"msg_1_{session_id}",
                            "role": "user",
                            "content": f"Session {session_id} - Looking for a car",
                            "createdAt": "2024-01-01T10:00:00Z"
                        }
                    ],
                    "sessionId": session_id,
                    "stream": False
                }
                
                response = client.post("/api/chat", json=request)
                results.append({
                    "session_id": session_id,
                    "status_code": response.status_code,
                    "response": response.json() if response.status_code == 200 else None
                })

            # Create multiple concurrent sessions
            threads = []
            for i in range(5):
                session_id = f"concurrent_session_{i}"
                thread = threading.Thread(target=create_session_workflow, args=(session_id,))
                threads.append(thread)

            # Start all threads
            for thread in threads:
                thread.start()

            # Wait for all threads to complete
            for thread in threads:
                thread.join()

            # Verify all sessions completed successfully
            assert len(results) == 5
            for result in results:
                assert result["status_code"] == 200
                assert result["response"] is not None
                assert "content" in result["response"]
    ```

- [ ] **Sub-Task 5: Performance and Load Testing**
  - **Description:** Create performance tests for production readiness

    ```python
    # File Path: carfind-backend/tests/performance/test_performance.py
    # Performance tests for CarFind Backend

    """Performance tests for CarFind Backend."""

    import pytest
    import asyncio
    import time
    from concurrent.futures import ThreadPoolExecutor
    from httpx import AsyncClient
    from fastapi.testclient import TestClient

    from app.main import create_app


    @pytest.mark.performance
    class TestPerformance:
        """Performance test cases."""

        @pytest.fixture
        def client(self):
            """Create test client."""
            app = create_app()
            return TestClient(app)

        @pytest_asyncio.fixture
        async def async_client(self):
            """Create async test client."""
            app = create_app()
            async with AsyncClient(app=app, base_url="http://test") as ac:
                yield ac

        def test_health_endpoint_response_time(self, client):
            """Test health endpoint response time."""
            # Warm up
            for _ in range(5):
                client.get("/api/health")

            # Measure response time
            start_time = time.time()
            for _ in range(100):
                response = client.get("/api/health")
                assert response.status_code == 200
            
            total_time = time.time() - start_time
            avg_response_time = total_time / 100
            
            # Assert average response time is under 100ms
            assert avg_response_time < 0.1, f"Average response time {avg_response_time:.3f}s exceeds 100ms"

        @pytest.mark.asyncio
        async def test_chat_endpoint_concurrency(self, async_client):
            """Test chat endpoint under concurrent load."""
            async def single_chat_request(session_id):
                """Single chat request for concurrency testing."""
                request = {
                    "messages": [
                        {
                            "id": f"msg_{session_id}",
                            "role": "user",
                            "content": "Quick test message",
                            "createdAt": "2024-01-01T10:00:00Z"
                        }
                    ],
                    "sessionId": f"perf_session_{session_id}",
                    "stream": False
                }
                
                start_time = time.time()
                response = await async_client.post("/api/chat", json=request)
                end_time = time.time()
                
                return {
                    "status_code": response.status_code,
                    "response_time": end_time - start_time,
                    "session_id": session_id
                }

            # Run 50 concurrent requests
            concurrent_requests = 50
            tasks = [single_chat_request(i) for i in range(concurrent_requests)]
            
            start_time = time.time()
            results = await asyncio.gather(*tasks)
            total_time = time.time() - start_time

            # Analyze results
            successful_requests = [r for r in results if r["status_code"] == 200]
            failed_requests = [r for r in results if r["status_code"] != 200]
            
            avg_response_time = sum(r["response_time"] for r in successful_requests) / len(successful_requests)
            max_response_time = max(r["response_time"] for r in successful_requests)
            
            # Assertions
            assert len(successful_requests) >= concurrent_requests * 0.95, "Success rate should be at least 95%"
            assert avg_response_time < 2.0, f"Average response time {avg_response_time:.3f}s exceeds 2s"
            assert max_response_time < 5.0, f"Max response time {max_response_time:.3f}s exceeds 5s"
            assert total_time < 10.0, f"Total execution time {total_time:.3f}s exceeds 10s"

        def test_memory_usage_stability(self, client):
            """Test memory usage stability under load."""
            import psutil
            import os
            
            process = psutil.Process(os.getpid())
            initial_memory = process.memory_info().rss / 1024 / 1024  # MB

            # Perform 1000 requests to test memory stability
            for i in range(1000):
                request = {
                    "messages": [
                        {
                            "id": f"mem_test_{i}",
                            "role": "user",
                            "content": f"Memory test request {i}",
                            "createdAt": "2024-01-01T10:00:00Z"
                        }
                    ],
                    "sessionId": f"memory_test_session_{i % 10}",  # Reuse 10 sessions
                    "stream": False
                }
                
                response = client.post("/api/chat", json=request)
                assert response.status_code == 200

                # Check memory every 100 requests
                if i % 100 == 99:
                    current_memory = process.memory_info().rss / 1024 / 1024  # MB
                    memory_increase = current_memory - initial_memory
                    
                    # Memory should not increase by more than 100MB
                    assert memory_increase < 100, f"Memory increased by {memory_increase:.2f}MB after {i+1} requests"

        def test_database_operation_performance(self, client):
            """Test database operation performance."""
            # Test search operations
            search_times = []
            
            for i in range(50):
                search_request = {
                    "sessionId": f"db_perf_session_{i}",
                    "criteria": {
                        "max_price": 30000 + (i * 1000),
                        "category": "SUV" if i % 2 == 0 else "Sedan"
                    }
                }
                
                start_time = time.time()
                response = client.post("/api/chat/search", json=search_request)
                end_time = time.time()
                
                assert response.status_code == 200
                search_times.append(end_time - start_time)

            avg_search_time = sum(search_times) / len(search_times)
            max_search_time = max(search_times)
            
            # Database operations should be fast
            assert avg_search_time < 0.5, f"Average search time {avg_search_time:.3f}s exceeds 500ms"
            assert max_search_time < 1.0, f"Max search time {max_search_time:.3f}s exceeds 1s"

        @pytest.mark.slow
        def test_long_running_stability(self, client):
            """Test system stability under long-running operations."""
            duration_minutes = 5
            end_time = time.time() + (duration_minutes * 60)
            request_count = 0
            error_count = 0
            
            while time.time() < end_time:
                try:
                    request = {
                        "messages": [
                            {
                                "id": f"stability_test_{request_count}",
                                "role": "user",
                                "content": f"Stability test message {request_count}",
                                "createdAt": "2024-01-01T10:00:00Z"
                            }
                        ],
                        "sessionId": f"stability_session_{request_count % 5}",
                        "stream": False
                    }
                    
                    response = client.post("/api/chat", json=request)
                    if response.status_code != 200:
                        error_count += 1
                    
                    request_count += 1
                    
                    # Small delay to prevent overwhelming the system
                    time.sleep(0.1)
                    
                except Exception as e:
                    error_count += 1
                    print(f"Request {request_count} failed: {e}")

            error_rate = error_count / request_count if request_count > 0 else 1
            
            # Error rate should be less than 1%
            assert error_rate < 0.01, f"Error rate {error_rate:.2%} exceeds 1% after {request_count} requests"
            assert request_count > 100, f"Only {request_count} requests completed in {duration_minutes} minutes"
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Comprehensive unit tests implemented for all Semantic Kernel processes with 85%+ coverage
- Integration tests validating API contract compatibility with Phase 2 frontend
- End-to-end tests covering complete user workflows and system behavior
- Performance tests confirming production readiness and scalability requirements
- Automated testing pipeline operational with quality gates and coverage reporting

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Unit test framework configured with pytest and async support
- [ ] Unit tests implemented for all Semantic Kernel processes with comprehensive coverage
- [ ] Integration tests created validating Phase 2 API contract compatibility
- [ ] End-to-end workflow tests implemented for complete user scenarios
- [ ] Performance tests established for production readiness validation
- [ ] Test coverage meets or exceeds 85% threshold
- [ ] All tests passing in CI/CD pipeline
- [ ] Quality gates configured for code coverage and test success
- [ ] Performance benchmarks established and validated

---

## 9. Risks & Mitigations

- **Risk**: Test coverage gaps in critical functionality → **Mitigation**: Systematic test planning with coverage reporting and quality gates
- **Risk**: Performance tests not reflecting real-world conditions → **Mitigation**: Realistic load patterns and concurrent user simulation
- **Risk**: Integration test brittleness with API changes → **Mitigation**: Contract-based testing and version compatibility validation
- **Risk**: Test execution time impacting development velocity → **Mitigation**: Parallel test execution and selective test running
- **Risk**: Mock dependencies not reflecting actual behavior → **Mitigation**: Integration tests with real service dependencies

---

## 10. Self-Assessment Checklist

- [ ] Test suite provides comprehensive coverage of all system functionality
- [ ] API contract validation ensures Phase 2 frontend compatibility
- [ ] Performance tests validate production readiness and scalability
- [ ] End-to-end tests confirm complete user workflow functionality
- [ ] Testing pipeline enables confident deployment and quality assurance

---
