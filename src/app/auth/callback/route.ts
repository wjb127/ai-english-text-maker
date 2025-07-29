import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth?error=callback_error', request.url))
      }

      if (data.session) {
        // Check if user exists in our users table
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.session.user.id)
          .single()

        // If user doesn't exist, create user record
        if (!existingUser && fetchError?.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: data.session.user.user_metadata?.full_name || 
                      data.session.user.user_metadata?.name ||
                      data.session.user.email?.split('@')[0] || 
                      'User',
                subscription_status: 'free'
              }
            ])

          if (insertError) {
            console.error('Error creating user record:', insertError)
          }
        }

        // Redirect to the intended page
        return NextResponse.redirect(new URL(redirect, request.url))
      }
    } catch (error) {
      console.error('Callback error:', error)
      return NextResponse.redirect(new URL('/auth?error=callback_error', request.url))
    }
  }

  // If no code or session, redirect to auth page
  return NextResponse.redirect(new URL('/auth', request.url))
}