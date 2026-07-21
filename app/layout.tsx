import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Casantiqua',
  description:
    'Casantiqua adalah spesialis konstruksi dan pelestarian Rumah Joglo tradisional di Bali. Menghadirkan kemegahan klasik berpadu kualitas arsitektur modern.',
  keywords: 'Joglo, Rumah Joglo, Casantiqua, Bali, Kontraktor Joglo, Kayu Jati, Arsitektur Tradisional',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
        <AnalyticsTracker />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
