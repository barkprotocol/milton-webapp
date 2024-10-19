import type { Metadata } from 'next';
import { Poppins, Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/ui/layout/header';
import { Footer } from '@/components/ui/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import './styles/globals.css';

// Load fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

// Define metadata for the page
export const metadata: Metadata = {
  title: 'Milton - Decentralized Social Finance Solutions',
  description:
    'Milton provides innovative decentralized finance solutions, empowering users with cutting-edge blockchain technology.',
  keywords: [
    'DeFi',
    'Blockchain',
    'Solana',
    'Meme Coin',
    'Decentralized Finance',
    'Milton',
  ],
  authors: [{ name: 'BARK Protocol' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://miltonprotocol.com',
    siteName: 'MILTON',
    title: 'Milton - Decentralized Finance Solutions',
    description:
      'Empowering users with cutting-edge blockchain technology and innovative DeFi solutions.',
    images: [
      {
        url: 'https://miltonprotocol.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Milton Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Milton',
    creator: '@bark_protocol',
  },
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${syne.variable} scroll-smooth`}>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
          >
            Skip to main content
          </a>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}