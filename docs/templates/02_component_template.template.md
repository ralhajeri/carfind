---
meta-directives:
  - 'Purpose: This template defines a single, reusable software component.'
  - 'Audience: AI agent and development team.'
  - 'Action: Populate all sections to create a comprehensive component specification.'
  - 'Principle: Components should be focused, testable, and adhere to the Single Responsibility Principle (SRP).'
---
# Title: {{COMPONENT_NAME}} Template

## 1. Brief

- **Goal**: A one-sentence description of what this component achieves.
- **Scope**: Key responsibilities and boundaries of this component.
- **Context**: When and why this component should be used.

## 2. Snippets
<!-- Repeat this block N times for different scenarios -->
### **Scenario: {{SCENARIO_NAME}}**

- **Description**: A brief explanation of the use case for this snippet.

```{{LANGUAGE}}
// e.g., PEP 8-compliant, minimal, and focused (≤ 30 lines).
// Use placeholders like `# ...` for non-essential logic.
{{SCENARIO_CODE_SNIPPET}}
```

- **Inputs**: Describe the expected inputs.
- **Outputs**: Describe the expected outputs or side effects.
- **Dependencies**: List any other components or services this snippet relies on.

## 3. Usage

- **Integration**: How to integrate this component into the broader application.
- **Configuration**: Any required environment variables or configuration settings.
- **Best Practices**: Key guidelines for using this component effectively.

## 4. Testing Strategy

- **Unit Tests**: Describe the approach for unit testing the component's core logic.
- **Test Cases**: List key test cases, including edge cases and error conditions.
- **Mocking**: Specify any dependencies that need to be mocked for testing.

## 5. Definition of Done (DoD)

- [ ] Core logic is implemented.
- [ ] Unit tests are written and passing with sufficient coverage (e.g., >90%).
- [ ] The component is documented (all sections of this template are filled).
- [ ] Code has been peer-reviewed and approved.
- [ ] All usage and integration guidelines are clear.

## 6. See Also

- **Related Components**: [Link to other relevant component templates]({{PATH_TO_RELATED_COMPONENT}})
- **Parent Plan/Task**: [Link to the plan or task that requires this component]({{PATH_TO_PLAN_OR_TASK}})
