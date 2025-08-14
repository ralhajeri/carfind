---
meta-directives:
  - 'Purpose: Clean up package dependencies and configuration to match Vercel template standards'
  - 'Audience: AI agent (Executor), development team'
  - 'Action: Remove unused dependencies and simplify configuration files'
  - 'Principle: Minimal dependencies. Match template package.json exactly.'
  - 'Framework: Dependency Cleanup and Configuration Simplification'
---

# Task 04: Package Dependencies and Configuration Cleanup

## Task Meta

- **Task ID:** 02_task_04_dependency-cleanup
- **Phase:** Phase 3.3 - Dependency and Configuration Cleanup
- **Estimated Duration:** 2-3 hours
- **Priority:** Medium (Cleanup and optimization)
- **Dependencies:** Task 01, 02, 03 (Architecture and API changes)
- **Risk Level:** Low (Configuration cleanup)

## 1. Task Overview

### **Objective:**

Clean up package.json dependencies and configuration files to match the official Vercel AI Chatbot template standards, removing packages that were used by the custom service layer and ensuring only necessary dependencies remain.

### **Business Value:**

- Reduced bundle size and faster build times
- Simplified dependency management
- Security improvements through fewer dependencies
- Better alignment with template maintenance cycles

### **Success Criteria:**

- Package.json contains only dependencies used by native template
- All unused packages removed
- Configuration files simplified to template standards
- Build and development processes work correctly

## 2. Current Dependencies Analysis

### 2.1 Dependencies to Review

Based on the current package.json, review these categories:

**Potentially Unnecessary:**

- Custom service layer dependencies
- Semantic Kernel related packages
- Over-engineered configuration packages
- Unused AI SDK packages

**Keep (Template Standard):**

- Core Next.js and React packages
- Vercel AI SDK packages
- shadcn/ui and Radix UI components
- Database ORM (Drizzle)
- Authentication (NextAuth)
- Basic utilities

## 3. Package Cleanup Strategy

### 3.1 Dependencies to Remove

Based on removed service architecture:

```json
{
  "dependencies": {
    // Remove if no longer used after service layer removal:
    // - Any packages only used by custom services
    // - Unused AI providers
    // - Complex configuration packages
    // - Semantic Kernel related dependencies
  }
}
```

### 3.2 Dependencies to Keep (Template Standard)

```json
{
  "dependencies": {
    "@ai-sdk/openai": "^2.0.9",
    "@ai-sdk/provider": "2.0.0-beta.1", 
    "@ai-sdk/react": "2.0.0-beta.6",
    "@radix-ui/react-*": "latest",
    "@vercel/analytics": "^1.3.1",
    "@vercel/postgres": "^0.10.0",
    "ai": "5.0.0-beta.6",
    "drizzle-orm": "^0.34.0",
    "next": "15.3.0-canary.31",
    "next-auth": "5.0.0-beta.25",
    "react": "19.0.0-rc-*",
    "react-dom": "19.0.0-rc-*",
    "zod": "^3.25.68"
  }
}
```

## 4. Implementation Steps

### 4.1 Step 1: Analyze Current Usage

```bash
# Analyze which packages are actually imported/used
npx depcheck
# This will show unused dependencies
```

### 4.2 Step 2: Remove Unused Dependencies

```bash
# Remove packages that were only used by removed services
npm uninstall package-name-1 package-name-2

# Examples (if not used elsewhere):
# npm uninstall @microsoft/semantic-kernel
# npm uninstall custom-config-package
```

### 4.3 Step 3: Update Package.json Metadata

```json
{
  "name": "carfind-ai-chatbot",
  "version": "1.0.0",
  "description": "CarFind AI-powered chatbot built with Next.js and Vercel AI SDK",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### 4.4 Step 4: Simplify Configuration Files

#### Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Clean up next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
```

## 5. Environment Variables Cleanup

### 5.1 Simplify .env.example

```bash
# Core AI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Database (if using Vercel Postgres)
POSTGRES_URL=your-postgres-url
POSTGRES_PRISMA_URL=your-postgres-prisma-url
POSTGRES_URL_NON_POOLING=your-postgres-non-pooling-url

# Authentication
AUTH_SECRET=your-auth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### 5.2 Remove Unused Environment Variables

Remove any environment variables that were only used by:

- Custom service layer
- Removed AI providers
- Semantic Kernel configuration
- Complex configuration systems

## 6. Build Configuration Cleanup

### 6.1 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

### 6.2 Remove Custom Build Steps

Remove any custom build steps that were:

- Service layer compilation
- Complex configuration generation
- Semantic Kernel setup scripts

## 7. Testing Configuration

### 7.1 Verify Clean Installation

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Verify no installation errors
npm run build
npm run dev
```

### 7.2 Dependency Security Audit

```bash
# Check for security vulnerabilities
npm audit

# Fix any issues
npm audit fix
```

## 8. File Structure Cleanup

### 8.1 Remove Configuration Directories

After Tasks 01-03, remove any directories that are no longer needed:

```bash
# Remove if empty or no longer used
rmdir lib/services     # Should be empty after Task 01
rmdir lib/config       # If custom configuration removed
rmdir lib/integration  # If SK integration files removed
```

### 8.2 Update .gitignore

Ensure .gitignore is clean and matches template standards:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

## 9. Documentation Updates

### 9.1 Update README.md

Update project README to reflect simplified architecture:

```markdown
# CarFind AI Chatbot

A modern AI-powered chatbot built with Next.js and the Vercel AI SDK.

## Features

- Real-time chat interface with OpenAI GPT-4
- Car search functionality
- Responsive design with shadcn/ui
- TypeScript support

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run development server: `npm run dev`

## Tech Stack

- Next.js 15
- Vercel AI SDK
- OpenAI GPT-4
- Drizzle ORM
- shadcn/ui
- TypeScript
```

## 10. Validation and Testing

### 10.1 Build Testing

```bash
# Test clean build
npm run build

# Verify no build errors
npm run start
```

### 10.2 Dependency Analysis

```bash
# Verify no unused dependencies remain
npx depcheck

# Check bundle size
npx next build --analyze
```

### 10.3 Functionality Testing

Test all core functionality:

- Chat interface works
- OpenAI integration functional
- Database operations work
- Authentication flows correctly

## 11. Success Criteria

This task is complete when:

- [ ] Package.json contains only necessary dependencies
- [ ] All unused packages removed
- [ ] Configuration files simplified to template standards
- [ ] Clean build and development processes
- [ ] No security vulnerabilities in dependencies
- [ ] Documentation updated to reflect changes
- [ ] All functionality still works correctly

---

**Cleanup Result:**
The project should now have a clean, minimal dependency footprint that matches the official Vercel AI Chatbot template, with significantly reduced complexity and improved maintainability.
