// File Path: CarFind/lib/services/car-search-service.ts
// SOLID: Single Responsibility Principle - Car Search Operations
import type { Car, CarSearchCriteria, CarSearchResult } from '../types/car';
import { MOCK_CARS } from '../data/mock-cars';

export class CarSearchService {
  private cars: Car[];

  constructor(cars: Car[] = MOCK_CARS) {
    this.cars = cars;
  }

  /**
   * Search cars based on provided criteria
   * @param criteria Search parameters
   * @returns Promise<CarSearchResult>
   */
  async searchCars(criteria: CarSearchCriteria): Promise<CarSearchResult> {
    let filteredCars = [...this.cars];

    // Filter by make
    if (criteria.make) {
      filteredCars = filteredCars.filter((car) =>
        car.make.toLowerCase().includes(criteria.make?.toLowerCase() || ''),
      );
    }

    // Filter by model
    if (criteria.model) {
      filteredCars = filteredCars.filter((car) =>
        car.model.toLowerCase().includes(criteria.model?.toLowerCase() || ''),
      );
    }

    // Filter by price range
    if (criteria.minPrice !== undefined) {
      const minPrice = criteria.minPrice;
      filteredCars = filteredCars.filter((car) => car.price >= minPrice);
    }
    if (criteria.maxPrice !== undefined) {
      const maxPrice = criteria.maxPrice;
      filteredCars = filteredCars.filter((car) => car.price <= maxPrice);
    }

    // Filter by year range
    if (criteria.minYear !== undefined) {
      const minYear = criteria.minYear;
      filteredCars = filteredCars.filter((car) => car.year >= minYear);
    }
    if (criteria.maxYear !== undefined) {
      const maxYear = criteria.maxYear;
      filteredCars = filteredCars.filter((car) => car.year <= maxYear);
    }

    // Filter by mileage
    if (criteria.maxMileage !== undefined) {
      const maxMileage = criteria.maxMileage;
      filteredCars = filteredCars.filter(
        (car) => (car.mileage || 0) <= maxMileage,
      );
    }

    // Filter by fuel type
    if (criteria.fuelType) {
      filteredCars = filteredCars.filter(
        (car) => car.fuelType === criteria.fuelType,
      );
    }

    return {
      cars: filteredCars,
      totalCount: filteredCars.length,
      criteria,
    };
  }

  /**
   * Get car by ID
   * @param id Car identifier
   * @returns Promise<Car | null>
   */
  async getCarById(id: string): Promise<Car | null> {
    const car = this.cars.find((car) => car.id === id);
    return car || null;
  }

  /**
   * Get all available makes
   * @returns Promise<string[]>
   */
  async getAvailableMakes(): Promise<string[]> {
    const makes = Array.from(new Set(this.cars.map((car) => car.make)));
    return makes.sort();
  }

  /**
   * Get models for a specific make
   * @param make Car make
   * @returns Promise<string[]>
   */
  async getModelsForMake(make: string): Promise<string[]> {
    const models = this.cars
      .filter((car) => car.make.toLowerCase() === make.toLowerCase())
      .map((car) => car.model);
    return Array.from(new Set(models)).sort();
  }
}

// Export singleton instance for use across the application
export const carSearchService = new CarSearchService();
