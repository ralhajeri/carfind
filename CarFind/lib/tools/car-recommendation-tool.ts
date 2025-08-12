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
                    whyRecommended: generateRecommendationReason(car, input)
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
    }
});

function generateRecommendationReason(car: any, input: any): string {
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
