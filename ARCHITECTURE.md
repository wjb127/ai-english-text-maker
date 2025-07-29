# AI 영어 독해 시스템 아키텍처 설계

## 🏗️ 전체 시스템 아키텍처

### 1. **프론트엔드 계층 (Next.js 15)**
```
├── 랜딩 페이지 (/)
├── 16단계 레벨 테스트 (/test)
├── 프로필 생성 (/profile)
├── 구독 시스템 (/subscription)
├── 대시보드 (/dashboard)
└── 결과 분석 (/results)
```

### 2. **백엔드 API 계층**
```
├── /api/generate-passage (실시간 지문 생성)
├── /api/cron/generate-passages (자동화 배치)
├── /api/auth/* (인증 시스템)
└── /api/analytics/* (학습 분석)
```

### 3. **데이터베이스 스키마 (Supabase PostgreSQL)**

#### 핵심 테이블 구조:
```sql
reading_passages (16단계 난이도 지문)
├── difficulty_level (1-16)
├── content (지문 내용)
├── translation (한국어 번역)
├── key_vocabulary (핵심 단어)
├── grammar_points (문법 포인트)
└── questions (문제들)

prompt_templates (패턴 방지 시스템)
├── topic_categories (주제 카테고리)
├── writing_styles (작문 스타일)
├── perspectives (관점)
└── usage_count (사용 빈도 추적)

passage_generation_log (패턴 추적)
├── difficulty_level
├── topic_used
├── style_used
└── generated_at (시간 추적)
```

## 🔄 **자동화 시스템 (핵심 혁신)**

### 1. **패턴 방지 AI 생성 시스템**

#### 🎯 **다차원 랜덤화 전략:**
```javascript
// 주제 다양성 (18개 카테고리)
topics: ['daily life', 'science', 'culture', 'history', ...]

// 글쓰기 스타일 (12개 유형)  
styles: ['narrative', 'informative', 'analytical', ...]

// 관점 변화 (9개 시각)
perspectives: ['third person', 'expert commentary', ...]

// 시간 기반 톤 변화
timeBasedVariation: 시간별로 다른 어조 적용
```

#### 🔄 **Vercel Cron 시스템 (매시간 실행)**
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-passages",
      "schedule": "0 * * * *"  // 매시간 정각
    }
  ]
}
```

### 2. **지능형 난이도 시스템 (16단계)**

#### 📊 **세분화된 레벨 구조:**
```
Level 1-4:   입문~상급초급 (100-150단어, 단순문장)
Level 5-8:   초중급~하급중급 (150-250단어, 복합문장)  
Level 9-12:  중급~상급중고급 (250-350단어, 복잡문장)
Level 13-16: 하급고급~원어민급 (350-500단어, 고급표현)
```

#### 🎯 **적응형 점수 매핑:**
```sql
97점+ → Level 16 (원어민급)
94점+ → Level 15 (고급)
91점+ → Level 14 (하급고급)
...
55점- → Level 1 (입문)
```

## 🚀 **성능 최적화 전략**

### 1. **API 비용 관리**
- 난이도별 하루 2개 지문 제한
- 30개 이상 지문 자동 정리
- 실패 시 2초 딜레이 적용

### 2. **데이터베이스 최적화**
```sql
-- 성능 인덱스
CREATE INDEX idx_reading_passages_difficulty ON reading_passages(difficulty_level);
CREATE INDEX idx_generation_log_generated_at ON passage_generation_log(generated_at);
```

### 3. **캐싱 전략**
- localStorage: 테스트 결과 임시 저장
- Supabase 캐싱: 자주 사용되는 지문
- CDN: 정적 리소스 최적화

## 🔐 **보안 및 인증**

### 1. **Supabase RLS (Row Level Security)**
```sql
-- 사용자별 데이터 접근 제어
CREATE POLICY "Users can view own test results" 
ON test_results FOR SELECT USING (auth.uid() = user_id);
```

### 2. **Cron Job 보안**
```javascript
// CRON_SECRET 검증
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## 📈 **확장성 고려사항**

### 1. **향후 개선 방향**

#### 🤖 **AI 고도화:**
- 개인 학습 패턴 분석
- 약점 특화 지문 생성  
- 실시간 난이도 조절

#### 📊 **분석 시스템:**
- 학습 진도 추적
- 성취도 시각화
- 개인화된 추천

#### 🌐 **다국어 지원:**
- 중국어, 일본어 버전
- 지역별 문화 적응

### 2. **기술 스택 확장**

#### 📱 **모바일 최적화:**
- PWA 구현
- 오프라인 학습 지원
- 푸시 알림 시스템

#### 🔄 **실시간 기능:**
- WebSocket 기반 실시간 피드백
- 라이브 튜터링 세션
- 협업 학습 기능

## 💡 **핵심 혁신 포인트**

### 1. **패턴 방지 시스템**
- 16차원 변수 조합으로 무한 다양성
- 시간/사용량 기반 가중치 시스템
- DB 로그 분석을 통한 지능형 회피

### 2. **세밀한 난이도 조절**
- 16단계 세분화로 정확한 레벨링
- 점수 구간별 3점 차이로 세밀한 조절
- 개인별 성장 곡선 추적

### 3. **완전 자동화 시스템**
- Vercel Cron으로 24/7 자동 운영
- API 비용 최적화 알고리즘
- 실패 복구 및 모니터링

## 🎯 **비즈니스 모델 확장**

### 1. **구독 시스템**
```
무료: 하루 1개 지문, 기본 분석
프리미엄: 무제한 지문, 고급 분석, AI 튜터링
```

### 2. **B2B 확장**
- 학교/학원 라이선스
- 기업 영어교육 패키지
- API 서비스 제공

이 아키텍처는 확장성, 안정성, 그리고 사용자 경험을 모두 고려한 설계입니다. 특히 패턴 방지 시스템과 16단계 난이도 시스템이 핵심 차별화 요소가 될 것입니다.