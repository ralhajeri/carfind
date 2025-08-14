# COGNITIVE TASK LEDGER: CarFind - Search

**PRIMARY_DIRECTIVE**: Find a solution for the `${SEARCH_TOPIC}` by executing the `COGNITIVE_WORKFLOW`.

## COGNITIVE_WORKFLOW (MUST_FOLLOW_IN_SEQUENCE)

1.  **INITIALIZE_CONTEXT**: Load and parse `SEARCH_CONSTANTS` to establish operational parameters.
2.  **PROJECT_ANALYSIS**: Understand the project by reading `${PROJECT_CONTEXT_FILES}` to gather initial information for search criteria.
3.  **PROBLEM_ANALYSIS**: Analyze the `${SEARCH_TOPIC}` and `${ERROR_LOG}`(if provided) to formulate precise search queries.
4.  **SEARCH_EXECUTION**:
    - Perform a deep search using the formulated queries and your attached instructions.
    - Prioritize official documentation and trusted sources.
    - Consider the `${SEARCH_CONSTRAINTS}` during the search.
5.  **SOLUTION_SYNTHESIS**:
    - Synthesize the findings into a coherent solution.
    - Provide code snippets if applicable, but do not implement them.
    - Explain how the solution addresses the problem within the given constraints.
6.  **OUTPUT_GENERATION**:
    - Generate a report with the proposed solution.
    - The report **MUST** adhere to the output template`${RESEARCH_BRIEF_TEMPLATE}` and directory structure defined in `${RESEARCHES_PATH}/`.

## ERROR_HANDLING_PROTOCOL

1.  If the search yields no relevant results:
    - **REFORMULATE_QUERY**: Broaden or alter search terms.
    - **ANALYZE_FAILURE**: Document why the initial search might have failed.
    - **REQUEST_CLARIFICATION**: If necessary, ask for more details about the problem.

## EXECUTION_BOUNDARY

- Your operational scope is strictly limited to searching for a solution locked inside your `**AI Agent Meta‑Prompt: Research Workflow Framework**`.
- You are not to write or modify any code in the project.

## SEARCH_CONSTANTS

- **META_PROMPT**: "AI Agent Meta-Prompt: Research Workflow Framework"
- **SEARCH_TOPIC**: "Configuration: How to correctly set up NextJS Chat bot template databse tables in supabase following the Vercel and supabase documentation, Do this aligne with my project?"
- **PROJECT_CONTEXT_FILES**: `docs/plans/*/01_overview.md`
- **ERROR_LOG**:
  ```
  NO_ERROR
  ```
- **SEARCH_CONSTRAINTS**:
  1. **ENVIRONMENT**: The system is based on the Vercel Next.js AI Chatbot template, with the AI provider migrated from the default XAI to OpenAI.
  2. **SOLUTION_SCOPE**: The proposed solution must be applicable to both the current OpenAI implementatio.
  3. The solution must align with the current project; no over-engineering.
  4. The search output must respect the specified path and template.
  5. The task is limited to search only, no coding.
