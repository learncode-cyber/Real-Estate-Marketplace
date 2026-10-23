import Link from 'next/link';
import type { ListingSummary } from '@/features/listings/types';
import { formatArea, formatPrice, priceSuffix } from '@/features/listings/format';
import type { ListingMessages } from '@/messages';
import { SaveButton } from './save-button';

interface PropertyCardProps {
  readonly listing: ListingSummary;
  readonly locale: string;
  readonly messages: ListingMessages;
  /** Omit to render a non-linked card (for example, on the preview page). */
  readonly href?: string;
}

/**
 * Listing card for grids. Server-rendered: all text, price, and image metadata are in the
 * initial HTML, so search engines and slow mobile connections get the content immediately.
 */
export function PropertyCard({ listing, locale, messages, href }: PropertyCardProps) {
  const price = formatPrice(listing.priceMinor, listing.currencyCode, locale);
  const suffix = priceSuffix(listing.listingType, messages);

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-border)]">
        {/* Plain <img> with explicit dimensions: avoids layout shift; real photos move to
            next/image with a responsive pipeline when the media service exists. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.imageUrl}
          alt={listing.imageAlt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[var(--motion-duration-base)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {listing.isNew ? (
          <span className="absolute start-2 top-2 rounded-full bg-[color:var(--color-accent)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-accent-foreground)]">
            {messages.newBadge}
          </span>
        ) : null}
        <SaveButton
          labelSave={messages.save}
          labelSaved={messages.saved}
          listingTitle={listing.title}
        />
      </div>

      <div className="flex flex-col gap-1.5 p-2.5 sm:p-3">
        <p className="text-base font-semibold text-[color:var(--color-foreground)] sm:text-lg">
          {price}
          {suffix ? (
            <span className="ms-1 text-xs font-normal text-[color:var(--color-muted)] sm:text-sm">
              {suffix}
            </span>
          ) : null}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-[color:var(--color-foreground)] sm:text-base">
          {listing.title}
        </h3>
        <p className="line-clamp-1 text-xs text-[color:var(--color-muted)] sm:text-sm">
          {listing.locationLabel}
        </p>
        <dl className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-[color:var(--color-muted)]">
          {listing.bedrooms !== null ? (
            <div className="flex gap-1">
              <dt className="sr-only">{messages.bedrooms}</dt>
              <dd>
                <span aria-hidden="true">🛏 </span>
                {listing.bedrooms}
              </dd>
            </div>
          ) : null}
          {listing.bathrooms !== null ? (
            <div className="flex gap-1">
              <dt className="sr-only">{messages.bathrooms}</dt>
              <dd>
                <span aria-hidden="true">🛁 </span>
                {listing.bathrooms}
              </dd>
            </div>
          ) : null}
          {listing.areaSqm !== null ? (
            <div className="flex gap-1">
              <dt className="sr-only">{messages.area}</dt>
              <dd>{formatArea(listing.areaSqm, locale)}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </>
  );

  const shell =
    'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] transition-shadow duration-[var(--motion-duration-base)] hover:shadow-lg focus-within:ring-0';

  return (
    <article className={shell}>
      {href ? (
        <Link href={href} className="flex h-full flex-col rounded-[var(--radius-lg)]">
          {body}
        </Link>
      ) : (
        <div className="flex h-full flex-col">{body}</div>
      )}
    </article>
  );
}
