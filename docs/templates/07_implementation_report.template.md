---
meta-directives:
  - 'Purpose: This template documents the execution, validation, and outcomes of a development task.'
  - 'Audience: AI agent (Executor) and development team.'
  - 'Action: Populate all sections to provide a transparent record of the development lifecycle.'
  - 'Principle: Adhere to project standards for reporting and documentation.'
---
# Implementation Report: {{TASK_NAME}}

## Report Meta

- **Task ID:** {{TASK_ID}}
- **Task Name:** {{TASK_NAME}}
- **Author:** {{AUTHOR}}
- **Date:** {{TODAY_DATE}}
- **Status:** {{STATUS}}
- **Parent Plan:** [{{NAME_OF_PARENT_PLAN}}](PATH_OF_PARENT_PLAN.md)

## 1. Task Summary

- **Objective:** [Brief, high-level summary of the task's objective and purpose.]
- **Key Outcomes:** [List the primary results or artifacts produced.]

---

## 2. Implementation Details

### 2.1 Strategic Approach

- [Describe the plan and reasoning behind the implementation. What patterns were used?]

### 2.2 Code Changes

- [Provide a summary of file modifications (added, modified, deleted).]
<!--
Example:
**Added:**
- `src/new_module/new_file.py`

**Modified:**
- `src/existing_module/file.py`: Refactored function `X` to improve performance.

**Deleted:**
- `src/old_module/deprecated_file.py`
-->

---

## 3. Validation & Quality Assurance

### 3.1 Testing

- **Unit Tests:** [e.g., All X new unit tests passed. Code coverage increased by Y%.]
- **Integration Tests:** [e.g., Ran the full integration suite; all Z tests passed.]
- **Manual Tests:** [Outline any manual verification steps performed and their outcomes.]

### 3.2 Linter & Formatter Results

- [Confirm adherence to code quality standards, e.g., "All linter, formatter, and static analysis checks passed successfully."]

---

## 4. Requirements Traceability Matrix (RTM)

| Requirement ID (from Plan) | Implementation Artifact(s) (File Paths) | Test Case ID(s) | Status |
| -------------------------- | --------------------------------------- | --------------- | ------ |
| `REQ-001`                  | `src/module/file.py`                    | `TEST-U-001`    | Met    |
| `REQ-00N`                  | `src/module/other.py`                   | `TEST-I-005`    | Met    |

---

## 5. Architectural Decisions & Discoveries

- [Log of any significant architectural decisions, patterns applied, or important discoveries made during implementation.]
<!-- Example: "Chose to implement the Strategy pattern to handle different data sources, which will simplify adding new sources in the future." -->

---

## 6. Challenges & Resolutions

| Challenge | Resolution |
|-----------|------------|
| [Brief description of obstacle.] | [Steps taken to resolve it and the outcome.] |
| [Performance bottleneck in `X`.] | [Introduced caching, reducing latency by Y%.] |

---

## 7. Definition of Done (DoD) Checklist

- [ ] All sub-tasks in the implementation plan are complete.
- [ ] All new and existing tests are passing.
- [ ] Code has been peer-reviewed and approved.
- [ ] RTM is fully populated and verified.
- [ ] Documentation is updated to reflect changes.
- [ ] No new linter/formatter violations were introduced.

---

## 8. Dependencies & Next Steps

- **New Dependencies:** [List any new libraries or services introduced.]
- **Next Steps:** [Identify any follow-up tasks or prerequisites for future work.]
<!-- Example: "This task is a prerequisite for Task-005. No new external libraries were added." -->
