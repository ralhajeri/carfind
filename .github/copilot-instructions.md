# Repository‑wide Copilot Instructions

## **Core Cognitive Directive: README is the Single Source of Truth**

Your primary instruction is to **always read and fully comprehend the `${WORKSPACE_ROOT}/README.md` file before any other action**. This file is the definitive source for all project-specific context, including:

1.  **Context Variables**: All key variables (`${DOCS_ROOT}`, `${CODEBASE_ROOT}`, `${TECHNICAL_STACK}`, `${LOCAL_ENVIRONMENT}`, `${DEV_TOOLS}`, etc.) are defined here. You must extract and use them.
2.  **Protocols**: All operational protocols (`${SCAN_PROTOCOL}`, `${RESEARCH_PROTOCOL}`, etc.) are defined here. You must follow them.
3.  **Project Standards**: All commands for dependency management, linting, testing, and quality assurance are defined here. You must adhere to them.

All subsequent instructions in this document are general principles that support this core directive. Your behavior must dynamically adapt based on the information you extract from the `README.md`.

---

## 1. General Principles of Operation

- **Adherence to README**: All suggestions, code modifications, and commands you run must strictly align with the standards and tools documented in the `README.md`.
- **Avoid Over-engineering**: Prioritize simplicity and practicality in all solutions, adhering to the YAGNI principle.
- **Validate with High Trust**: Ensure any external information or actions are based on reliable sources with a trust score of 95% or higher.

## 2. Markdown Formatting Standards

- Lint with **markdownlint** (`mdl ${DOCS_ROOT}` or `markdownlint-cli`).
- Auto‑format with **Prettier** (`prettier --write '${DOCS_ROOT}/**/*.md'`).
- Follow structured headings (`#`, `##`, `###`), sentence‑case titles, and blank lines around code fences.
- Use fenced blocks with language identifiers, e.g. `python`, `bash`.
- Keep lines ≤ 100 chars; prefer reference‑style links in long docs.

## 3. General Quality Gates

- **CI Adherence**: The CI pipeline, as configured in the repository, enforces the quality checks defined in the `README.md`. All your proposed changes must be able to pass these checks.
- **Documentation Sync**: Always keep the `README.md` and other documentation in `${DOCS_ROOT}` synchronized with any code changes you propose.

---

_These rules are **mandatory**. If a suggestion would violate any instruction, you must refuse or request clarification instead of producing non‑compliant output._

- Use fenced blocks with language identifiers, e.g. <code>`python</code>, <code>`bash</code>.
- Keep lines ≤ 100 chars; prefer reference‑style links in long docs.

## 4  General quality gates

1. Block commits if the quality checks defined in the `README.md` (e.g., for Black, Ruff, Mypy, pytest) fail.
2. Treat linter warnings as errors, using the commands specified in the `README.md`.
3. **CI (GitHub Actions)**: The CI pipeline must execute the installation, linting, formatting, and testing commands as defined in the project's `README.md`. A generic example is:

   ```bash
   # Step 1: Install dependencies using the project-specific command
   # e.g., poetry install --no-root OR npm ci

   # Step 2: Run linter, formatter, and tests using project-specific commands
   # e.g., ruff . && black --check . && pytest
   ```

4. Keep `${WORKSPACE_ROOT}/README.md` and docs synchronized with code changes.

---

_These rules are **mandatory**. If a suggestion would violate any instruction, Copilot must refuse or request clarification instead of producing non‑compliant output._
