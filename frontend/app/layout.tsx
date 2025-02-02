// src/app/layout.tsx
'use client';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import AuthWrapper from './components/AuthWrapper';

// Only dynamically import the ReduxProvider for client-side rendering
const ReduxProvider = dynamic(() => import('../redux/redux-provider'), {
  ssr: false, // Only load on client-side
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Use ReduxProvider to wrap AuthWrapper and children */}
        <ReduxProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}