'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">개발 모드</h1>
          <p className="text-gray-600 mb-6">
            대시보드는 현재 개발 중입니다. 테스트를 진행해보세요!
          </p>
          <div className="space-y-4">
            <Link 
              href="/test"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              독해 테스트 시작
            </Link>
            <Link 
              href="/"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}