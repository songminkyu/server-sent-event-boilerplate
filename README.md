# 🚀 SSE Monorepo - Server-Sent Events Full-Stack Solution

[![Node.js](https://img.shields.io/badge/Node.js-18.0+-brightgreen.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0+-E0234E.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC.svg)](https://www.typescriptlang.org/)
[![PNPM](https://img.shields.io/badge/PNPM-9.0+-F69220.svg)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready **Server-Sent Events (SSE)** monorepo featuring a **NestJS backend** and **React frontend** with **TypeScript**, **PNPM workspace management**, and **comprehensive multi-language documentation**.

---

## 🌐 Multi-Language Documentation

Choose your preferred language for complete documentation:

- **🇺🇸 [English Documentation](./docs/en/)** - Complete guides, API reference, and tutorials
- **🇰🇷 [한국어 문서](./docs/ko/)** - 완전한 가이드, API 참조 및 튜토리얼  
- **🇯🇵 [日本語ドキュメント](./docs/ja/)** - 完全なガイド、APIリファレンス、チュートリアル

---

## 📋 Table of Contents

- [🎯 Key Features](#-key-features)
- [🏗️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🎯 Key Features

### 🔧 **Backend (NestJS)**
- ⚡ **Multiple SSE Endpoints**: Notifications, real-time updates, chat, system status
- 🔐 **Authentication System**: Token-based auth with role-based access control
- 🔄 **Connection Management**: Automatic cleanup, heartbeat monitoring, reconnection handling
- 🌐 **CORS Support**: Configurable for development and production environments
- 🛡️ **Type Safety**: Complete TypeScript implementation with strong typing
- 📊 **Connection Statistics**: Real-time monitoring of active connections
- ⚡ **Performance Optimized**: Efficient RxJS streams with proper resource management
- 🔧 **Production Ready**: Comprehensive error handling, logging, and graceful shutdown

### ⚛️ **Frontend (React + Vite)**
- 🎣 **useSSE Hook**: Reusable SSE connection management with TypeScript
- 🎨 **Real-time UI**: Interactive notifications, chat, and system monitoring interfaces
- 🔄 **Auto Reconnection**: Automatic retry logic with exponential backoff
- 📊 **Connection Status**: Real-time connection state and statistics display
- 📱 **Responsive Design**: Mobile-friendly UI with modern styling
- ⚡ **Fast Development**: Vite for lightning-fast hot module replacement
- 🛡️ **Type Safety**: Full TypeScript support with strict type checking

### 📦 **Monorepo (PNPM)**
- 🚀 **PNPM Workspace**: Efficient dependency management and disk usage
- ⚡ **Parallel Development**: Run both frontend and backend simultaneously
- 🔧 **Unified Scripts**: Single commands for building, testing, and linting
- 📚 **Multi-language Docs**: Comprehensive documentation in Korean, English, and Japanese

## 🏗️ Project Structure

```
server-sent-event/
├── docs/                           # 📚 Multi-language documentation
│   ├── ko/                         # 🇰🇷 Korean documentation
│   ├── en/                         # 🇺🇸 English documentation
│   ├── ja/                         # 🇯🇵 Japanese documentation
│   └── assets/                     # Documentation assets
├── sse-backend/                    # 🔧 NestJS SSE server
│   ├── src/
│   │   ├── controllers/            # SSE endpoint controllers
│   │   ├── services/               # Core SSE services
│   │   ├── guards/                 # Authentication guards
│   │   ├── types/                  # TypeScript type definitions
│   │   └── main.ts                 # Application entry point
│   ├── package.json                # Backend dependencies
│   └── ...config files             # TypeScript, ESLint, Jest configs
├── sse-frontend/                   # ⚛️ React + Vite client
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── hooks/                  # Custom SSE hooks
│   │   ├── services/               # API service layer
│   │   └── types/                  # TypeScript type definitions
│   ├── package.json                # Frontend dependencies
│   └── ...config files             # Vite, TypeScript, ESLint configs
├── package.json                    # 🏗️ Workspace root configuration
├── pnpm-workspace.yaml             # 📋 PNPM workspace definition
├── pnpm-lock.yaml                  # 🔒 Dependency lock file
├── TESTING-GUIDE.md                # 🧪 Comprehensive testing guide
├── PNPM-MIGRATION.md               # 📦 PNPM migration documentation
└── README.md                       # 📖 This file
```

## ⚡ Quick Start

### 📋 Prerequisites
- **Node.js 18.0+** ([Download](https://nodejs.org/))
- **PNPM 9.0+** (`npm install -g pnpm`)
- **Git** (for cloning)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### 🚀 Installation & Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd server-sent-event
   pnpm install
   ```

2. **Start both servers simultaneously**:
   ```bash
   pnpm run dev
   ```
   This starts:
   - **Backend**: http://localhost:3000 (NestJS SSE server)
   - **Frontend**: http://localhost:5173 (React + Vite client)

3. **Open your browser**:
   Navigate to http://localhost:5173 to see the SSE demo application.

### 🎯 Quick Test

1. Click **"Login (Demo)"** to authenticate with demo token
2. Verify all SSE connections show **"Connected"** status
3. Test each tab:
   - **Notifications**: Click "Send Test Notification"
   - **Real-time**: Click "Send Test Update"
   - **Chat**: Send messages in different rooms
   - **System**: Monitor system status updates

### 🔧 Individual Server Control

```bash
# Backend only
pnpm run backend:dev    # Development mode
pnpm run backend:build  # Production build

# Frontend only  
pnpm run frontend:dev   # Development mode
pnpm run frontend:build # Production build

# All packages
pnpm run build          # Build all packages
pnpm run test           # Test all packages
pnpm run lint           # Lint all packages
```

## 📖 Documentation

### 🌍 Multi-Language Support
- **🇺🇸 [English](./docs/en/)**: Complete documentation with API references, guides, and tutorials
- **🇰🇷 [한국어](./docs/ko/)**: 포괄적인 API 참조, 가이드 및 튜토리얼
- **🇯🇵 [日本語](./docs/ja/)**: APIリファレンス、ガイド、チュートリアルを含む完全なドキュメント

### 📚 Key Documentation
| Document | Description |
|----------|-------------|
| [TESTING-GUIDE.md](./TESTING-GUIDE.md) | Comprehensive testing instructions for all scenarios |
| [PNPM-MIGRATION.md](./PNPM-MIGRATION.md) | Detailed PNPM migration guide with troubleshooting |
| [docs/en/](./docs/en/) | Complete English documentation suite |
| [docs/ko/](./docs/ko/) | Complete Korean documentation suite |
| [docs/ja/](./docs/ja/) | Complete Japanese documentation suite |

## 🔧 Development

### 📋 Development Workflow

1. **Environment Setup**:
   ```bash
   # Install PNPM globally
   npm install -g pnpm
   
   # Clone and install
   git clone <repo-url>
   cd server-sent-event
   pnpm install
   ```

2. **Development Mode**:
   ```bash
   # Start both servers with hot reload
   pnpm run dev
   
   # Or start individually
   pnpm run backend:dev   # NestJS server
   pnpm run frontend:dev  # React + Vite client
   ```

3. **Code Quality**:
   ```bash
   # Lint all packages
   pnpm run lint
   
   # Type checking
   pnpm run type-check
   
   # Format code  
   pnpm run format
   ```

### 🎨 Frontend Development (React + Vite)

#### useSSE Hook Usage
```typescript
import { useSSE } from '../hooks/useSSE';

const MyComponent = () => {
  const { events, isConnected, connectionStats } = useSSE({
    endpoint: '/notifications/stream',
    token: 'your-auth-token',
    reconnect: true,
    reconnectInterval: 3000,
    onConnect: () => console.log('🔗 Connected to SSE'),
    onError: (error) => console.error('❌ SSE Error:', error),
    onMessage: (event) => console.log('📨 Received:', event.data)
  });

  return (
    <div>
      <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <div>Events received: {connectionStats.totalEvents}</div>
      {events.map(event => (
        <div key={event.id}>
          <strong>{event.type}:</strong> {JSON.stringify(event.data)}
        </div>
      ))}
    </div>
  );
};
```

#### Pure JavaScript Usage
```javascript
// Modern EventSource implementation
const createSSEConnection = (endpoint, token) => {
  const eventSource = new EventSource(`${endpoint}?token=${token}`);
  
  eventSource.addEventListener('open', () => {
    console.log('🔗 SSE Connection established');
  });
  
  eventSource.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('📨 Received message:', data);
  });
  
  eventSource.addEventListener('error', (error) => {
    console.error('❌ SSE Connection error:', error);
    // Implement reconnection logic here
  });
  
  return eventSource;
};

// Usage
const notifications = createSSEConnection('/notifications/stream', 'your-token');
```

### 🔧 Backend Development (NestJS)

#### Creating Custom SSE Endpoints
```typescript
// custom-events.controller.ts
import { Controller, Sse, Query } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('custom-events')
export class CustomEventsController {
  @Sse('metrics')
  metricsStream(@Query('interval') intervalMs: number = 5000): Observable<any> {
    return interval(intervalMs).pipe(
      map(() => ({
        data: {
          timestamp: new Date().toISOString(),
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 100,
          activeConnections: Math.floor(Math.random() * 1000)
        },
        type: 'metrics'
      }))
    );
  }
}
```

#### Authentication Integration
```typescript
// Enhanced auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SSEAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token || request.headers.authorization?.replace('Bearer ', '');
    
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      return false; // Will close SSE connection
    }
  }
}
```

## 🧪 Testing

### 🚀 Quick Testing
```bash
# Run all tests across workspace
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run E2E tests
pnpm run test:e2e
```

### 📋 Testing Checklist
For comprehensive testing instructions, see **[TESTING-GUIDE.md](./TESTING-GUIDE.md)**.

**Basic Tests**:
- [ ] ✅ Both servers start successfully
- [ ] ✅ Frontend loads without errors
- [ ] ✅ SSE connections establish properly
- [ ] ✅ Authentication works with demo token
- [ ] ✅ All four SSE endpoints stream data
- [ ] ✅ Real-time messaging functions correctly
- [ ] ✅ Builds complete without errors

### 🔍 Browser Testing
1. **Open Developer Tools** → Network tab
2. **Verify SSE connections** show as persistent EventSource requests
3. **Test authentication** by logging in/out
4. **Monitor real-time events** in each tab
5. **Check error handling** by stopping the backend

### 📊 API Testing Examples

#### Send Notification
```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "Hello from cURL!",
    "type": "info"
  }'
```

#### Send Real-time Update
```bash
curl -X POST http://localhost:3000/realtime/update \
  -H "Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "user",
    "entityId": "test-user",
    "action": "updated",
    "data": {"status": "active", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}
  }'
```

## 🚀 Deployment

### 🏗️ Development Deployment
```bash
# Build all packages
pnpm run build

# Verify builds
ls -la sse-backend/dist/
ls -la sse-frontend/dist/

# Start production servers
cd sse-backend && pnpm run start:prod
cd sse-frontend && pnpm run preview  # Optional: preview build
```

### 🐳 Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual images
docker build -t sse-backend ./sse-backend
docker build -t sse-frontend ./sse-frontend
```

### ☁️ Production Considerations

#### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
JWT_SECRET=your-production-jwt-secret

# Frontend (.env.production)
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

#### Load Balancer Setup (Nginx)
```nginx
# Configure for SSE support
upstream backend {
    server backend:3000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        
        # SSE specific settings
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        
        # Timeout settings
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
```

#### Production Checklist
- [ ] ✅ Environment variables configured
- [ ] ✅ CORS settings for production domains
- [ ] ✅ SSL/TLS certificates installed
- [ ] ✅ Load balancer configured for sticky sessions
- [ ] ✅ Health checks responding
- [ ] ✅ Monitoring and logging active
- [ ] ✅ Error tracking configured
- [ ] ✅ Database connections optimized
- [ ] ✅ CDN configured for static assets

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔧 Development Setup
1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/yourusername/server-sent-event.git`
3. **Install dependencies**: `pnpm install`
4. **Create a branch**: `git checkout -b feature/amazing-feature`
5. **Make changes** and commit: `git commit -m 'Add amazing feature'`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** on GitHub

### 📝 Contribution Guidelines

#### Code Standards
- **TypeScript**: Use strict TypeScript with proper typing
- **ESLint**: Follow configured linting rules (`pnpm run lint`)
- **Testing**: Add tests for new features (`pnpm run test`)
- **Documentation**: Update docs for API changes
- **Commit Messages**: Use conventional commit format

#### Areas for Contribution
- 🐛 **Bug fixes**: Fix issues and improve stability
- ✨ **New features**: Add new SSE endpoints or UI features
- 📚 **Documentation**: Improve guides and API documentation
- 🧪 **Testing**: Increase test coverage and add E2E tests
- 🌐 **Internationalization**: Add support for more languages
- ⚡ **Performance**: Optimize SSE connections and UI rendering
- 🔧 **DevOps**: Improve build processes and deployment scripts

#### Pull Request Process
1. **Ensure tests pass**: Run `pnpm run test` before submitting
2. **Update documentation**: Include relevant documentation updates
3. **Add changeset**: If applicable, add changeset for version bumping
4. **Small, focused PRs**: Keep changes focused and atomic
5. **Descriptive title**: Use clear, descriptive PR titles

### 🐛 Reporting Issues
When reporting bugs, please include:
- **Environment details**: OS, Node.js version, browser
- **Steps to reproduce**: Clear reproduction steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Full error messages and stack traces
- **Screenshots**: If applicable, add screenshots

### 💡 Feature Requests
For feature requests, please:
- **Search existing issues**: Check if feature already requested
- **Provide context**: Explain the use case and benefits
- **Consider implementation**: Suggest possible implementation approaches
- **Add examples**: Include code examples or mockups if applicable

### 📖 Documentation Contributions
- **Multi-language support**: Help translate documentation
- **Code examples**: Add more usage examples
- **Tutorials**: Create step-by-step tutorials
- **API docs**: Improve API reference documentation

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use**: Use in commercial projects
- ✅ **Modification**: Modify the source code
- ✅ **Distribution**: Distribute the software
- ✅ **Private use**: Use privately
- ❗ **Limitation**: No liability or warranty
- 📋 **Condition**: Include license and copyright notice

## 📞 Support & Community

### 🆘 Getting Help
- 📖 **Documentation**: Check [docs/](./docs/) for comprehensive guides
- 🧪 **Testing Guide**: See [TESTING-GUIDE.md](./TESTING-GUIDE.md) for testing help
- 📦 **PNPM Issues**: See [PNPM-MIGRATION.md](./PNPM-MIGRATION.md) for migration help
- 🐛 **Bug Reports**: Create an issue with detailed information
- 💬 **Discussions**: Join GitHub Discussions for questions

### 🌟 Show Your Support
If this project helped you, please consider:
- ⭐ **Star the repository** on GitHub
- 🐛 **Report bugs** and suggest improvements
- 📝 **Contribute code** or documentation
- 📢 **Share with others** who might find it useful

### 🏷️ Project Status
- ✅ **Active Development**: Regular updates and maintenance
- 🔧 **Production Ready**: Used in production environments
- 🧪 **Well Tested**: Comprehensive test coverage
- 📚 **Well Documented**: Multi-language documentation
- 🤝 **Community Driven**: Open to contributions

---

## 🙏 Acknowledgments

Special thanks to:
- **[NestJS](https://nestjs.com/)** - The progressive Node.js framework
- **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces  
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[PNPM](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **The open-source community** for continuous inspiration and contributions

---

**Built with ❤️ and ☕ for the developer community**

🚀 **Happy Coding!** 🚀