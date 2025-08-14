// File Path: CarFind/lib/tools/car-search-tool.ts
// SOLID: Open/Closed Principle - extensible tools
import { tool } from 'ai';
import { z } from 'zod';
import { carSearchService } from '../services/car-search-service';
import type { CarSearchCriteria } from '../types/car';

export const carSearchTool = tool({
  description:
    'Search for cars based on specific criteria like make, model, price range, and year. Use this when users want to find cars matching their requirements.',
  inputSchema: z.object({
    make: z
      .string()
      .optional()
      .describe('Car make/brand (e.g., Toyota, Honda, Ford)'),
    model: z
      .string()
      .optional()
      .describe('Car model (e.g., Camry, Civic, F-150)'),
    maxPrice: z.number().positive().optional().describe('Maximum price in USD'),
    minPrice: z.number().positive().optional().describe('Minimum price in USD'),
    minYear: z.number().min(1990).max(2025).optional().describe('Minimum year'),
    maxYear: z.number().min(1990).max(2025).optional().describe('Maximum year'),
    maxMileage: z.number().positive().optional().describe('Maximum mileage'),
    fuelType: z
      .enum(['gasoline', 'diesel', 'electric', 'hybrid'])
      .optional()
      .describe('Fuel type preference'),
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
        fuelType: input.fuelType,
      };

      const result = await carSearchService.searchCars(criteria);

      if (result.cars.length === 0) {
        return {
          success: false,
          message:
            'No cars found matching your criteria. Try adjusting your search parameters.',
          totalCount: 0,
          cars: [],
        };
      }

      return {
        success: true,
        message: `Found ${result.totalCount} car(s) matching your criteria.`,
        totalCount: result.totalCount,
        cars: result.cars.map((car) => ({
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          description: car.description,
          mileage: car.mileage,
          color: car.color,
          fuelType: car.fuelType,
        })),
      };
    } catch (error) {
      console.error('Car search tool error:', error);
      return {
        success: false,
        message:
          'An error occurred while searching for cars. Please try again.',
        totalCount: 0,
        cars: [],
      };
    }
  },
});
