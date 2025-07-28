'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface ReadingPassage {
  title: string
  content: string
  translation: string
  keyVocabulary: string[]
  grammarPoints: string[]
  questions: Question[]
}

export default function TestPage() {
  const [passage, setPassage] = useState<ReadingPassage | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  
  const router = useRouter()

  const samplePassage: ReadingPassage = {
    title: "The Benefits of Reading",
    content: `Reading is one of the most beneficial activities for the human mind. When we read books, magazines, or newspapers, our brain processes information in a unique way that helps improve cognitive function. Studies have shown that regular reading can enhance vocabulary, improve concentration, and even reduce stress levels.

One of the greatest advantages of reading is its ability to expand our knowledge. Through books, we can learn about different cultures, historical events, and scientific discoveries without physically traveling or conducting experiments ourselves. This makes reading an incredibly efficient way to gain information and broaden our perspectives.

Furthermore, reading fiction can help develop empathy. When we read about characters facing various challenges, we learn to understand different viewpoints and emotional experiences. This emotional intelligence gained from reading can improve our relationships with others in real life.`,
    translation: `독서는 인간의 정신에 가장 유익한 활동 중 하나입니다. 우리가 책, 잡지, 신문을 읽을 때, 우리의 뇌는 인지 기능 향상에 도움이 되는 독특한 방식으로 정보를 처리합니다. 연구에 따르면 정기적인 독서는 어휘력을 향상시키고, 집중력을 개선하며, 심지어 스트레스 수준을 줄일 수 있다고 합니다.

독서의 가장 큰 장점 중 하나는 우리의 지식을 확장시키는 능력입니다. 책을 통해 우리는 직접 여행하거나 실험을 하지 않고도 다른 문화, 역사적 사건, 과학적 발견에 대해 배울 수 있습니다. 이는 독서를 정보를 얻고 관점을 넓히는 매우 효율적인 방법으로 만듭니다.

더 나아가, 소설 읽기는 공감 능력을 기르는 데 도움이 될 수 있습니다. 다양한 도전에 직면한 등장인물들에 대해 읽을 때, 우리는 다른 관점과 감정적 경험을 이해하는 법을 배웁니다. 독서에서 얻은 이러한 감정 지능은 실생활에서 다른 사람들과의 관계를 개선시킬 수 있습니다.`,
    keyVocabulary: [
      "beneficial: 유익한",
      "cognitive: 인지의",
      "enhance: 향상시키다",
      "concentration: 집중력",
      "efficient: 효율적인",
      "perspective: 관점",
      "empathy: 공감",
      "emotional intelligence: 감정 지능"
    ],
    grammarPoints: [
      "현재완료시제: have shown, has shown",
      "동명사 주어: Reading is...",
      "관계대명사: When we read...",
      "비교급: more beneficial than...",
      "수동태: Studies have been conducted..."
    ],
    questions: [
      {
        question: "According to the passage, what is one of the main benefits of reading?",
        options: [
          "A. It helps people sleep better",
          "B. It improves cognitive function", 
          "C. It makes people more athletic",
          "D. It increases physical strength"
        ],
        correctAnswer: 1,
        explanation: "The passage states that reading helps improve cognitive function when our brain processes information."
      },
      {
        question: "How does reading fiction help develop empathy?",
        options: [
          "A. By making us physically stronger",
          "B. By teaching us new languages",
          "C. By helping us understand different viewpoints and emotions",
          "D. By improving our memory skills"
        ],
        correctAnswer: 2,
        explanation: "The passage explains that reading about characters facing challenges helps us understand different viewpoints and emotional experiences."
      },
      {
        question: "What makes reading an efficient way to gain knowledge?",
        options: [
          "A. It requires expensive equipment",
          "B. We can learn about different topics without direct experience",
          "C. It takes a very long time to read",
          "D. It only teaches us about fiction"
        ],
        correctAnswer: 1,
        explanation: "The passage mentions that through books, we can learn about different cultures, historical events, and scientific discoveries without physically traveling or conducting experiments."
      },
      {
        question: "According to the passage, regular reading can:",
        options: [
          "A. Only improve vocabulary",
          "B. Only reduce stress",
          "C. Enhance vocabulary, improve concentration, and reduce stress",
          "D. Make people taller"
        ],
        correctAnswer: 2,
        explanation: "The passage explicitly states that regular reading can enhance vocabulary, improve concentration, and even reduce stress levels."
      },
      {
        question: "The word 'broaden' in the passage most likely means:",
        options: [
          "A. To make narrower",
          "B. To expand or widen",
          "C. To destroy completely",
          "D. To make shorter"
        ],
        correctAnswer: 1,
        explanation: "'Broaden our perspectives' means to expand or widen our viewpoints and understanding."
      }
    ]
  }

  useEffect(() => {
    const loadPassage = async () => {
      try {
        // Default to difficulty level 1 for new users
        const response = await fetch('/api/generate-passage?difficulty=1')
        
        if (!response.ok) {
          throw new Error('Failed to load passage')
        }
        
        const passageData = await response.json()
        setPassage(passageData)
      } catch (error) {
        console.error('Error loading passage:', error)
        // Fallback to sample passage if API fails
        setPassage(samplePassage)
      } finally {
        setIsLoading(false)
      }
    }

    loadPassage()
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < passage!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === passage!.questions[index].correctAnswer
      ).length
      const finalScore = Math.round((correctAnswers / passage!.questions.length) * 100)
      setScore(finalScore)
      setIsCompleted(true)
      
      localStorage.setItem('testResult', JSON.stringify({
        score: finalScore,
        answers: newAnswers,
        passage: passage,
        completedAt: new Date().toISOString()
      }))
    }
  }

  const handleShowResults = () => {
    setShowResults(true)
  }

  const handleLoginPrompt = () => {
    router.push('/auth/login?redirect=/results')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI가 맞춤형 독해 지문을 생성하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (!passage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">지문을 불러오는데 실패했습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  if (isCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">테스트 완료!</h1>
              <p className="text-lg text-gray-600">
                수고하셨습니다. 점수: <span className="font-bold text-blue-600">{score}점</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleShowResults}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                테스트 결과 보기
              </button>
              
              <p className="text-sm text-gray-500">
                * 상세한 결과와 해석을 보려면 회원가입이 필요합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
              <p className="text-lg text-gray-600 mb-6">
                테스트 결과를 확인하고 저장하려면 회원가입 또는 로그인해주세요.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">회원가입 혜택</h3>
                <ul className="text-blue-800 text-left space-y-2">
                  <li>• 상세한 테스트 결과 및 해석</li>
                  <li>• 개인별 맞춤 난이도 추천</li>
                  <li>• 학습 진도 추적</li>
                  <li>• 틀린 문제 복습 기능</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleLoginPrompt}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  로그인 / 회원가입
                </button>
                
                <Link 
                  href="/"
                  className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = passage.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / passage.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                문제 {currentQuestion + 1} / {passage.questions.length}
              </span>
              <Link href="/" className="text-blue-600 hover:underline text-sm">
                홈으로
              </Link>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{passage.title}</h1>
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {passage.content}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentQ.question}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedAnswer !== null
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion < passage.questions.length - 1 ? '다음 문제' : '테스트 완료'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}