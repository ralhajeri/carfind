# COGNITIVE TASK LEDGER: Car Find

**PRIMARY_DIRECTIVE**: Execute the plan defined in `PLAN_CONSTANTS`.

## COGNITIVE_WORKFLOW (MUST_FOLLOW_IN_SEQUENCE)

1. **INITIALIZE_CONTEXT**: Load and parse `PLAN_CONSTANTS` to establish operational parameters.
2. **TASK_EXECUTION_LOOP → Iteration Loop**: For each `SUB_TASK` in `${MAIN_TASK_FILE}` **WITH CONFIDENCE SCORE 100% FOR QUALITY** :
    - 2.0. **ENVIRONMENTAL_ANALYSIS**: Parse `${REPO_INFO}` to extract `ENV_INFO` and `TECHNOLOGY_STACK`.
    - 2.1. **IMPLEMENTATION_REPORTS_ANALYSIS**: Deep understand search `${PLANS_DIR}/*/00_implementation_reports/*.md` for completed tasks and context continuity
    - 2.2. **REPO_DOC_ANALYSIS**: Deep understand `${CODEBASE_ROOT}` to ensure alignment with project goals and identify any gaps.
    - 2.3. **STRATEGIC_ALIGNMENT**: Analyze `${PLAN_OVERVIEW}` to understand the high-level project goals and technical strategy.
    - 2.4. **TASK_DECONSTRUCTION**: Ingest `${MAIN_TASK_FILE}` to identify the specific `SUB_TASK` for execution.
    - 2.5. **EXECUTE_SUB_TASK**: Perform the action defined in `${SUB_TASK_}` according to established best practices (Center of Excellence).
    - 2.6. **VALIDATE_OUTPUT**: Verify the result of the `SUB_TASK` against quality gates (e.g., Linting, OOP, DRY, YAGNI, SRP). Await user confirmation to proceed.
    - 2.7. **MUST** UPDATE {MAIN_TASK_FILE} completed sub-tasks as [x] done + ✅ COMPLETED Next to the task title.
    - 2.8. **MUST** CREATE the implementation report
    - 2.9. **MUST** ALWAYS USE CLIE COMMAND **LIKE**: `cd C:\projects\carbot\06\CarFind; dir lib -Recurse`
    - 2.10. **ISSUE_LOGGING_PROTOCOL (MANDATORY_ENFORCEMENT)**:
        - **A. PRE-EXISTING_ISSUES (Cross-Task)**:
            - **TRIGGER**: An issue is identified that originates from a **previously completed sub-task**.
            - **ACTION (MUST_PERFORM)**:
                1. Navigate to the `02_task_...md` file corresponding to the source of the issue.
                2. Append an `## Identified Issues` section if one does not exist.
                3. Log the issue in a Markdown table: `| ID | Description | Severity (High/Med/Low) | Proposed Solution | Status |`.
                4. Set `Status` to `Reported`.
        - **B. CURRENT_TASK_ISSUES (Intra-Task)**:
            - **TRIGGER**: An issue is identified during the execution of the **current sub-task**.
            - **ACTION (MUST_PERFORM)**:
                1. Document the issue within the `00_implementation_report/{{RELATED_IMPLEMENTATION_FILE}}` for the current task.
                2. Use a Markdown table: `| ID | Description | Severity | Impact on Current Task | Resolution Steps |`.

## ERROR_HANDLING_PROTOCOL

1. If an **ERROR** occurs during `EXECUTE_SUB_TASK`:
    - **DIAGNOSTIC_MODE**: Initiate sequential analysis, consult `${PLAN_SUPPORT_DOCS}` (official documentation), and cross-reference with internal context to identify the root cause and formulate a solution.

**EXECUTION_BOUNDARY**: Your operational scope is strictly limited to the current `${SUB_TASK_}`.

## PLAN_CONSTANTS

- **REPO_INFO**: `README.md`
- **PLAN_SUPPORT_DOCS**: `[{https://vercel.com/templates/next.js/nextjs-ai-chatbot}, {https://supabase.com/docs/reference/javascript/start}, {https://learn.microsoft.com/en-us/semantic-kernel/overview/}]`
- **PLAN_OVERVIEW**: `docs\plans\02_carfind-phase2-integration-layer\01_overview.md`
- **MAIN_TASK_FILE**: `docs\plans\02_carfind-phase2-integration-layer\02_task_05_database-schema-creation.md`
- **SUB_TASK_**: `[{**Sub-Task 5: Create Database Functions and Triggers**}, {**Sub-Task 6: Implement Row Level Security Policies**}, {**Sub-Task 7: Create Database Views for Common Queries**}]`
