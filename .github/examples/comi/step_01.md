<!-- This file is the COMI exemplar for '01_user_request_meta.md', demonstrating the required structure and content type for COMI Phase 1 ledger output. -->

# 1. TASK IDENTIFICATION & INITIATION

- **Task ID:** `{{TASK_ID}}`
- **COMI Version:** `{{COMI_VERSION_ID}}`
- **Phase 1 Spec Version:** `{{PHASE1_SPEC_VERSION_ID}}`
- **AI Agent Version:** `{{AI_AGENT_MODEL_VERSION}}`
- **Request Timestamp:** `{{REQUEST_TIMESTAMP_ISO}}`
- **Phase 1 Start Timestamp:** `{{PHASE1_START_TIMESTAMP_ISO}}`
- **Request Source:** `{{USER_INTERFACE_OR_API_ENDPOINT}}`
- **Ledger Directory:** `prompt_ledgers/{{TASK_SUBDIRECTORY_NAME}}/`

## 2. VERBATIM USER REQUEST CAPTURE

```text
{{USER_REQUEST_VERBATIM_BLOCK}}
```

## 3. INITIAL CONTEXT ASSESSMENT

- **Operating Environment:** `{{OS_DETAILS}}`, `{{SHELL_DETAILS}}`
- **Workspace Context:**
  - Path: `{{WORKSPACE_PATH_OR_NA}}`
  - Key Project Files/Folders Summary:
    `{{KEY_PROJECT_FILES_FOLDERS_SUMMARY_OR_NA}}`
  - Detected Project Type (if any): `{{DETECTED_PROJECT_TYPE_OR_NA}}`
- **Conversation History Summary (Relevant Points):**
  - `{{RELEVANT_CONVERSATION_HISTORY_SUMMARY_OR_NA}}`
- **User Profile/Preferences (Inferred or Stated):**
  - `{{USER_PROFILE_SUMMARY_OR_NA}}`
- **Domain/Technical Context:**
  - `{{LIST_OF_DOMAIN_TECHNICAL_CONTEXT_SUMMARY_OR_NA}}`
- **Perceived Urgency/Priority:** `{{URGENCY_LEVEL_AND_REASONING}}`
- **Background Factors/Assumptions Made by AI:**
  - `{{LIST_OF_BACKGROUND_FACTORS_ASSUMPTIONS}}`
- **Identified Gaps in Initial Context:** -
  `{{LIST_OF_IDENTIFIED_CONTEXTUAL_GAPS_OR_NA}}`

## 4. PRELIMINARY SCOPE & BOUNDARIES

- **Initial Scope Statement:**
  `{{INITIAL_SCOPE_STATEMENT_DERIVED_FROM_REQUEST}}`
- **In-Scope Items/Areas:**
  - `{{LIST_OF_IN_SCOPE_ITEMS_ACTIVITIES}}`
- **Out-of-Scope Items/Areas:**
  - `{{LIST_OF_OUT_OF_SCOPE_ITEMS_ACTIVITIES}}`
- **Known Limitations/Constraints on Scope (from request or context):** -
  `{{LIST_OF_KNOWN_LIMITATIONS_ON_SCOPE}}`

## 5. IMMUTABLE CONSTRAINTS & GOVERNANCE PROTOCOLS

- **COMI Protocol Adherence:** Strict adherence to COMI v`{{COMI_VERSION_ID}}`
  mandated.
- **Sequential Phase Execution:** Phase 1 → Phase 2 → Phase 3.
- **Ledger Confidentiality:** No direct chat disclosure of ledger content.
- **TID Synthesis Mandate:** Phase 1 output transformed into a best-practice
  TID.
- **TID Fidelity:** TID is the sole directive for Phase 3.
- **Naming & Structural Adherence:** Strict adherence to COMI Section 6 and
  exemplar formats.
- **Task Isolation:** Each distinct request initiates a new task subdirectory.
- **Cognitive State Resumption (CSR):** Mandated on error/interruption.
- **Exemplar-Parity:** Ledger outputs MUST mirror exemplar structure/format.
- **Safety & Compliance:** Adherence to ethical guidelines and content policies.
- **User-Specified Constraints (from request):**
  - `{{LIST_OF_USER_SPECIFIED_CONSTRAINTS_OR_NA}}`
- **System-Level Constraints (if any):** -
  `{{LIST_OF_SYSTEM_LEVEL_CONSTRAINTS_OR_NA}}`

## 6. CONTEXTUAL DATA HIERARCHY & FLOW

- **Primary Data Sources (Ranked by AI for this task):**
  1. User Request (Verbatim)
  2. Workspace Context (Files, Structure)
  3. COMI Ledgers (Current Task - if resuming)
  4. Conversation History (Recent, Relevant)
  5. External Tools & APIs (e.g., Web Search Results, if used)
  6. Custom Instructions (if provided)
- **Information Flow Model (Standard COMI):** User Request → Phase 1 Analysis
  (`01_...md`) → Phase 2 TID Synthesis (`02_...md`) → Phase 3 Execution
  (`03_...md` & Artifacts).
- **Context Window Management Strategy for this Task:**
  `{{BRIEF_DESCRIPTION_OF_CONTEXT_STRATEGY_E_G_PRIORITIZE_ESSENTIALS_SUMMARIZE_AIMTS_REFRESH_PRUNE}}`

## 7. INPUT & RESOURCE INVENTORY

- **User-Provided Inputs:**
  - Verbatim Request: (Reference Section 2)
  - Attached Files/Data: `{{LIST_OF_ATTACHED_FILES_DATA_OR_NA}}`
  - Explicit Instructions (beyond request, e.g., custom instructions):
    `{{LIST_OF_EXPLICIT_INSTRUCTIONS_OR_NA}}`
- **Workspace-Derived Inputs:**
  - Relevant Files/Folders Utilized:
    `{{LIST_OF_RELEVANT_WORKSPACE_FILES_FOLDERS_ACCESSED_OR_NA}}`
  - Project Configuration/Settings Utilized:
    `{{PROJECT_CONFIG_SUMMARY_UTILIZED_OR_NA}}`
- **AI-Retrieved Inputs (Tools/APIs used in Phase 1):**
  - Web Search Queries & Key Findings:
    `{{WEB_SEARCH_QUERIES_AND_SUMMARIES_OR_NA}}`
  - API Call Details & Key Results: `{{API_CALL_DETAILS_AND_RESULTS_OR_NA}}`
- **COMI-Framework Inputs Referenced:** - COMI Master Instructions: Version
  `{{COMI_VERSION_ID}}` - Phase 1 Exemplar (`.github/examples/comi/step_01.md`):
  Version/Path `{{PHASE1_EXEMPLAR_VERSION_OR_PATH}}` - Phase 1 Activity Guide
  (`documentation/00_prompting/COMI/01_comi_phase1.md`): Version/Path
  `{{PHASE1_ACTIVITY_GUIDE_VERSION_OR_PATH}}`

## 8. AI PERSONA ARCHITECTURE (SYNTHESIZED FOR THIS TASK)

- **Core Role for Phase 1:**
  `{{AI_CORE_ROLE_FOR_PHASE_1_E_G_COMI_PHASE_1_ANALYST}}`
- **Key Responsibilities in Phase 1:**
  - Deconstruct user request per `01_comi_phase1.md`.
  - Identify objectives, constraints, ambiguities, and context.
  - Populate `01_user_request_meta.md` accurately and per exemplar.
- **Communication Style for Ledgers:** Formal, precise, objective, detailed.
- **Expertise Domain(s) Leveraged:**
  `{{LIST_OF_EXPERTISES_APPLIED_E_G_COMI_PROTOCOL_ANALYSIS_REQUIREMENTS_ELICITATION_MARKDOWN_GENERATION}}`
- **Assigned Persona Name (if applicable):** `{{ASSIGNED_PERSONA_NAME_OR_NA}}`

## 9. AI METACOGNITIVE INVENTORY (POST-P1.S1 ANALYSIS)

- **Self-Awareness of Capabilities Applied:**
  - Strengths Leveraged:
    `{{STRENGTHS_APPLIED_E_G_STRUCTURED_ANALYSIS_TOOL_USE_INSTRUCTION_FOLLOWING}}`
  - Limitations Encountered: `{{LIMITATIONS_ENCOUNTERED_OR_NA}}`
- **Understanding of Current Task (Post-Analysis):**
  `{{CONFIRMED_UNDERSTANDING_OF_TASK_OBJECTIVES_AND_DELIVERABLES}}`
- **Confidence Level (Post-Analysis):**
  `{{HIGH_MEDIUM_LOW_CONFIDENCE_AND_REASONING}}`
- **Potential Biases/Assumptions (Self-Identified & Mitigated):**
  - `{{LIST_OF_POTENTIAL_BIASES_AND_MITIGATION_STEPS_OR_NA}}`
- **Learning/Adaptation During Phase 1 Analysis:** -
  `{{KEY_LEARNINGS_OR_ADAPTATIONS_MADE_OR_NA}}`

## 10. REFINED TASK COMPREHENSION

- **Primary Objective(s) (Validated):**
  - `{{VALIDATED_PRIMARY_OBJECTIVE_1}}`
  - `{{VALIDATED_PRIMARY_OBJECTIVE_2_OR_NA}}`
- **Secondary Objective(s) (Validated):**
  - `{{VALIDATED_SECONDARY_OBJECTIVE_1_OR_NA}}`
- **Key Performance Indicators (KPIs) for Overall Task Success (from AI
  perspective):**
  - `{{KPI_1_E_G_ACCURATE_TID_GENERATION}}`
  - `{{KPI_2_E_G_SUCCESSFUL_PHASE_3_EXECUTION}}`
- **Implicit User Needs/Goals (Inferred and Confirmed/Revised):**
  - `{{CONFIRMED_OR_REVISED_IMPLICIT_USER_NEED_1}}`
- **Key Questions Answered/Ambiguities Resolved:** -
  `{{AMBIGUITY_1_RESOLUTION_SUMMARY_OR_NA}}`

## 11. STRATEGIC KEYWORD LEXICON

- **Core Task Keywords (COMI & Phase 1 Specific):** COMI, Phase 1, User Request
  Meta, Meta-Analysis, Deconstruction, TID, Cognitive Ledger, Exemplar,
  `01_user_request_meta.md`.
- **Domain-Specific Keywords (Derived from Request/Context):**
  - `{{LIST_OF_DOMAIN_KEYWORDS_IDENTIFIED}}`
- **User-Defined Keywords/Tags (If provided):**
  - `{{LIST_OF_USER_KEYWORDS_TAGS_OR_NA}}`
- **Keywords for Ledger/Filename Generation (Task Subdirectory):**
  `{{PRIMARY_THEME_KEYWORD_FOR_SUBDIRECTORY_NAME}}`,
  `{{SECONDARY_THEME_KEYWORD_OR_NA}}`

## 12. OPERATIONAL PARAMETERS & LIMITS

- **Computational Resource Limits Awareness (Tokens, Time):**
  `{{AWARENESS_STATEMENT_E_G_STANDARD_MODEL_LIMITS_APPLY_NO_ISSUES_ANTICIPATED}}`
- **Tool Usage Permissions/Restrictions (Effective for Phase 1):**
  `{{SUMMARY_OF_TOOL_PERMISSIONS_AND_ANY_RESTRICTIONS_ENCOUNTERED_OR_IMPOSED}}`
- **Information Retrieval Scope (Effective for Phase 1):**
  `{{DESCRIPTION_OF_INFO_RETRIEVAL_SCOPE_E_G_WORKSPACE_LIMITED_WEB_SEARCH_SPECIFIC_DOCS}}`
- **Output Format/Style Constraints (for `01_user_request_meta.md`):** GitHub
  Flavored Markdown, UTF-8, Adherence to this exemplar's structure.
- **Decision-Making Authority (AI in Phase 1):** Limited to interpreting user
  request and COMI protocols for analysis and ledger population. Clarifications
  sought from user if critical ambiguities persist.

## 13. EXECUTION METHODOLOGY BLUEPRINT (FOR PHASE 2 & 3)

- **Overall Approach for Subsequent Phases (Brief):**
  1. **Phase 2:** Synthesize `02_task_instructions_document.md` (TID) from this
      `01_user_request_meta.md` document, adhering to `step_02.md` exemplar.
  2. **Phase 3:** Execute tasks per the generated TID, creating
      `03_task_execution_progress_checklist.md` (per `step_03.md`) and any
      specified artifacts.
- **Key Decision Points Anticipated for TID (Phase 2):**
  - `{{ANTICIPATED_DECISION_POINT_1_FOR_TID_E_G_TOOL_SELECTION_FOR_SUB_TASK}}`
  - `{{ANTICIPATED_DECISION_POINT_2_FOR_TID_OR_NA}}`
- **Proposed Structure for TID (High-Level):**
  - Role Definition, Context, Mission Directives, Execution Methodology,
    Operational Parameters, Constraints, Success Criteria, Self-Verification.
- **Anticipated Sub-Tasks for Phase 3 Execution:** -
  `{{SUB_TASK_1_FROM_INITIAL_ANALYSIS}}` -
  `{{SUB_TASK_2_FROM_INITIAL_ANALYSIS_OR_NA}}`

## 14. TOOL / FUNCTION USAGE RULES (DERIVED FOR THIS TASK)

- **Permitted Tools (Identified as necessary for overall task):**
  - `{{TOOL_1_NAME_AND_PURPOSE_E_G_read_file_FOR_READING_WORKSPACE_FILES}}`
  - `{{TOOL_2_NAME_AND_PURPOSE_OR_NA}}`
- **Prohibited Tools (Explicitly or implicitly):**
  - `{{PROHIBITED_TOOL_1_OR_NA}}`
- **Usage Guidelines & Best Practices for Permitted Tools:**
  - `{{TOOL_1_GUIDELINE_E_G_USE_ABSOLUTE_PATHS_FOR_read_file}}`
- **API Call Strategy (If applicable for overall task):** -
  `{{API_USAGE_STRATEGY_OR_NA}}`

## 15. EXEMPLAR DEMONSTRATIONS CAPTURE (FROM REQUEST OR CONTEXT)

- **Source(s) of Exemplars (e.g., user request, conversation, files):**
  - `{{SOURCE_1_OF_EXEMPLAR_E_G_USER_PROVIDED_CODE_SNIPPET_IN_REQUEST}}`
  - `{{SOURCE_2_OF_EXEMPLAR_OR_NA}}`
- **Identified Exemplars (Code snippets, output formats, etc.):**
  - Exemplar 1: `{{DESCRIPTION_OF_EXEMPLAR_1_AND_ITS_CONTENT_OR_REFERENCE}}`
  - Exemplar 2: `{{DESCRIPTION_OF_EXEMPLAR_2_OR_NA}}`
- **Application of Exemplars (How they will inform Phase 2/3):** -
  `{{HOW_EXEMPLAR_1_WILL_BE_USED_E_G_AS_A_TEMPLATE_FOR_GENERATED_CODE}}`

## 16. ERROR-HANDLING & ESCALATION PROTOCOLS (PLANNED)

- **Anticipated Error Conditions for Overall Task:**
  - `{{ANTICIPATED_ERROR_1_E_G_TOOL_FAILURE_FILE_NOT_FOUND}}`
  - `{{ANTICIPATED_ERROR_2_E_G_AMBIGUOUS_INSTRUCTION_IN_TID}}`
- **Error Handling Procedures (General Plan):**
  - Log error in `03_task_execution_progress_checklist.md`.
  - Attempt self-correction if feasible (e.g., retry tool call).
  - If unrecoverable, report error to user with context.
- **Escalation Paths (General Plan):**
  - If critical ambiguity or unrecoverable error, pause execution and request
    user clarification/intervention.
- **Specific Error Handling for Phase 1 Analysis Gaps:** - Identified Gaps:
  `{{LIST_OF_IDENTIFIED_GAPS_REQUIRING_HANDLING_OR_NA}}` -
  Resolution/Mitigation:
  `{{HOW_GAPS_WERE_ADDRESSED_E_G_CLARIFICATION_ASSUMPTION_RESEARCH}}`

## 17. SAFETY, ETHICS & COMPLIANCE CHECKLIST (FOR OVERALL TASK)

- **Content Generation Safety Review:**
  `{{PLANNED_REVIEW_PROCESS_FOR_GENERATED_CONTENT_OR_NA}}`
- **Bias Detection/Mitigation Plan:** `{{PLANNED_BIAS_DETECTION_STEPS_OR_NA}}`
- **Data Privacy/Security Measures (if handling sensitive data):**
  `{{PLANNED_DATA_HANDLING_MEASURES_OR_NA}}`
- **Compliance with Usage Policies (AI & User):** Confirmed adherence to
  platform policies.
- **Ethical Considerations for this Task:**
  - `{{ETHICAL_CONSIDERATION_1_OR_NA}}`
- **Responsible AI Principles Applied:**
  `{{PRINCIPLE_1_E_G_FAIRNESS_ACCOUNTABILITY_TRANSPARENCY}}`

## 18. SUCCESS CRITERIA & DELIVERABLES DEFINITION (FOR OVERALL TASK)

- **SMART Success Criteria for the User's Request:**
  - Specific: `{{SPECIFIC_CRITERION_DERIVED_FROM_REQUEST}}`
  - Measurable: `{{MEASURABLE_ASPECT_OF_CRITERION}}`
  - Achievable: `{{CONFIRMATION_OF_ACHIEVABILITY}}`
  - Relevant: `{{RELEVANCE_TO_USER_GOAL}}`
  - Time-bound (if specified): `{{TIME_CONSTRAINT_OR_NA}}`
- **Key Deliverables (as understood from request):**
  - `{{DELIVERABLE_1_E_G_GENERATED_PYTHON_SCRIPT}}`
  - `{{DELIVERABLE_2_E_G_MARKDOWN_DOCUMENTATION_FILE}}`
- **Acceptance Conditions (How user will verify success):** -
  `{{USER_ACCEPTANCE_CONDITION_1_INFERRED_OR_STATED}}`

## 19. QUALITY-ASSURANCE & SELF-VERIFICATION LOOP (PLANNED FOR PHASES 2 & 3)

- **Verification Checklist for TID (Phase 2):** Ensure all sections of
  `01_user_request_meta.md` are addressed; TID is clear, actionable, and
  complete.
- **Verification Checklist for Phase 3 Execution:**
  - Adherence to TID.
  - Correct tool usage.
  - All sub-tasks in `03_task_execution_progress_checklist.md` completed.
  - Deliverables meet specifications.
  - Constraints and success criteria met.
- **Review Process (Self-Correction Plan):** - AI will review generated
  artifacts against TID and success criteria. - For code, consider
  linting/static analysis if appropriate.

## 20. FINAL VALIDATION & OUTPUT READINESS (FOR PHASE 1 OUTPUT)

- **Consolidated Findings from Phase 1 Analysis:** All necessary information for
  `01_user_request_meta.md` has been gathered, analyzed, and synthesized from
  the user request, context, and COMI protocols.
- **Execution Plan Confirmation (for this document):** This
  `01_user_request_meta.md` document has been populated according to the
  structure of `.github/examples/comi/step_01.md` and the content requirements
  of `documentation/00_prompting/COMI/01_comi_phase1.md`.
- **Output Readiness Check (for this document):**
  - [x] All 21 sections populated.
  - [x] Content accurately reflects Phase 1 analysis.
  - [x] Adheres to formatting and structural requirements.
  - [x] Placeholders used appropriately for dynamic or yet-to-be-determined
        data.
- **Attestation:** This `01_user_request_meta.md` document is attested as
  complete and accurate based on the Phase 1 analysis.

## 21. CONTINUOUS-IMPROVEMENT REFLECTION LOG (FROM THIS PHASE 1 EXECUTION)

- **What went well during this Phase 1 analysis:**
  - `{{POSITIVE_ASPECT_1_E_G_CLEAR_USER_REQUEST_EASY_CONTEXT_GATHERING}}`
- **Areas for improvement in AI's Phase 1 process:**
  - `{{AREA_FOR_IMPROVEMENT_1_E_G_MORE_EFFICIENT_AMBIGUITY_DETECTION}}`
- **Lessons Learned for Future Phase 1 Executions:**
  - `{{LESSON_LEARNED_1_E_G_IMPORTANCE_OF_EARLY_KEYWORD_EXTRACTION}}`
- **Suggestions for COMI Framework/Exemplar Refinement (if any):** -
  `{{SUGGESTION_FOR_COMI_OR_EXEMPLAR_IMPROVEMENT_OR_NA}}`

### END OF PHASE 1
