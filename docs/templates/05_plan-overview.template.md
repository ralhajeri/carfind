---
meta-directives:
  - 'Purpose: This template outlines the scope, requirements, and technical approach for a new feature or module.'
  - 'Audience: AI agent (Planner), stakeholders, and development team.'
  - 'Action: Populate all sections to create a comprehensive development plan.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
  - 'Framework: Continuous Testing-Framework Development Loop (DRY, KISS, YAGNI)'
  - 'Dynamic Template: Fully customizable - adapt all sections, structures, and examples to your specific project needs'
  - 'Output: Convert all code blocks to markdown lists in final plan'
  - 'Extensibility: Add/remove/modify sections, subsections, and list items as needed - this template is your starting point, not a rigid structure'
  - 'Guidance: Adhere to project standards, variables, and protocols defined in ../../README.md'
---
# Plan Overview - {{AppName}}: [Feature/Module Name]

## Plan Meta

 **Framework:** {{FRAMEWORK}}

- **Plan Name:** {{PLAN_NAME}}
- **Phase:** {{PHASE_NUMBER}}
- **Date:** {{TODAY_DATE}}
- **Status:** {{STATUS}}
- **Author:** {{AUTHOR}}

## 1. Executive Summary

### **Description:**

- [Brief, high-level summary of the feature and its purpose.] <!-- Add items as needed -->

### **Business Value:**

- [Describe the value this feature brings to the business or user.] <!-- Add items as needed -->

### **Technical Approach:**

- [High-level overview of the proposed technical solution.] <!-- Add items as needed -->

## 2. Requirements

### 2.1 Functional Requirements

- **REQ-001:** [As a user, I want to...]
- **REQ-002:** [The system must...]

### 2.2 Non-Functional Requirements

- **NFR-001 (Performance):** [The API response time must be under X ms.]
- **NFR-002 (Security):** [All sensitive data must be encrypted at rest.]

## 3. Scope & Phases

### 3.1 In-Scope

1. **Requirement REQ-001:** [Core feature 1 implementation.] <!-- Map features to requirements -->

### 3.2 Out-of-Scope

1. [Future enhancement or related feature not covered in this plan.]

### 3.3 Phases & Tasks

<!-- Define a logical sequence of tasks, grouped by phases if necessary. -->
**Phase 1:** [Core functionality]

1. **[Task 1 Name]** - [Brief description of the task's goal.]

    ```{{LANGUAGE}}
    // File Path: src/[feature_name]/[task1].py
    // Example: Code snippet for this task.
    {{TASK_1_CODE_EXAMPLE}}
    ```

2. **[Task 2 Name]** - [Brief description of the task's goal.]

    ```{{LANGUAGE}}
    // File Path: src/[feature_name]/[task2]_handler.py
    // Example: Code snippet for this task.
    {{TASK_2_CODE_EXAMPLE}}
    ```

<!-- Add more tasks as needed (n) - each with its own code snippet example -->

**Phase N:** [Add more phases as needed] <!-- Add more phases with tasks as needed -->

## 4. Technical Implementation

### 4.1 Architecture

- **Pattern:** [e.g., Strategy, Factory, Microservice, etc.]
- **Stack:** [Determined by ${TECHNICAL_STACK} from README.md]
<!-- Follow the project guidelines from `${WORKSPACE_ROOT}/README.md` -->
```{{LANGUAGE}}
// File Path: src/[feature_name]/service.py
// Example: High-level service pattern.
{{ARCHITECTURE_CODE_EXAMPLE}}
```

### 4.2 Module Structure
<!-- Follow the project structure from `${WORKSPACE_ROOT}/README.md` -->
```plaintext
// File Path: Project directory structure
# Example: Module structure layout - Customize based on project requirements
${CODEBASE_ROOT}/
├── src/                # Source code
│   └── [module_name]/
│       ├── __init__.py
│       ├── core.py     # Core logic
│       └── utils.py    # Utility functions
├── tests/              # Automated tests
│   └── test_[module_name].py
├── docs/               # Project documentation
├── config/             # Configuration files
└── scripts/            # Helper scripts
```

## 5. Success Criteria & Definition of Done (DoD)

### 5.1 Success Criteria

1. All functional requirements (2.1) are met and validated by tests.
2. All non-functional requirements (2.2) are met.

### 5.2 Definition of Done Checklist

- [ ] All tasks across all phases are completed.
- [ ] All code is peer-reviewed and merged.
- [ ] Test coverage meets or exceeds the target of [X]%.
- [ ] All security considerations have been addressed.
- [ ] Documentation is updated to reflect the new feature.

## 6. Dependencies & Risks

### 6.1 Dependencies

1. **Language:** [Language] v[X.X.X] <!-- Add more frameworks as needed (n) -->
2. **Database:** [Type] <!-- Add more databases/storage as needed (n) -->
3. **External:** [APIs/Services] <!-- Add more external dependencies as needed (n) -->
<!-- Add more dependency categories as needed: Authentication, Caching, Message Queues, File Storage, etc. -->

### 6.2 Risks
<!-- Add items 2, 3, 4, etc. as needed (n) -->
| Requirement | Risk | Impact | Mitigation |
|-------------|------|--------|------------|
| [REQ-001]   | [Risk 1] | [High/Med/Low] | [Strategy] |
| [NFR-002]   | [Risk N] | [High/Med/Low] | [Strategy] |

## 7. Testing Strategy

### 7.1 Test Levels
<!-- Follow the Testing/Linting Strategy from `${WORKSPACE_ROOT}/README.md` -->
1. **Unit Tests:** [Describe the approach for unit testing key components.]
2. **Integration Tests:** [Describe how interactions between components will be tested.]
3. **End-to-End (E2E) Tests:** [Outline the critical user flows to be covered by E2E tests.]

### 7.2 Tools & Frameworks

1. **Test Runner:** [e.g., Pytest, Jest, Vitest]
2. **Mocking Library:** [e.g., unittest.mock, Jest mocks]
3. **Assertion Library:** [e.g., Chai, built-in assertions]

## 8. Security Considerations

1. **Authentication & Authorization:** [How will access be controlled? Reference relevant requirements.]
2. **Data Protection:** [How will sensitive data be handled? Reference relevant requirements.]
3. **Input Validation:** [What measures will prevent common vulnerabilities? Reference relevant requirements.]
4. **Dependency Security:** [How will third-party dependencies be scanned for vulnerabilities?]

## 9. Open Questions

1. [Question 1 that needs resolution before or during development.] <!-- Add items 2, 3, etc. as needed (n) -->
2. [Question 2 related to scope, implementation, or dependencies.]
