import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 영어 독해 연습",
  description: "AI가 생성하는 맞춤형 영어 독해 지문으로 실력을 향상시키세요",
  keywords: ["영어", "독해", "AI", "학습", "교육", "레벨테스트"],
  authors: [{ name: "AI English Reading" }],
  creator: "AI English Reading Team",
  publisher: "AI English Reading",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-english-text-maker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI 영어 독해 연습",
    description: "AI가 생성하는 맞춤형 영어 독해 지문으로 실력을 향상시키세요",
    url: "https://ai-english-text-maker.vercel.app",
    siteName: "AI 영어 독해 연습",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 영어 독해 연습",
    description: "AI가 생성하는 맞춤형 영어 독해 지문으로 실력을 향상시키세요",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI독해",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
