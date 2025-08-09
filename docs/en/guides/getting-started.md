# 🚀 Getting Started with SSE Monorepo

## Overview

Welcome to the SSE (Server-Sent Events) Monorepo! This guide will help you get up and running with the full-stack SSE solution in just a few minutes.

## Quick Setup

### 1. Prerequisites
- **Node.js 18.0+** ([Download](https://nodejs.org/))
- **PNPM 9.0+** (`npm install -g pnpm`)
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd server-sent-event

# Install all dependencies
pnpm install
```

### 3. Start Development Servers
```bash
# Start both backend and frontend
pnpm run dev
```

This command starts:
- **Backend**: http://localhost:3000 (NestJS SSE server)
- **Frontend**: http://localhost:5173 (React + Vite client)

### 4. Test the Application
1. Open http://localhost:5173 in your browser
2. Click "Login (Demo)" to authenticate
3. Verify all SSE connections show "Connected"
4. Test real-time features in each tab

## Project Structure

```
server-sent-event/
├── docs/                    # Multi-language documentation
├── sse-backend/             # NestJS SSE server
├── sse-frontend/            # React + Vite client
├── package.json             # Workspace configuration
└── pnpm-workspace.yaml      # PNPM workspace definition
```

## Key Features

### Backend (NestJS)
- Multiple SSE endpoints for different data types
- Token-based authentication with role-based access
- Automatic connection cleanup and monitoring
- Production-ready error handling and logging

### Frontend (React + Vite)
- Custom useSSE hook for easy integration
- Real-time UI components
- Automatic reconnection handling
- Connection statistics and monitoring

## Next Steps

- 📖 **Read the [API Reference](../api/backend.md)** for detailed endpoint documentation
- 🧪 **Follow the [Testing Guide](./testing.md)** to run comprehensive tests
- 🏗️ **Check the [Development Guide](./development.md)** for advanced workflows
- 🚀 **Review the [Deployment Guide](../deployment/production.md)** for production setup

## Common Commands

```bash
# Development
pnpm run dev              # Start both servers
pnpm run backend:dev      # Backend only
pnpm run frontend:dev     # Frontend only

# Building
pnpm run build            # Build all packages
pnpm run backend:build    # Build backend
pnpm run frontend:build   # Build frontend

# Testing
pnpm run test             # Run all tests
pnpm run lint             # Lint all code
```

## Need Help?

- 📚 Check the comprehensive documentation in `docs/`
- 🧪 See the [Testing Guide](../../TESTING-GUIDE.md) for detailed testing instructions
- 📦 Read the [PNPM Migration Guide](../../PNPM-MIGRATION.md) for workspace setup
- 🐛 Create an issue for bugs or feature requests

---

**Ready to build something amazing with Server-Sent Events? Let's get started! 🚀**