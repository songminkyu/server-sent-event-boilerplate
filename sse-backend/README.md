# NestJS SSE Boilerplate

A production-ready **Server-Sent Events (SSE)** implementation built with **NestJS**, featuring authentication, multiple specialized endpoints, connection management, and comprehensive error handling.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Server-Sent Events](https://img.shields.io/badge/SSE-Real%20Time-brightgreen?style=for-the-badge)

## 🚀 Features

- **🔐 Authentication & Authorization**: JWT-style token authentication with role-based access
- **📡 Multiple SSE Endpoints**: Specialized endpoints for different data types
  - Notifications
  - Real-time updates  
  - Chat messages
  - System status
- **🔄 Connection Management**: Automatic cleanup, heartbeat monitoring, and reconnection handling
- **🌐 CORS Support**: Configurable CORS for frontend integration
- **📊 Connection Statistics**: Real-time monitoring of active connections
- **⚡ Performance Optimized**: Efficient RxJS streams with proper resource management
- **🛡️ Production Ready**: Comprehensive error handling, logging, and graceful shutdown
- **📚 Well Documented**: Extensive examples and integration guides

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Frontend Integration](#frontend-integration)
- [Configuration](#configuration)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)

## ⚡ Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nestjs-sse-boilerplate

# Install dependencies
npm install

# Start development server
npm run start:dev
```

The server will start on `http://localhost:3000`. Visit this URL to see the interactive documentation and test interface.

### Test SSE Connection

```javascript
// Quick test in browser console
const eventSource = new EventSource('/notifications/stream?token=dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=');
eventSource.onmessage = (event) => {
    console.log('SSE Event:', JSON.parse(event.data));
};
```

## 🛠 API Endpoints

### Notifications
- `GET /notifications/stream` - SSE stream for notifications
- `POST /notifications/send` - Send targeted notification
- `POST /notifications/broadcast` - Broadcast to all subscribers

### Real-time Updates
- `GET /realtime/stream` - SSE stream for real-time updates
- `POST /realtime/update` - Send real-time update
- `POST /realtime/entity/:entity/create` - Entity creation event
- `POST /realtime/entity/:entity/update` - Entity update event
- `POST /realtime/entity/:entity/delete` - Entity deletion event

### Chat
- `GET /chat/stream` - SSE stream for chat messages
- `GET /chat/room/:roomId/stream` - Room-specific chat stream
- `POST /chat/message` - Send chat message
- `POST /chat/room/:roomId/join` - Join chat room
- `POST /chat/room/:roomId/leave` - Leave chat room

### System
- `GET /system/status/stream` - SSE stream for system status
- `POST /system/status/update` - Update system status
- `GET /system/stats` - Connection statistics
- `GET /system/connections` - Active connections (admin only)
- `GET /system/health` - Health check
- `GET /system/heartbeat` - Heartbeat stream

### General
- `GET /` - Interactive documentation
- `GET /api` - API information and examples
- `GET /health` - Application health check

## 🔐 Authentication

The boilerplate uses a simple token-based authentication system. In production, replace this with your preferred authentication method (JWT, OAuth, etc.).

### Token Format
```
Base64(userId:username:email:roles)
```

### Test Token
```javascript
// User: test123, testuser, test@example.com, roles: user,admin
const testToken = 'dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=';
```

### Usage
```javascript
// In Authorization header
headers: {
    'Authorization': `Bearer ${token}`
}

// Or as query parameter (useful for SSE)
const eventSource = new EventSource(`/notifications/stream?token=${token}`);
```

### Authentication Guards

- **AuthGuard**: Requires valid authentication
- **OptionalAuthGuard**: Authentication optional, provides user context if available

## 🌐 Frontend Integration

The boilerplate works with any frontend framework. See detailed examples in [`src/examples/frontend-integration.md`](src/examples/frontend-integration.md).

### React Example
```jsx
const useSSE = (endpoint, token) => {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const eventSource = new EventSource(`${endpoint}?token=${token}`);
        
        eventSource.addEventListener('notification', (event) => {
            setData(JSON.parse(event.data));
        });
        
        return () => eventSource.close();
    }, [endpoint, token]);
    
    return data;
};
```

### Vue Example
```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const notifications = ref([]);
let eventSource = null;

onMounted(() => {
    eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');
    eventSource.addEventListener('notification', (event) => {
        notifications.value.push(JSON.parse(event.data));
    });
});

onUnmounted(() => {
    eventSource?.close();
});
</script>
```

## ⚙️ Configuration

### Environment Variables
```bash
# .env
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:4200
CORS_CREDENTIALS=true

# Authentication (implement your own)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
```

### CORS Configuration
Update `src/main.ts` to configure CORS for your domains:

```typescript
cors: {
    origin: [
        'http://localhost:3000',
        'https://yourdomain.com',
        /^https:\/\/.*\.yourdomain\.com$/
    ],
    credentials: true
}
```

## 🔧 Development

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build

# Production mode
npm run start:prod

# Run tests
npm test

# Test coverage
npm run test:cov

# Lint and format
npm run lint
npm run format
```

### Project Structure
```
src/
├── controllers/          # SSE endpoint controllers
│   ├── notifications.controller.ts
│   ├── realtime.controller.ts
│   ├── chat.controller.ts
│   └── system.controller.ts
├── services/
│   └── sse.service.ts    # Core SSE service
├── guards/
│   └── auth.guard.ts     # Authentication guards
├── types/
│   └── sse.types.ts      # TypeScript interfaces
├── examples/
│   └── frontend-integration.md
├── app.controller.ts     # Main controller with documentation
├── app.module.ts         # Application module
└── main.ts              # Application bootstrap
```

## 🚀 Production Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  sse-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

### Environment Considerations

1. **Load Balancing**: Use sticky sessions for SSE connections
2. **Reverse Proxy**: Configure nginx/Apache for SSE support
3. **Monitoring**: Implement health checks and connection monitoring
4. **Scaling**: Consider Redis for multi-instance deployments
5. **Security**: Replace simple token auth with proper JWT/OAuth

### Nginx Configuration
```nginx
location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # SSE specific
    proxy_buffering off;
    proxy_cache off;
    chunked_transfer_encoding off;
}
```

## 🏗 Architecture

### SSE Service Architecture
```
┌─────────────────────┐
│   SSE Controllers   │  ← Handle HTTP requests & SSE connections
├─────────────────────┤
│    SSE Service      │  ← Core business logic & connection management
├─────────────────────┤
│  Connection Store   │  ← Active connection tracking
├─────────────────────┤
│   Event Streams     │  ← RxJS subjects for different event types
└─────────────────────┘
```

### Key Components

- **SSEService**: Core service managing connections and event distribution
- **Controllers**: Specialized endpoints for different event types
- **Guards**: Authentication and authorization middleware
- **Types**: TypeScript interfaces for type safety
- **Connection Management**: Automatic cleanup and health monitoring

### Event Flow
1. Client establishes SSE connection
2. Connection registered in SSEService
3. Events published to specific streams
4. SSEService routes events to subscribed connections
5. Automatic cleanup on disconnect

## 🧪 Testing

### Manual Testing

1. Start the server: `npm run start:dev`
2. Open `http://localhost:3000` for interactive testing
3. Use the provided test token for authentication
4. Test different endpoints and event types

### API Testing with curl

```bash
# Send notification
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"Hello World","type":"info"}'

# Get connection stats
curl http://localhost:3000/system/stats
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add appropriate error handling
- Update documentation for new features
- Write tests for new functionality
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](your-repo-url/issues)
- 📖 Documentation: [Wiki](your-repo-url/wiki)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [RxJS](https://rxjs.dev/) - Reactive Extensions for JavaScript
- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)

---

**Built with ❤️ using NestJS and TypeScript**
