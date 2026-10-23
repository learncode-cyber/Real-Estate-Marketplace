import type { ListingSummary } from '@/features/listings/types';
import type { ListingMessages } from '@/messages';
import { PropertyCard } from './property-card';

interface ListingGridProps {
  readonly listings: readonly ListingSummary[];
  readonly locale: string;
  readonly messages: ListingMessages;
  readonly hrefFor?: (listing: ListingSummary) => string | undefined;
}

/**
 * Two columns on phones (the mobile layout requested for property browsing), then three and
 * four columns on wider screens. Gap and padding stay tight on small screens so photos get
 * most of the width.
 */
export function ListingGrid({ listings, locale, messages, hrefFor }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--color-border)] p-6 text-center text-[color:var(--color-muted)]">
        {messages.empty}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <li key={listing.id} className="min-w-0">
          <PropertyCard
            listing={listing}
            locale={locale}
            messages={messages}
            href={hrefFor?.(listing)}
          />
        </li>
      ))}
    </ul>
  );
}
