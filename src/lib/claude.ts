import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ReadingPassage {
  title: string
  content: string
  translation: string
  keyVocabulary: string[]
  grammarPoints: string[]
  questions: Question[]
  // Anti-pattern tracking
  generationMetadata?: {
    topic: string
    style: string
    perspective: string
    questionFocus: string
    difficultyLevel: number
  }
}

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export async function generateReadingPassage(difficultyLevel: DifficultyLevel): Promise<ReadingPassage> {
  const difficultyMap = {
    1: 'absolute beginner (입문)',
    2: 'early beginner (초보)',
    3: 'beginner (초급)',
    4: 'high beginner (상급 초급)',
    5: 'low elementary (하급 초중급)',
    6: 'elementary (초중급)',
    7: 'high elementary (상급 초중급)',
    8: 'low intermediate (하급 중급)',
    9: 'intermediate (중급)',
    10: 'high intermediate (상급 중급)',
    11: 'low upper-intermediate (하급 중고급)',
    12: 'upper-intermediate (중고급)',
    13: 'high upper-intermediate (상급 중고급)',
    14: 'low advanced (하급 고급)',
    15: 'advanced (고급)',
    16: 'proficient/native-like (최고급)'
  }

  const getWordLengthAndComplexity = (level: DifficultyLevel) => {
    if (level <= 4) return { words: '100-150', complexity: 'simple sentences, present tense, basic vocabulary' }
    if (level <= 8) return { words: '150-250', complexity: 'compound sentences, past/future tenses, common vocabulary' }
    if (level <= 12) return { words: '250-350', complexity: 'complex sentences, various tenses, intermediate vocabulary' }
    return { words: '350-500', complexity: 'sophisticated structures, advanced vocabulary, nuanced expressions' }
  }

  const getQuestionCount = (level: DifficultyLevel) => {
    if (level <= 4) return 3
    if (level <= 8) return 4
    if (level <= 12) return 5
    return 6
  }

  const { words, complexity } = getWordLengthAndComplexity(difficultyLevel)
  const questionCount = getQuestionCount(difficultyLevel)

  // Anti-pattern system: randomize various aspects
  const topics = [
    'daily life and routines', 'science and technology', 'culture and traditions', 
    'history and historical events', 'environment and nature', 'health and wellness',
    'education and learning', 'sports and recreation', 'travel and exploration',
    'food and cooking', 'arts and creativity', 'business and economics',
    'psychology and behavior', 'social issues', 'future predictions',
    'innovation and inventions', 'relationships and communication', 'hobbies and interests'
  ]

  const styles = [
    'narrative storytelling', 'informative article', 'descriptive essay',
    'analytical discussion', 'comparative analysis', 'cause and effect explanation',
    'problem-solution format', 'chronological account', 'interview-style content',
    'scientific report', 'personal reflection', 'argumentative piece'
  ]

  const perspectives = [
    'third person objective', 'first person experience', 'expert commentary',
    'student perspective', 'historical viewpoint', 'cross-cultural comparison',
    'scientific observation', 'personal journey', 'social commentary'
  ]

  const randomTopic = topics[Math.floor(Math.random() * topics.length)]
  const randomStyle = styles[Math.floor(Math.random() * styles.length)]
  const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)]

  // Additional randomization for question types
  const questionTypes = [
    'main idea and details', 'inference and interpretation', 'vocabulary in context',
    'cause and effect', 'comparison and contrast', 'author\'s purpose and tone',
    'sequence and chronology', 'fact vs opinion', 'supporting evidence'
  ]
  const randomQuestionFocus = questionTypes[Math.floor(Math.random() * questionTypes.length)]

  // Generate timestamp-based variation
  const currentHour = new Date().getHours()
  const timeBasedVariation = currentHour % 3 === 0 ? 'formal academic tone' : 
                           currentHour % 3 === 1 ? 'conversational and engaging tone' : 
                           'balanced informative tone'

  const prompt = `Create a unique English reading comprehension passage for ${difficultyMap[difficultyLevel]} level Korean learners.

CONTENT SPECIFICATIONS:
- Topic: ${randomTopic}
- Writing style: ${randomStyle}
- Perspective: ${randomPerspective}
- Tone: ${timeBasedVariation}
- Length: ${words} words
- Language complexity: ${complexity}

STRUCTURAL REQUIREMENTS:
- Create an engaging, creative title (avoid generic titles)
- Write original content - DO NOT use common textbook examples
- Provide complete Korean translation of the entire passage
- List 6-10 key vocabulary words with Korean meanings (level ${difficultyLevel} appropriate)
- Identify 4-6 important grammar points used in the passage with Korean explanations
- Create ${questionCount} multiple choice questions focusing on: ${randomQuestionFocus}

ANTI-PATTERN INSTRUCTIONS:
- Vary sentence structures and lengths significantly
- Use diverse vocabulary and avoid repetitive phrases
- Create unique scenarios and examples
- Mix question types (literal, inferential, analytical)
- Ensure cultural relevance and engagement for Korean learners

IMPORTANT: Be creative and original. Avoid formulaic structures. Each passage should feel fresh and unique.

Format your response as valid JSON:
{
  "title": "creative and engaging title",
  "content": "unique reading passage text",
  "translation": "완전한 한국어 번역",
  "keyVocabulary": ["word1: 한국어 뜻", "word2: 한국어 뜻", ...],
  "grammarPoints": ["문법 포인트 1 (한국어 설명)", "문법 포인트 2 (한국어 설명)", ...],
  "questions": [
    {
      "question": "varied question text in English",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correctAnswer": 0,
      "explanation": "detailed Korean explanation for the correct answer"
    }
  ]
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedPassage = JSON.parse(jsonMatch[0])
        
        // Add generation metadata for pattern tracking
        parsedPassage.generationMetadata = {
          topic: randomTopic,
          style: randomStyle,
          perspective: randomPerspective,
          questionFocus: randomQuestionFocus,
          difficultyLevel: difficultyLevel
        }
        
        return parsedPassage
      }
    }

    throw new Error('Failed to parse Claude response')
  } catch (error) {
    console.error('Error generating reading passage:', error)
    throw error
  }
}

export default anthropic