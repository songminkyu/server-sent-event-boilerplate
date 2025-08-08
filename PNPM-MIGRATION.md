# PNPM Migration Guide

This project has been migrated from npm to pnpm workspace structure for improved performance and better monorepo management.

## Installation

1. Install pnpm globally if you haven't already:
   ```bash
   npm install -g pnpm
   ```

2. Remove old node_modules (if exists):
   ```bash
   rm -rf node_modules
   rm -rf sse-backend/node_modules  
   rm -rf sse-frontend/node_modules
   ```

3. Install all dependencies:
   ```bash
   pnpm install
   ```

## Available Commands

### Root Level Commands (from project root)
```bash
# Install all dependencies
pnpm install

# Run both frontend and backend in development mode
pnpm run dev

# Build both projects
pnpm run build

# Run linting on all packages
pnpm run lint

# Run tests on all packages
pnpm run test

# Clean all dist and node_modules
pnpm run clean
```

### Package-specific Commands
```bash
# Backend only
pnpm run backend:dev
pnpm run backend:build

# Frontend only  
pnpm run frontend:dev
pnpm run frontend:build
```

### Working with Specific Packages
```bash
# Run commands in specific package
pnpm --filter sse-backend run start:dev
pnpm --filter sse-frontend run dev

# Add dependency to specific package
pnpm --filter sse-backend add express
pnpm --filter sse-frontend add axios

# Add dev dependency to specific package
pnpm --filter sse-backend add -D @types/express
```

## Key Changes Made

1. **Created pnpm workspace structure**:
   - `pnpm-workspace.yaml` - Defines workspace packages
   - Root `package.json` - Workspace orchestration scripts
   - `.npmrc` - pnpm configuration

2. **Updated package.json files**:
   - Added `packageManager` field
   - Updated engine requirements to Node 18+
   - Changed npm scripts to pnpm equivalents

3. **Removed npm artifacts**:
   - `package-lock.json` files

## Benefits of PNPM

- **Faster installations**: Shared dependency cache
- **Disk space efficient**: Hard-linked dependencies  
- **Better workspace support**: Native monorepo features
- **Strict dependency resolution**: Prevents phantom dependencies
- **Parallel execution**: Better performance for monorepo commands

## Troubleshooting

If you encounter issues:

1. Clear pnpm cache: `pnpm store prune`
2. Remove lock file: `rm pnpm-lock.yaml`
3. Reinstall: `pnpm install`

For peer dependency issues, check `.npmrc` configuration or use:
```bash
pnpm install --fix-peer-deps
```