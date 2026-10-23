import type { Metadata } from 'next';
import Link from 'next/link';
import { ListingGrid } from '@/components/listings/listing-grid';
import { FilterForm } from '@/components/search/filter-form';
import { fetchAreas, fetchProperties } from '@/lib/api';
import { toListingSummary } from '@/lib/map-listing';
import { FILTER_KEYS, toApiParams } from '@/lib/search-params';
import { fillMessage, getMessages, resolveLocale } from '@/messages';

export const metadata: Metadata = {
  title: 'Search properties',
  description: 'Search rentals and homes for sale in Khulna and nearby areas.',
};

type RawSearch = Record<string, string | string[] | undefined>;

interface PageProps {
  readonly searchParams: Promise<RawSearch>;
}

function single(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export default async function SearchPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const locale = resolveLocale(single(raw['lang']));
  const messages = getMessages(locale);
  const apiParams = toApiParams(raw);
  const [result, areas] = await Promise.all([fetchProperties(apiParams), fetchAreas()]);

  const values = Object.fromEntries(FILTER_KEYS.map((k) => [k, single(raw[k])]));
  const { data, source } = result;
  const cards = data.items.map((p) => toListingSummary(p, locale));
  const hrefFor = (slug: string) => `/property/${slug}?lang=${locale}`;

  const pageLink = (page: number) => {
    const params = new URLSearchParams(apiParams);
    params.set('page', String(page));
    params.set('lang', locale);
    return `/search?${params.toString()}`;
  };

  return (
    <main id="main" className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
      <header className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
          {messages.searchHeading}
        </h1>
        <p className="text-sm text-[color:var(--color-muted)]" aria-live="polite">
          {fillMessage(messages.resultsCount, { count: data.total })}
        </p>
      </header>

      {source === 'demo' ? (
        <p
          role="status"
          className="mb-4 rounded-[var(--radius-md)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 py-3 text-sm"
        >
          {messages.demoBanner}
        </p>
      ) : null}

      <section
        aria-label={messages.searchHeading}
        className="mb-6 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 sm:p-4"
      >
        <FilterForm messages={messages} locale={locale} areas={areas} values={values} />
      </section>

      <ListingGrid
        listings={cards}
        locale={locale === 'bn' ? 'bn-BD' : 'en-BD'}
        messages={messages}
        hrefFor={(l) => hrefFor(l.slug)}
      />

      {data.totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className="mt-6 flex items-center justify-between gap-3 text-sm"
        >
          {data.page > 1 ? (
            <Link
              className="min-h-11 inline-flex items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4"
              href={pageLink(data.page - 1)}
            >
              {messages.previous}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-[color:var(--color-muted)]">
            {fillMessage(messages.pageOf, { page: data.page, total: data.totalPages })}
          </span>
          {data.page < data.totalPages ? (
            <Link
              className="min-h-11 inline-flex items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4"
              href={pageLink(data.page + 1)}
            >
              {messages.next}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </main>
  );
}
