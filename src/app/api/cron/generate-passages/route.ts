import { NextRequest, NextResponse } from 'next/server'
import { generateReadingPassage } from '@/lib/claude'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you might want to add proper authentication)
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = []
    const errors = []

    // Generate passages for each difficulty level
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      try {
        // Check if we need more passages for this difficulty
        const { data: existingPassages, error: countError } = await supabase
          .from('reading_passages')
          .select('id')
          .eq('difficulty_level', difficulty)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Created in last 24 hours

        if (countError) {
          console.error(`Error counting passages for difficulty ${difficulty}:`, countError)
          continue
        }

        // Only generate if we have fewer than 3 passages created today
        if (existingPassages && existingPassages.length >= 3) {
          results.push(`Difficulty ${difficulty}: Already has ${existingPassages.length} recent passages`)
          continue
        }

        // Generate new passage
        const passage = await generateReadingPassage(difficulty as 1 | 2 | 3 | 4 | 5)

        // Save to database
        const { data: savedPassage, error: saveError } = await supabase
          .from('reading_passages')
          .insert([
            {
              title: passage.title,
              content: passage.content,
              difficulty_level: difficulty,
              translation: passage.translation,
              key_vocabulary: passage.keyVocabulary,
              grammar_points: passage.grammarPoints,
              questions: passage.questions
            }
          ])
          .select('id')
          .single()

        if (saveError) {
          console.error(`Error saving passage for difficulty ${difficulty}:`, saveError)
          errors.push(`Difficulty ${difficulty}: Save error - ${saveError.message}`)
        } else {
          results.push(`Difficulty ${difficulty}: Generated passage "${passage.title}" (ID: ${savedPassage?.id})`)
        }

        // Add delay between generations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (error) {
        console.error(`Error generating passage for difficulty ${difficulty}:`, error)
        errors.push(`Difficulty ${difficulty}: Generation error - ${error}`)
      }
    }

    // Clean old passages (keep only last 50 per difficulty level)
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      try {
        const { data: oldPassages, error: fetchError } = await supabase
          .from('reading_passages')
          .select('id')
          .eq('difficulty_level', difficulty)
          .order('created_at', { ascending: false })
          .range(50, 1000) // Get passages from 51st onwards

        if (fetchError) {
          console.error(`Error fetching old passages for difficulty ${difficulty}:`, fetchError)
          continue
        }

        if (oldPassages && oldPassages.length > 0) {
          const oldIds = oldPassages.map(p => p.id)
          
          const { error: deleteError } = await supabase
            .from('reading_passages')
            .delete()
            .in('id', oldIds)

          if (deleteError) {
            console.error(`Error deleting old passages for difficulty ${difficulty}:`, deleteError)
          } else {
            results.push(`Difficulty ${difficulty}: Cleaned ${oldIds.length} old passages`)
          }
        }
      } catch (error) {
        console.error(`Error cleaning old passages for difficulty ${difficulty}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cron job failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Passage generation cron job endpoint is ready'
  })
}