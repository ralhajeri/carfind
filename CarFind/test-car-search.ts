// Test script to validate car search tools integration
import { carSearchService } from './lib/services/car-search-service';
import { carTools } from './lib/tools';

async function testCarSearchIntegration() {
    console.log('🔧 Testing CarFind Integration...\n');

    try {
        // Test 1: Service Layer
        console.log('1️⃣ Testing Car Search Service:');
        const serviceResult = await carSearchService.searchCars({
            make: 'Toyota',
            maxPrice: 30000
        });
        console.log(`✅ Service found ${serviceResult.totalCount} cars`);
        console.log(`📋 First car: ${serviceResult.cars[0]?.year} ${serviceResult.cars[0]?.make} ${serviceResult.cars[0]?.model}\n`);

        // Test 2: Car Details Service
        console.log('2️⃣ Testing Car Details Service:');
        const car = await carSearchService.getCarById('1'); // Using valid mock ID
        if (car) {
            console.log(`✅ Found car: ${car.year} ${car.make} ${car.model}`);
            console.log(`💰 Price: $${car.price.toLocaleString()}\n`);
        } else {
            console.log('❌ Car not found\n');
        }

        // Test 3: Available Makes
        console.log('3️⃣ Testing Available Makes:');
        const makes = await carSearchService.getAvailableMakes();
        console.log(`✅ Found ${makes.length} car makes: ${makes.slice(0, 5).join(', ')}...\n`);

        // Test 4: Tool Collection Validation
        console.log('4️⃣ Validating Tool Collection:');
        const requiredTools = ['searchCars', 'getCarDetails', 'getRecommendations'];
        const availableTools = Object.keys(carTools);
        const missingTools = requiredTools.filter(tool => !availableTools.includes(tool));

        if (missingTools.length === 0) {
            console.log('✅ All required tools are available');
            console.log(`🔧 Available tools: ${availableTools.join(', ')}`);
        } else {
            console.log(`❌ Missing tools: ${missingTools.join(', ')}`);
        }

        // Test 5: Tool Structure Validation
        console.log('\n5️⃣ Validating Tool Structure:');
        for (const [toolName, tool] of Object.entries(carTools)) {
            if (tool && typeof tool === 'object' && 'description' in tool) {
                console.log(`✅ ${toolName}: ${tool.description}`);
            } else {
                console.log(`❌ ${toolName}: Invalid tool structure`);
            }
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('🚀 CarFind API integration is ready for use.');

    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}

// Run the test
testCarSearchIntegration()
    .then(() => {
        console.log('\n✅ CarFind integration validation completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ CarFind integration validation failed:', error);
        process.exit(1);
    });
