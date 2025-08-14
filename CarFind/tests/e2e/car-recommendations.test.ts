// File Path: tests/e2e/car-recommendations.test.ts
// Sub-Task 3: AI Recommendation Testing (REQ-003) - Automated Playwright Tests
import { ChatPage } from '../pages/chat';
import { test, expect } from '../fixtures';

test.describe('CarFind AI Recommendation Testing (REQ-003)', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.createNewChat();
  });

  test('TEST-F-003-1: Family car recommendations with fuel economy', async () => {
    // Test Step 1: Send message requesting family car with good fuel economy
    await chatPage.sendUserMessage(
      'I need a family car with good fuel economy',
    );
    await chatPage.isGenerationComplete();

    // Verify AI provides relevant recommendations
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    // Validate response exists and has content
    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate response contains family-oriented cars
      expect(content).toMatch(/(CR-V|X3|Pilot|Highlander|SUV|family)/i);

      // Validate fuel economy consideration
      expect(content).toMatch(/(fuel|economy|efficient|electric|hybrid|mpg)/i);

      // Validate substantial response
      expect(content.length).toBeGreaterThan(50);
    }
  });

  test('TEST-F-003-2: New driver car recommendations', async () => {
    // Test Step 2: Send message asking for new driver recommendations
    await chatPage.sendUserMessage("What's a good car for a new driver?");
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate safety and affordability focus
      expect(content).toMatch(
        /(safety|reliable|affordable|budget|beginner|new driver)/i,
      );

      // Validate reasonable price recommendations
      expect(content).toMatch(/(Corolla|Civic|Elantra|Jetta|Malibu)/i);

      // Ensure response is helpful and detailed
      expect(content.length).toBeGreaterThan(100);
    }
  });

  test('TEST-F-003-3: Luxury car under budget constraint', async () => {
    // Test Step 3: Send message requesting luxury car under $50,000
    await chatPage.sendUserMessage('I want a luxury car under $50,000');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate luxury brand recommendations
      expect(content).toMatch(/(BMW|Mercedes|Audi|Tesla|luxury|premium)/i);

      // Validate budget consideration
      expect(content).toMatch(/(\$|price|budget|under|50)/i);

      // Validate specific luxury models in price range
      expect(content).toMatch(/(X3|Q5)/i); // Models within budget from mock data
    }
  });

  test('TEST-F-003-4: Follow-up detail request', async () => {
    // First, get initial recommendations
    await chatPage.sendUserMessage('I need a luxury car under $50,000');
    await chatPage.isGenerationComplete();

    // Test Step 4: Ask for more details about first car
    await chatPage.sendUserMessage('Tell me more about the first car');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate detailed information is provided
      expect(content).toMatch(
        /(year|price|mileage|color|features|description)/i,
      );

      // Validate conversation context is maintained
      expect(content.length).toBeGreaterThan(80);

      // Should provide specific car details
      expect(content).toMatch(/(\d{4}|\$\d+|miles)/i); // Year, price, or mileage
    }
  });

  test('TEST-F-003-5: Commuting car recommendations', async () => {
    // Test commuting-specific recommendations
    await chatPage.sendUserMessage('I need a car for daily commuting to work');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate commuting-focused recommendations
      expect(content).toMatch(
        /(commut|fuel.*efficien|electric|hybrid|econom)/i,
      );

      // Should recommend efficient vehicles
      expect(content).toMatch(/(Corolla|Civic|Camry|Prius|electric|hybrid)/i);
    }
  });

  test('TEST-F-003-6: Work vehicle recommendations', async () => {
    // Test work-specific recommendations (trucks/utility)
    await chatPage.sendUserMessage('I need a vehicle for work and hauling');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate work-focused recommendations
      expect(content).toMatch(/(work|haul|truck|utility|cargo)/i);

      // Should recommend trucks or work vehicles
      expect(content).toMatch(/(F-150|truck|pickup)/i);
    }
  });

  test('TEST-F-003-7: Multiple constraint recommendations', async () => {
    // Test complex query with multiple constraints
    await chatPage.sendUserMessage(
      'I want an electric car under $40,000 for family use',
    );
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate multiple constraint handling
      expect(content).toMatch(/(electric)/i);
      expect(content).toMatch(/(family)/i);
      expect(content).toMatch(/(\$|price|budget|40)/i);

      // Should handle constraint combination appropriately
      expect(content.length).toBeGreaterThan(100);
    }
  });

  test('TEST-F-003-8: Response quality and format validation', async () => {
    await chatPage.sendUserMessage('What car would you recommend for me?');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    const content = assistantMessage.content;

    expect(content).toBeTruthy();
    expect(content).not.toBeNull();

    if (content) {
      // Validate substantial response
      expect(content.length).toBeGreaterThan(50);

      // Should ask clarifying questions or provide general guidance
      expect(content).toMatch(
        /(recommend|suggest|help|need|budget|use|prefer)/i,
      );
    }
  });
});
