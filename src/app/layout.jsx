import { ApplePwaSplash } from '@/app/apple-pwa-splash';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ProgressBar } from '@/components/progress-bar';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/lib/analytics/analytics';
import { getAnalyticsConfig } from '@/lib/analytics/config';
import { effectiveBaseUrl } from '@/lib/env';
import { TRPCProvider } from '@/trpc/client';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';
export async function generateMetadata() {
    const t = await getTranslations('Homepage');
    return {
        metadataBase: new URL(effectiveBaseUrl),
        title: {
            default: t('metaTitle'),
            template: '%s · Spliit',
        },
        description: 'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
        openGraph: {
            title: t('metaTitle'),
            description: 'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
            images: `/banner.png`,
            type: 'website',
            url: '/',
        },
        twitter: {
            card: 'summary_large_image',
            images: `/banner.png`,
            title: t('metaTitle'),
            description: 'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
        },
        appleWebApp: {
            capable: true,
            title: 'Spliit',
        },
        applicationName: 'Spliit',
        icons: [
            {
                url: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                url: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
export const viewport = {
    themeColor: '#047857',
};
function Content({ children }) {
    const t = useTranslations();
    return (<TRPCProvider>
      <header className="fixed top-0 border-b flex justify-between items-center h-16 w-full px-4 sm:px-6 md:px-8 bg-slate-50 bg-opacity-80 dark:bg-card dark:bg-opacity-80 backdrop-blur z-50">
        <Link href="/">
          <h1>
            <Image src="/logo-with-text.png" className="m-1 h-auto w-auto" width={(35 * 522) / 180} height={35} alt="Spliit"/>
          </h1>
        </Link>
        <div role="navigation" aria-label="Menu" className="flex">
          <ul className="flex items-center text-sm">
            <li>
              <Button variant="ghost" size="sm" asChild className="-my-3 text-primary">
                <Link href="/groups">{t('Header.groups')}</Link>
              </Button>
            </li>
            <li>
              <LocaleSwitcher />
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </header>

      <div className="pt-16 flex-1 flex flex-col">{children}</div>

      <footer className="sm:p-8 md:p-16 sm:mt-16 sm:text-sm md:text-base md:mt-32 bg-slate-50 dark:bg-card border-t p-6 mt-8 flex flex-col sm:flex-row sm:justify-between gap-4 text-xs [&_a]:underline">
        <div className="flex flex-col space-y-2">
          <div className="sm:text-lg font-semibold text-base flex space-x-2 items-center">
            <Link className="flex items-center gap-2" href="/">
              <Image src="/logo-with-text.png" className="m-1 h-auto w-auto" width={(35 * 522) / 180} height={35} alt="Spliit"/>
            </Link>
          </div>
          <div className="flex flex-col space-y a--no-underline-text-white">
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
      <Toaster />
    </TRPCProvider>);
}
export default async function RootLayout({ children, }) {
    const locale = await getLocale();
    const messages = await getMessages();
    const analyticsConfig = await getAnalyticsConfig();
    return (<html lang={locale} dir={['ar', 'he'].includes(locale) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <ApplePwaSplash icon="/logo-with-text.png" color="#047857"/>
      <body className="min-h-[100dvh] flex flex-col items-stretch bg-slate-50 bg-opacity-30 dark:bg-background">
        <NextIntlClientProvider messages={messages}>
          {/* Rendered inside the provider because it reads translations via
            `useTranslations`, which needs NextIntlClientProvider in its
            ancestor tree. */}
          <ServiceWorkerRegistration />
          <Analytics config={analyticsConfig}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Suspense>
                <ProgressBar />
              </Suspense>
              <Content>{children}</Content>
            </ThemeProvider>
          </Analytics>
        </NextIntlClientProvider>
      </body>
    </html>);
}
