'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface TestResult {
  id: string
  score: number
  difficulty_level: number
  completed_at: string
  passage: {
    title: string
  }
}

interface UserProfile {
  id: string
  email: string
  name: string
  subscription_status: 'free' | 'premium'
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    currentLevel: 1,
    improvementRate: 0
  })
  
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getUser()
        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (profile) {
          setUser(profile)
        }

        // Get test results
        const { data: results } = await supabase
          .from('test_results')
          .select(`
            id,
            score,
            difficulty_level,
            completed_at,
            reading_passages (
              title
            )
          `)
          .eq('user_id', currentUser.id)
          .order('completed_at', { ascending: false })
          .limit(10)

        if (results) {
          const formattedResults = results.map(result => ({
            ...result,
            passage: {
              title: result.reading_passages?.title || 'Unknown'
            }
          }))
          setTestResults(formattedResults as any)

          // Calculate stats
          if (results.length > 0) {
            const totalTests = results.length
            const averageScore = Math.round(
              results.reduce((sum, result) => sum + result.score, 0) / totalTests
            )
            
            // Get user's recommended difficulty level
            const { data: levelResult } = await supabase
              .rpc('get_user_difficulty_level', { user_uuid: currentUser.id })

            const currentLevel = levelResult || 1

            // Calculate improvement rate (compare first 3 and last 3 tests)
            let improvementRate = 0
            if (results.length >= 6) {
              const recent3 = results.slice(0, 3)
              const earlier3 = results.slice(-3)
              const recentAvg = recent3.reduce((sum, r) => sum + r.score, 0) / 3
              const earlierAvg = earlier3.reduce((sum, r) => sum + r.score, 0) / 3
              improvementRate = Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100)
            }

            setStats({ totalTests, averageScore, currentLevel, improvementRate })
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getDifficultyText = (level: number) => {
    const levels = {
      1: '초급',
      2: '초중급', 
      3: '중급',
      4: '중고급',
      5: '고급'
    }
    return levels[level as keyof typeof levels] || '초급'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                AI 영어 독해 연습
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">안녕하세요, {user?.name}님</span>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.subscription_status === 'premium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.subscription_status === 'premium' ? '프리미엄' : '무료'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">학습 진도와 성과를 확인해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 테스트 수</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">평균 점수</p>
                <p className={`text-2xl font-semibold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}점
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">현재 레벨</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getDifficultyText(stats.currentLevel)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">향상률</p>
                <p className={`text-2xl font-semibold ${
                  stats.improvementRate > 0 ? 'text-green-600' : 
                  stats.improvementRate < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">최근 테스트 결과</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {testResults.length > 0 ? (
                  testResults.map((result) => (
                    <div key={result.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {result.passage.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(result.completed_at).toLocaleDateString('ko-KR')} • 
                            {getDifficultyText(result.difficulty_level)} 레벨
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                            {result.score}점
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
                    <Link 
                      href="/test"
                      className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                    >
                      첫 테스트 시작하기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
              <div className="space-y-3">
                <Link
                  href="/test"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  새 테스트 시작
                </Link>
                <button className="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  복습하기
                </button>
              </div>
            </div>

            {user?.subscription_status === 'free' && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  프리미엄 구독
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  무제한 테스트와 상세 분석으로 실력을 빠르게 향상시키세요.
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 mb-4">
                  <li>• 무제한 독해 테스트</li>
                  <li>• 개인별 맞춤 분석</li>
                  <li>• 상세한 학습 리포트</li>
                  <li>• 오답 노트 기능</li>
                </ul>
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                  구독하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}