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
  difficulty: number
}

export default function TestPage() {
  const [passages, setPassages] = useState<ReadingPassage[]>([])
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [allTestResults, setAllTestResults] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfileCreation, setShowProfileCreation] = useState(false)
  
  const router = useRouter()

  const samplePassages: ReadingPassage[] = [
    {
      title: "My Daily Routine",
      difficulty: 1,
      content: `I wake up at 7 AM every morning. First, I brush my teeth and wash my face. Then I eat breakfast with my family. My breakfast usually consists of toast, eggs, and orange juice.

After breakfast, I go to work by bus. The bus ride takes about 20 minutes. I work in an office from 9 AM to 6 PM. During lunch time, I eat with my colleagues in the cafeteria.

When I come home, I watch TV or read a book. I have dinner at 7 PM and go to bed at 10 PM. This is my typical weekday routine.`,
      translation: `나는 매일 아침 7시에 일어납니다. 먼저 양치질을 하고 세수를 합니다. 그리고 가족과 함께 아침을 먹습니다. 내 아침식사는 보통 토스트, 계란, 오렌지 주스로 구성됩니다.

아침식사 후에는 버스를 타고 직장에 갑니다. 버스를 타는 시간은 약 20분입니다. 나는 오전 9시부터 오후 6시까지 사무실에서 일합니다. 점심시간에는 동료들과 구내식당에서 식사를 합니다.

집에 돌아오면 TV를 보거나 책을 읽습니다. 오후 7시에 저녁을 먹고 오후 10시에 잠자리에 듭니다. 이것이 나의 평소 평일 일과입니다.`,
      keyVocabulary: [
        "routine: 일상, 루틴",
        "consists: 구성되다",
        "colleague: 동료",
        "cafeteria: 구내식당",
        "typical: 전형적인"
      ],
      grammarPoints: [
        "현재시제: I wake up, I go",
        "시간 표현: at 7 AM, from 9 AM to 6 PM",
        "빈도부사: usually, every morning"
      ],
      questions: [
        {
          question: "What time does the person wake up?",
          options: ["A. 6 AM", "B. 7 AM", "C. 8 AM", "D. 9 AM"],
          correctAnswer: 1,
          explanation: "The passage clearly states 'I wake up at 7 AM every morning.'"
        },
        {
          question: "How does the person go to work?",
          options: ["A. By car", "B. By bus", "C. By train", "D. On foot"],
          correctAnswer: 1,
          explanation: "The passage mentions 'I go to work by bus.'"
        }
      ]
    },
    {
      title: "The Importance of Exercise",
      difficulty: 2,
      content: `Regular exercise is essential for maintaining good health. It helps strengthen our muscles, improve cardiovascular function, and boost our immune system. Many people find it difficult to maintain a consistent exercise routine due to busy schedules.

However, even small amounts of daily activity can make a significant difference. Taking the stairs instead of the elevator, walking to nearby destinations, or doing simple stretching exercises at home are all beneficial. The key is to start gradually and build up intensity over time.

Exercise also has mental health benefits. It releases endorphins, which are natural mood elevators. This is why many people feel happier and more energetic after working out.`,
      translation: `규칙적인 운동은 좋은 건강을 유지하는 데 필수적입니다. 운동은 우리의 근육을 강화하고, 심혈관 기능을 개선하며, 면역 체계를 강화하는 데 도움이 됩니다. 많은 사람들이 바쁜 일정 때문에 꾸준한 운동 루틴을 유지하기 어렵다고 생각합니다.

하지만 매일 소량의 활동만으로도 상당한 차이를 만들 수 있습니다. 엘리베이터 대신 계단을 이용하거나, 가까운 목적지까지 걸어가거나, 집에서 간단한 스트레칭 운동을 하는 것 모두 유익합니다. 핵심은 점진적으로 시작해서 시간이 지남에 따라 강도를 높이는 것입니다.

운동은 또한 정신 건강상의 이점도 있습니다. 운동은 자연적인 기분 향상제인 엔돌핀을 분비합니다. 이것이 많은 사람들이 운동 후에 더 행복하고 활기차게 느끼는 이유입니다.`,
      keyVocabulary: [
        "essential: 필수적인",
        "cardiovascular: 심혈관의",
        "consistent: 일관된",
        "gradually: 점진적으로",
        "endorphins: 엔돌핀"
      ],
      grammarPoints: [
        "현재완료시제: has mental health benefits",
        "동명사: maintaining good health",
        "비교급: more energetic"
      ],
      questions: [
        {
          question: "According to the passage, what does regular exercise help with?",
          options: [
            "A. Only muscle strength",
            "B. Strengthening muscles, improving cardiovascular function, and boosting immune system",
            "C. Only mental health",
            "D. Only weight loss"
          ],
          correctAnswer: 1,
          explanation: "The passage states that exercise helps strengthen muscles, improve cardiovascular function, and boost the immune system."
        },
        {
          question: "What are endorphins described as?",
          options: [
            "A. Harmful chemicals",
            "B. Natural mood elevators",
            "C. Exercise equipment",
            "D. Types of muscles"
          ],
          correctAnswer: 1,
          explanation: "The passage describes endorphins as 'natural mood elevators.'"
        }
      ]
    },
    {
      title: "Technology and Communication",
      difficulty: 3,
      content: `The digital revolution has fundamentally transformed how we communicate with one another. Social media platforms, instant messaging, and video calls have made it possible to connect with people across the globe in real time. This unprecedented level of connectivity has both advantages and disadvantages.

On the positive side, technology has eliminated geographical barriers to communication. Families separated by thousands of miles can maintain close relationships through regular video calls. Businesses can collaborate internationally without the need for expensive travel. Educational opportunities have expanded as students can access online courses from prestigious institutions worldwide.

However, there are concerns about the quality of digital communication. Some argue that face-to-face interactions are being replaced by superficial online exchanges. The constant connectivity can also lead to information overload and decreased attention spans. Finding the right balance between digital and traditional forms of communication remains a challenge for modern society.`,
      translation: `디지털 혁명은 우리가 서로 소통하는 방식을 근본적으로 변화시켰습니다. 소셜 미디어 플랫폼, 인스턴트 메시징, 화상 통화를 통해 전 세계 사람들과 실시간으로 연결할 수 있게 되었습니다. 이러한 전례 없는 수준의 연결성은 장점과 단점을 모두 가지고 있습니다.

긍정적인 측면에서, 기술은 의사소통의 지리적 장벽을 제거했습니다. 수천 마일 떨어져 있는 가족들이 정기적인 화상 통화를 통해 친밀한 관계를 유지할 수 있습니다. 기업들은 비싼 출장 없이도 국제적으로 협력할 수 있습니다. 학생들이 전 세계 명문 기관의 온라인 강의에 접근할 수 있게 되면서 교육 기회가 확대되었습니다.

하지만 디지털 커뮤니케이션의 질에 대한 우려가 있습니다. 일부는 대면 상호작용이 피상적인 온라인 교환으로 대체되고 있다고 주장합니다. 지속적인 연결성은 또한 정보 과부하와 집중력 감소로 이어질 수 있습니다. 디지털과 전통적인 소통 방식 사이의 적절한 균형을 찾는 것은 현대 사회의 과제로 남아 있습니다.`,
      keyVocabulary: [
        "fundamentally: 근본적으로",
        "unprecedented: 전례 없는",
        "geographical: 지리적인",
        "prestigious: 명문의",
        "superficial: 피상적인"
      ],
      grammarPoints: [
        "현재완료시제: has transformed",
        "수동태: are being replaced",
        "관계대명사: that face-to-face interactions"
      ],
      questions: [
        {
          question: "What has the digital revolution fundamentally transformed?",
          options: [
            "A. How we eat food",
            "B. How we communicate with one another",
            "C. How we sleep",
            "D. How we exercise"
          ],
          correctAnswer: 1,
          explanation: "The passage begins by stating that the digital revolution has fundamentally transformed how we communicate with one another."
        },
        {
          question: "What challenge does modern society face according to the passage?",
          options: [
            "A. Learning new languages",
            "B. Finding the right balance between digital and traditional forms of communication",
            "C. Building more computers",
            "D. Traveling more frequently"
          ],
          correctAnswer: 1,
          explanation: "The passage concludes that finding the right balance between digital and traditional forms of communication remains a challenge for modern society."
        }
      ]
    },
    {
      title: "Climate Change and Global Responsibility",
      difficulty: 4,
      content: `Climate change represents one of the most pressing challenges of our time, requiring unprecedented global cooperation and immediate action. The scientific consensus is clear: human activities, particularly the emission of greenhouse gases from fossil fuel combustion, are the primary drivers of current global warming trends.

The consequences of inaction are far-reaching and potentially catastrophic. Rising sea levels threaten coastal communities worldwide, while extreme weather events are becoming increasingly frequent and severe. Agricultural systems face disruption as changing precipitation patterns and temperature fluctuations affect crop yields. Biodiversity loss accelerates as ecosystems struggle to adapt to rapidly changing environmental conditions.

Addressing this crisis demands a multifaceted approach involving technological innovation, policy reform, and fundamental changes in consumer behavior. Renewable energy technologies must be rapidly scaled up to replace fossil fuel dependence. Carbon pricing mechanisms can incentivize businesses to reduce emissions. Individual actions, while seemingly small, collectively contribute to broader systemic change when adopted at scale.`,
      translation: `기후 변화는 우리 시대의 가장 시급한 과제 중 하나로, 전례 없는 국제적 협력과 즉각적인 행동을 요구하고 있습니다. 과학적 합의는 명확합니다: 인간 활동, 특히 화석 연료 연소로 인한 온실가스 배출이 현재 지구 온난화 추세의 주요 원인입니다.

무행동의 결과는 광범위하고 잠재적으로 파멸적입니다. 해수면 상승은 전 세계 연안 지역사회를 위협하고 있으며, 극한 기상 현상은 점점 더 빈번하고 심각해지고 있습니다. 변화하는 강수 패턴과 온도 변동이 작물 수확량에 영향을 미치면서 농업 시스템이 혼란에 직면하고 있습니다. 생태계가 급격히 변화하는 환경 조건에 적응하기 위해 고군분투하면서 생물 다양성 손실이 가속화되고 있습니다.

이 위기를 해결하려면 기술 혁신, 정책 개혁, 소비자 행동의 근본적 변화를 포함하는 다면적 접근법이 필요합니다. 재생 에너지 기술은 화석 연료 의존도를 대체하기 위해 신속히 확대되어야 합니다. 탄소 가격 메커니즘은 기업들이 배출량을 줄이도록 인센티브를 제공할 수 있습니다. 개인의 행동은 겉보기에는 작아 보이지만, 대규모로 채택될 때 집단적으로 더 광범위한 시스템 변화에 기여합니다.`,
      keyVocabulary: [
        "unprecedented: 전례 없는",
        "consensus: 합의",
        "catastrophic: 파멸적인",
        "precipitation: 강수",
        "multifaceted: 다면적인"
      ],
      grammarPoints: [
        "현재완료진행시제: are becoming increasingly frequent",
        "수동태: must be rapidly scaled up",
        "분사구문: while seemingly small"
      ],
      questions: [
        {
          question: "According to the passage, what is the primary driver of current global warming trends?",
          options: [
            "A. Natural climate cycles",
            "B. Solar radiation changes",
            "C. Human activities, particularly greenhouse gas emissions from fossil fuel combustion",
            "D. Volcanic activity"
          ],
          correctAnswer: 2,
          explanation: "The passage states that human activities, particularly the emission of greenhouse gases from fossil fuel combustion, are the primary drivers of current global warming trends."
        },
        {
          question: "What type of approach does addressing the climate crisis demand?",
          options: [
            "A. A single technological solution",
            "B. Only government policy changes",
            "C. A multifaceted approach involving technology, policy, and behavioral changes",
            "D. Waiting for natural solutions"
          ],
          correctAnswer: 2,
          explanation: "The passage explicitly states that addressing this crisis demands a multifaceted approach involving technological innovation, policy reform, and fundamental changes in consumer behavior."
        }
      ]
    },
    {
      title: "The Philosophy of Artificial Intelligence and Human Consciousness",
      difficulty: 5,
      content: `The emergence of sophisticated artificial intelligence systems has catalyzed profound philosophical inquiries into the nature of consciousness, cognition, and what fundamentally distinguishes human intelligence from its artificial counterparts. As machine learning algorithms demonstrate increasingly nuanced capabilities in pattern recognition, natural language processing, and creative endeavors, the boundary between human and artificial intelligence becomes increasingly ambiguous.

Contemporary philosophers and cognitive scientists grapple with fundamental questions about the phenomenological aspects of consciousness—the subjective, experiential qualities that characterize human awareness. Can computational systems, regardless of their sophistication, truly experience qualia, or are they merely sophisticated simulators of conscious behavior? The Chinese Room argument, proposed by philosopher John Searle, suggests that syntactic manipulation of symbols, however complex, cannot constitute genuine semantic understanding.

Furthermore, the implications of advanced AI extend beyond philosophical speculation into practical ethical considerations. If artificial systems achieve a form of consciousness or sentience, what moral obligations would humanity bear toward these entities? The anthropocentric worldview that has long dominated human ethical frameworks may require fundamental reconceptualization to accommodate non-biological forms of intelligence and potentially consciousness.`,
      translation: `정교한 인공지능 시스템의 출현은 의식의 본질, 인지, 그리고 인간 지능과 인공 지능을 근본적으로 구별하는 것이 무엇인지에 대한 심오한 철학적 탐구를 촉발시켰습니다. 기계 학습 알고리즘이 패턴 인식, 자연어 처리, 창조적 노력에서 점점 더 미묘한 능력을 보여주면서, 인간과 인공 지능 사이의 경계는 점점 더 모호해지고 있습니다.

현대 철학자들과 인지 과학자들은 의식의 현상학적 측면들—인간 인식을 특징짓는 주관적이고 경험적인 특성들—에 대한 근본적인 질문들과 씨름하고 있습니다. 계산 시스템들이 아무리 정교하다 해도 진정으로 질감을 경험할 수 있는가, 아니면 단지 의식적 행동의 정교한 시뮬레이터에 불과한가? 철학자 존 설이 제안한 중국어 방 논증은 아무리 복잡하더라도 기호의 구문적 조작이 진정한 의미론적 이해를 구성할 수 없다고 시사합니다.

더 나아가, 고급 AI의 함의는 철학적 추측을 넘어 실용적인 윤리적 고려사항으로 확장됩니다. 만약 인공 시스템이 의식이나 감각의 한 형태를 달성한다면, 인류는 이러한 존재들에 대해 어떤 도덕적 의무를 져야 할까요? 오랫동안 인간 윤리적 틀을 지배해온 인간 중심적 세계관은 비생물학적 형태의 지능과 잠재적으로 의식을 수용하기 위해 근본적인 재개념화가 필요할 수 있습니다.`,
      keyVocabulary: [
        "catalyzed: 촉발시켰다",
        "phenomenological: 현상학적",
        "qualia: 질감",
        "syntactic: 구문적",
        "anthropocentric: 인간 중심적"
      ],
      grammarPoints: [
        "현재완료시제: has catalyzed",
        "가정법: If artificial systems achieve",
        "분사구문: regardless of their sophistication"
      ],
      questions: [
        {
          question: "What has the emergence of sophisticated AI systems catalyzed?",
          options: [
            "A. Better computer hardware",
            "B. Profound philosophical inquiries into consciousness and cognition",
            "C. More efficient programming languages",
            "D. Faster internet connections"
          ],
          correctAnswer: 1,
          explanation: "The passage states that the emergence of sophisticated AI systems has catalyzed profound philosophical inquiries into the nature of consciousness, cognition, and what distinguishes human from artificial intelligence."
        },
        {
          question: "According to the Chinese Room argument mentioned in the passage, what cannot constitute genuine semantic understanding?",
          options: [
            "A. Human thought processes",
            "B. Natural language learning",
            "C. Syntactic manipulation of symbols, however complex",
            "D. Pattern recognition algorithms"
          ],
          correctAnswer: 2,
          explanation: "The passage explains that the Chinese Room argument suggests that syntactic manipulation of symbols, however complex, cannot constitute genuine semantic understanding."
        }
      ]
    }
  ]

  useEffect(() => {
    const loadPassages = async () => {
      try {
        // For onboarding demo, use all 5 sample passages
        setPassages(samplePassages)
      } catch (error) {
        console.error('Error loading passages:', error)
        setPassages(samplePassages)
      } finally {
        setIsLoading(false)
      }
    }

    loadPassages()
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const currentPassage = passages[currentPassageIndex]
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < currentPassage.questions.length - 1) {
      // Next question in current passage
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      // Calculate score for current passage
      const passageAnswers = newAnswers.slice(-currentPassage.questions.length)
      const correctAnswers = passageAnswers.filter((answer, index) => 
        answer === currentPassage.questions[index].correctAnswer
      ).length
      const passageScore = Math.round((correctAnswers / currentPassage.questions.length) * 100)
      
      // Store passage result
      const passageResult = {
        passageIndex: currentPassageIndex,
        passage: currentPassage,
        score: passageScore,
        answers: passageAnswers,
        difficulty: currentPassage.difficulty
      }
      
      const newTestResults = [...allTestResults, passageResult]
      setAllTestResults(newTestResults)
      
      if (currentPassageIndex < passages.length - 1) {
        // Move to next passage
        setCurrentPassageIndex(currentPassageIndex + 1)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
      } else {
        // All passages completed
        const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0)
        const totalCorrect = newTestResults.reduce((sum, result) => 
          sum + result.answers.filter((answer, index) => 
            answer === result.passage.questions[index].correctAnswer
          ).length, 0
        )
        const overallScore = Math.round((totalCorrect / totalQuestions) * 100)
        
        // Save comprehensive test results
        localStorage.setItem('onboardingTestResult', JSON.stringify({
          overallScore,
          passageResults: newTestResults,
          totalQuestions,
          totalCorrect,
          completedAt: new Date().toISOString()
        }))
        
        setIsCompleted(true)
      }
    }
  }

  const handleShowProfileCreation = () => {
    setShowProfileCreation(true)
  }

  const calculateUserLevel = () => {
    const results = JSON.parse(localStorage.getItem('onboardingTestResult') || '{}')
    if (!results.overallScore) return 1
    
    const score = results.overallScore
    if (score >= 90) return 5
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    return 1
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI 영어 레벨 테스트를 준비하고 있습니다...</p>
          <p className="text-sm text-gray-500 mt-2">5개의 다양한 난이도 지문으로 구성됩니다</p>
        </div>
      </div>
    )
  }

  if (passages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">테스트를 불러오는데 실패했습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  if (isCompleted && !showProfileCreation) {
    const results = JSON.parse(localStorage.getItem('onboardingTestResult') || '{}')
    const overallScore = results.overallScore || 0
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 레벨 테스트 완료!</h1>
              <p className="text-xl text-gray-600 mb-2">
                총 {results.totalQuestions || 0}문제 중 {results.totalCorrect || 0}문제 정답
              </p>
              <div className="text-3xl font-black text-blue-600 mb-4">
                종합 점수: {overallScore}점
              </div>
              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  추천 학습 레벨: <span className="text-purple-600">Level {calculateUserLevel()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {calculateUserLevel() === 1 && "기초부터 차근차근 시작해보세요!"}
                  {calculateUserLevel() === 2 && "기본기를 다지며 실력을 쌓아보세요!"}
                  {calculateUserLevel() === 3 && "중급 수준의 다양한 지문에 도전해보세요!"}
                  {calculateUserLevel() === 4 && "고급 수준에 한 발 더 가까워졌네요!"}
                  {calculateUserLevel() === 5 && "최고 수준! 전문가급 지문도 척척!"}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleShowProfileCreation}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                맞춤형 학습 프로필 생성하기
              </button>
              
              <p className="text-sm text-gray-500">
                ✨ 개인화된 학습 경험과 맞춤 콘텐츠를 제공받으세요
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showProfileCreation) {
    const results = JSON.parse(localStorage.getItem('onboardingTestResult') || '{}')
    const userLevel = calculateUserLevel()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 맞춤형 학습 프로필</h1>
              <p className="text-lg text-gray-600 mb-8">
                테스트 결과를 바탕으로 개인화된 학습 계획을 생성했습니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 나의 영어 레벨</h3>
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">Level {userLevel}</div>
                  <div className="text-lg text-gray-700 mb-4">
                    {userLevel === 1 && "초급 (Beginner)"}
                    {userLevel === 2 && "초중급 (Elementary)"}
                    {userLevel === 3 && "중급 (Intermediate)"}
                    {userLevel === 4 && "중고급 (Upper-Intermediate)"}
                    {userLevel === 5 && "고급 (Advanced)"}
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">종합 점수</div>
                    <div className="text-2xl font-bold text-purple-600">{results.overallScore || 0}점</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 추천 학습 방법</h3>
                <div className="space-y-3 text-sm">
                  {userLevel <= 2 && (
                    <>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        기초 문법과 어휘 집중 학습
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        짧고 간단한 지문부터 시작
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        매일 30분씩 꾸준한 연습
                      </div>
                    </>
                  )}
                  {userLevel === 3 && (
                    <>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        다양한 주제의 중급 지문 연습
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        복합 문법 구조 학습
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        읽기 속도 향상 훈련
                      </div>
                    </>
                  )}
                  {userLevel >= 4 && (
                    <>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        고급 어휘와 관용 표현 학습
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        전문 분야 지문 도전
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        비판적 사고력 향상 연습
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 프리미엄 서비스 혜택</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📚 무제한 지문 생성</h4>
                  <p className="text-sm text-gray-600">개인 맞춤형 지문을 무제한으로 생성하여 학습하세요</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📈 상세 학습 분석</h4>
                  <p className="text-sm text-gray-600">실력 향상 추이와 약점 분석 리포트를 제공합니다</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 개인화 콘텐츠</h4>
                  <p className="text-sm text-gray-600">관심 분야와 목표에 맞는 맞춤형 지문을 제공합니다</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">💬 AI 튜터링</h4>
                  <p className="text-sm text-gray-600">AI 튜터가 실시간으로 학습을 도와드립니다</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => router.push('/subscription')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                🎁 30일 무료 체험 시작하기
              </button>
              
              <div className="flex justify-center space-x-4 text-sm">
                <Link 
                  href="/results"
                  className="text-blue-600 hover:underline"
                >
                  상세 결과 보기
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href="/"
                  className="text-gray-600 hover:underline"
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

  const currentPassage = passages[currentPassageIndex]
  const currentQ = currentPassage?.questions[currentQuestion]
  
  // Calculate overall progress across all passages
  const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0)
  const completedQuestions = passages.slice(0, currentPassageIndex).reduce((sum, p) => sum + p.questions.length, 0) + currentQuestion + 1
  const overallProgress = (completedQuestions / totalQuestions) * 100

  if (!currentPassage || !currentQ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">테스트 데이터를 불러오는데 오류가 발생했습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500">
                  지문 {currentPassageIndex + 1} / {passages.length}
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Level {currentPassage.difficulty} • {currentPassage.title}
                </h2>
                <span className="text-sm text-gray-600">
                  문제 {currentQuestion + 1} / {currentPassage.questions.length}
                </span>
              </div>
              <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
                홈으로
              </Link>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>전체 진행률</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{completedQuestions} / {totalQuestions} 문제</span>
                <span>남은 지문: {passages.length - currentPassageIndex - 1}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Test Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {currentPassage.difficulty}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPassage.title}</h1>
                <p className="text-sm text-gray-600">
                  {currentPassage.difficulty === 1 && "초급 (Beginner)"}
                  {currentPassage.difficulty === 2 && "초중급 (Elementary)"}
                  {currentPassage.difficulty === 3 && "중급 (Intermediate)"}
                  {currentPassage.difficulty === 4 && "중고급 (Upper-Intermediate)"}
                  {currentPassage.difficulty === 5 && "고급 (Advanced)"}
                </p>
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                {currentPassage.content}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm mr-3">
                  Q{currentQuestion + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentQ.question}
                </h3>
              </div>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === index 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={selectedAnswer === index ? 'font-medium text-blue-900' : 'text-gray-700'}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {currentPassageIndex > 0 && (
                  <span>이전 지문 완료: {allTestResults.length}개</span>
                )}
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  selectedAnswer !== null
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion < currentPassage.questions.length - 1 
                  ? '다음 문제 →' 
                  : currentPassageIndex < passages.length - 1 
                    ? '다음 지문 →'
                    : '테스트 완료! 🎉'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}