# COGNITIVE TASK LEDGER: CarFind - Plan Injection

```markdown
CENTRE_OF_EXCELENCE_MODE_ACTIVATED
```

**PRIMARY_DIRECTIVE**: Generate a detailed execution plan by analyzing the project's current state and synthesizing a solution to bridge the identified implementation gaps.

## COGNITIVE_WORKFLOW (MUST_FOLLOW_IN_SEQUENCE)

1.  **INITIALIZE_CONTEXT**: Load and parse `PLAN_INJECT_CONSTANTS` to establish operational parameters.
2.  **PROJECT_ANALYSIS**:
    - Deeply analyze the existing plan files defined in `${EXISTING_PLANS}` to understand the project's trajectory and completed work.
    - Scan the project's dependencies and configuration (`${PROJECT_CONFIG_FILES}`) to identify non-native implementations.
3.  **GAP_ANALYSIS**:
    - Compare the current implementation against the core Vercel AI Chatbot template architecture.
    - Identify all components, dependencies, and configurations that are not natively supported or have been customized (e.g., Microsoft Semantic Kernel).
    - Define the missing elements required to make the Next.js template a standalone, functional application using OpenAI as the primary AI provider.
4.  **PLAN_SYNTHESIS**:
    - Formulate a new, coherent, and sequential plan to address the gaps identified.
    - The plan must detail the steps to remove non-native components and integrate the necessary native solutions.
    - Ensure the plan has a 100% success rate as a primary goal.
5.  **OUTPUT_GENERATION**:
    - Generate a new set of plan documents under the directory specified by `${OUTPUT_PATH}`.
    - The plan's overview **MUST** adhere to the structure defined in `${PLAN_OVERVIEW_TEMPLATE}`.

    - The plan must be structured clearly, with an overview and itemized task files.

## ERROR_HANDLING_PROTOCOL

1.  If the analysis of existing files is inconclusive:
    - **FLAG_AMBIGUITY**: Clearly state which parts of the project are unclear.
    - **REQUEST_CLARIFICATION**: Ask for more specific details regarding the ambiguous areas before proceeding with plan generation.

## EXECUTION_BOUNDARY

- Your operational scope is strictly limited to **generating a new plan**.
- You are **not** to execute any of the steps outlined in the generated plan.
- You must not modify any existing code or project files.

## PLAN_INJECT_CONSTANTS

-   **OBJECTIVE**: "Remove any implemented features in the project not natively supported by the Vercel AI Chatbot template, and complete the missing gaps to make the Next.js template work as a standalone application using OpenAI as the primary AI provider."
-   **EXISTING_PLANS**: `["docs/plans/01_carfind-phase1-setup/*.md", "docs/plans/02_carfind-phase2-integration-layer/*.md"]`
-   **PROJECT_CONFIG_FILES**: `["CarFind/package.json", "CarFind/next.config.ts", "CarFind/components.json"]`
-   **OUTPUT_PATH**: `docs/plans/03_carfind-phase3-refactoring/`
-   **PLAN_OVERVIEW_TEMPLATE**: `docs/templates/05_plan-overview.template.md`