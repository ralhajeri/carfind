---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Car Search Process Framework

## Task Meta

- **Task ID:** 02_task_06
- **Task Name:** Car Search Process Framework
- **Phase:** Phase 3.2
- **Parent Plan:** [CarFind Phase 3 Semantic Kernel Backend MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-11
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Implement advanced AI-powered car search process using Semantic Kernel with sophisticated filtering logic, contextual recommendations, and alternative suggestions when no exact matches found.

## 2. Objectives

- Implement CarSearchProcess class with comprehensive filtering and recommendation logic
- Create Car and CarSearchCriteria data models with realistic automotive attributes
- Develop AI recommendation engine using Semantic Kernel for contextual suggestions
- Add alternative suggestion generation for enhanced user experience
- Implement mock car database with realistic data for MVP demonstration and testing

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Task 05 (Kernel Service Implementation) completed successfully
- [ ] KernelService operational with Semantic Kernel initialized
- [ ] Semantic Kernel process framework understood and ready for implementation
- [ ] Car search requirements from Phase 1 and Phase 2 understood for compatibility
- [ ] AI recommendation patterns researched and design approach validated

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Phase 1: `CarFind/lib/tools/car-search-tool.ts` - Original car search tool implementation
- Phase 2: `CarFind/lib/services/car-search-service.ts` - Service layer abstraction
- Backend: `carfind-backend/app/services/kernel_service.py` - Semantic Kernel service foundation
- Backend: `carfind-backend/app/processes/car_search_process.py` - New process implementation

### 4.2 Framework Dependencies

- Microsoft Semantic Kernel for process framework and AI integration
- Pydantic for data models and validation with comprehensive type safety
- Enum classes for standardized automotive attributes and filtering
- Async/await patterns for optimal performance and scalability
- Mock data generation for realistic MVP demonstration and testing

---

## 5. Testing Strategy

- **Unit Tests:** Validate CarSearchProcess logic and data model validation
- **Integration Tests:** Verify Semantic Kernel integration and AI recommendation functionality
- **Manual Tests:** Confirm car search accuracy and recommendation quality

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-003`                  | Car search process implementation | `carfind-backend/app/processes/car_search_process.py` | `TEST-U-001` |
| `REQ-004`                  | AI recommendation functionality | Search criteria extraction and suggestions | `TEST-I-002` |
| `NFR-001`                  | Performance requirements | Async process implementation | `TEST-P-003` |
| `NFR-003`                  | SOLID principles compliance | Process class design and data models | `TEST-M-004` |
| `NFR-004`                  | Scalability architecture | Concurrent search handling | `TEST-S-005` |

---

## 7. Implementation Plan

### 7.1 Design

Advanced car search process using Semantic Kernel framework with AI-powered recommendations, comprehensive filtering, and realistic automotive data models following SOLID principles.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Car Data Models Implementation**
  - **Description:** Create comprehensive car and search criteria data models

    ```python
    # File Path: carfind-backend/app/models/car_models.py
    # Comprehensive car data models with automotive attributes

    """CarFind Car Data Models and Search Criteria."""

    from enum import Enum
    from typing import List, Optional

    from pydantic import BaseModel, Field, field_validator


    class CarMake(str, Enum):
        """Standardized car manufacturers."""

        TOYOTA = "Toyota"
        HONDA = "Honda"
        FORD = "Ford"
        CHEVROLET = "Chevrolet"
        NISSAN = "Nissan"
        BMW = "BMW"
        MERCEDES_BENZ = "Mercedes-Benz"
        AUDI = "Audi"
        VOLKSWAGEN = "Volkswagen"
        HYUNDAI = "Hyundai"
        KIA = "Kia"
        MAZDA = "Mazda"
        SUBARU = "Subaru"
        LEXUS = "Lexus"
        ACURA = "Acura"


    class CarType(str, Enum):
        """Car body types and categories."""

        SEDAN = "Sedan"
        SUV = "SUV"
        HATCHBACK = "Hatchback"
        COUPE = "Coupe"
        CONVERTIBLE = "Convertible"
        TRUCK = "Truck"
        WAGON = "Wagon"
        MINIVAN = "Minivan"
        CROSSOVER = "Crossover"


    class FuelType(str, Enum):
        """Fuel type options."""

        GASOLINE = "Gasoline"
        DIESEL = "Diesel"
        HYBRID = "Hybrid"
        ELECTRIC = "Electric"
        PLUG_IN_HYBRID = "Plug-in Hybrid"


    class Transmission(str, Enum):
        """Transmission types."""

        MANUAL = "Manual"
        AUTOMATIC = "Automatic"
        CVT = "CVT"


    class Car(BaseModel):
        """Comprehensive car model with automotive attributes."""

        id: str = Field(..., description="Unique car identifier")
        make: CarMake = Field(..., description="Car manufacturer")
        model: str = Field(..., description="Car model name")
        year: int = Field(..., ge=1990, le=2025, description="Manufacturing year")
        price: int = Field(..., ge=0, description="Price in USD")
        mileage: int = Field(..., ge=0, description="Odometer reading in miles")
        car_type: CarType = Field(..., description="Body type category")
        fuel_type: FuelType = Field(..., description="Fuel system type")
        transmission: Transmission = Field(..., description="Transmission type")
        color: str = Field(..., description="Exterior color")
        condition: str = Field(..., description="Vehicle condition")
        location: str = Field(..., description="Geographic location")
        features: List[str] = Field(default_factory=list, description="Notable features")
        description: str = Field(..., description="Detailed description")

        @field_validator("model")
        @classmethod
        def validate_model_name(cls, v: str) -> str:
            """Validate model name format."""
            if len(v.strip()) < 1:
                raise ValueError("Model name cannot be empty")
            return v.strip()

        @property
        def display_name(self) -> str:
            """Get formatted display name."""
            return f"{self.year} {self.make.value} {self.model}"

        @property
        def price_formatted(self) -> str:
            """Get formatted price string."""
            return f"${self.price:,}"


    class CarSearchCriteria(BaseModel):
        """Search criteria for car filtering and recommendations."""

        make: Optional[CarMake] = Field(None, description="Preferred manufacturer")
        model: Optional[str] = Field(None, description="Specific model name")
        min_year: Optional[int] = Field(None, ge=1990, description="Minimum year")
        max_year: Optional[int] = Field(None, le=2025, description="Maximum year")
        min_price: Optional[int] = Field(None, ge=0, description="Minimum price")
        max_price: Optional[int] = Field(None, ge=0, description="Maximum price")
        max_mileage: Optional[int] = Field(None, ge=0, description="Maximum mileage")
        car_type: Optional[CarType] = Field(None, description="Preferred body type")
        fuel_type: Optional[FuelType] = Field(None, description="Preferred fuel type")
        transmission: Optional[Transmission] = Field(None, description="Transmission preference")
        color: Optional[str] = Field(None, description="Preferred color")
        location: Optional[str] = Field(None, description="Search location")
        keywords: List[str] = Field(default_factory=list, description="Search keywords")

        @field_validator("max_price")
        @classmethod
        def validate_price_range(cls, v: Optional[int], info) -> Optional[int]:
            """Validate price range consistency."""
            if v is not None and "min_price" in info.data and info.data["min_price"] is not None:
                if v < info.data["min_price"]:
                    raise ValueError("Maximum price must be greater than minimum price")
            return v

        @field_validator("max_year")
        @classmethod
        def validate_year_range(cls, v: Optional[int], info) -> Optional[int]:
            """Validate year range consistency."""
            if v is not None and "min_year" in info.data and info.data["min_year"] is not None:
                if v < info.data["min_year"]:
                    raise ValueError("Maximum year must be greater than minimum year")
            return v


    class CarSearchResult(BaseModel):
        """Search result container with metadata."""

        cars: List[Car] = Field(..., description="Matching cars")
        total_count: int = Field(..., description="Total matches found")
        search_criteria: CarSearchCriteria = Field(..., description="Applied search criteria")
        ai_recommendations: List[str] = Field(default_factory=list, description="AI-generated recommendations")
        alternative_suggestions: List[str] = Field(default_factory=list, description="Alternative search suggestions")
        search_time_ms: float = Field(..., description="Search execution time")
    ```

- [ ] **Sub-Task 2: Mock Car Database Implementation**
  - **Description:** Create realistic car database for MVP demonstration

    ```python
    # File Path: carfind-backend/app/data/mock_car_database.py
    # Realistic mock car database for MVP demonstration

    """Mock Car Database for CarFind MVP Demonstration."""

    from typing import List

    from app.models.car_models import Car, CarMake, CarType, FuelType, Transmission


    class MockCarDatabase:
        """Mock car database with realistic automotive data."""

        def __init__(self) -> None:
            """Initialize with comprehensive car inventory."""
            self._cars = self._generate_mock_inventory()

        def _generate_mock_inventory(self) -> List[Car]:
            """Generate realistic car inventory for demonstration."""
            cars = [
                # Toyota Models
                Car(
                    id="car_001",
                    make=CarMake.TOYOTA,
                    model="Camry",
                    year=2023,
                    price=28500,
                    mileage=12000,
                    car_type=CarType.SEDAN,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.AUTOMATIC,
                    color="Silver",
                    condition="Excellent",
                    location="Los Angeles, CA",
                    features=["Backup Camera", "Bluetooth", "Cruise Control"],
                    description="Reliable mid-size sedan with excellent fuel economy and safety ratings.",
                ),
                Car(
                    id="car_002",
                    make=CarMake.TOYOTA,
                    model="RAV4",
                    year=2022,
                    price=32000,
                    mileage=18500,
                    car_type=CarType.SUV,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.AUTOMATIC,
                    color="Blue",
                    condition="Very Good",
                    location="Seattle, WA",
                    features=["AWD", "Lane Keeping Assist", "Apple CarPlay"],
                    description="Popular compact SUV with all-wheel drive and advanced safety features.",
                ),
                # Honda Models
                Car(
                    id="car_003",
                    make=CarMake.HONDA,
                    model="Civic",
                    year=2023,
                    price=24500,
                    mileage=8000,
                    car_type=CarType.SEDAN,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.CVT,
                    color="White",
                    condition="Excellent",
                    location="Miami, FL",
                    features=["Honda Sensing", "Sunroof", "Heated Seats"],
                    description="Sporty compact sedan with exceptional reliability and fuel efficiency.",
                ),
                Car(
                    id="car_004",
                    make=CarMake.HONDA,
                    model="CR-V",
                    year=2021,
                    price=29500,
                    mileage=25000,
                    car_type=CarType.SUV,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.CVT,
                    color="Black",
                    condition="Good",
                    location="Chicago, IL",
                    features=["Real Time AWD", "Power Tailgate", "Remote Start"],
                    description="Versatile compact SUV perfect for families and active lifestyles.",
                ),
                # Electric Vehicles
                Car(
                    id="car_005",
                    make=CarMake.NISSAN,
                    model="Leaf",
                    year=2022,
                    price=27000,
                    mileage=15000,
                    car_type=CarType.HATCHBACK,
                    fuel_type=FuelType.ELECTRIC,
                    transmission=Transmission.AUTOMATIC,
                    color="Red",
                    condition="Very Good",
                    location="San Francisco, CA",
                    features=["ProPILOT Assist", "Quick Charge", "NissanConnect"],
                    description="Affordable electric vehicle with impressive range and smart features.",
                ),
                # Luxury Vehicles
                Car(
                    id="car_006",
                    make=CarMake.BMW,
                    model="X3",
                    year=2023,
                    price=48500,
                    mileage=5000,
                    car_type=CarType.SUV,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.AUTOMATIC,
                    color="Gray",
                    condition="Excellent",
                    location="New York, NY",
                    features=["xDrive AWD", "Panoramic Sunroof", "Premium Audio"],
                    description="Luxury compact SUV with dynamic performance and premium features.",
                ),
                # Trucks
                Car(
                    id="car_007",
                    make=CarMake.FORD,
                    model="F-150",
                    year=2022,
                    price=42000,
                    mileage=22000,
                    car_type=CarType.TRUCK,
                    fuel_type=FuelType.GASOLINE,
                    transmission=Transmission.AUTOMATIC,
                    color="Blue",
                    condition="Good",
                    location="Dallas, TX",
                    features=["4WD", "Towing Package", "Bed Liner"],
                    description="America's best-selling truck with legendary capability and durability.",
                ),
                # Hybrid Vehicles
                Car(
                    id="car_008",
                    make=CarMake.TOYOTA,
                    model="Prius",
                    year=2023,
                    price=26500,
                    mileage=10000,
                    car_type=CarType.HATCHBACK,
                    fuel_type=FuelType.HYBRID,
                    transmission=Transmission.CVT,
                    color="Green",
                    condition="Excellent",
                    location="Portland, OR",
                    features=["Toyota Safety Sense", "JBL Audio", "Wireless Charging"],
                    description="Iconic hybrid with outstanding fuel economy and environmental benefits.",
                ),
            ]
            return cars

        def get_all_cars(self) -> List[Car]:
            """Get all cars in the database."""
            return self._cars.copy()

        def get_car_by_id(self, car_id: str) -> Car | None:
            """Get specific car by ID."""
            for car in self._cars:
                if car.id == car_id:
                    return car
            return None

        def get_cars_count(self) -> int:
            """Get total number of cars in database."""
            return len(self._cars)

        def get_available_makes(self) -> List[CarMake]:
            """Get list of available car makes."""
            return list(set(car.make for car in self._cars))

        def get_available_models(self, make: CarMake | None = None) -> List[str]:
            """Get list of available models, optionally filtered by make."""
            if make:
                return list(set(car.model for car in self._cars if car.make == make))
            return list(set(car.model for car in self._cars))
    ```

- [ ] **Sub-Task 3: Car Search Process Implementation**
  - **Description:** Implement core CarSearchProcess with AI recommendations

    ```python
    # File Path: carfind-backend/app/processes/car_search_process.py
    # AI-powered car search process using Semantic Kernel

    """CarFind Car Search Process with AI Recommendations."""

    import asyncio
    import time
    from typing import List

    import semantic_kernel as sk
    from semantic_kernel.functions import kernel_function

    from app.data.mock_car_database import MockCarDatabase
    from app.models.car_models import Car, CarSearchCriteria, CarSearchResult


    class CarSearchProcess:
        """AI-powered car search process using Semantic Kernel."""

        def __init__(self, kernel: sk.Kernel) -> None:
            """Initialize with Semantic Kernel instance."""
            self.kernel = kernel
            self.database = MockCarDatabase()

        @kernel_function(
            description="Search for cars based on user criteria",
            name="search_cars",
        )
        async def search_cars(self, criteria: CarSearchCriteria) -> CarSearchResult:
            """Execute comprehensive car search with AI recommendations."""
            start_time = time.time()

            # Get all cars and apply filters
            all_cars = self.database.get_all_cars()
            filtered_cars = await self._apply_filters(all_cars, criteria)

            # Generate AI recommendations
            ai_recommendations = await self._generate_ai_recommendations(criteria, filtered_cars)

            # Generate alternative suggestions if few results
            alternative_suggestions = []
            if len(filtered_cars) < 3:
                alternative_suggestions = await self._generate_alternative_suggestions(criteria)

            search_time = (time.time() - start_time) * 1000

            return CarSearchResult(
                cars=filtered_cars,
                total_count=len(filtered_cars),
                search_criteria=criteria,
                ai_recommendations=ai_recommendations,
                alternative_suggestions=alternative_suggestions,
                search_time_ms=search_time,
            )

        async def _apply_filters(self, cars: List[Car], criteria: CarSearchCriteria) -> List[Car]:
            """Apply search criteria filters to car list."""
            filtered_cars = cars.copy()

            # Filter by make
            if criteria.make:
                filtered_cars = [car for car in filtered_cars if car.make == criteria.make]

            # Filter by model
            if criteria.model:
                filtered_cars = [
                    car for car in filtered_cars 
                    if criteria.model.lower() in car.model.lower()
                ]

            # Filter by year range
            if criteria.min_year:
                filtered_cars = [car for car in filtered_cars if car.year >= criteria.min_year]
            if criteria.max_year:
                filtered_cars = [car for car in filtered_cars if car.year <= criteria.max_year]

            # Filter by price range
            if criteria.min_price:
                filtered_cars = [car for car in filtered_cars if car.price >= criteria.min_price]
            if criteria.max_price:
                filtered_cars = [car for car in filtered_cars if car.price <= criteria.max_price]

            # Filter by mileage
            if criteria.max_mileage:
                filtered_cars = [car for car in filtered_cars if car.mileage <= criteria.max_mileage]

            # Filter by car type
            if criteria.car_type:
                filtered_cars = [car for car in filtered_cars if car.car_type == criteria.car_type]

            # Filter by fuel type
            if criteria.fuel_type:
                filtered_cars = [car for car in filtered_cars if car.fuel_type == criteria.fuel_type]

            # Filter by transmission
            if criteria.transmission:
                filtered_cars = [car for car in filtered_cars if car.transmission == criteria.transmission]

            # Filter by color
            if criteria.color:
                filtered_cars = [
                    car for car in filtered_cars 
                    if criteria.color.lower() in car.color.lower()
                ]

            # Filter by location
            if criteria.location:
                filtered_cars = [
                    car for car in filtered_cars 
                    if criteria.location.lower() in car.location.lower()
                ]

            # Filter by keywords in description or features
            if criteria.keywords:
                keyword_filtered = []
                for car in filtered_cars:
                    car_text = f"{car.description} {' '.join(car.features)}".lower()
                    if any(keyword.lower() in car_text for keyword in criteria.keywords):
                        keyword_filtered.append(car)
                filtered_cars = keyword_filtered

            return filtered_cars

        async def _generate_ai_recommendations(
            self, 
            criteria: CarSearchCriteria, 
            results: List[Car]
        ) -> List[str]:
            """Generate AI-powered recommendations based on search results."""
            try:
                # Prepare context for AI recommendation
                context_prompt = self._build_recommendation_context(criteria, results)
                
                # Use Semantic Kernel to generate recommendations
                recommendation_function = self.kernel.get_function(
                    plugin_name="ConversationSummary",
                    function_name="SummarizeConversation"
                )
                
                # For MVP, use simplified recommendation logic
                recommendations = []
                
                if len(results) == 0:
                    recommendations.append("Consider expanding your search criteria for more options")
                    recommendations.append("Try searching for similar models from other manufacturers")
                elif len(results) < 3:
                    recommendations.append("You might want to consider slightly older models for better value")
                    recommendations.append("Expanding your search radius could reveal more options")
                else:
                    recommendations.append("Great selection found! Consider test driving your top choices")
                    recommendations.append("Compare features and warranties across your options")

                return recommendations
                
            except Exception as e:
                # Fallback to basic recommendations if AI fails
                return [
                    "Consider your budget and financing options",
                    "Research reliability ratings for your preferred models",
                    "Schedule test drives for your top choices",
                ]

        async def _generate_alternative_suggestions(self, criteria: CarSearchCriteria) -> List[str]:
            """Generate alternative search suggestions when few results found."""
            suggestions = []

            if criteria.max_price and criteria.max_price < 30000:
                suggestions.append("Consider certified pre-owned vehicles for better value")

            if criteria.min_year and criteria.min_year > 2020:
                suggestions.append("Try including 2019-2020 models for more options")

            if criteria.make:
                suggestions.append(f"Consider similar models from other manufacturers")

            if criteria.car_type:
                suggestions.append("Explore different body types that might meet your needs")

            if not suggestions:
                suggestions = [
                    "Try broadening your search criteria",
                    "Consider different geographic locations",
                    "Adjust your price range for more options",
                ]

            return suggestions

        def _build_recommendation_context(
            self, 
            criteria: CarSearchCriteria, 
            results: List[Car]
        ) -> str:
            """Build context string for AI recommendation generation."""
            context_parts = [
                f"Search criteria: {criteria.model_dump_json()}",
                f"Results found: {len(results)} cars",
            ]

            if results:
                top_cars = results[:3]
                context_parts.append("Top matches:")
                for car in top_cars:
                    context_parts.append(f"- {car.display_name} - {car.price_formatted}")

            return "\n".join(context_parts)

        @kernel_function(
            description="Get car details by ID",
            name="get_car_details",
        )
        async def get_car_details(self, car_id: str) -> Car | None:
            """Get detailed information for a specific car."""
            return self.database.get_car_by_id(car_id)

        @kernel_function(
            description="Get available car makes",
            name="get_available_makes",
        )
        async def get_available_makes(self) -> List[str]:
            """Get list of available car manufacturers."""
            makes = self.database.get_available_makes()
            return [make.value for make in makes]

        @kernel_function(
            description="Get available models for a specific make",
            name="get_available_models",
        )
        async def get_available_models(self, make: str | None = None) -> List[str]:
            """Get list of available models, optionally filtered by make."""
            try:
                make_enum = None
                if make:
                    # Convert string to enum
                    from app.models.car_models import CarMake
                    make_enum = CarMake(make)
                
                return self.database.get_available_models(make_enum)
            except ValueError:
                # Invalid make provided
                return self.database.get_available_models()
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Car data models implemented with comprehensive automotive attributes and validation
- Mock car database created with realistic inventory for MVP demonstration
- CarSearchProcess successfully integrated with Semantic Kernel framework
- AI recommendation system operational and providing contextual suggestions
- Search filtering logic comprehensive and accurate for all criteria types
- Alternative suggestions generated when search results are limited

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete
- [ ] Car and CarSearchCriteria models implemented with comprehensive validation
- [ ] Mock car database created with realistic automotive inventory
- [ ] CarSearchProcess class implemented following Single Responsibility Principle
- [ ] Search filtering logic comprehensive and tested for all criteria
- [ ] AI recommendation system integrated with Semantic Kernel
- [ ] Alternative suggestions functionality implemented
- [ ] Zero import errors or model validation failures
- [ ] Code follows SOLID principles with comprehensive type hints

---

## 9. Risks & Mitigations

- **Risk**: AI recommendation generation failures → **Mitigation**: Fallback recommendation logic with graceful degradation
- **Risk**: Search performance with large datasets → **Mitigation**: Efficient filtering logic with async processing
- **Risk**: Data model validation complexity → **Mitigation**: Comprehensive Pydantic validators with clear error messages
- **Risk**: Mock database maintenance overhead → **Mitigation**: Structured data generation with realistic automotive attributes
- **Risk**: Semantic Kernel integration complexity → **Mitigation**: Clear function decorators and proper error handling

---

## 10. Self-Assessment Checklist

- [ ] Car search process provides accurate and relevant results for all search criteria
- [ ] AI recommendation system enhances user experience with contextual suggestions
- [ ] Data models properly represent automotive industry standards and requirements
- [ ] Mock database provides realistic demonstration scenarios for MVP validation
- [ ] Process implementation ready for integration with FastAPI chat endpoints

---
