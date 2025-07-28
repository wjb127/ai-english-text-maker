'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface TestResult {
  score: number
  answers: number[]
  passage: {
    title: string
    content: string
    translation: string
    keyVocabulary: string[]
    grammarPoints: string[]
    questions: Question[]
  }
  completedAt: string
}

export default function ResultsPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoadResults = async () => {
      try {
        const currentUser = await getUser()
        if (!currentUser) {
          router.push('/auth/login?redirect=/results')
          return
        }
        
        setUser(currentUser)

        // Get test result from localStorage
        const storedResult = localStorage.getItem('testResult')
        if (storedResult) {
          const parsed = JSON.parse(storedResult)
          setTestResult(parsed)
          
          // Save to database
          await saveTestResult(currentUser.id, parsed)
        } else {
          // If no stored result, redirect to test page
          router.push('/test')
        }
      } catch (error) {
        console.error('Error loading results:', error)
        router.push('/auth/login?redirect=/results')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadResults()
  }, [router])

  const saveTestResult = async (userId: string, result: TestResult) => {
    setSaving(true)
    try {
      // First, save the passage to database if it doesn't exist
      const { data: existingPassage, error: searchError } = await supabase
        .from('reading_passages')
        .select('id')
        .eq('title', result.passage.title)
        .single()

      let passageId = existingPassage?.id

      if (!existingPassage) {
        // Create new passage
        const { data: newPassage, error: insertError } = await supabase
          .from('reading_passages')
          .insert([
            {
              title: result.passage.title,
              content: result.passage.content,
              difficulty_level: Math.ceil(result.score / 20), // Convert score to difficulty level
              translation: result.passage.translation,
              key_vocabulary: result.passage.keyVocabulary,
              grammar_points: result.passage.grammarPoints,
              questions: result.passage.questions
            }
          ])
          .select('id')
          .single()

        if (insertError) {
          console.error('Error creating passage:', insertError)
          return
        }

        passageId = newPassage?.id
      }

      // Save test result
      const { error: resultError } = await supabase
        .from('test_results')
        .insert([
          {
            user_id: userId,
            passage_id: passageId,
            score: result.score,
            answers: result.answers,
            difficulty_level: Math.ceil(result.score / 20),
            completed_at: result.completedAt
          }
        ])

      if (resultError) {
        console.error('Error saving test result:', resultError)
      } else {
        setSaved(true)
        // Clear localStorage after successful save
        localStorage.removeItem('testResult')
      }
    } catch (error) {
      console.error('Error saving test result:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">테스트 결과를 찾을 수 없습니다.</p>
          <Link href="/test" className="text-blue-600 hover:underline">
            새 테스트 시작하기
          </Link>
        </div>
      </div>
    )
  }

  const getDifficultyLevel = (score: number) => {
    if (score >= 90) return { level: 5, text: '고급 (Advanced)' }
    if (score >= 80) return { level: 4, text: '중고급 (Upper-Intermediate)' }
    if (score >= 70) return { level: 3, text: '중급 (Intermediate)' }
    if (score >= 60) return { level: 2, text: '초중급 (Elementary)' }
    return { level: 1, text: '초급 (Beginner)' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const difficulty = getDifficultyLevel(testResult.score)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {saving && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
            결과를 저장하는 중...
          </div>
        )}
        
        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            ✓ 테스트 결과가 성공적으로 저장되었습니다!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">테스트 결과</h1>
            <div className="inline-flex items-center space-x-4">
              <div className={`text-4xl font-bold ${getScoreColor(testResult.score)}`}>
                {testResult.score}점
              </div>
              <div className="text-gray-600">
                <div className="text-lg font-semibold">추천 난이도</div>
                <div className="text-blue-600">{difficulty.text}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">성과 분석</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>총 문제 수:</span>
                  <span className="font-semibold">{testResult.passage.questions.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span>정답 수:</span>
                  <span className="font-semibold text-green-600">
                    {testResult.answers.filter((answer, index) => 
                      answer === testResult.passage.questions[index].correctAnswer
                    ).length}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>오답 수:</span>
                  <span className="font-semibold text-red-600">
                    {testResult.answers.filter((answer, index) => 
                      answer !== testResult.passage.questions[index].correctAnswer
                    ).length}개
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">학습 포인트</h3>
              <div className="space-y-2">
                <h4 className="font-medium">핵심 단어</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {testResult.passage.keyVocabulary.slice(0, 3).map((vocab, index) => (
                    <div key={index}>• {vocab}</div>
                  ))}
                </div>
                <h4 className="font-medium mt-3">문법 포인트</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {testResult.passage.grammarPoints.slice(0, 2).map((grammar, index) => (
                    <div key={index}>• {grammar}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">문제별 상세 분석</h2>
            
            {testResult.passage.questions.map((question, index) => {
              const userAnswer = testResult.answers[index]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium">문제 {index + 1}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? '정답' : '오답'}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 mb-4">{question.question}</p>
                  
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer 
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : optionIndex === userAnswer && !isCorrect
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {option}
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600">✓ 정답</span>
                        )}
                        {optionIndex === userAnswer && !isCorrect && (
                          <span className="ml-2 text-red-600">✗ 선택한 답</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">해설</h4>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                더 많은 {difficulty.text} 지문으로 실력을 향상시켜보세요!
              </h3>
              <p className="text-yellow-800 mb-4">
                AI가 생성하는 무제한 독해 지문으로 체계적인 영어 학습을 계속하세요.
              </p>
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                프리미엄 구독하기
              </button>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/test"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                새 테스트 시작
              </Link>
              <Link 
                href="/dashboard"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}