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
}

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export async function generateReadingPassage(difficultyLevel: 1 | 2 | 3 | 4 | 5): Promise<ReadingPassage> {
  const difficultyMap = {
    1: 'beginner (초급)',
    2: 'elementary (초중급)',
    3: 'intermediate (중급)',
    4: 'upper-intermediate (중고급)',
    5: 'advanced (고급)'
  }

  const prompt = `Create an English reading comprehension passage for ${difficultyMap[difficultyLevel]} level Korean learners.

Requirements:
- Passage should be 150-300 words
- Include a clear title
- Provide Korean translation of the entire passage
- List 5-8 key vocabulary words with Korean meanings
- Identify 3-5 important grammar points used in the passage
- Create 5 multiple choice questions about the passage

Format your response as JSON:
{
  "title": "passage title",
  "content": "the reading passage",
  "translation": "Korean translation of the passage",
  "keyVocabulary": ["word1: meaning1", "word2: meaning2", ...],
  "grammarPoints": ["grammar point 1", "grammar point 2", ...],
  "questions": [
    {
      "question": "question text",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correctAnswer": 0,
      "explanation": "explanation for the correct answer"
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
        return JSON.parse(jsonMatch[0])
      }
    }

    throw new Error('Failed to parse Claude response')
  } catch (error) {
    console.error('Error generating reading passage:', error)
    throw error
  }
}

export default anthropic