# 🚀 SSE 모노레포 시작하기

## 개요

SSE (Server-Sent Events) 모노레포에 오신 것을 환영합니다! 이 가이드를 통해 몇 분 만에 풀스택 SSE 솔루션을 실행할 수 있습니다.

## 빠른 설정

### 1. 사전 요구사항
- **Node.js 18.0+** ([다운로드](https://nodejs.org/))
- **PNPM 9.0+** (`npm install -g pnpm`)
- **Git** (버전 관리용)
- **최신 브라우저** (Chrome, Firefox, Safari, Edge)

### 2. 설치
```bash
# 저장소 복제
git clone <your-repo-url>
cd server-sent-event

# 모든 의존성 설치
pnpm install
```

### 3. 개발 서버 시작
```bash
# 백엔드와 프론트엔드 동시 시작
pnpm run dev
```

이 명령어는 다음을 시작합니다:
- **백엔드**: http://localhost:3000 (NestJS SSE 서버)
- **프론트엔드**: http://localhost:5173 (React + Vite 클라이언트)

### 4. 애플리케이션 테스트
1. 브라우저에서 http://localhost:5173 열기
2. "Login (Demo)" 클릭하여 인증
3. 모든 SSE 연결이 "Connected" 상태인지 확인
4. 각 탭에서 실시간 기능 테스트

## 프로젝트 구조

```
server-sent-event/
├── docs/                    # 다국어 문서
├── sse-backend/             # NestJS SSE 서버
├── sse-frontend/            # React + Vite 클라이언트
├── package.json             # 워크스페이스 구성
└── pnpm-workspace.yaml      # PNPM 워크스페이스 정의
```

## 주요 기능

### 백엔드 (NestJS)
- 다양한 데이터 타입을 위한 다중 SSE 엔드포인트
- 역할 기반 접근 제어가 있는 토큰 기반 인증
- 자동 연결 정리 및 모니터링
- 프로덕션 준비된 에러 처리 및 로깅

### 프론트엔드 (React + Vite)
- 쉬운 통합을 위한 커스텀 useSSE 훅
- 실시간 UI 컴포넌트
- 자동 재연결 처리
- 연결 통계 및 모니터링

## 다음 단계

- 📖 **[API 참조](../api/backend.md)**를 읽고 상세한 엔드포인트 문서 확인
- 🧪 **[테스팅 가이드](./testing.md)**를 따라 포괄적인 테스트 실행
- 🏗️ **[개발 가이드](./development.md)**에서 고급 워크플로우 확인
- 🚀 **[배포 가이드](../deployment/production.md)**에서 프로덕션 설정 검토

## 주요 명령어

```bash
# 개발
pnpm run dev              # 두 서버 모두 시작
pnpm run backend:dev      # 백엔드만
pnpm run frontend:dev     # 프론트엔드만

# 빌드
pnpm run build            # 모든 패키지 빌드
pnpm run backend:build    # 백엔드 빌드
pnpm run frontend:build   # 프론트엔드 빌드

# 테스트
pnpm run test             # 모든 테스트 실행
pnpm run lint             # 모든 코드 린트
```

## 도움이 필요하신가요?

- 📚 `docs/` 폴더의 포괄적인 문서 확인
- 🧪 자세한 테스트 지침은 [테스팅 가이드](../../TESTING-GUIDE.md) 참조
- 📦 워크스페이스 설정은 [PNPM 마이그레이션 가이드](../../PNPM-MIGRATION.md) 읽기
- 🐛 버그나 기능 요청시 이슈 생성

---

**Server-Sent Events로 놀라운 것을 만들 준비가 되셨나요? 시작해봅시다! 🚀**