---
meta-directives:
  - 'Purpose: Remove all custom AI service abstractions and return to native Vercel AI SDK patterns'
  - 'Audience: AI agent (Executor), development team'
  - 'Action: Execute destructive refactoring to eliminate non-native service layer'
  - 'Principle: Move from complex to simple. Use only native patterns.'
  - 'Framework: Destructive Refactoring - Remove Custom Abstractions'
---

# Task 01: Remove Custom Service Architecture

## Task Meta

- **Task ID:** 02_task_01_remove-service-architecture
- **Phase:** Phase 3.1 - Custom Service Architecture Removal
- **Estimated Duration:** 4-6 hours
- **Priority:** High (Foundational)
- **Dependencies:** None (starting point)
- **Risk Level:** Medium (destructive refactoring)

## 1. Task Overview

### **Objective:**

Remove all custom AI service layer files that create abstractions over the native Vercel AI SDK. This includes Semantic Kernel preparation code, custom factory patterns, and dependency injection containers.

### **Business Value:**

- Eliminates over-engineered abstractions that add complexity
- Returns codebase to maintainable, standard patterns
- Reduces potential bugs from custom service layer
- Aligns with official Vercel template standards

### **Success Criteria:**

- All custom service layer files completely removed
- Zero TypeScript compilation errors after removal
- No remaining references to deleted services
- Codebase prepared for native AI SDK implementation

## 2. Detailed Implementation

### 2.1 Files to Remove (Complete Deletion)

#### Service Layer Files

1. **`lib/services/semantic-kernel-service.ts`**
   - Microsoft Semantic Kernel placeholder implementation
   - Contains Phase 3 preparation code that's no longer needed
   - Remove completely - no migration needed

2. **`lib/services/ai-service-factory.ts`**
   - Custom factory pattern for AI service instantiation
   - Creates unnecessary abstraction over direct AI SDK usage
   - Remove completely - replace with direct provider usage

3. **`lib/services/base-ai-service.ts`**
   - Abstract base class for AI services
   - Provides common functionality that's handled by AI SDK natively
   - Remove completely - AI SDK provides this functionality

4. **`lib/services/openai-service.ts`**
   - Wrapper around native OpenAI SDK functionality
   - Duplicates capabilities already in @ai-sdk/openai
   - Remove completely - use direct AI SDK integration

5. **`lib/services/service-container.ts`**
   - Dependency injection container for service management
   - Over-engineering for simple AI chatbot application
   - Remove completely - not needed for native patterns

#### Type Definition Files

1. **`lib/types/semantic-kernel.ts`**
   - Interface definitions for Microsoft Semantic Kernel
   - Preparation code for functionality not being implemented
   - Remove completely - no SK integration planned

2. **`lib/types/ai-service.ts`**
   - Custom interface definitions that duplicate AI SDK types
   - Creates abstractions over well-designed AI SDK interfaces
   - Remove completely - use native AI SDK types

#### Integration Files

1. **`lib/integration/semantic-kernel-ready.ts`**
   - Preparation interfaces for Semantic Kernel integration
   - Phase 3 preparation code that's no longer needed
   - Remove completely - returning to native patterns only

### 2.2 Implementation Steps

#### Step 1: Analyze Dependencies

```bash
# Search for imports of files to be removed
grep -r "semantic-kernel-service" CarFind/
grep -r "ai-service-factory" CarFind/
grep -r "base-ai-service" CarFind/
grep -r "openai-service" CarFind/
grep -r "service-container" CarFind/
```

#### Step 2: Remove Service Layer Files

```bash
# Remove service architecture files
Remove-Item lib\services\semantic-kernel-service.ts
Remove-Item lib\services\ai-service-factory.ts
Remove-Item lib\services\base-ai-service.ts
Remove-Item lib\services\openai-service.ts
Remove-Item lib\services\service-container.ts
```

#### Step 3: Remove Type Definition Files

```bash
# Remove custom type definitions
Remove-Item lib\types\semantic-kernel.ts
Remove-Item lib\types\ai-service.ts
```

#### Step 4: Remove Integration Files

```bash
# Remove integration preparation files
Remove-Item lib\integration\semantic-kernel-ready.ts
```

#### Step 5: Remove Test Files for Deleted Services

```bash
# Find and remove test files for deleted services
Get-ChildItem -Path . -Recurse -Include "*test*" | Where-Object { 
  $_.Name -match "semantic-kernel|ai-service|openai-service|service-container" 
} | Remove-Item -Force
```

### 2.3 Post-Removal Validation

#### Verify Clean Removal

```bash
# Ensure files are completely removed
Test-Path lib\services\semantic-kernel-service.ts  # Should return False
Test-Path lib\services\ai-service-factory.ts       # Should return False
Test-Path lib\types\semantic-kernel.ts             # Should return False
```

#### Check for Broken Imports

```bash
# Verify no remaining imports of deleted files
Select-String -Path ".\**\*.ts" -Pattern "semantic-kernel-service|ai-service-factory|base-ai-service|openai-service|service-container"
```

#### TypeScript Compilation Check

```bash
# Verify TypeScript compiles after removal
npm run build
# Should complete without errors related to missing files
```

## 3. Risk Mitigation

### 3.1 Before Starting

```bash
# Create backup before destructive operations
git add -A
git commit -m "Pre-Task 01: Backup before service layer removal"
git tag "task01-pre-removal-backup"
```

### 3.2 Rollback Strategy

```bash
# If issues arise, restore from backup
git checkout task01-pre-removal-backup
```

### 3.3 Common Issues and Solutions

#### Issue: Import Errors After Removal

**Symptoms:** TypeScript errors about missing imports
**Solution:** Update importing files to use native AI SDK patterns (handled in subsequent tasks)

#### Issue: Runtime Errors

**Symptoms:** Application crashes due to missing services
**Solution:** Verify no remaining references and update API routes (Task 02 focus)

#### Issue: Test Failures

**Symptoms:** Tests fail due to missing service imports
**Solution:** Update or remove tests that depended on custom services

## 4. Quality Assurance

### 4.1 Validation Checklist

- [ ] All 8 target files successfully removed
- [ ] No remaining references to deleted files in codebase
- [ ] TypeScript compilation succeeds without errors
- [ ] Git history preserved with proper backup tags
- [ ] No test files remain that test deleted services

### 4.2 Success Indicators

- Clean `npm run build` execution
- Zero search results for deleted file names in codebase
- Reduced complexity in `lib/` directory structure
- Preparation complete for native AI SDK implementation

## 5. Next Steps

After successful completion of this task:

1. **Task 02:** Refactor API routes to use direct AI SDK patterns
2. **Task 03:** Simplify database operations
3. **Task 04:** Clean up dependencies and configuration
4. **Task 05:** Final integration testing

## 6. Implementation Notes

### 6.1 What Gets Preserved

- All UI components remain unchanged
- Database schema and core data remain intact
- Environment configuration structure preserved
- Basic utilities and helper functions kept

### 6.2 What Gets Removed

- All abstraction layers over AI SDK
- Custom service instantiation patterns
- Dependency injection framework
- Semantic Kernel preparation code
- Custom AI service interfaces

### 6.3 Performance Impact

- Positive: Reduced bundle size from removed abstractions
- Positive: Fewer function call layers improve response time
- Neutral: UI components unaffected during this task

---

**Task Completion Criteria:**
This task is complete when all 8 identified files are removed, TypeScript compilation succeeds, and no references to deleted services remain in the codebase. The application should be ready for direct AI SDK integration in subsequent tasks.
