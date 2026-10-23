import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ListingGrid } from '@/components/listings/listing-grid';
import { SAMPLE_LISTINGS } from '@/features/listings/fixtures';
import { getMessages, type Locale } from '@/messages';

export const metadata: Metadata = {
  title: 'Listing layout preview',
  robots: { index: false, follow: false },
};

interface PageProps {
  readonly searchParams: Promise<{ lang?: string }>;
}

/** Design review route. Synthetic data only; disabled entirely in production builds. */
export default async function ListingsPreviewPage({ searchParams }: PageProps) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { lang } = await searchParams;
  const locale: Locale = lang === 'bn' ? 'bn' : 'en';
  const messages = getMessages(locale);

  return (
    <main id="main" className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
      <header className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
          {messages.listingsHeading}
        </h1>
        <p className="text-sm text-[color:var(--color-muted)]">{messages.sampleNotice}</p>
      </header>
      <ListingGrid
        listings={SAMPLE_LISTINGS}
        locale={locale === 'bn' ? 'bn-BD' : 'en-BD'}
        messages={messages}
      />
    </main>
  );
}
