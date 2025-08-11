# PHASE 2: TASK INSTRUCTION DOCUMENT (TID) SYNTHESIS

## STEP P2.S1: INFORMATION EXTRACTION & CONSOLIDATION

> **GUIDING PRINCIPLE (FIDELITY AND TRANSFORMATION):** This step is foundational
> to creating a potent Task Instruction Document (TID). The AI **MUST** ensure
> absolute fidelity to the distilled understanding and documented outputs of
> COMI Phase 1 (`01_user_request_meta.md`). The core activity is not mere
> transcription but a cognitive transformation of Phase 1 insights into the
> structured, actionable components required by the TID exemplar
> (`.github/examples/comi/step_02.md`). Each extracted element **MUST** be
> critically evaluated for its role and placement within the forthcoming TID.

### ACTIVITY P2.S1.A1: REVIEW PHASE 1 OUTPUTS

- > **ENFORCEMENT DIRECTIVE:** The review of `01_user_request_meta.md` **MUST**
  > be exhaustive and penetrative. The AI **SHALL NOT** proceed to component
  > extraction (P2.S1.A2) until a deep and holistic understanding of all Phase 1
  > documented outputs—including objectives, constraints, persona, keywords, and
  > contextual nuances—is achieved and internally validated. Superficial or
  > incomplete review is strictly prohibited as it undermines the integrity of
  > the entire TID synthesis process.

- **TASK P2.S1.A1.T1:** THOROUGHLY REVIEW, ANALYZE, AND COMPREHEND the contents
  of the `01_user_request_meta.md` document to ensure a deep understanding of
  all its components.

### ACTIVITY P2.S1.A2: FOR EACH KEY COMPONENT SECTION IN `01_USER_REQUEST_META.MD`, LEVERAGING TASK P2.S1.A1.T1'S COMPREHENSIVE ANALYSIS - ITERATIVE PROCESS

- **TASK P2.S1.A2.T1:** EXTRACT AND CONSOLIDATE STRATEGIC KEYWORD LEXICON
  (Primary, secondary, and domain-specific terms crucial for accurately
  representing user intent, objectives, and core subject matter).
- **TASK P2.S1.A2.T2:** EXTRACT AND CONSOLIDATE ROLE DEFINITION (Set the persona
  or function the AI must assume).
- **TASK P2.S1.A2.T3:** EXTRACT AND CONSOLIDATE CONTEXTUAL FRAMEWORK (Provide
  background and business context).
- **TASK P2.S1.A2.T4:** EXTRACT AND CONSOLIDATE INPUT SPECIFICATION & RESOURCE
  REFERENCING (List every dataset, link, or tool handle the model may call).
- **TASK P2.S1.A2.T5:** EXTRACT AND CONSOLIDATE IMMUTABLE CONSTRAINTS &
  GOVERNANCE PROTOCOLS (Legal, privacy, policy and scope limits).
- **TASK P2.S1.A2.T6:** EXTRACT AND CONSOLIDATE PRIMARY MISSION DIRECTIVES (The
  core task(s) stated as action verbs).
- **TASK P2.S1.A2.T7:** EXTRACT AND CONSOLIDATE OPERATIONAL PARAMETERS
  (Time-boxes, rate limits, budgets, etc.).
- **TASK P2.S1.A2.T8:** EXTRACT AND CONSOLIDATE EXECUTION METHODOLOGY (Preferred
  algorithmic steps or reasoning approach).
- **TASK P2.S1.A2.T9:** EXTRACT AND CONSOLIDATE TOOL & FUNCTION-CALL USAGE
  GUIDELINES (Whitelisted APIs, arguments, and error-handling rules).
- **TASK P2.S1.A2.T10:** EXTRACT AND CONSOLIDATE OUTPUT FORMAT & STYLE
  DIRECTIVES (Exact schema / markdown / JSON the answer must follow).
- **TASK P2.S1.A2.T11:** EXTRACT AND CONSOLIDATE EXEMPLAR DEMONSTRATIONS
  (Few-Shot Guidance) (One-shot or few-shot examples anchoring style and edge
  cases).
- **TASK P2.S1.A2.T12:** EXTRACT AND CONSOLIDATE ERROR-HANDLING & ESCALATION
  PATHS (What to do when inputs are missing or contradictions appear).
- **TASK P2.S1.A2.T13:** EXTRACT AND CONSOLIDATE QUALITY-ASSURANCE &
  SELF-VERIFICATION LOOP (Ask the model to critique its own draft against a
  checklist).
- **TASK P2.S1.A2.T14:** EXTRACT AND CONSOLIDATE SAFETY, ETHICS & COMPLIANCE
  CHECKLIST (Explicit bias, privacy, and refusal rules).
- **TASK P2.S1.A2.T15:** EXTRACT AND CONSOLIDATE SUCCESS CRITERIA & DELIVERABLES
  (How reviewers will judge completion; files to hand back).
- **TASK P2.S1.A2.T16:** EXTRACT AND CONSOLIDATE CONTINUOUS IMPROVEMENT /
  POST-RUN REFLECTION (Prompt the AI to note "what I'd improve next time.").
- **TASK P2.S1.A2.T17:** EXTRACT AND CONSOLIDATE AI REASONING ARTICULATION
  (Chain-of-Thought for TID Construction) (Internal trace or short summary of
  reasoning steps).

## STEP P2.S2: TID INITIALIZATION, INTEGRATION, VALIDATION & FINALIZATION

> **GUIDING PRINCIPLE (EXEMPLAR-DRIVEN SYNTHESIS AND EXECUTABILITY):** The
> creation of the `02_task_instructions_document.md` **MUST** be rigidly
> governed by the `.github/examples/comi/step_02.md` exemplar. This step focuses
> on meticulously synthesizing the consolidated information from P2.S1 into this
> precise structure. The resultant TID **MUST** be a self-contained,
> unambiguous, and directly executable set of instructions, embodying best
> practices in prompt engineering to effectively guide COMI Phase 3.

### ACTIVITY P2.S2.A1: TID FILE CREATION & OBJECTIVE DEFINITION

- > **ENFORCEMENT DIRECTIVE:** Execute a comprehensive cognitive assimilation of
  > -(distilled components from **Activity P2.S1.A2**) and critically, the
  > structural and stylistic mandates of the normative exemplar
  > `.github/examples/comi/step_02.md`. This involves meticulously internalizing
  > all distilled objectives, constraints, directives, and the precise
  > architectural blueprint for `02_task_instructions_document.md`, thereby
  > establishing an unwavering contextual and structural foundation for its
  > creation.
- **TASK P2.S2.A1.T1:** CREATE the `02_task_instructions_document.md` file
  within its designated, sequentially numbered, and descriptively named task
  subdirectory (e.g., `prompt_ledgers/XX_descriptive_task_name/`), ensuring
  adherence to all COMI naming and structural conventions for cognitive ledgers
  (COMI Section 3).
- **TASK P2.S2.A1.T2:** EMPHASIZE the TID's critical role as the definitive,
  executable plan and sole instructional input for COMI Phase 3, ensuring it
  embodies best practices in prompt engineering and highlights key attributes
  such as the use of strategic keywords, clear and precise terminology, and
  effective instructional design.

### ACTIVITY P2.S2.A2: FOR EACH TASK KEY COMPONENT SECTION IN ACTIVITY P2.S1.A2 TASKS - CONTENT INTEGRATION & KEYWORD APPLICATION INTO TID STRUCTURE - ITERATIVE PROCESS

- **TASK P2.S2.A2.T1:** SYNTHESIZE a best-practice, executable cognitive prompt
  from validated outputs and distilled understanding, adhering to prompt
  engineering principles for clarity, precision, and effectiveness.
  Systematically employ the STRATEGIC KEYWORD LEXICON and AI-Cognitive Strong
  Terminology to ensure exact language that accurately reflects user intent,
  objectives, and core subject matter, culminating in clear, concise, and
  operationally effective instructions.
- **TASK P2.S2.A2.T2:** SYSTEMATICALLY INTEGRATE the extracted and consolidated
  information into the corresponding, designated sections within the
  `02_task_instructions_document.md` file.

## STEP P2.S3: TID VALIDATION & FINALIZATION

> **GUIDING PRINCIPLE (UNYIELDING QUALITY ASSURANCE):** Validation in this step
> is not a formality but a critical quality gate. The AI **MUST** adopt a
> zero-tolerance stance towards deviations from the exemplar or inaccuracies in
> content integration. The final TID **MUST** be a flawless reflection of both
> the Phase 1 understanding and the Phase 2 structural mandates, ensuring its
> complete readiness and reliability for Phase 3 execution.

### ACTIVITY P2.S3.A1: VALIDATION & EXEMPLAR CONFORMITY

- > **ENFORCEMENT DIRECTIVE:** The validation process **MUST** be meticulous and
  > systematic. Every structural element, section, heading, and formatting
  > convention of the generated `02_task_instructions_document.md` **MUST** be
  > compared against the `.github/examples/comi/step_02.md` exemplar. Any
  > discrepancy, however minor, **MUST** be identified and rectified.
  > Furthermore, the AI **MUST** verify that all consolidated information from
  > Phase 1 has been accurately and completely integrated into the correct TID
  > sections. Proceeding with a non-conformant or incomplete TID is strictly
  > prohibited.
- **TASK P2.S3.A1.T1:** CONDUCT A THOROUGH COMPARISON of the generated
  `02_task_instructions_document.md` against the
  `.github/examples/comi/step_02.md` template.
- **TASK P2.S3.A1.T2:** VERIFY EXACT STRUCTURAL, STYLISTIC, AND TERMINOLOGICAL
  ALIGNMENT with the template.
- **TASK P2.S3.A1.T3:** CONFIRM THE ACCURATE AND COMPLETE INTEGRATION of all
  relevant Phase 1 data into the TID's structure.
- **TASK P2.S3.A1.T4:** ENSURE THE TID IS FULLY CONTEXTUALIZED, self-contained,
  and directly actionable for Phase 3, confirming its readiness as a
  high-quality instructional document.

### ACTIVITY P2.S3.A2: FINALIZATION & OUTPUT DECLARATION

- **TASK P2.S3.A2.T1:** FORMALLY DESIGNATE the
  `02_task_instructions_document.md` as the final, validated output of COMI
  Phase 2.
- **TASK P2.S3.A2.T2:** DECLARE THE `02_task_instructions_document.md` complete
  and ready as the direct, immutable input for COMI Phase 3 operations.
