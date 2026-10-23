import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatArea, formatPrice } from '@/features/listings/format';
import { fetchPropertyDetail } from '@/lib/api';
import { getMessages, resolveLocale } from '@/messages';

interface PageProps {
  readonly params: Promise<{ slug: string }>;
  readonly searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchPropertyDetail(slug).catch(() => null);
  if (!property) return { title: 'Listing', robots: { index: false, follow: false } };
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    alternates: { canonical: `/property/${property.slug}` },
  };
}

export default async function PropertyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const messages = getMessages(locale);
  const formatLocale = locale === 'bn' ? 'bn-BD' : 'en-BD';

  let property;
  try {
    property = await fetchPropertyDetail(slug);
  } catch {
    return (
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] p-4"
        >
          {messages.detailUnavailable}
        </p>
      </main>
    );
  }
  if (!property) notFound();

  const kindLabel: Record<string, string> = {
    APARTMENT: messages.kindApartment,
    HOUSE: messages.kindHouse,
    LAND: messages.kindLand,
    COMMERCIAL: messages.kindCommercial,
  };
  const cover = property.media[0];
  const price = formatPrice(property.priceMinor, property.currencyCode, formatLocale);
  const suffix = property.listingType === 'RENT' ? ` ${messages.perMonth}` : '';
  const area = locale === 'bn' ? property.areaNameBn : property.areaNameEn;

  return (
    <main id="main" className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
      <Link
        href={`/search?lang=${locale}`}
        className="mb-4 inline-flex min-h-11 items-center text-sm font-medium underline"
      >
        ← {messages.backToSearch}
      </Link>

      <div className="grid gap-5 md:grid-cols-[3fr_2fr] md:gap-8">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover?.url ?? '/images/property-placeholder.svg'}
            alt={cover?.altText ?? property.title}
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <section className="flex flex-col gap-3">
          <p className="text-2xl font-semibold sm:text-3xl">
            {price}
            <span className="text-base font-normal text-[color:var(--color-muted)]">{suffix}</span>
          </p>
          <h1 className="text-lg font-semibold sm:text-2xl">{property.title}</h1>
          <p className="text-sm text-[color:var(--color-muted)]">{area}, Khulna</p>
          {property.isDemo ? (
            <p
              role="status"
              className="rounded-[var(--radius-md)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-3 py-2 text-xs"
            >
              {messages.demoBanner}
            </p>
          ) : null}

          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
            {messages.factsHeading}
          </h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[color:var(--color-muted)]">{messages.kindLabel}</dt>
              <dd className="font-medium">{kindLabel[property.kind]}</dd>
            </div>
            {property.bedrooms !== null ? (
              <div>
                <dt className="text-[color:var(--color-muted)]">{messages.bedrooms}</dt>
                <dd className="font-medium">{property.bedrooms}</dd>
              </div>
            ) : null}
            {property.bathrooms !== null ? (
              <div>
                <dt className="text-[color:var(--color-muted)]">{messages.bathrooms}</dt>
                <dd className="font-medium">{property.bathrooms}</dd>
              </div>
            ) : null}
            {property.areaSqm !== null ? (
              <div>
                <dt className="text-[color:var(--color-muted)]">{messages.area}</dt>
                <dd className="font-medium">{formatArea(property.areaSqm, formatLocale)}</dd>
              </div>
            ) : null}
            {property.developerName ? (
              <div className="col-span-2">
                <dt className="text-[color:var(--color-muted)]">{messages.developerLabel}</dt>
                <dd className="font-medium">{property.developerName}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-base font-semibold">{messages.descriptionHeading}</h2>
        <p className="max-w-prose leading-relaxed text-[color:var(--color-foreground)]">
          {property.description}
        </p>
      </section>
    </main>
  );
}
