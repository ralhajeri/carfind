// File Path: CarFind/lib/types/car.ts
// Core Car entity and search criteria interfaces

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    description: string;
    mileage?: number;
    color?: string;
    fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}

export interface CarSearchCriteria {
    make?: string;
    model?: string;
    maxPrice?: number;
    minPrice?: number;
    minYear?: number;
    maxYear?: number;
    maxMileage?: number;
    fuelType?: string;
}

export interface CarSearchResult {
    cars: Car[];
    totalCount: number;
    criteria: CarSearchCriteria;
}
