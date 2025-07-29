'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium')
  const router = useRouter()

  const handleStartTrial = () => {
    // In a real app, this would handle subscription logic
    localStorage.setItem('subscriptionStatus', 'trial')
    localStorage.setItem('trialStartDate', new Date().toISOString())
    router.push('/dashboard')
  }

  const handleFreePlan = () => {
    localStorage.setItem('subscriptionStatus', 'free')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-sm">
                🚀 특별 런칭 혜택
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">
            AI 영어 학습의 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> 새로운 기준</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            개인 맞춤형 AI 튜터와 함께하는 체계적인 영어 독해 학습 시스템
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">무료 체험</h3>
              <div className="text-4xl font-black text-gray-700 mb-2">₩0</div>
              <p className="text-gray-600">30일 무료 이후 제한된 서비스</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">하루 1개 독해 지문</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">기본 난이도 선택 (1-3단계)</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">기본 학습 기록</span>
              </div>
              <div className="flex items-center opacity-50">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 line-through">고급 분석 및 상세 해설</span>
              </div>
            </div>

            <button
              onClick={handleFreePlan}
              className="w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-200"
            >
              무료로 시작하기
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 relative text-white transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🔥 가장 인기있는 플랜
              </div>
            </div>

            <div className="text-center mb-8 mt-4">
              <h3 className="text-2xl font-bold mb-2">프리미엄</h3>
              <div className="text-4xl font-black mb-2">₩9,900</div>
              <p className="text-purple-100">/ 월 • 30일 무료 체험</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">무제한 독해 지문 생성</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">모든 난이도 접근 (1-5단계)</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">AI 맞춤형 학습 추천</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">상세 학습 분석 및 리포트</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">개인화된 주제별 지문</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white">AI 튜터 실시간 피드백</span>
              </div>
            </div>

            <button
              onClick={handleStartTrial}
              className="w-full bg-white text-purple-600 py-4 px-6 rounded-xl font-black text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              30일 무료 체험 시작 🚀
            </button>
            
            <p className="text-center text-purple-100 text-xs mt-3">
              * 언제든 취소 가능 • 카드 등록 불필요
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            왜 AI 영어 독해 연습을 선택해야 할까요?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">개인 맞춤형 학습</h3>
              <p className="text-gray-600">
                AI가 당신의 실력과 학습 패턴을 분석하여 최적화된 지문과 문제를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">빠른 실력 향상</h3>
              <p className="text-gray-600">
                체계적인 난이도 조절과 즉각적인 피드백으로 단기간에 독해 실력을 향상시킵니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">상세한 학습 분석</h3>
              <p className="text-gray-600">
                학습 진도, 약점 분석, 성취도 추적을 통해 효율적인 학습 방향을 제시합니다.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">자주 묻는 질문</h2>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">30일 무료 체험 후에는 어떻게 되나요?</h3>
              <p className="text-gray-600">
                체험 기간 종료 후 자동으로 무료 플랜으로 전환되며, 하루 1개의 독해 지문만 이용 가능합니다. 
                프리미엄 기능을 계속 이용하시려면 유료 구독을 신청하시면 됩니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">언제든지 구독을 취소할 수 있나요?</h3>
              <p className="text-gray-600">
                네, 언제든지 구독을 취소하실 수 있습니다. 취소 시점까지 이용한 기간에 대해서만 요금이 부과됩니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">어떤 수준의 영어 독해 지문이 제공되나요?</h3>
              <p className="text-gray-600">
                초급(Level 1)부터 고급(Level 5)까지 5단계 난이도의 지문을 제공합니다. 
                AI가 당신의 실력을 분석하여 적절한 난이도의 지문을 추천합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">지금 바로 영어 실력 향상을 시작하세요!</h2>
            <p className="text-xl text-purple-100 mb-8">
              30일 무료 체험으로 AI 영어 학습의 차이를 직접 경험해보세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartTrial}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 30일 무료 체험 시작하기
              </button>
              
              <Link
                href="/test"
                className="text-purple-100 hover:text-white font-medium underline"
              >
                또는 무료 테스트 먼저 해보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center space-x-8 mt-12 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            홈으로 돌아가기
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/results" className="text-gray-600 hover:text-gray-900 font-medium">
            테스트 결과 보기
          </Link>
        </div>
      </div>
    </div>
  )
}