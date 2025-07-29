'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabaseClient } from '@/lib/supabase-client'
import { type AuthChangeEvent, type Session } from '@supabase/supabase-js'

export default function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if user exists in our users table
        const { data: existingUser, error } = await supabaseClient
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        // If user doesn't exist, create user record
        if (!existingUser && !error) {
          const { error: insertError } = await supabaseClient
            .from('users')
            .insert([
              {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                subscription_status: 'free'
              }
            ])

          if (insertError) {
            console.error('Error creating user record:', insertError)
          }
        }

        // Redirect to the intended page
        router.push(redirect)
      }
      
      setLoading(false)
    })

    // Check current session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirect)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, redirect])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">인증을 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 safe-top safe-bottom">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI 영어 독해 연습</h1>
          <h2 className="mt-4 md:mt-6 text-xl md:text-2xl font-semibold text-gray-700">
            로그인 / 회원가입
          </h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            계속하려면 로그인하거나 새 계정을 만드세요
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 md:py-8 px-4 shadow-lg mobile-card sm:px-6 md:sm:px-10">
          <Auth
            supabaseClient={supabaseClient}
            view="magic_link"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                  fonts: {
                    bodyFontFamily: 'inherit',
                    buttonFontFamily: 'inherit',
                    inputFontFamily: 'inherit',
                    labelFontFamily: 'inherit',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '16px',
                    baseLabelSize: '14px',
                    baseButtonSize: '16px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                anchor: 'text-blue-600 hover:text-blue-500 text-sm md:text-base',
                button: 'w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm md:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-98 transition-all duration-200 min-touch-target',
                input: 'appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base min-touch-target',
                label: 'block text-sm md:text-base font-medium text-gray-700 mb-2',
                message: 'mt-2 text-sm text-red-600',
                container: 'space-y-4',
                divider: 'my-6',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: '이메일',
                  password_label: '비밀번호',
                  email_input_placeholder: 'your@email.com',
                  password_input_placeholder: '비밀번호를 입력하세요',
                  button_label: '로그인',
                  loading_button_label: '로그인 중...',
                  social_provider_text: '{{provider}}로 로그인',
                  link_text: '이미 계정이 있으신가요? 로그인하기',
                },
                sign_up: {
                  email_label: '이메일',
                  password_label: '비밀번호',
                  email_input_placeholder: 'your@email.com',
                  password_input_placeholder: '비밀번호를 입력하세요',
                  button_label: '회원가입',
                  loading_button_label: '회원가입 중...',
                  social_provider_text: '{{provider}}로 회원가입',
                  link_text: '계정이 없으신가요? 회원가입하기',
                },
                magic_link: {
                  email_input_label: '이메일',
                  email_input_placeholder: 'your@email.com',
                  button_label: '매직 링크 보내기',
                  loading_button_label: '전송 중...',
                  link_text: '매직 링크로 로그인',
                },
                forgotten_password: {
                  email_label: '이메일',
                  password_label: '비밀번호',
                  email_input_placeholder: 'your@email.com',
                  button_label: '비밀번호 재설정 링크 보내기',
                  loading_button_label: '전송 중...',
                  link_text: '비밀번호를 잊으셨나요?',
                },
              },
            }}
            providers={['google', 'github']}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}` : undefined}
            showLinks={true}
            magicLink={true}
          />
          
          <div className="mt-6 text-xs md:text-sm text-gray-500 text-center">
            로그인 시{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              이용약관
            </a>
            {' '}및{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              개인정보처리방침
            </a>
            에 동의합니다.
          </div>
        </div>
      </div>
    </div>
  )
}