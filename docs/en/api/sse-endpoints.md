# 🔌 SSE Endpoints API Reference

## Overview

The SSE backend provides multiple Server-Sent Events endpoints for different types of real-time data streams.

## Authentication

Most endpoints require authentication via token parameter or Authorization header:

```javascript
// Query parameter (recommended for SSE)
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

// Authorization header (for HTTP requests)
fetch('/api/endpoint', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

**Demo Token**: `dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=`

## SSE Endpoints

### Notifications Stream
**Endpoint**: `GET /notifications/stream`  
**Authentication**: Required  
**Parameters**: `token` (string)

Streams push notifications to authenticated users.

```javascript
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  console.log('Notification:', data);
  // { id, title, message, type, timestamp, userId }
});
```

### Real-time Updates Stream  
**Endpoint**: `GET /realtime/stream`  
**Authentication**: Required  
**Parameters**: `token` (string)

Streams real-time entity updates and system events.

```javascript
const eventSource = new EventSource('/realtime/stream?token=YOUR_TOKEN');

eventSource.addEventListener('update', (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
  // { entityType, entityId, action, data, timestamp }
});
```

### Chat Stream
**Endpoint**: `GET /chat/stream`  
**Authentication**: Required  
**Parameters**: `token` (string), `room` (string, optional)

Streams chat messages for specified rooms or all accessible rooms.

```javascript
const eventSource = new EventSource('/chat/stream?token=YOUR_TOKEN&room=general');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Chat:', data);
  // { id, roomId, userId, username, message, timestamp }
});
```

### System Status Stream
**Endpoint**: `GET /system/status/stream`  
**Authentication**: Not required  
**Parameters**: None

Streams system status updates and health information.

```javascript
const eventSource = new EventSource('/system/status/stream');

eventSource.addEventListener('status', (event) => {
  const data = JSON.parse(event.data);
  console.log('System:', data);
  // { status, uptime, connections, memory, cpu, timestamp }
});
```

## HTTP API Endpoints

### Send Notification
**Endpoint**: `POST /notifications/send`  
**Authentication**: Required  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "Hello World!",
    "type": "info"
  }'
```

**Response**: `{ success: true, id: string }`

### Send Real-time Update
**Endpoint**: `POST /realtime/update`  
**Authentication**: Required  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/realtime/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "user",
    "entityId": "user123",
    "action": "updated",
    "data": {"status": "online"}
  }'
```

### Send Chat Message
**Endpoint**: `POST /chat/send`  
**Authentication**: Required  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "general",
    "message": "Hello everyone!"
  }'
```

### Get System Status
**Endpoint**: `GET /system/status`  
**Authentication**: Not required

```bash
curl http://localhost:3000/system/status
```

**Response**: 
```json
{
  "status": "healthy",
  "uptime": 3600,
  "connections": 42,
  "memory": "125MB",
  "cpu": "15%"
}
```

## Event Types

### Notification Events
- `notification`: Standard user notification
- `system-notification`: System-wide announcement
- `error-notification`: Error or warning message

### Real-time Events
- `update`: Entity update event
- `create`: Entity creation event  
- `delete`: Entity deletion event
- `status-change`: Status change event

### Chat Events
- `message`: Standard chat message
- `user-joined`: User joined room
- `user-left`: User left room
- `typing`: User typing indicator

### System Events
- `status`: System status update
- `heartbeat`: Connection heartbeat
- `maintenance`: Maintenance mode notification

## Error Handling

SSE connections may close due to:
- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Insufficient permissions
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

Implement reconnection logic with exponential backoff:

```javascript
let reconnectDelay = 1000;
const maxDelay = 30000;

function connectSSE() {
  const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');
  
  eventSource.onopen = () => {
    reconnectDelay = 1000; // Reset delay on successful connection
  };
  
  eventSource.onerror = () => {
    eventSource.close();
    setTimeout(connectSSE, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, maxDelay);
  };
}
```

## Connection Limits

- **Maximum connections per user**: 5
- **Global connection limit**: 1000
- **Idle timeout**: 5 minutes
- **Heartbeat interval**: 30 seconds

---

For more details, see the [Backend Development Guide](../guides/development.md).