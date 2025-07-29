import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if both environment variables are properly set
const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export const isSupabaseConfigured = () => isConfigured

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          subscription_status: 'free' | 'premium'
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          subscription_status?: 'free' | 'premium'
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          subscription_status?: 'free' | 'premium'
        }
      }
      reading_passages: {
        Row: {
          id: string
          title: string
          content: string
          difficulty_level: 1 | 2 | 3 | 4 | 5
          translation: string
          key_vocabulary: string[]
          grammar_points: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          difficulty_level: 1 | 2 | 3 | 4 | 5
          translation: string
          key_vocabulary: string[]
          grammar_points: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          difficulty_level?: 1 | 2 | 3 | 4 | 5
          translation?: string
          key_vocabulary?: string[]
          grammar_points?: string[]
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          user_id: string
          passage_id: string
          score: number
          difficulty_level: 1 | 2 | 3 | 4 | 5
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          passage_id: string
          score: number
          difficulty_level: 1 | 2 | 3 | 4 | 5
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          passage_id?: string
          score?: number
          difficulty_level?: 1 | 2 | 3 | 4 | 5
          completed_at?: string
        }
      }
    }
  }
}