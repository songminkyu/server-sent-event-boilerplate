# 🧪 SSE Monorepo Testing Guide

## 📋 Overview

This guide provides comprehensive testing instructions for the SSE (Server-Sent Events) monorepo project with NestJS backend and React frontend, using pnpm workspace structure for efficient development and testing workflows.

## 🛠️ Prerequisites

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **pnpm 9+** installed globally: `npm install -g pnpm`
3. **Terminal/Command Prompt** access
4. **Git** installed (for cloning and version control)
5. **Modern browser** (Chrome, Firefox, Safari, Edge) for SSE testing

## 🚀 Project Structure

```
server-sent-event/
├── docs/                    # 📚 Multi-language documentation
│   ├── ko/                  # 🇰🇷 Korean docs
│   ├── en/                  # 🇺🇸 English docs  
│   └── ja/                  # 🇯🇵 Japanese docs
├── sse-backend/             # 🔧 NestJS SSE server
│   ├── src/controllers/     # SSE endpoint controllers
│   ├── src/services/        # Core SSE services
│   ├── src/guards/          # Authentication guards
│   └── src/types/           # TypeScript definitions
├── sse-frontend/            # ⚛️ React + Vite client
│   ├── src/components/      # React components
│   ├── src/hooks/           # Custom SSE hooks
│   └── src/services/        # API services
├── package.json             # Workspace root configuration
├── pnpm-workspace.yaml      # PNPM workspace definition
└── pnpm-lock.yaml           # Dependency lock file
```

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

## 🚀 Advanced Testing

### Unit Testing

#### Backend Unit Tests (Jest)
```bash
# Run backend unit tests
pnpm --filter nestjs-sse-boilerplate run test

# Run tests in watch mode
pnpm --filter nestjs-sse-boilerplate run test:watch

# Run tests with coverage
pnpm --filter nestjs-sse-boilerplate run test:cov
```

#### Frontend Unit Tests (Vitest)
```bash
# Run frontend unit tests
pnpm --filter sse-frontend run test

# Run tests in UI mode
pnpm --filter sse-frontend run test:ui

# Run tests with coverage
pnpm --filter sse-frontend run test:coverage
```

### Integration Testing

#### End-to-End SSE Testing
```bash
# Start both servers for E2E testing
pnpm run dev

# In another terminal, run integration tests
pnpm run test:e2e
```

### Browser Compatibility Testing

Test SSE functionality across different browsers:

1. **Chrome** (recommended for development)
2. **Firefox** (good SSE support)  
3. **Safari** (WebKit SSE implementation)
4. **Edge** (Chromium-based, similar to Chrome)

### Mobile Testing

Test responsive design and mobile SSE support:

1. Use Chrome DevTools device emulation
2. Test on actual mobile devices
3. Verify touch interactions work properly
4. Check mobile network conditions

## 🧪 Test Automation Scripts

### Custom Test Scripts
```bash
# Full test suite (add to package.json)
pnpm run test:full    # Runs all tests across workspace

# Lint and format check
pnpm run check        # Runs linting and type checking

# Build verification
pnpm run verify       # Builds and tests production builds
```

## 🔍 Monitoring & Debugging

### SSE Connection Monitoring
```javascript
// Browser console monitoring script
const monitorSSE = (url, token) => {
  const eventSource = new EventSource(`${url}?token=${token}`);
  
  eventSource.onopen = () => {
    console.log(`✅ Connected to ${url}`);
  };
  
  eventSource.onmessage = (event) => {
    console.log(`📨 Message from ${url}:`, JSON.parse(event.data));
  };
  
  eventSource.onerror = (error) => {
    console.error(`❌ Error on ${url}:`, error);
  };
  
  return eventSource;
};

// Monitor all SSE endpoints
const token = 'dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=';
const notifications = monitorSSE('/notifications/stream', token);
const realtime = monitorSSE('/realtime/stream', token);
const chat = monitorSSE('/chat/stream', token);
const system = monitorSSE('/system/status/stream');
```

### Backend Debugging
```bash
# Debug mode with inspect
pnpm --filter nestjs-sse-boilerplate run start:debug

# Enable verbose logging
NODE_ENV=development DEBUG=* pnpm run backend:dev
```

### Frontend Debugging
```bash
# Start with source maps
pnpm --filter sse-frontend run dev

# Build with debugging info
pnpm --filter sse-frontend run build --mode development
```

## 🚀 Production Testing

### Production Build Testing
```bash
# Build both projects
pnpm run build

# Verify build artifacts exist
ls -la sse-backend/dist/
ls -la sse-frontend/dist/

# Start backend in production mode
cd sse-backend && pnpm run start:prod

# Serve frontend build (optional)
cd sse-frontend && pnpm run preview
```

### Production Environment Checklist
- [ ] Environment variables configured correctly
- [ ] CORS settings for production domains
- [ ] Authentication system properly configured
- [ ] SSL/TLS certificates installed
- [ ] Load balancer configured for sticky sessions
- [ ] Health checks responding correctly
- [ ] Monitoring and logging systems active
- [ ] Error handling and graceful degradation working
- [ ] Performance benchmarks met
- [ ] Security headers configured

### Docker Testing
```bash
# Build Docker images
docker build -t sse-backend ./sse-backend
docker build -t sse-frontend ./sse-frontend

# Run with Docker Compose
docker-compose up -d

# Verify containers are running
docker ps

# Check logs
docker logs sse-backend
docker logs sse-frontend
```

## 📋 Documentation Testing

### Documentation Verification
```bash
# Verify all documentation links work
find docs/ -name "*.md" -exec echo "Checking {}" \;

# Test code examples in documentation
# (Manual process - copy/paste code examples and verify they work)
```

### Multi-language Documentation Testing
1. **Korean documentation**: Navigate to `docs/ko/` and verify translations
2. **English documentation**: Navigate to `docs/en/` and verify completeness  
3. **Japanese documentation**: Navigate to `docs/ja/` and verify accuracy

## 🎯 Performance Benchmarks

### Expected Performance Metrics
- **Backend startup**: < 3 seconds
- **Frontend build**: < 30 seconds  
- **SSE connection establishment**: < 200ms
- **Message delivery latency**: < 50ms
- **Memory usage (backend)**: < 150MB idle
- **Memory usage (frontend)**: < 100MB
- **CPU usage**: < 10% idle, < 50% under load

### Benchmark Testing Tools
```bash
# Install performance testing tools
npm install -g autocannon clinic

# Backend performance testing
autocannon -c 100 -d 30 http://localhost:3000/health

# Memory and CPU profiling
clinic doctor -- node sse-backend/dist/main.js
```

## ⚠️ Known Issues and Workarounds

### Windows-Specific Issues
- **Long path names**: Use `pnpm config set shamefully-hoist true` if needed
- **Symlink permissions**: Run as administrator if symlink creation fails
- **Port conflicts**: Check for other services using ports 3000/5173

### macOS/Linux-Specific Issues  
- **Permission issues**: Use `sudo` only if absolutely necessary
- **Node version conflicts**: Use nvm to manage Node.js versions
- **Process cleanup**: Use `killall node` to clean up hanging processes

## 📞 Support & Help

If you encounter issues during testing:

1. **Check the troubleshooting section** in this guide
2. **Review logs** for error messages and stack traces
3. **Consult documentation** in `docs/` folder for detailed guides
4. **Create an issue** with detailed error information and steps to reproduce
5. **Join discussions** for community support and tips

---

**Happy Testing! 🎉** 

For more detailed information, see the complete documentation in the `docs/` folder with guides available in Korean, English, and Japanese.