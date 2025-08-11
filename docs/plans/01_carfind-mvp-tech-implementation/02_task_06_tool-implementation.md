---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: Tool Implementation

## Task Meta

- **Task ID:** TASK-06
- **Task Name:** Tool Implementation
- **Phase:** Phase 2 - Car Search Integration
- **Parent Plan:** [CarFind MVP Tech Implementation Plan](01_overview.md)
- **Date Created:** 2025-08-10
- **Status:** Ready for Implementation

## 1. Overview

- **Description**:
  Add car search tool using AI SDK pattern to enable OpenAI-powered car search functionality with proper input validation and service integration.

## 2. Objectives

- Implement car search tool following Vercel AI SDK tool patterns
- Integrate with CarSearchService following Dependency Inversion Principle (DIP)
- Provide Zod schema validation for all tool inputs
- Enable AI-powered natural language car search capabilities
- Maintain extensible tool architecture for future enhancements

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] Service layer implementation (TASK-05) has been completed successfully
- [ ] CarSearchService is implemented and functional
- [ ] Vercel AI SDK tool patterns are understood from template
- [ ] Zod validation library is available in template dependencies
- [ ] TypeScript environment is working properly

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- Vercel AI SDK tool() function for tool creation
- Zod schema validation library
- Template's existing tool implementation patterns
- CarSearchService from TASK-05

### 4.2 Framework Dependencies

- @ai-sdk/openai for AI integration
- ai package for tool utilities
- zod for input validation
- CarSearchService and related types

---

## 5. Testing Strategy

- **Unit Tests:** Validate tool schema and input validation
- **Integration Tests:** Test tool integration with CarSearchService
- **Manual Tests:** Verify AI can properly invoke tools with natural language

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-002`                  | `Enable AI-powered car search by criteria`  | `CarFind/lib/tools/car-search-tool.ts`                    | `TEST-U-002`    |
| `REQ-003`                  | `Integrate with OpenAI for natural language processing`  | `CarFind/lib/tools/car-recommendation-tool.ts`                   | `TEST-U-003`    |
| `NFR-003`                  | `Implement maintainable tool architecture`  | `CarFind/lib/tools/index.ts`                   | `TEST-I-003`    |

---

## 7. Implementation Plan

### 7.1 Design

Implementation of AI SDK tools that bridge natural language requests with the CarSearchService, providing input validation and proper error handling while maintaining extensible architecture.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: Car Search Tool Implementation**
  - **Description:** Create main car search tool with Zod validation

    ```typescript
    // File Path: CarFind/lib/tools/car-search-tool.ts
    // SOLID: Open/Closed Principle - extensible tools
    import { tool } from 'ai';
    import { z } from 'zod';
    import { carSearchService } from '../services/car-search-service';
    import { CarSearchCriteria } from '../types/car';

    export const carSearchTool = tool({
      description: 'Search for cars based on specific criteria like make, model, price range, and year. Use this when users want to find cars matching their requirements.',
      inputSchema: z.object({
        make: z.string().optional().describe('Car make/brand (e.g., Toyota, Honda, Ford)'),
        model: z.string().optional().describe('Car model (e.g., Camry, Civic, F-150)'),
        maxPrice: z.number().positive().optional().describe('Maximum price in USD'),
        minPrice: z.number().positive().optional().describe('Minimum price in USD'),
        minYear: z.number().min(1990).max(2025).optional().describe('Minimum year'),
        maxYear: z.number().min(1990).max(2025).optional().describe('Maximum year'),
        maxMileage: z.number().positive().optional().describe('Maximum mileage'),
        fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional().describe('Fuel type preference')
      }),
      async execute(input) {
        try {
          const criteria: CarSearchCriteria = {
            make: input.make,
            model: input.model,
            maxPrice: input.maxPrice,
            minPrice: input.minPrice,
            minYear: input.minYear,
            maxYear: input.maxYear,
            maxMileage: input.maxMileage,
            fuelType: input.fuelType
          };

          const result = await carSearchService.searchCars(criteria);
          
          if (result.cars.length === 0) {
            return {
              success: false,
              message: 'No cars found matching your criteria. Try adjusting your search parameters.',
              totalCount: 0,
              cars: []
            };
          }

          return {
            success: true,
            message: `Found ${result.totalCount} car(s) matching your criteria.`,
            totalCount: result.totalCount,
            cars: result.cars.map(car => ({
              id: car.id,
              make: car.make,
              model: car.model,
              year: car.year,
              price: car.price,
              description: car.description,
              mileage: car.mileage,
              color: car.color,
              fuelType: car.fuelType
            }))
          };
        } catch (error) {
          console.error('Car search tool error:', error);
          return {
            success: false,
            message: 'An error occurred while searching for cars. Please try again.',
            totalCount: 0,
            cars: []
          };
        }
      }
    });
    ```

- [ ] **Sub-Task 2: Car Details Tool Implementation**
  - **Description:** Create tool for getting detailed information about a specific car

    ```typescript
    // File Path: CarFind/lib/tools/car-details-tool.ts
    // Tool for retrieving detailed car information
    import { tool } from 'ai';
    import { z } from 'zod';
    import { carSearchService } from '../services/car-search-service';

    export const carDetailsTool = tool({
      description: 'Get detailed information about a specific car by its ID. Use this when users want more details about a particular car.',
      inputSchema: z.object({
        carId: z.string().describe('The unique identifier of the car')
      }),
      async execute(input) {
        try {
          const car = await carSearchService.getCarById(input.carId);
          
          if (!car) {
            return {
              success: false,
              message: 'Car not found with the provided ID.',
              car: null
            };
          }

          return {
            success: true,
            message: `Here are the details for the ${car.year} ${car.make} ${car.model}:`,
            car: {
              id: car.id,
              make: car.make,
              model: car.model,
              year: car.year,
              price: car.price,
              description: car.description,
              mileage: car.mileage,
              color: car.color,
              fuelType: car.fuelType
            }
          };
        } catch (error) {
          console.error('Car details tool error:', error);
          return {
            success: false,
            message: 'An error occurred while retrieving car details. Please try again.',
            car: null
          };
        }
      }
    });
    ```

- [ ] **Sub-Task 3: Car Recommendation Tool Implementation**
  - **Description:** Create intelligent recommendation tool based on user preferences

    ```typescript
    // File Path: CarFind/lib/tools/car-recommendation-tool.ts
    // AI-powered car recommendation tool
    import { tool } from 'ai';
    import { z } from 'zod';
    import { carSearchService } from '../services/car-search-service';

    export const carRecommendationTool = tool({
      description: 'Get personalized car recommendations based on user needs, budget, and preferences. Use this for advisory conversations.',
      inputSchema: z.object({
        budget: z.number().positive().optional().describe('User budget in USD'),
        usage: z.enum(['commuting', 'family', 'luxury', 'work', 'sport']).optional().describe('Primary use case'),
        fuelPreference: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional().describe('Fuel type preference'),
        features: z.array(z.string()).optional().describe('Important features (e.g., fuel-efficient, spacious, reliable)')
      }),
      async execute(input) {
        try {
          // Build search criteria based on preferences
          const criteria: any = {};
          
          if (input.budget) {
            criteria.maxPrice = input.budget;
          }
          
          if (input.fuelPreference) {
            criteria.fuelType = input.fuelPreference;
          }

          const result = await carSearchService.searchCars(criteria);
          
          // Apply intelligent filtering based on usage
          let recommendations = result.cars;
          
          if (input.usage) {
            switch (input.usage) {
              case 'commuting':
                recommendations = recommendations.filter(car => 
                  car.fuelType === 'electric' || car.fuelType === 'hybrid' || 
                  ['Civic', 'Camry', 'Corolla'].includes(car.model)
                );
                break;
              case 'family':
                recommendations = recommendations.filter(car => 
                  ['SUV', 'Minivan'].some(type => car.description.includes(type)) ||
                  ['X3', 'Pilot', 'Highlander'].includes(car.model)
                );
                break;
              case 'luxury':
                recommendations = recommendations.filter(car => 
                  ['BMW', 'Mercedes', 'Audi', 'Tesla'].includes(car.make) ||
                  car.price > 40000
                );
                break;
              case 'work':
                recommendations = recommendations.filter(car => 
                  ['F-150', 'Silverado', 'Ram'].includes(car.model) ||
                  car.description.includes('truck')
                );
                break;
            }
          }

          // Limit to top 3 recommendations
          recommendations = recommendations.slice(0, 3);

          return {
            success: true,
            message: `Based on your preferences, here are my top recommendations:`,
            recommendations: recommendations.map(car => ({
              id: car.id,
              make: car.make,
              model: car.model,
              year: car.year,
              price: car.price,
              description: car.description,
              whyRecommended: this.generateRecommendationReason(car, input)
            }))
          };
        } catch (error) {
          console.error('Car recommendation tool error:', error);
          return {
            success: false,
            message: 'An error occurred while generating recommendations. Please try again.',
            recommendations: []
          };
        }
      },
      
      generateRecommendationReason(car: any, input: any): string {
        const reasons = [];
        
        if (input.budget && car.price <= input.budget) {
          reasons.push('fits your budget');
        }
        
        if (input.fuelPreference && car.fuelType === input.fuelPreference) {
          reasons.push(`matches your ${input.fuelPreference} preference`);
        }
        
        if (input.usage) {
          switch (input.usage) {
            case 'commuting':
              if (car.fuelType === 'electric' || car.fuelType === 'hybrid') {
                reasons.push('excellent for daily commuting with great fuel economy');
              }
              break;
            case 'family':
              reasons.push('perfect for family needs with space and safety');
              break;
            case 'luxury':
              reasons.push('offers premium features and prestige');
              break;
            case 'work':
              reasons.push('ideal for work purposes with utility and reliability');
              break;
          }
        }

        return reasons.length > 0 ? reasons.join(', ') : 'matches your requirements';
      }
    });
    ```

- [ ] **Sub-Task 4: Tool Export Module**
  - **Description:** Create centralized export module for all car-related tools

    ```typescript
    // File Path: CarFind/lib/tools/index.ts
    // Centralized tool exports for AI integration
    export { carSearchTool } from './car-search-tool';
    export { carDetailsTool } from './car-details-tool';
    export { carRecommendationTool } from './car-recommendation-tool';

    // Export all tools as a collection for easy API integration
    export const carTools = {
      searchCars: carSearchTool,
      getCarDetails: carDetailsTool,
      getRecommendations: carRecommendationTool
    };
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- All car search tools are implemented with proper Zod validation
- Tools integrate successfully with CarSearchService
- Error handling is robust and provides meaningful feedback
- Tool schemas are properly documented for AI understanding
- Tools support natural language interaction patterns
- All TypeScript compilation passes without errors

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] Car search tool implemented with comprehensive validation.
- [ ] Car details tool provides detailed information retrieval.
- [ ] Car recommendation tool offers intelligent suggestions.
- [ ] All tools have proper error handling and user feedback.
- [ ] Tool exports are centralized and organized.
- [ ] TypeScript compilation passes without errors.
- [ ] Tools are ready for API integration (TASK-07).

---

## 9. Risks & Mitigations

- **Risk**: Tool schema validation failures → **Mitigation**: Use comprehensive Zod schemas with proper error messages
- **Risk**: Service integration issues → **Mitigation**: Follow dependency injection patterns and test service calls
- **Risk**: Poor AI tool invocation → **Mitigation**: Provide clear, descriptive tool descriptions and examples
- **Risk**: Runtime errors in tool execution → **Mitigation**: Implement comprehensive try-catch blocks and error logging

---

## 10. Self-Assessment Checklist

- [ ] All tools follow AI SDK patterns consistently
- [ ] Zod schemas provide comprehensive input validation
- [ ] Error handling provides clear, actionable feedback
- [ ] Tool descriptions guide AI to proper usage
- [ ] Service integration follows SOLID principles
- [ ] Tools are properly exported and organized
- [ ] Implementation is ready for API route integration (TASK-07)

---
