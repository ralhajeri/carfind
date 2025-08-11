---
meta-directives:
  - 'Purpose: This template defines the relationship, data flow, and integration logic between two components.'
  - 'Audience: AI agent and development team.'
  - 'Action: Populate all sections to document how components interact.'
  - 'Principle: Focus on the "glue" code and interaction points, not the internal logic of the components.'
---
# Relation: {{COMPONENT_A}} ↔ {{COMPONENT_B}}

## 1. Brief

- **Purpose**: Explain—in one or two lines—why and how **{{COMPONENT_A}}** collaborates with **{{COMPONENT_B}}**.
- **Data Flow**: Describe the data exchanged between the components (e.g., inputs, outputs, direction).

## 2. Snippet

- **Description**: A brief explanation of the interaction shown in the snippet.

```{{LANGUAGE}}
// ≤ 30 lines — glue code showing interaction between A and B.
// Use placeholders for any non-essential details.
{{INTEGRATION_CODE_SNIPPET}}
```

## 3. RTM — Requirements Traceability Matrix

| Req ID | Role in A | Role in B | Integration Logic | Snippet Line(s) |
| :----- | :-------- | :-------- | :---------------- | :-------------- |
| `{{REQ_ID_1}}` | `{{ROLE_IN_A_1}}` | `{{ROLE_IN_B_1}}` | `{{LOGIC_1}}` | `{{LINES_1}}` |
| `{{REQ_ID_N}}` | `{{ROLE_IN_A_N}}` | `{{ROLE_IN_B_N}}` | `{{LOGIC_N}}` | `{{LINES_N}}` |

## 4. Integration Notes

- **Call Flow**: Summarize the sequence of calls and control flow.
- **Error Handling**: Describe how errors are handled during the interaction.
- **Assumptions**: List any assumptions made about the components' behavior.

## 5. Testing Strategy

- **Integration Tests**: Describe the specific tests that validate the interaction described in the snippet.
- **Mocking**: Detail which component (if any) will be mocked and what behavior is expected.
- **Test Case IDs**: List the corresponding test case IDs (e.g., `TEST-I-005`) that cover this integration.

## 6. See Also

- [Component A Documentation]({{PATH_TO_COMPONENT_A_DOC}})
- [Component B Documentation]({{PATH_TO_COMPONENT_B_DOC}})
