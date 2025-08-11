---
meta-directives:
  - 'Purpose: This document serves as the central index and guide for all project templates.'
  - 'Audience: AI agents and development team.'
  - 'Action: Use this guide to understand project variables, locate templates, and follow documentation standards.'
  - 'Principle: Maintain consistency across all project documentation by adhering to these guidelines.'
---
# Templates Index

## 1. Overview

{{OVERVIEW}}
<!-- Example: This document outlines the standardized templates used across the project to ensure consistency and quality in documentation and planning. -->

## 2. Context Variables

This section defines the global variables used across all templates for consistency.

### **Core Context Variables**

#### **Directory & Path Variables**

- **WORKSPACE_ROOT**: `./`
- **CODEBASE_ROOT**: `./{{PROJECT_NAME}}`
- **DOCS_ROOT**: `./docs`
- **PLANS_DIR**: `./docs/plans`
- **TEMPLATES_PATH**: `./docs/templates`
- **RESERCHES_PATH**: `${PLANS_DIR}/researches`
- **EXAMPLES_PATH**: `${PLANS_DIR}/examples`
- **EXAMPLE_COMPONENT_PATH**: `${EXAMPLES_PATH}/NN_<component>/01_components`
- **RELATION_PATH**: `${EXAMPLE_COMPONENT_PATH}/NN_<component>/02_relations`
- **IMPLEMENTATION_REPORTS_DIR**: `${PLANS_DIR}/NN_<plan>/00_implementation_reports`
- **LOCAL_ENVIRONMENT**: `Windows 11, VSCode, GitHub Copilot Agent mode`
- **DEV_TOOLS**: `Python 3.12+, Poetry, Git`

#### **Application Variables**

- **APP_NAME**: `{{PROJECT_NAME}}`
- **APP_NAME_SNAKE**: `{{APP_NAME_SNAKE}}`
- **APP_NAME_SPACED**: `{{APP_NAME_SPACED}}`
- **PROJECT_PACKAGE**: `${CODEBASE_ROOT/pyproject.toml}`

#### **Template File Paths**

- **RESEARCH_TEMPLATE**: `${TEMPLATES_PATH}/01_research_brief.template.md`
- **COMPONENT_TEMPLATE**: `${TEMPLATES_PATH}/02_component.template.md`
- **RELATION_TEMPLATE**: `${TEMPLATES_PATH}/03_relation.template.md`
- **EXAMPLE_TEMPLATE**: `${EXAMPLES_PATH}/04_readme.template.md`
- **PLAN_TEMPLATE**: `${TEMPLATES_PATH}/05_plan-overview.template.md`
- **TASK_TEMPLATE**: `${TEMPLATES_PATH}/06_task-definition.template.md`
- **IMPLEMENTATION_REPORT_TEMPLATE**: `${TEMPLATES_PATH}/07_implementation_report.template.md`

### **Protocol Variables**

- **CONTEXT_CONTINUITY_PROTOCOL**: "MANDATORY: (1) Read `${PLANS_DIR}/NN_<plan>/01_overview.md`, (2) Read all previous sequential tasks, (3) Identify integration points"
- **RESEARCH_PROTOCOL**: for current trends and best practices. I will not over-engineer solutions and will focus on practical, with confidence score of 95% or higher fucos on offecial documents.
- **SCAN_PROTOCOL**: "Inspect `${PROJECT_PACKAGE}` and key directories (e.g., components/, lib/, app/, etc.)"

## 3. Template Usage

### 3.1 Usage Guidelines

{{USAGE_GUIDELINES}}
<!-- Example: To use a template, copy it to the appropriate directory (e.g., a new plan in docs/plans) and populate the placeholders. -->

### 3.2 Available Templates

- A list of available component examples can be found in [`$EXAMPLE_COMPONENT_PATH`](../examples/NN_<component>/01_components).
- A list of available relation examples can be found in [`$RELATION_PATH`](../examples/NN_<component>/02_relations).

### 3.3 Generic Template Structure

Each template generally follows this standardized format:

- **Brief**: {{BRIEF}}
- **Snippets**: {{SNIPPETS}}
- **Usage**: {{USAGE}}
- **See also**: {{SEE_ALSO}}

## 4. System Architecture

This section describes the overall architecture of the target application.

- **Project Structure Diagram:**

  ```markdown
  {{PROJECT_STRUCTURE}}
  ```

- **Core Components:**
  {{CORE_COMPONENTS}}

- **External Integrations:**
  {{EXTERNAL_INTEGRATIONS}}

- **Component Relations:**
  {{COMPONENT_RELATIONS}}
  <!-- Example: List the available relation documents in `$RELATION_PATH` -->

## 5. Technical Stack

This section outlines the technologies used in the project.

- **Core Framework:**
  {{CORE_FRAMEWORK}}
- **AI & Machine Learning:**
  {{AI_MACHINE_LEARNING}}
- **Data & Storage:**
  {{DATA_STORAGE}}
- **Integration & APIs:**
  {{INTEGRATION_APIS}}
- **Development & Deployment:**
  {{DEVELOPMENT_DEPLOYMENT}}
