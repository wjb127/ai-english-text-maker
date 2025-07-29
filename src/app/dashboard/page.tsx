'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'trial' | 'premium'>('free')
  const [testResult, setTestResult] = useState<any>(null)
  const [userLevel, setUserLevel] = useState(1)

  useEffect(() => {
    // Load subscription status
    const status = localStorage.getItem('subscriptionStatus') || 'free'
    setSubscriptionStatus(status as 'free' | 'trial' | 'premium')

    // Load test results
    const results = localStorage.getItem('onboardingTestResult')
    if (results) {
      const parsed = JSON.parse(results)
      setTestResult(parsed)
      
      // Calculate user level
      const score = parsed.overallScore || 0
      if (score >= 90) setUserLevel(5)
      else if (score >= 80) setUserLevel(4)
      else if (score >= 70) setUserLevel(3)
      else if (score >= 60) setUserLevel(2)
      else setUserLevel(1)
    }
  }, [])

  const getDaysRemaining = () => {
    const trialStart = localStorage.getItem('trialStartDate')
    if (!trialStart) return 0
    
    const startDate = new Date(trialStart)
    const now = new Date()
    const diffTime = 30 * 24 * 60 * 60 * 1000 - (now.getTime() - startDate.getTime())
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          {/* Mobile Header Layout */}
          <div className="flex items-center justify-between md:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">AI 독해</h1>
                <p className="text-xs text-gray-600">대시보드</p>
              </div>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              홈
            </Link>
          </div>

          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI 영어 독해 대시보드</h1>
                <p className="text-sm text-gray-600">맞춤형 학습 진행 상황</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {subscriptionStatus === 'trial' && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  🎁 무료 체험 {getDaysRemaining()}일 남음
                </div>
              )}
              {subscriptionStatus === 'free' && (
                <Link
                  href="/subscription"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700"
                >
                  프리미엄 업그레이드
                </Link>
              )}
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                홈으로
              </Link>
            </div>
          </div>

          {/* Mobile Subscription Status */}
          <div className="md:hidden mt-3">
            {subscriptionStatus === 'trial' && (
              <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
                🎁 무료 체험 {getDaysRemaining()}일 남음
              </div>
            )}
            {subscriptionStatus === 'free' && (
              <Link
                href="/subscription"
                className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:from-purple-700 hover:to-pink-700"
              >
                프리미엄 업그레이드
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">환영합니다! 👋</h2>
              <p className="text-gray-600 text-sm md:text-base">AI 맞춤형 영어 독해 학습을 시작해보세요</p>
            </div>
            {testResult && (
              <div className="text-center md:text-right">
                <div className="text-sm text-gray-500">현재 레벨</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">Level {userLevel}</div>
                <div className="text-sm text-gray-600">
                  {userLevel === 1 && "초급 (Beginner)"}
                  {userLevel === 2 && "초중급 (Elementary)"}
                  {userLevel === 3 && "중급 (Intermediate)"}
                  {userLevel === 4 && "중고급 (Upper-Intermediate)"}
                  {userLevel === 5 && "고급 (Advanced)"}
                </div>
              </div>
            )}
          </div>

          {testResult && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">📊 최근 테스트 결과</h3>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">{testResult.overallScore}점</div>
                  <div className="text-xs md:text-sm text-gray-600">종합 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-600">{testResult.totalCorrect}</div>
                  <div className="text-xs md:text-sm text-gray-600">정답 개수</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">{testResult.passageResults?.length || 0}</div>
                  <div className="text-xs md:text-sm text-gray-600">완료한 지문</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/test"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center active:scale-95"
            >
              새로운 테스트 시작하기
            </Link>
            {testResult && (
              <Link
                href="/results"
                className="border border-gray-300 text-gray-700 px-4 md:px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-center active:scale-95"
              >
                상세 결과 보기
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">맞춤형 독해 지문</h3>
            <p className="text-gray-600 text-sm mb-3 md:mb-4">
              당신의 레벨에 맞는 AI 생성 독해 지문으로 학습하세요
            </p>
            <Link
              href="/test"
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              지금 시작하기 →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">학습 진도 분석</h3>
            <p className="text-gray-600 text-sm mb-3 md:mb-4">
              상세한 학습 분석과 약점 개선 방안을 확인하세요
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              분석 보기 →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">AI 튜터링</h3>
            <p className="text-gray-600 text-sm mb-3 md:mb-4">
              실시간 AI 피드백으로 효율적인 학습을 경험하세요
            </p>
            <button className="text-purple-600 font-medium text-sm hover:underline">
              {subscriptionStatus === 'free' ? '프리미엄에서 이용 가능 →' : '시작하기 →'}
            </button>
          </div>
        </div>

        {/* Subscription Status */}
        {subscriptionStatus === 'free' && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-4 md:p-8 text-white mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold mb-2">🎁 무료 체험으로 업그레이드하세요!</h3>
                <p className="text-orange-100 mb-3 md:mb-4 text-sm md:text-base">
                  30일 동안 모든 프리미엄 기능을 무료로 이용해보세요
                </p>
                <ul className="text-sm text-orange-100 space-y-1">
                  <li>✓ 무제한 독해 지문 생성</li>
                  <li>✓ 모든 난이도 레벨 접근</li>
                  <li>✓ 상세 학습 분석 및 리포트</li>
                  <li>✓ AI 개인 튜터링</li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <Link
                  href="/subscription"
                  className="bg-white text-orange-600 px-4 md:px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 inline-block active:scale-95"
                >
                  무료 체험 시작
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">📈 학습 현황</h3>
          
          {testResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm md:text-base">레벨 테스트 완료</div>
                    <div className="text-xs md:text-sm text-gray-600">5개 지문, {testResult.totalQuestions}문제 완료</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-sm md:text-base">{testResult.overallScore}점</div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {new Date(testResult.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-3 md:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">난이도별 성과</h4>
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const passageResult = testResult.passageResults?.find((r: any) => r.difficulty === level)
                    return (
                      <div key={level} className="text-center">
                        <div className="text-sm md:text-lg font-bold text-gray-900">Lv{level}</div>
                        {passageResult ? (
                          <>
                            <div className={`text-lg md:text-2xl font-bold ${passageResult.score >= 70 ? 'text-green-600' : passageResult.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {passageResult.score}
                            </div>
                            <div className="text-xs text-gray-500">
                              {passageResult.answers.filter((a: number, i: number) => a === passageResult.passage.questions[i].correctAnswer).length}/
                              {passageResult.passage.questions.length}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-xs md:text-sm">미완료</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">학습을 시작해보세요!</h4>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                AI 레벨 테스트를 통해 맞춤형 학습 계획을 세워보세요
              </p>
              <Link
                href="/test"
                className="bg-blue-600 text-white px-4 md:px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 inline-block active:scale-95"
              >
                레벨 테스트 시작하기
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}