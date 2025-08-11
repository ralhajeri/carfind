# Semantic Kernel Architecture Summary

> **Professional reference guide covering Semantic Kernel Process Framework fundamentals, architecture patterns, and component relationships.**

---

## 1. Semantic Kernel Hierarchy Overview

Semantic Kernel follows a clear hierarchical structure from smallest to largest components:

**Complete Architecture:**

```text
Master Process
├── Process (Phase/Workflow)
│   ├── Step (Task Container)
│   │   ├── KernelFunction (Individual Task)
│   │   └── KernelFunction (Individual Task)
│   └── Step (Task Container)
└── Plugin (AI-Callable Functions)
    ├── KernelFunction (Individual Task)
    └── Process Invocation Function
```

**Recommended Python Structure**:

```markdown
├── appoint_factory/ # Main Python package
│ ├── processes/ # Business process definitions
│ │ └── business_automation_process.py
│ ├── steps/ # Reusable workflow steps
│ │ └── workflow_steps/
│ ├── functions/ # Kernel function definitions  
│ │ └── automation_functions/
│ ├── plugins/ # Plugin implementations
│ │ └── business_automation/
│ ├── services/ # Service layer implementations
│ │ └── infrastructure/
│ ├── agents/ # AI agent implementations
│ │ └── specialized/
│ └── models/ # Domain models and contracts
│ └── entities/
├── tests/ # Test packages
│ └── unit/
├── docs/ # Documentation
│ └── architecture/
└── scripts/ # Utility scripts
└── deployment/
```

**Component Hierarchy (Smallest to Largest):**

1. **KernelFunction** - Individual Task (atomic work unit)
2. **Step** - Container for KernelFunctions/Tasks
3. **Process** - Container for Steps (equivalent to "Phase")
4. **Master Process** - Container for multiple Processes
5. **Plugin** - AI-accessible function containers

---

## 2. Core Component Definitions

### KernelFunction (Individual Task)

The smallest executable unit in Semantic Kernel. Each KernelFunction represents a single, atomic task.

```python
@kernel_function(description="Validates input data")
async def validate_data(self, data: str) -> str:
    return validated_data  # Single atomic operation
```

### Step (Task Container)

A container that holds one or more related KernelFunctions. **Important:** Step ≠ Task.

```python
class ValidationStep(KernelProcessStepBase):  # ← Step (Container)
    @kernel_function  # ← Task 1
    async def validate_email(self, email: str) -> bool: ...

    @kernel_function  # ← Task 2
    async def validate_phone(self, phone: str) -> bool: ...
```

**Key Facts:**

- Steps can contain multiple KernelFunctions (tasks)
- Steps communicate through event-driven messaging, not direct invocation
- Keep logically related tasks together within a step

### Process (Phase/Workflow)

A collection of steps arranged to achieve a specific business goal. In Semantic Kernel terminology, "Process" is equivalent to what you might call a "Phase."

```text
Process (Your "Phase")
├── Step (Container for Tasks)
│   └── KernelFunction (Individual Task - actual work)
└── Step (Another Container)
    ├── KernelFunction (Task 1)
    └── KernelFunction (Task 2)
```

### Plugin (AI-Callable Functions)

Named containers for functions that can be exposed to AI applications for automatic function calling.

```text
Plugin (Container)
├── KernelFunction 1
├── KernelFunction 2
└── KernelFunction 3
```

---

## 3. Development Strategy and Reusability

**Core Principle:** Develop each task (KernelFunction) as standalone, then connect and reuse.

**Microsoft Documentation:** _"Reusability & Flexibility: Steps and processes can be reused across different applications, promoting modularity and scalability"_

**Implementation Benefits:**

- Tasks are modular with defined inputs/outputs
- Same task can be reused across multiple phases/processes
- Promotes code reusability and maintainability

**Architecture Pattern:**

```text
Master Process
├── Process A (Phase 1) → Steps 1-3 (each containing tasks)
├── Process B (Phase 2) → Steps 4-5 (each containing tasks)
└── Process C (Phase 3) → Steps 6-7 (each containing tasks)
```

---

## 4. Framework Selection Guide

### Process Framework vs Other Options

For sequential workflow development, use the **Process Framework** (NOT Planner, NOT Agent Framework).

**Process Framework Components:**

- **Process Framework** = Sequential workflow orchestration
- **KernelFunction** = Individual executable task
- **Step** = Container for related KernelFunctions

**Implementation Example:**

```python
class ValidateDataStep(KernelProcessStepBase):
    @kernel_function(description="Validates input data")
    async def validate_data(self, data: str) -> str:
        return validated_data
```

---

## 5. Human-in-the-Loop Integration

The Process Framework supports human interaction through two primary mechanisms:

### External Events

Processes can pause and wait for user input, then resume when data is provided.

**Implementation Pattern:**

- Process executes until it requires human input
- Process goes idle, waiting for external event
- User provides input through external event
- Process resumes execution with user data

### Interactive Callbacks

Direct user interaction capabilities in agent orchestrations for real-time communication.

---

## 6. Multi-Phase and Nested Workflows

**Capability:** Processes can contain other processes, enabling complex hierarchical workflows.

**Microsoft Fact:** _"A Process can be invoked within other processes, promoting modularity and reusability"_

**Nested Architecture Example:**

```text
Master Process
├── Process A (Phase 1) → Steps 1-3 (each containing tasks)
├── Process B (Phase 2) → Steps 4-5 (each containing tasks)
└── Process C (Phase 3) → Steps 6-7 (each containing tasks)
```

**Benefits:**

- **Modularity** - Each phase is independently testable
- **Reusability** - Phases can be reused in different workflows
- **Maintainability** - Clear separation of concerns
- **Scalability** - Each process can scale independently

---

## 7. Step Communication Patterns

**Important:** Steps cannot directly invoke other steps. Communication occurs through event-driven messaging managed by the Process Framework.

**Correct Event-Driven Pattern:**

```python
# Event emission (managed by Process Framework)
step1.on_function_result("task").send_event_to(step2)
```

**Architecture Flow:**

```text
Step A → Event → Process Framework → Event → Step B
```

**Why Event-Driven:**

- Prevents recursive invocation patterns
- Maintains clean separation of concerns
- Enables process orchestration and monitoring

---

## 8. Plugin vs Process Framework Comparison

These are different frameworks serving different purposes:

| Aspect         | Plugin                | Step (Process Framework)  |
| -------------- | --------------------- | ------------------------- |
| **Framework**  | Core Semantic Kernel  | Process Framework         |
| **Purpose**    | AI function calling   | Workflow orchestration    |
| **Invocation** | AI-driven (automatic) | Event-driven (structured) |
| **Context**    | Chat/AI interactions  | Business processes        |
| **Base Class** | Plugin class          | `KernelProcessStepBase`   |

**Key Distinction:**

- **Plugins** expose functions to AI for automatic calling
- **Steps** orchestrate workflows in structured business processes

---

## 9. Plugin-Process Integration

Plugins can invoke and manage Process Framework workflows, making complex processes accessible to AI.

**Implementation Pattern:**

```python
class WorkflowPlugin:
    @kernel_function(description="Execute workflow")
    async def run_workflow(self, input: str, kernel: Kernel) -> str:
        # Plugin function invokes Process Framework
        async with await start(process=self.process, kernel=kernel,
                             initial_event=KernelProcessEvent(id="Start", data=input)) as ctx:
            return await ctx.get_state()
```

**Architecture Flow:**

```text
AI Request → Plugin Function → Process Framework → Steps → Result
```

**Use Cases:**

- AI can trigger complex multi-step workflows through simple function calls
- Complex business processes become accessible to AI agents
- Enables AI-driven process automation

---

## 10. Key Architectural Principles

**Design Principles:**

1. **Modularity** - All components are reusable across different contexts
2. **Event-Driven** - Communication through framework orchestration, not direct calls
3. **Hierarchical** - Clear separation of concerns at each level
4. **AI-Accessible** - Plugins expose functionality to AI agents
5. **Human-Interactive** - Built-in support for human-in-the-loop workflows

**Best Practices:**

- Keep steps focused on single responsibilities
- Group logically related tasks within steps
- Use event-driven communication between components
- Leverage reusability at all levels of the hierarchy

# 11. System Requirements

- **Python 3.12 or higher** - Required by Semantic Kernel framework
- **Poetry latest** - Modern Python dependency management
- **Windows PowerShell** - Development environment shell
- **Git** - Version control and dependency management

---

_Document based on Microsoft Semantic Kernel official documentation and verified implementation patterns._
