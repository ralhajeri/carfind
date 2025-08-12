// File Path: CarFind/lib/tools/index.ts
// Centralized tool exports for AI integration
export { carSearchTool } from './car-search-tool';
export { carDetailsTool } from './car-details-tool';
export { carRecommendationTool } from './car-recommendation-tool';

// Import for local use in carTools
import { carSearchTool } from './car-search-tool';
import { carDetailsTool } from './car-details-tool';
import { carRecommendationTool } from './car-recommendation-tool';

// Export all tools as a collection for easy API integration
export const carTools = {
    searchCars: carSearchTool,
    getCarDetails: carDetailsTool,
    getRecommendations: carRecommendationTool
};
