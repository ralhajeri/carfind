---
meta-directives:
  - 'Purpose: This template defines a single, actionable task derived from a parent plan.'
  - 'Audience: AI agent (Tasker) and development team.'
  - 'Action: Populate all sections to ensure clarity, context, and traceability.'
  - 'Principle: Adhere to DRY, KISS, and YAGNI. Avoid over-engineering.'
---
# Task: {{TASK_NAME}}

## Task Meta

- **Task ID:** {{TASK_ID}}
- **Task Name:** {{TASK_NAME}}
- **Phase:** {{PHASE_NUMBER}}
- **Parent Plan:** [{{NAME_OF_PARENT_PLAN}}](PATH_OF_PARENT_PLAN.md)
- **Date Created:** {{TODAY_DATE}}
- **Status:** {{STATUS}}

## 1. Overview

- **Description**:
  A one‑ or two‑sentence summary of what this task is about and its primary goal.

## 2. Objectives

- Bullet out the key, measurable goals you intend to achieve with this task.

## 3. Definition of Ready (DoR)

This checklist confirms that all prerequisites are met before starting implementation.

- [ ] All dependencies listed in the parent plan are available.
- [ ] The scope and objectives are clear and agreed upon.
- [ ] Necessary access (e.g., to repositories, APIs) has been granted.
- [ ] The parent plan has been reviewed and understood.

## 4. Current Framework Integration Points

### 4.1 Existing API Methods & Modules

- List and briefly describe the existing endpoints, service calls or modules you'll leverage.

### 4.2 Framework Dependencies

- List libraries, versions, or plugins that this task will rely on.

---

## 5. Testing Strategy

- **Unit Tests:** Describe the approach for unit testing new or modified components.
- **Integration Tests:** Describe how interactions with other components will be tested.
- **Manual Tests:** Outline any manual verification steps required.

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Task Objective | Implementation Artifact(s) (File Paths) | Test Case ID(s) |
| -------------------------- | -------------- | --------------------------------------- | --------------- |
| `REQ-001`                  | `Objective 1`  | `src/module/file.py`                    | `TEST-U-001`    |
| `REQ-00N`                  | `Objective 2`  | `src/module/other.py`                   | `TEST-I-005`    |

---

## 7. Implementation Plan

### 7.1 Design

- Brief description of the technical design or approach for this task.

### 7.2 Sub-Tasks

- [ ] **Sub-Task 1: {{SUBTASK_1_NAME}}**
  - **Description:** {{SUBTASK_1_DESCRIPTION}}

    ```typescript
    // File Path: {{FILE_PATH_1}}
    // Implementation for {{SUBTASK_1_NAME}}

    {{CODE_EXAMPLE_1}}
    ```

- [ ] **Sub-Task N: {{SUBTASK_N_NAME}}**
  - **Description:** {{SUBTASK_N_DESCRIPTION}}

    ```typescript
    // File Path: {{FILE_PATH_N}}
    // Implementation for {{SUBTASK_N_NAME}}

    {{CODE_EXAMPLE_N}}
    ```

## 8. Success Criteria & Definition of Done (DoD)

### 8.1 Success Criteria

- Define measurable outcomes that signal completion, for example:
  - All new code paths are covered by tests (Coverage >= 90%).
  - No new lint errors or rule violations are introduced.
  - Performance benchmarks are met.

### 8.2 Definition of Done Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] All tests specified in the testing strategy are passing.
- [ ] Code has been peer-reviewed and approved.
- [ ] RTM is fully populated and verified.
- [ ] Documentation (if any) is updated.
- [ ] The task meets all success criteria.

---

## 9. Risks & Mitigations

- **Risk**: Short description → **Mitigation**: Plan to address it
- **Risk**: … → **Mitigation**: …

---

## 10. Self-Assessment Checklist

- [ ] {{SELF_ASSESSMENT_CHECKLIST_ITEMS}}

---
