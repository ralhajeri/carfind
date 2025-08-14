// File Path: CarFind/lib/tools/car-details-tool.ts
// Tool for retrieving detailed car information
import { tool } from 'ai';
import { z } from 'zod';
import { carSearchService } from '../services/car-search-service';

export const carDetailsTool = tool({
  description:
    'Get detailed information about a specific car by its ID. Use this when users want more details about a particular car.',
  inputSchema: z.object({
    carId: z.string().describe('The unique identifier of the car'),
  }),
  async execute(input) {
    try {
      const car = await carSearchService.getCarById(input.carId);

      if (!car) {
        return {
          success: false,
          message: 'Car not found with the provided ID.',
          car: null,
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
          fuelType: car.fuelType,
        },
      };
    } catch (error) {
      console.error('Car details tool error:', error);
      return {
        success: false,
        message:
          'An error occurred while retrieving car details. Please try again.',
        car: null,
      };
    }
  },
});
