# COGNITIVE TASK LEDGER: Car Find

**PRIMARY_DIRECTIVE**: Execute the plan defined in `PLAN_CONSTANTS`.

## COGNITIVE_WORKFLOW (MUST_FOLLOW_IN_SEQUENCE)

1. **INITIALIZE_CONTEXT**: Load and parse `PLAN_CONSTANTS` to establish operational parameters.
2. **TASK_EXECUTION_LOOP → Iteration Loop**: For each `SUB_TASK` in `${MAIN_TASK_FILE}`:
    - 2.0. **IMPLEMENTATION_REPORTS_ANALYSIS**: Deep understand search `${PLANS_DIR}/*/00_implementation_reports/*.md` for completed tasks and context continuity
    - 2.1. **ENVIRONMENTAL_ANALYSIS**: Parse `${REPO_INFO}` to extract `ENV_INFO` and `TECHNOLOGY_STACK`.
    - 2.2. **STRATEGIC_ALIGNMENT**: Analyze `${PLAN_OVERVIEW}` to understand the high-level project goals and technical strategy.
    - 2.3. **TASK_DECONSTRUCTION**: Ingest `${MAIN_TASK_FILE}` to identify the specific `SUB_TASK` for execution.
    - 2.4. **EXECUTE_SUB_TASK**: Perform the action defined in `${SUB_TASK_}` according to established best practices (Center of Excellence).
    - 2.5. **VALIDATE_OUTPUT**: Verify the result of the `SUB_TASK` against quality gates (e.g., Linting, OOP, DRY, YAGNI, SRP). Await user confirmation to proceed.
    - 2.6. UPDATE {MAIN_TASK_FILE} completed sub-tasks as [x] done.

## ERROR_HANDLING_PROTOCOL

1. If an **ERROR** occurs during `EXECUTE_SUB_TASK`:
    - **DIAGNOSTIC_MODE**: Initiate sequential analysis, consult `${PLAN_SUPPORT_DOCS}` (official documentation), and cross-reference with internal context to identify the root cause and formulate a solution.

**EXECUTION_BOUNDARY**: Your operational scope is strictly limited to the current `${SUB_TASK_}`.

## PLAN_CONSTANTS

- **REPO_INFO**: `README.md`
- **PLAN_SUPPORT_DOCS**: `https://vercel.com/templates/next.js/nextjs-ai-chatbot`
- **PLAN_OVERVIEW**: `docs\plans\04_openai_migration_implementation\01_overview.md`
- **MAIN_TASK_FILE**: `docs\plans\04_openai_migration_implementation\02_task_05_update-provider-configuration.md`
- **SUB_TASK_**: `**The Entire Sub-tasks in ${MAIN_TASK_FILE} file**`
