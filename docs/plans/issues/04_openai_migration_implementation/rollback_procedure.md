# OpenAI Migration Rollback Procedure

## Overview

This document provides step-by-step instructions for rolling back the OpenAI provider migration to restore the original xAI provider configuration in case of issues or failures.

## When to Use This Rollback

- OpenAI provider configuration fails to work correctly
- Critical functionality is broken after migration
- Performance issues that cannot be resolved quickly
- API connectivity problems with OpenAI
- Any blocking issues that prevent normal operation

## Prerequisites

- All backup files created during Task-02 (Backup Current Configuration)
- Git repository with pre-migration checkpoint
- Access to PowerShell terminal and project directory

## Rollback Steps

### Step 1: Navigate to Project Directory

```bash
cd c:\projects\carbot\06\CarFind
```

### Step 2: Stop Development Server

If the development server is running, stop it with `Ctrl+C`

### Step 3: Restore Provider Configuration

```bash
# Restore provider configuration from backup
Copy-Item lib\ai\providers.ts.backup lib\ai\providers.ts

# Restore any model configuration if exists
if (Test-Path lib\ai\models.test.ts.backup) {
    Copy-Item lib\ai\models.test.ts.backup lib\ai\models.test.ts
}
```

### Step 4: Restore Package Dependencies

```bash
# Restore package.json from backup
Copy-Item package.json.backup package.json

# Restore lock file
Copy-Item pnpm-lock.yaml.backup pnpm-lock.yaml

# Remove OpenAI provider
pnpm remove @ai-sdk/openai

# Reinstall xAI provider
pnpm add @ai-sdk/xai

# Reinstall all dependencies
pnpm install
```

### Step 5: Restore Environment Configuration

```bash
# If environment was modified, restore template
if (Test-Path .env.template.backup) {
    # Manually review and restore environment variables as needed
    Write-Host "Review .env.template.backup for environment restoration"
}
```

### Step 6: Git Rollback (Alternative Method)

```bash
# Alternative: Use git to rollback to pre-migration state
git checkout pre-openai-migration-backup
# or
git reset --hard pre-openai-migration
```

### Step 7: Validation

```bash
# Verify xAI dependency is restored
pnpm list @ai-sdk/xai

# Start development server to test
pnpm dev

# Navigate to http://localhost:3000 and verify functionality
```

## Verification Checklist

- [ ] xAI provider package is installed and listed in dependencies
- [ ] Provider configuration file restored to original state
- [ ] Development server starts without errors
- [ ] Chat interface loads and functions correctly
- [ ] xAI provider responds to chat messages
- [ ] All original functionality is restored

## Post-Rollback Actions

1. Document the reason for rollback
2. Investigate and resolve the issues that caused the rollback
3. Plan corrective actions before attempting migration again
4. Update migration plan if necessary based on lessons learned

## Emergency Contact

If rollback fails or additional issues occur:

1. Check git status and available commits
2. Verify backup file integrity
3. Consider manual restoration of specific files
4. Document all issues for troubleshooting

---

**Note:** This rollback procedure assumes all backup files were created correctly during the backup phase. Always verify backup integrity before beginning migration.
