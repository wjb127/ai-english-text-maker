# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered English reading comprehension system built for Korean learners. It uses Claude API to generate tailored English passages and provides comprehensive analysis including Korean translations, vocabulary explanations, and grammar points.

**Current Development Status**: Authentication is disabled for personal development use. The system works without login requirements.

## Technology Stack

- **Framework**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI Integration**: Anthropic Claude API using `@anthropic-ai/sdk`
- **Authentication**: Supabase Auth (currently disabled for development)
- **Deployment**: Vercel-optimized

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Production build (ignores TypeScript/ESLint errors)
npm run start        # Start production server
npm run lint         # Run ESLint

# Database setup
# Run the SQL in supabase/schema.sql in your Supabase SQL editor
```

## Architecture Overview

### Core System Flow
1. **Landing Page** (`/`) → **Test Page** (`/test`) → **Results Page** (`/results`)
2. **AI Generation**: Claude API creates structured passages with Korean translations
3. **State Management**: localStorage for test results (development mode)
4. **Database**: Supabase stores passages, users, test results (when auth enabled)

### Key Components Architecture

**AI Passage Generation** (`src/lib/claude.ts`):
- Uses Claude 3 Sonnet model with structured prompts
- Generates 150-300 word passages for 5 difficulty levels (초급 to 고급)
- Returns structured data: title, content, translation, vocabulary, grammar points, 5 multiple-choice questions
- Designed specifically for Korean English learners

**API Layer** (`src/app/api/`):
- `/api/generate-passage`: Main endpoint for getting/generating passages
  - GET: Returns existing passage or generates new one for specified difficulty
  - POST: Forces new passage generation
- `/api/cron/generate-passages`: Batch generation system with auth via Bearer token

**Database Schema** (`supabase/schema.sql`):
- **users**: User profiles with subscription status (free/premium)
- **reading_passages**: AI-generated content with difficulty levels, translations, questions
- **test_results**: User performance data with scores and answers
- **Built-in function**: `get_user_difficulty_level()` calculates recommended level from recent test scores

### Page Structure
- **Landing**: Modern hero design with gradient animations and feature highlights
- **Test**: Interactive reading comprehension with progress tracking
- **Results**: Detailed analysis with score breakdown, explanations, and recommendations
- **Auth**: Supabase Auth UI integration (disabled for development)
- **Dashboard**: Simplified placeholder for development mode

## Environment Configuration

Required variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-claude-api-key
CRON_SECRET=secure-random-string-for-cron-auth
```

## AI Integration Details

**Claude API Usage**:
- Model: `claude-3-sonnet-20240229`
- Max tokens: 2000
- Structured JSON output with error handling
- Difficulty-specific prompts optimized for Korean learners
- Includes comprehensive Korean translations and educational content

**Content Generation Strategy**:
- Caches existing passages before generating new ones
- Implements rate limiting with 2-second delays
- Automatic cleanup (keeps last 50 passages per difficulty)
- Fallback to sample content if API fails

## Authentication System (Currently Disabled)

The codebase includes full Supabase Auth integration but is disabled for development:
- **AuthProvider** context for global auth state
- **Suspense boundaries** for `useSearchParams()` to prevent SSR issues
- **Row Level Security** policies configured in database
- **OAuth support** for Google/GitHub (when enabled)

To re-enable authentication:
1. Remove auth checks bypassed in test/results pages
2. Uncomment database save operations in test results
3. Update user flow to require login after test completion

## Development Notes

**Build Configuration**: 
- TypeScript and ESLint errors are ignored in production builds (`next.config.ts`)
- This allows deployment despite development-focused code modifications

**Supabase Integration**:
- Uses `@supabase/ssr` for server-side rendering support
- Middleware configured for auth session management
- Database types defined in `src/lib/supabase.ts`

**Performance Optimization**:
- Static generation for all pages
- Efficient caching strategy for AI-generated content
- Optimized bundle sizes with selective imports

## Deployment

The application is configured for Vercel deployment:
1. Environment variables must be set in Vercel dashboard
2. Cron job can be configured with: `curl -X POST -H "Authorization: Bearer CRON_SECRET" https://your-domain.com/api/cron/generate-passages`
3. Supabase schema must be applied before first deployment

## Security Considerations

- Row Level Security enabled on all database tables
- API keys properly stored in environment variables
- Cron endpoint protected with Bearer token authentication
- CORS configured for Supabase integration