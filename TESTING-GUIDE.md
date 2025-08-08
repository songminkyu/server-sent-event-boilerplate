# SSE Project Testing Guide

## 📋 Overview

This guide provides comprehensive testing instructions for the SSE (Server-Sent Events) backend and frontend project migrated to pnpm workspace structure.

## 🛠️ Prerequisites

1. **Node.js 18+** installed
2. **pnpm 8+** installed globally: `npm install -g pnpm`
3. **Terminal/Command Prompt** access

## 🚀 Quick Start Testing

### 1. Install Dependencies
```bash
cd D:\00_OpenCV_Project\Study_at_Australia\JavaScript\network\server-sent-event
pnpm install
```

### 2. Start Both Servers Simultaneously
```bash
# Start both backend and frontend in development mode
pnpm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173 (Vite default port)

## 🔍 Individual Server Testing

### Backend Testing (NestJS Server)

#### Start Backend Only
```bash
# Option 1: Using workspace command
pnpm run backend:dev

# Option 2: Using filter command
pnpm --filter nestjs-sse-boilerplate run dev

# Option 3: Navigate to backend directory
cd sse-backend
pnpm run dev
```

#### Backend Endpoints
- **Base URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **System Status**: http://localhost:3000/system/status

#### SSE Endpoints (Browser Testing)
Open these URLs in your browser to test SSE streams:

1. **Notifications Stream**: 
   ```
   http://localhost:3000/notifications/stream
   ```

2. **Real-time Updates Stream**: 
   ```
   http://localhost:3000/realtime/stream
   ```

3. **Chat Stream**: 
   ```
   http://localhost:3000/chat/stream
   ```

4. **System Status Stream**: 
   ```
   http://localhost:3000/system/status/stream
   ```

#### Backend Build Testing
```bash
pnpm run backend:build
```

### Frontend Testing (React + Vite)

#### Start Frontend Only
```bash
# Option 1: Using workspace command
pnpm run frontend:dev

# Option 2: Using filter command
pnpm --filter sse-frontend run dev

# Option 3: Navigate to frontend directory
cd sse-frontend
pnpm run dev
```

#### Frontend Access
- **Development URL**: http://localhost:5173
- **Hot Reload**: Automatic on file changes

#### Frontend Build Testing
```bash
pnpm run frontend:build
```

## 🔄 SSE Connection Testing

### Method 1: Integrated Testing (Recommended)

1. **Start both servers**:
   ```bash
   pnpm run dev
   ```

2. **Open frontend**: http://localhost:5173

3. **Test Authentication**:
   - Click "Login (Demo)" button
   - Verify connection status changes to "Connected"

4. **Test SSE Streams**:
   - **Notifications Tab**: Click "Send Test Notification"
   - **Real-time Tab**: Click "Send Test Update"
   - **Chat Tab**: Select room and send message
   - **System Tab**: Monitor system status updates

### Method 2: Manual Browser Testing

1. **Start backend**: `pnpm run backend:dev`

2. **Open SSE streams in browser**:
   ```
   http://localhost:3000/notifications/stream
   http://localhost:3000/realtime/stream
   http://localhost:3000/chat/stream
   http://localhost:3000/system/status/stream
   ```

3. **Send test data via API**:
   ```bash
   # Send notification
   curl -X POST http://localhost:3000/notifications/send \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","message":"Hello","type":"info"}'
   
   # Send real-time update
   curl -X POST http://localhost:3000/realtime/update \
     -H "Content-Type: application/json" \
     -d '{"entityType":"user","entityId":"123","action":"updated","data":{}}'
   
   # Send chat message
   curl -X POST http://localhost:3000/chat/send \
     -H "Content-Type: application/json" \
     -d '{"roomId":"general","message":"Hello World"}'
   ```

## 📊 PNPM Workspace Commands Testing

### Root Level Commands
```bash
# Install all dependencies
pnpm install

# Build all projects
pnpm run build

# Lint all projects
pnpm run lint

# Test all projects
pnpm run test

# Clean all projects
pnpm run clean

# Start both in development
pnpm run dev
```

### Package-Specific Commands
```bash
# Backend operations
pnpm run backend:dev
pnpm run backend:build

# Frontend operations
pnpm run frontend:dev
pnpm run frontend:build
```

### Filter Commands
```bash
# Backend filters
pnpm --filter nestjs-sse-boilerplate run start:dev
pnpm --filter nestjs-sse-boilerplate run build
pnpm --filter nestjs-sse-boilerplate add express

# Frontend filters
pnpm --filter sse-frontend run dev
pnpm --filter sse-frontend run build
pnpm --filter sse-frontend add axios
```

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts
- **Backend (3000)**: Change `PORT` in `sse-backend/src/main.ts`
- **Frontend (5173)**: Change port in `sse-frontend/vite.config.ts`

#### CORS Issues
- Backend automatically allows `localhost:3000`, `localhost:5173`
- Add custom origins in `sse-backend/src/main.ts`

#### Authentication Issues
- Demo token is automatically set in frontend
- Check browser localStorage for `sse-auth-token`

#### Connection Issues
- Verify backend is running on correct port
- Check browser Network tab for SSE connections
- Ensure no firewall blocking connections

### Debug Commands
```bash
# Check pnpm workspace structure
pnpm list --depth=0

# Check individual package dependencies
pnpm --filter nestjs-sse-boilerplate list
pnpm --filter sse-frontend list

# Force reinstall
pnpm install --force
```

## 📈 Performance Testing

### Backend Load Testing
```bash
# Install wrk (if available)
wrk -t12 -c400 -d30s http://localhost:3000/health

# Or use curl for simple testing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/system/status
```

### Frontend Performance
- Open Chrome DevTools > Lighthouse
- Run performance audit on http://localhost:5173
- Check Network tab for SSE connection efficiency

## ✅ Success Indicators

### Backend Success
- ✅ Server starts on port 3000
- ✅ Health endpoint responds
- ✅ SSE endpoints stream data
- ✅ CORS configured for frontend
- ✅ Build completes without errors

### Frontend Success
- ✅ Development server starts on port 5173
- ✅ App loads without console errors
- ✅ Authentication works (demo login)
- ✅ All SSE connections show "Connected"
- ✅ Real-time data flows between tabs
- ✅ Build completes without errors

### Integration Success
- ✅ Frontend connects to backend APIs
- ✅ SSE streams show real-time data
- ✅ Authentication persists across page refresh
- ✅ No CORS errors in browser console
- ✅ Both servers can run simultaneously

## 📝 Testing Checklist

- [ ] Dependencies installed with `pnpm install`
- [ ] Backend starts successfully
- [ ] Frontend starts successfully  
- [ ] Both servers run together with `pnpm run dev`
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:3000
- [ ] Authentication works (login/logout)
- [ ] All 4 SSE connections show "Connected"
- [ ] Send test notification works
- [ ] Send real-time update works
- [ ] Chat messaging works
- [ ] System status updates work
- [ ] Builds complete without errors
- [ ] No console errors in browser
- [ ] Hot reload works in development

## 🚀 Production Testing

```bash
# Build both projects
pnpm run build

# Start backend in production mode
cd sse-backend && pnpm run start:prod

# Serve frontend build (optional)
cd sse-frontend && pnpm run preview
```