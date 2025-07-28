# AI 영어 독해 연습 시스템

Next.js 15 + Supabase + Claude API를 사용하여 구축된 AI 기반 영어 독해 지문 생성 및 테스트 플랫폼입니다.

## 주요 기능

- 🤖 **AI 지문 생성**: Claude API를 활용한 맞춤형 영어 독해 지문 자동 생성
- 📊 **5단계 난이도**: 초급부터 고급까지 체계적인 레벨 시스템
- 🎯 **인터랙티브 테스트**: 실시간 문제 풀이 및 즉시 피드백
- 📈 **학습 진도 추적**: 개인별 성과 분석 및 진도 관리
- 🔐 **회원 시스템**: Supabase Auth를 통한 안전한 사용자 인증
- 💎 **구독제 모델**: 무료/프리미엄 티어 지원

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API
- **Deployment**: Vercel (권장)

## 설치 및 설정

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd ai-english-text-maker
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API
ANTHROPIC_API_KEY=your-claude-api-key

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Cron Job
CRON_SECRET=your-secure-cron-secret
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase/schema.sql` 파일의 스키마를 Supabase SQL 에디터에서 실행
3. 인증 설정에서 Google OAuth 등 소셜 로그인 설정 (선택사항)

### 4. Claude API 키 발급

1. [Anthropic Console](https://console.anthropic.com)에서 API 키 발급
2. `.env.local`에 API 키 추가

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보 및 구독 상태
- `reading_passages`: AI 생성 독해 지문 저장
- `test_results`: 사용자 테스트 결과 기록

### 데이터베이스 함수

- `get_user_difficulty_level()`: 사용자의 최근 테스트 결과를 바탕으로 추천 난이도 계산

## API 엔드포인트

### `/api/generate-passage`

- `GET`: 기존 지문 조회 또는 새 지문 생성
- `POST`: 새 지문 강제 생성
- 파라미터: `difficulty` (1-5), `limit`

### `/api/cron/generate-passages`

- `POST`: 모든 난이도의 지문 자동 생성 (cron job용)
- 인증: Bearer token 필요

## 배포

### Vercel 배포 (권장)

1. GitHub에 프로젝트 push
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정
4. 배포 완료

### Cron Job 설정

지문 자동 생성을 위한 cron job 설정:

```bash
# 매일 오전 2시에 실행
0 2 * * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/generate-passages
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # 인증 페이지
│   ├── dashboard/         # 대시보드
│   ├── results/           # 테스트 결과
│   ├── test/              # 테스트 페이지
│   └── page.tsx           # 랜딩 페이지
├── lib/                   # 유틸리티 라이브러리
│   ├── auth.ts           # 인증 헬퍼
│   ├── claude.ts         # Claude API 클라이언트
│   └── supabase.ts       # Supabase 클라이언트
└── middleware.ts         # Next.js 미들웨어
```

## 사용 흐름

1. **랜딩 페이지**: 서비스 소개 및 "AI 독해 테스트 시작하기" 버튼
2. **테스트 페이지**: AI 생성 독해 지문으로 5문제 테스트 진행
3. **결과 확인**: 테스트 완료 후 로그인/회원가입 유도
4. **상세 결과**: 인증된 사용자에게 상세 분석 및 해설 제공
5. **대시보드**: 학습 진도, 성과 분석, 추가 테스트 제공
6. **구독 유도**: 프리미엄 기능 (무제한 테스트, 상세 분석) 안내

## 개발 참고사항

### 코드 스타일
- TypeScript strict 모드 사용
- Tailwind CSS로 스타일링
- ESLint + Prettier 설정

### 보안 고려사항
- Row Level Security (RLS) 활성화
- API 키 환경변수 관리
- CORS 설정 확인

## 라이선스

MIT License

## 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
