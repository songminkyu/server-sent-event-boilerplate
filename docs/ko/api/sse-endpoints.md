# 🔌 SSE 엔드포인트 API 참조

## 개요

SSE 백엔드는 다양한 유형의 실시간 데이터 스트림을 위한 여러 Server-Sent Events 엔드포인트를 제공합니다.

## 인증

대부분의 엔드포인트는 토큰 매개변수 또는 Authorization 헤더를 통한 인증이 필요합니다:

```javascript
// 쿼리 매개변수 (SSE에 권장)
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

// Authorization 헤더 (HTTP 요청용)
fetch('/api/endpoint', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

**데모 토큰**: `dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=`

## SSE 엔드포인트

### 알림 스트림
**엔드포인트**: `GET /notifications/stream`  
**인증**: 필요  
**매개변수**: `token` (문자열)

인증된 사용자에게 푸시 알림을 스트리밍합니다.

```javascript
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  console.log('알림:', data);
  // { id, title, message, type, timestamp, userId }
});
```

### 실시간 업데이트 스트림
**엔드포인트**: `GET /realtime/stream`  
**인증**: 필요  
**매개변수**: `token` (문자열)

실시간 엔티티 업데이트와 시스템 이벤트를 스트리밍합니다.

```javascript
const eventSource = new EventSource('/realtime/stream?token=YOUR_TOKEN');

eventSource.addEventListener('update', (event) => {
  const data = JSON.parse(event.data);
  console.log('업데이트:', data);
  // { entityType, entityId, action, data, timestamp }
});
```

### 채팅 스트림
**엔드포인트**: `GET /chat/stream`  
**인증**: 필요  
**매개변수**: `token` (문자열), `room` (문자열, 선택사항)

지정된 방 또는 접근 가능한 모든 방의 채팅 메시지를 스트리밍합니다.

```javascript
const eventSource = new EventSource('/chat/stream?token=YOUR_TOKEN&room=general');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('채팅:', data);
  // { id, roomId, userId, username, message, timestamp }
});
```

### 시스템 상태 스트림
**엔드포인트**: `GET /system/status/stream`  
**인증**: 불필요  
**매개변수**: 없음

시스템 상태 업데이트와 건강 상태 정보를 스트리밍합니다.

```javascript
const eventSource = new EventSource('/system/status/stream');

eventSource.addEventListener('status', (event) => {
  const data = JSON.parse(event.data);
  console.log('시스템:', data);
  // { status, uptime, connections, memory, cpu, timestamp }
});
```

## HTTP API 엔드포인트

### 알림 전송
**엔드포인트**: `POST /notifications/send`  
**인증**: 필요  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 알림",
    "message": "안녕하세요!",
    "type": "info"
  }'
```

### 실시간 업데이트 전송
**엔드포인트**: `POST /realtime/update`  
**인증**: 필요  
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

### 채팅 메시지 전송
**엔드포인트**: `POST /chat/send`  
**인증**: 필요  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "general",
    "message": "안녕하세요 여러분!"
  }'
```

## 이벤트 타입

### 알림 이벤트
- `notification`: 표준 사용자 알림
- `system-notification`: 시스템 전체 공지
- `error-notification`: 오류 또는 경고 메시지

### 실시간 이벤트
- `update`: 엔티티 업데이트 이벤트
- `create`: 엔티티 생성 이벤트
- `delete`: 엔티티 삭제 이벤트
- `status-change`: 상태 변경 이벤트

### 채팅 이벤트
- `message`: 표준 채팅 메시지
- `user-joined`: 사용자 방 입장
- `user-left`: 사용자 방 퇴장
- `typing`: 사용자 타이핑 표시

### 시스템 이벤트
- `status`: 시스템 상태 업데이트
- `heartbeat`: 연결 하트비트
- `maintenance`: 유지보수 모드 알림

## 에러 처리

SSE 연결은 다음 이유로 닫힐 수 있습니다:
- **401 Unauthorized**: 잘못되거나 만료된 토큰
- **403 Forbidden**: 권한 부족
- **429 Too Many Requests**: 속도 제한 초과
- **500 Internal Server Error**: 서버 오류

지수 백오프로 재연결 로직 구현:

```javascript
let reconnectDelay = 1000;
const maxDelay = 30000;

function connectSSE() {
  const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');
  
  eventSource.onopen = () => {
    reconnectDelay = 1000; // 성공 연결 시 지연 시간 재설정
  };
  
  eventSource.onerror = () => {
    eventSource.close();
    setTimeout(connectSSE, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, maxDelay);
  };
}
```

## 연결 제한

- **사용자당 최대 연결 수**: 5개
- **전역 연결 제한**: 1000개
- **유휴 타임아웃**: 5분
- **하트비트 간격**: 30초

---

자세한 내용은 [백엔드 개발 가이드](../guides/development.md)를 참조하세요.