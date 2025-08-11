---
meta-directives:
  - 'Purpose: `${APP_NAME}` is an intelligent business automation platform that streamlines development workflows and business processes through advanced AI orchestration and semantic understanding.'
  - 'Audience: AI agents and development team.'
  - 'Action: Use this guide to understand project variables, locate templates, and follow documentation standards.'
  - 'Principle: Maintain consistency across all project documentation by adhering to these guidelines.'
---
# **`${APP_NAME}`**: CarFind

## 1. Overview

`${APP_NAME}` is an intelligent business automation platform that streamlines development workflows and business processes through advanced AI orchestration and semantic understanding. Built on Microsoft's Semantic Kernel framework, it creates sophisticated AI-driven workflows that automate complex business operations across all business scopes.

**Important Clarification**: `${APP_NAME}` is **not** an appointment scheduling application. The name reflects the platform's ability to "appoint" or assign intelligent automation solutions to business processes. It is a comprehensive business automation platform designed to enhance productivity through intelligent workflow automation.

### MVP Focus: Development Workflow Automation via MCP Servers

The current MVP phase concentrates on development workflow automation using MCP (Model Context Protocol) servers, which will serve as the foundation for broader business automation capabilities. This initial implementation focuses on:

**Core Development Automation Capabilities:**

1. **Request Enhancement Engine**: Intelligently analyzes user requests to fill information gaps and extract comprehensive technical requirements
2. **Development Flow Automation**: Streamlines coding workflows, testing processes, and deployment pipelines through MCP server integration
3. **Intelligent Code Assistance**: Provides automated code generation, optimization, and development guidance
4. **Process Orchestration**: Coordinates complex development tasks across multiple tools and systems using Semantic Kernel processes

### Key Features

- **MCP Server Integration**: Primary focus on Model Context Protocol servers for extensible development automation capabilities
- **Development Workflow Enhancement**: Specialized tools for automating software development processes, code generation, and testing workflows
- **Request Intelligence**: Advanced AI comprehension that analyzes and enhances user requests to extract complete technical requirements
- **Intelligent Process Orchestration**: Automated workflow management with AI-powered decision making for development tasks
- **Human-in-the-Loop Integration**: Seamless collaboration between AI automation and human oversight for critical development decisions
- **Semantic Understanding**: Advanced AI comprehension of development requirements, code context, and technical specifications
- **Extensible Architecture**: Modular design that starts with development automation and extends to broader business automation
- **Real-time Development Support**: Dynamic process execution with immediate response capabilities for development workflows

## 2. Context Variables

### **Core Context Variables**

#### **Application Variables**

- **APP_NAME**: `PROJECT_NAME`
- **APP_NAME_SNAKE**: `project_name`
- **APP_NAME_SPACED**: `Project Name`
- **PROJECT_PACKAGE**:
  - **BACKEND_PACKAGE** `${CODEBASE_ROOT}/pyproject.toml`
  - **FRONTEND_PACKAGE** `${CODEBASE_ROOT}/frontend/package.json`

#### **Directory & Path Variables**

- **WORKSPACE_ROOT**: `./`
- **CODEBASE_ROOT**: `./${APP_NAME}`
- **DOCS_ROOT**: `./docs`
- **PLANS_DIR**: `./docs/plans`
- **TEMPLATES_PATH**: `./docs/templates`
- **EXAMPLES_PATH**: `${PLANS_DIR}/examples`
- **QUESTIONNAIRE_PATH**: `${PLANS_DIR}/questionnaire`
- **RESEARCHES_PATH**: `${PLANS_DIR}/researches`
- **PRODUCT_BRIEFS_PATH**: `${EXAMPLES_PATH}/product_briefs`
- **EXAMPLE_COMPONENT_PATH**: `${EXAMPLES_PATH}/NN_<component>/01_components`
- **RELATION_PATH**: `${EXAMPLE_COMPONENT_PATH}/NN_<component>/02_relations`
- **IMPLEMENTATION_REPORTS_DIR**: `${PLANS_DIR}/NN_<plan>/00_implementation_reports`

#### **Template Variables**

- **IDEA_ENHANCEMENT_TEMPLATE**: `${TEMPLATES_PATH}/00_idea_enhancement.template.md`
- **RESEARCH_BRIEF_TEMPLATE**: `${TEMPLATES_PATH}/01_research_brief.template.md`
- **COMPONENT_TEMPLATE**: `${TEMPLATES_PATH}/02_component_template.template.md`
- **RELATION_TEMPLATE**: `${TEMPLATES_PATH}/03_relation_template.template.md`
- **README_TEMPLATE**: `${TEMPLATES_PATH}/04_readme.template.md`
- **PLAN_TEMPLATE**: `${TEMPLATES_PATH}/05_plan-overview.template.md`
- **TASK_TEMPLATE**: `${TEMPLATES_PATH}/06_task-definition.template.md`
- **IMPLEMENTATION_REPORT_TEMPLATE**: `${TEMPLATES_PATH}/07_implementation_report.template.md`
- **PRODUCT_BRIEF_TEMPLATE**: `${TEMPLATES_PATH}/08_product_brief.template.md`

#### **Chatmode Variables**

- **IDEA_ENHANCER_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/00_idea_enhancer.chatmode.md`
- **DEEP_SEARCH_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/deep_search.chatmode.md`
- **EXAMPLERS_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/examplers.chatmode.md`
- **EXECUTOR_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/executor.chatmode.md`
- **PLANNER_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/planner.chatmode.md`
- **QUESTIONNAIRE_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/Questionnaire.chatmode.md`
- **SEMANTIC_KERNEL_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/semantic-kernel.chatmode.md`
- **TASKER_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/tasker.chatmode.md`
- **COE_INTERVIEW_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/coe_interview.chatmode.md`
- **COE_PRODUCT_BRIEF_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/coe_product_brief.chatmode.md`
- **COMI_QUESTIONNAIRE_CHATMODE**: `${WORKSPACE_ROOT}/.github/chatmodes/comi_questionnaire.chatmode.md`

#### **Environment & Tooling**

- **LOCAL_ENVIRONMENT**: `Windows 11, VSCode, GitHub Copilot Agent mode`
- **DEV_TOOLS**:
  - **BACKEND**: `Python 3.12+, Poetry, Git, MCP Servers`
  - **AI/LLM**: `Microsoft Semantic Kernel Framework (Python), AI SDK by Vercel`
- **FRONTEND**:
  - **WEB**: `Next.js 14+ (Vercel AI Chatbot template), TypeScript`
  - **UI**: `Tailwind CSS, shadcn/ui`
- **PLATFORM**:
  - **DEPLOY**: `Vercel`

#### **Protocol Variables**

- **CONTEXT_CONTINUITY_PROTOCOL**: "MANDATORY: (1) Read `${PLANS_DIR}/NN_<plan>/01_overview.md`, (2) Read all previous sequential tasks, (3) Identify integration points"
- **RESEARCH_PROTOCOL**: "Focus on current trends and best practices for development automation and MCP servers. Prioritize practical solutions with confidence score of 95% or higher, focusing on official documentation."
- **SCAN_PROTOCOL**: "Inspect `${PROJECT_PACKAGE}` and key directories (e.g., components/, lib/, app/, processes/, plugins/, etc.)"

## 3. Project Structure

The `${APP_NAME}` project is organized as follows:

```markdown
`${WORKSPACE_ROOT}`/
├── docs/                    # Project documentation
```

**Key Directories:**

- **`docs/`**: Technical documentation and architecture guides

## 4. System Architecture

`${APP_NAME}` is built on Microsoft's Semantic Kernel Process Framework, providing robust workflow orchestration specifically designed for development automation with extensibility to broader business processes.

### Core Components

- **Process Framework**: Orchestrates development workflows and business processes as sequential, event-driven phases
- **KernelFunctions**: Individual executable tasks that perform specific development operations (code generation, testing, deployment)
- **Steps**: Containers that group related functions with event-driven communication for development workflow coordination
- **MCP Server Integration**: Primary integration layer with Model Context Protocol servers for development tool automation
- **Plugin System**: AI-callable functions that enable automatic execution of development and business tasks
- **Human Integration**: Interactive callbacks for user input and decision points in critical development and business workflow stages

### Current Architecture

```text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Servers   │────│  Semantic Kernel │────│  Development    │
│ & AI Services   │    │  Process Engine  │    │   Workflows     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │   `${APP_NAME}` Core   │
                    │  Development Automation │
                    │    Platform (MVP)       │
                    └─────────────────────────┘
```

## 5. Technical Stack

- **Core Framework**: Python 3.12+
- **AI & Process Engine**: Microsoft Semantic Kernel (Python)
- **Development Integration**: Model Context Protocol (MCP) Servers
- **Agentic System**: Semantic Kernel Process Framework with specialized development agents
- **Frontend**: Vercel AI SDK with Next.js (Development-focused chatbot interface)
- **Development & Deployment**: Python Poetry, Git, Vercel (frontend hosting)

## 6. Documentation

### Technical References

- [Semantic Kernel Architecture Summary](SK_Architecture_Summary.md) - Comprehensive technical reference
- [Process Framework Guide](docs/) - Implementation patterns and best practices

### Integration Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs) - Official Vercel AI SDK guide
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Server-side API implementation
- [Semantic Kernel Process Framework](https://learn.microsoft.com/en-us/semantic-kernel/concepts/process-framework/) - Microsoft's official SK process documentation

### Implementation Guides

- [Building Chatbots with Vercel AI](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) - UI implementation patterns
- [Streaming Responses](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#streaming) - Real-time data streaming techniques
- [Tool Integration](https://sdk.vercel.ai/docs/ai-sdk-core/tools) - Adding custom tools to AI workflows

### Architecture References

- [Serverless Functions on Vercel](https://vercel.com/docs/functions) - Deployment and optimization
- [Next.js App Router](https://nextjs.org/docs/app) - Modern React framework architecture
- [Microsoft Semantic Kernel GitHub](https://github.com/microsoft/semantic-kernel) - Source code and examples
