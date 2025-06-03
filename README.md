# 수면 기록 관리 서비스

## 프로젝트 개요
이 프로젝트는 개인의 수면 패턴을 추적하고 관리할 수 있는 웹 애플리케이션입니다. 사용자는 매일의 취침 시간, 기상 시간, 수면의 질 등을 기록하고 분석할 수 있습니다.

### 주요 기능
- 일별 수면 기록 작성 및 관리
- 취침/기상 시간 추적
- 수면 관련 특이사항 메모
- 모바일 환경 지원

### 기술 스택
- Frontend: React, TypeScript, Material-UI, Tailwind CSS
- Backend: Node.js, Fastify, TypeScript
- Database: SQLite (Drizzle ORM)
- Authentication: JWT

## 설치 및 실행

### 초기 설치

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm install
```

### 개발 서버 실행

```bash
# 클라이언트 및 서버 동시 실행
pnpm dev

# 클라이언트만 실행
pnpm dev:client

# 서버만 실행
pnpm dev:server
```

### 테스트 실행

```bash
# 클라이언트 테스트
pnpm test:client

# 서버 테스트
pnpm test:server

# 모든 테스트 실행
pnpm test
```

### 빌드

```bash
# 클라이언트 및 서버 빌드
pnpm build
```

## 환경 변수 설정

- 클라이언트: `client/.env` 파일에 설정 (예시는 `client/.env.example` 참조)
- 서버: `server/.env` 파일에 설정 (예시는 `server/.env.example` 참조)

## API 엔드포인트

서버는 다음과 같은 API 엔드포인트를 제공합니다:

### 수면 기록 관리
- `GET /api/sleep-records`: 사용자의 수면 기록 목록 조회
- `POST /api/sleep-records`: 새로운 수면 기록 생성
- `PUT /api/sleep-records/:id`: 특정 수면 기록 수정
- `DELETE /api/sleep-records/:id`: 특정 수면 기록 삭제

### 상태 확인
- `GET /api/health`: 서버 상태 확인
