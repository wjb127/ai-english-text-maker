import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm md:text-base">AI 영어 독해</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">1~5</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">맞춤형 AI 독해</span>
            <button className="text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              프리미엄 구독
            </button>
            <button className="text-sm text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
              무료 체험
            </button>
          </div>

          {/* Mobile CTA Button */}
          <div className="md:hidden">
            <Link 
              href="/test"
              className="text-sm text-white bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              체험하기
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
            언제, 어디서든 하루 10분,<br />
            AI 독해 학습 4단계
          </h1>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20">
          {/* Left Feature */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-sm text-gray-600 uppercase tracking-wide">
              AI가 생성하는 맞춤형 지문으로
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              독해 학습
            </h2>
            <div className="mt-6 md:mt-8">
              <p className="text-gray-700 mb-4 md:mb-6">
                다음 지문을 읽고 문제를 풀어보세요.
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 md:p-8">
                <div className="text-left space-y-4">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    Reading is one of the most beneficial activities for the human mind. When we read books, magazines, or newspapers, our brain processes information in a unique way that helps improve cognitive function.
                  </p>
                  <div className="mt-4 p-3 md:p-4 bg-white rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-900 mb-2">What is the main benefit of reading mentioned in the passage?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded-full mr-2 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <span className="text-blue-600 font-medium">Improves cognitive function</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Feature */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-sm text-gray-600 uppercase tracking-wide">
              상세한 해석과 문법 분석으로
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              완벽한 학습
            </h2>
            <div className="mt-6 md:mt-8">
              <div className="bg-gray-50 rounded-2xl p-4 md:p-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                    <div className="text-xs text-gray-500 mb-2">📝 전문 번역</div>
                    <p className="text-gray-700 text-sm mb-2">
                      독서는 인간의 정신에 가장 유익한 활동 중 하나입니다. 우리가 책, 잡지, 신문을 읽을 때, 우리의 뇌는 인지 기능 향상에 도움이 되는 독특한 방식으로 정보를 처리합니다.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 md:p-4">
                    <div className="text-xs text-blue-600 mb-2">🔍 핵심 단어</div>
                    <div className="text-sm space-y-1">
                      <div><span className="font-semibold">beneficial:</span> 유익한</div>
                      <div><span className="font-semibold">cognitive:</span> 인지의</div>
                      <div><span className="font-semibold">function:</span> 기능</div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 md:p-4">
                    <div className="text-xs text-green-600 mb-2">📚 문법 포인트</div>
                    <p className="text-sm text-gray-700">
                      "one of the most + 형용사 + 명사(복수)" 구문으로 최상급을 표현
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-900 rounded-2xl p-4 md:p-6 mb-8 max-w-md mx-auto">
            <Link 
              href="/test"
              className="flex items-center justify-between text-white group"
            >
              <span className="font-medium text-sm md:text-base">AI 독해 테스트 지금 시작하기</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="text-xs text-gray-400 mt-2">
              ✨ 무료 체험 • 회원가입 불필요
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons - Mobile Optimized */}
      <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 space-y-3">
        <Link 
          href="/test"
          className="w-14 h-14 md:w-12 md:h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center active:scale-95 transition-transform"
        >
          <span className="text-xs font-bold leading-tight">무료<br />체험</span>
        </Link>
        <button className="w-14 h-14 md:w-12 md:h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 flex items-center justify-center active:scale-95 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
