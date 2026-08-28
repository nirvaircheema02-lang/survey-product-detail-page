import type { Metadata } from 'next';
import { DM_Sans, Noto_Serif } from 'next/font/google';
import './globals.css';

// Variable fonts · omit `weight` prop → next/font fetches the variable axis (single file · full weight range)
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  axes: ['opsz'],
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ken Research — Survey Product Detail Page',
  description: 'Survey product detail page — Bank vs NBFC Preference Survey (SMEs).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${notoSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-semibold focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
