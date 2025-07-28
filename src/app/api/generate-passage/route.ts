import { NextRequest, NextResponse } from 'next/server'
import { generateReadingPassage } from '@/lib/claude'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { difficultyLevel = 1 } = await request.json()

    // Validate difficulty level
    if (difficultyLevel < 1 || difficultyLevel > 5) {
      return NextResponse.json(
        { error: 'Invalid difficulty level. Must be between 1 and 5.' },
        { status: 400 }
      )
    }

    // Generate passage using Claude API
    const passage = await generateReadingPassage(difficultyLevel)

    // Save to database
    const { data: savedPassage, error: saveError } = await supabase
      .from('reading_passages')
      .insert([
        {
          title: passage.title,
          content: passage.content,
          difficulty_level: difficultyLevel,
          translation: passage.translation,
          key_vocabulary: passage.keyVocabulary,
          grammar_points: passage.grammarPoints,
          questions: passage.questions
        }
      ])
      .select()
      .single()

    if (saveError) {
      console.error('Error saving passage:', saveError)
      // Return generated passage even if save fails
      return NextResponse.json(passage)
    }

    return NextResponse.json(passage)
  } catch (error) {
    console.error('Error generating passage:', error)
    return NextResponse.json(
      { error: 'Failed to generate reading passage' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const difficultyLevel = parseInt(url.searchParams.get('difficulty') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '1')

    // Validate parameters
    if (difficultyLevel < 1 || difficultyLevel > 5) {
      return NextResponse.json(
        { error: 'Invalid difficulty level. Must be between 1 and 5.' },
        { status: 400 }
      )
    }

    // Get existing passages from database
    const { data: passages, error } = await supabase
      .from('reading_passages')
      .select('*')
      .eq('difficulty_level', difficultyLevel)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching passages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch passages' },
        { status: 500 }
      )
    }

    // If no passages found, generate a new one
    if (!passages || passages.length === 0) {
      const newPassage = await generateReadingPassage(difficultyLevel)
      
      // Save the generated passage
      const { error: saveError } = await supabase
        .from('reading_passages')
        .insert([
          {
            title: newPassage.title,
            content: newPassage.content,
            difficulty_level: difficultyLevel,
            translation: newPassage.translation,
            key_vocabulary: newPassage.keyVocabulary,
            grammar_points: newPassage.grammarPoints,
            questions: newPassage.questions
          }
        ])

      if (saveError) {
        console.error('Error saving new passage:', saveError)
      }

      return NextResponse.json(newPassage)
    }

    // Return existing passage
    const passage = passages[0]
    return NextResponse.json({
      title: passage.title,
      content: passage.content,
      translation: passage.translation,
      keyVocabulary: passage.key_vocabulary,
      grammarPoints: passage.grammar_points,
      questions: passage.questions
    })
  } catch (error) {
    console.error('Error in GET /api/generate-passage:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}