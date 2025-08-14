# COGNITIVE TASK LEDGER: CarFind - Task File Validation

```markdown
CENTRE_OF_EXCELENCE_MODE_ACTIVATED
```

**PRIMARY_DIRECTIVE**: Validate a specific task file for its alignment with the governing plan and native implementation best practices.

## COGNITIVE_WORKFLOW (MUST_FOLLOW_IN_SEQUENCE)

1.  **INITIALIZE_CONTEXT**:
    - Load and parse `VALIDATION_CONSTANTS` to establish operational parameters.

2.  **ANALYSIS**:
    - Read the specified task file from `${TASK_FILE_PATH}`.
    - Read the governing plan overview from `${PLAN_OVERVIEW_PATH}`.

3.  **VALIDATION_PROTOCOL**:
    - **Plan Alignment**: Verify that the steps, scope, and objectives defined in the task file are 100% aligned with the corresponding section in the plan overview. The task must be a direct and accurate implementation of a specific part of the plan, without deviation.
    - **Native Approach Alignment**:
        - Identify the core technologies, libraries, and methods proposed in the task file.
        - Assess if the proposed implementation aligns with the native, documented best practices for the `${NATIVE_PROVIDER}`.
        - This includes checking for the correct use of APIs, architectural patterns, and configurations recommended by the provider's official documentation. Any non-native or deprecated solutions should be flagged.

4.  **REPORTING_PROTOCOL**:
    - **IF ISSUES_FOUND**:
        - Generate a detailed report outlining each discrepancy.
        - For each issue, specify the file, the validation step that failed (e.g., "Plan Alignment," "Native Approach Alignment"), the problem, and the required correction.
        - Follow the standard CoE reporting format.
    - **ELSE (NO_ISSUES_FOUND)**:
        - Output a confirmation message stating: "Task validation successful. The task file at `${TASK_FILE_PATH}` is fully aligned with the plan and native best practices."

## EXECUTION_BOUNDARY

- Your scope is strictly limited to **validating the specified task file**.
- You are **not** to execute or modify any plan files or source code.

## VALIDATION_CONSTANTS

-   **TASK_FILE_PATH**: `docs\plans\03_carfind-phase3-refactoring\02_task_03_database-migration.md`
-   **PLAN_OVERVIEW_PATH**: `docs\plans\03_carfind-phase3-refactoring\01_overview.md`
-   **NATIVE_PROVIDER**: "Vercel AI SDK and Next.js + Next.js AI Chatbot Template"