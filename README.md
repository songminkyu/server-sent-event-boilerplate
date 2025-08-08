# NestJS Server-Sent Events (SSE) 보일러플레이트

NestJS 기반의 Server-Sent Events (SSE) 실시간 통신 보일러플레이트입니다. 백엔드와 프론트엔드가 포함되어 있어 바로 사용 가능합니다.

## 📚 목차

- [프로젝트 구조](#프로젝트-구조)
- [기능 소개](#기능-소개)
- [설치 및 실행](#설치-및-실행)
- [사용법](#사용법)
- [API 문서](#api-문서)
- [예제](#예제)
- [커스터마이징](#커스터마이징)
- [트러블슈팅](#트러블슈팅)

## 🏗️ 프로젝트 구조

```
server-sent-event/
├── sse-backend/          # NestJS 백엔드 서버
│   ├── src/
│   │   ├── controllers/  # SSE 컨트롤러들
│   │   ├── services/     # SSE 서비스
│   │   ├── guards/       # 인증 가드
│   │   ├── types/        # TypeScript 타입 정의
│   │   └── main.ts       # 애플리케이션 엔트리포인트
│   └── package.json
├── sse-frontend/         # React 프론트엔드 클라이언트
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── hooks/        # SSE 커스텀 훅
│   │   ├── services/     # API 서비스
│   │   └── types/        # TypeScript 타입 정의
│   └── package.json
└── README.md
```

## ✨ 기능 소개

### 백엔드 (NestJS)
- **다중 SSE 엔드포인트**: 알림, 실시간 업데이트, 채팅, 시스템 상태
- **인증 시스템**: 토큰 기반 인증 및 선택적 인증
- **연결 관리**: 자동 정리 및 헬스체크
- **CORS 설정**: 개발/프로덕션 환경 대응
- **타입 안전성**: TypeScript로 구현된 강력한 타입 시스템
- **에러 처리**: 포괄적인 에러 핸들링 및 로깅

### 프론트엔드 (React)
- **useSSE 커스텀 훅**: 재사용 가능한 SSE 연결 관리
- **실시간 UI**: 알림, 채팅, 시스템 모니터링 인터페이스
- **자동 재연결**: 연결 끊김시 자동 재시도 로직
- **연결 상태 표시**: 실시간 연결 상태 및 통계
- **반응형 디자인**: 모바일 친화적 UI
- **타입 안전성**: TypeScript 완전 지원

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js (16.0 이상)
- npm 또는 yarn

### 1. 백엔드 설치 및 실행

```bash
# 백엔드 디렉토리로 이동
cd sse-backend

# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev

# 또는 프로덕션 빌드 후 실행
npm run build
npm run start:prod
```

백엔드 서버가 `http://localhost:3000`에서 실행됩니다.

### 2. 프론트엔드 설치 및 실행

```bash
# 프론트엔드 디렉토리로 이동 (새 터미널)
cd sse-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버가 `http://localhost:5173` (Vite 기본 포트)에서 실행됩니다.

### 3. 브라우저에서 확인

`http://localhost:5173`를 열어 SSE 데모 애플리케이션을 확인하세요.

## 📱 사용법

### 기본 사용법

1. **로그인**: \"Login (Demo)\" 버튼을 클릭하여 데모 토큰으로 로그인
2. **연결 확인**: 상단의 연결 상태 패널에서 SSE 연결 상태 확인
3. **탭 선택**: Notifications, Real-time, Chat, System 탭을 선택하여 각 기능 테스트
4. **데이터 전송**: 각 탭의 \"Send Test\" 버튼을 클릭하여 실시간 데이터 전송 테스트

### 프로그래밍 방식 사용

#### 1. React 컴포넌트에서 SSE 사용

```typescript
import { useSSE } from '../hooks/useSSE';

const MyComponent = () => {
  const { events, isConnected } = useSSE({
    endpoint: '/notifications/stream',
    token: 'your-auth-token',
    onConnect: () => console.log('Connected!'),
    onError: (error) => console.error('SSE Error:', error)
  });

  return (
    <div>
      <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {events.map(event => (
        <div key={event.id}>{JSON.stringify(event.data)}</div>
      ))}
    </div>
  );
};
```

#### 2. 순수 JavaScript에서 SSE 사용

```javascript
const eventSource = new EventSource('http://localhost:3000/notifications/stream?token=YOUR_TOKEN');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
};
```

## 🔌 API 문서

### SSE 엔드포인트

| 엔드포인트 | 설명 | 인증 필요 | 매개변수 |
|------------|------|-----------|----------|
| `/notifications/stream` | 푸시 알림 스트림 | ✅ | `token` |
| `/realtime/stream` | 실시간 업데이트 스트림 | ✅ | `token` |
| `/chat/stream` | 채팅 메시지 스트림 | ✅ | `token`, `room` |
| `/system/status/stream` | 시스템 상태 스트림 | ❌ | - |

### HTTP API 엔드포인트

| 메소드 | 엔드포인트 | 설명 | 바디 |
|--------|------------|------|------|
| POST | `/notifications/send` | 알림 전송 | `{title, message, type}` |
| POST | `/realtime/update` | 실시간 업데이트 전송 | `{entityType, entityId, action, data}` |
| POST | `/chat/send` | 채팅 메시지 전송 | `{roomId, message}` |
| GET | `/system/status` | 시스템 상태 조회 | - |

### 인증

데모용 토큰: `dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=`

실제 환경에서는 JWT 토큰 또는 세션 기반 인증으로 교체하세요.

## 💡 예제

### 1. 알림 전송 예제

```bash
curl -X POST http://localhost:3000/notifications/send \\
  -H \"Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=\" \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"title\": \"새로운 메시지\",
    \"message\": \"안녕하세요! 새로운 알림입니다.\",
    \"type\": \"info\"
  }'
```

### 2. 실시간 업데이트 전송 예제

```bash
curl -X POST http://localhost:3000/realtime/update \\
  -H \"Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=\" \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"entityType\": \"user\",
    \"entityId\": \"user123\",
    \"action\": \"updated\",
    \"data\": {\"status\": \"online\", \"lastSeen\": \"2024-01-15T10:30:00Z\"}
  }'
```

### 3. 채팅 메시지 전송 예제

```bash
curl -X POST http://localhost:3000/chat/send \\
  -H \"Authorization: Bearer dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=\" \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"roomId\": \"general\",
    \"message\": \"안녕하세요! 모두들 어떻게 지내세요?\"
  }'
```

## ⚙️ 커스터마이징

### 백엔드 커스터마이징

#### 1. 새로운 SSE 엔드포인트 추가

```typescript
// src/controllers/custom.controller.ts
import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('custom')
export class CustomController {
  @Sse('stream')
  customStream(): Observable<any> {
    return interval(5000).pipe(
      map(() => ({
        data: { 
          timestamp: new Date().toISOString(),
          customData: 'Hello from custom stream!'
        }
      }))
    );
  }
}
```

#### 2. 인증 로직 변경

```typescript
// src/guards/auth.guard.ts 수정
private async validateToken(token: string): Promise<any> {
  // JWT 토큰 검증 로직으로 교체
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
```

### 프론트엔드 커스터마이징

#### 1. 새로운 SSE 훅 생성

```typescript
// src/hooks/useCustomSSE.ts
export const useCustomSSE = (endpoint: string) => {
  return useSSE({
    endpoint,
    reconnect: true,
    reconnectInterval: 5000,
    onConnect: () => console.log('Custom SSE connected'),
    onError: (error) => console.error('Custom SSE error:', error)
  });
};
```

#### 2. 커스텀 컴포넌트 생성

```typescript
// src/components/CustomSSEComponent.tsx
export const CustomSSEComponent = () => {
  const { events, isConnected } = useCustomSSE('/custom/stream');
  
  return (
    <div>
      <h3>Custom SSE Stream</h3>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {events.map(event => (
        <div key={event.id}>
          {event.data.customData} - {event.data.timestamp}
        </div>
      ))}
    </div>
  );
};
```

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. CORS 오류
```
Access to XMLHttpRequest at 'http://localhost:3000/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**해결방법**: 백엔드의 `main.ts`에서 프론트엔드 URL을 CORS 설정에 추가

```typescript
cors: {
  origin: [
    'http://localhost:5173',  // Vite 기본 포트 추가
    'http://localhost:3001'   // 기타 포트 추가
  ]
}
```

#### 2. SSE 연결이 계속 끊어짐
**원인**: 네트워크 프록시나 방화벽에서 연결을 차단
**해결방법**: 
- 개발 환경에서는 로컬 네트워크 설정 확인
- 프로덕션에서는 서버 설정에서 keep-alive 설정

#### 3. 토큰 인증 실패
```
Unauthorized: Invalid or missing token
```

**해결방법**: 
1. 로컬스토리지에 토큰이 저장되었는지 확인
2. 토큰 형식이 올바른지 확인 (Base64 인코딩)
3. 백엔드에서 토큰 디코딩 로직 확인

#### 4. 이벤트가 수신되지 않음
**해결방법**:
1. 브라우저 개발자 도구의 Network 탭에서 SSE 연결 상태 확인
2. 백엔드 로그에서 이벤트 전송 여부 확인
3. 이벤트 타입이 프론트엔드에서 올바르게 처리되고 있는지 확인

### 성능 최적화

#### 1. 연결 수 제한
대량의 클라이언트 연결시 서버 리소스 관리:

```typescript
// 최대 연결 수 제한
private readonly maxConnections = 1000;
private readonly connections = new Map();

@Sse('stream')
stream() {
  if (this.connections.size >= this.maxConnections) {
    throw new HttpException('Too many connections', 429);
  }
  // ...
}
```

#### 2. 메모리 누수 방지
```typescript
// 연결 해제시 정리
private cleanup(connectionId: string) {
  this.connections.delete(connectionId);
  this.subscriptions.get(connectionId)?.unsubscribe();
  this.subscriptions.delete(connectionId);
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. GitHub Issues를 통해 버그 리포트나 기능 요청
2. 문서를 참조하여 일반적인 사용법 확인
3. 예제 코드를 참조하여 구현 방법 확인

---

**Happy Coding! 🚀**