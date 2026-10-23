'use client';

import { useState } from 'react';
import type { ListingMessages } from '@/messages';

interface SaveButtonProps {
  readonly labelSave: ListingMessages['save'];
  readonly labelSaved: ListingMessages['saved'];
  readonly listingTitle: string;
}

/** The only interactive piece of the card. 44px target size for comfortable mobile tapping. */
export function SaveButton({ labelSave, labelSaved, listingTitle }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const label = `${saved ? labelSaved : labelSave}: ${listingTitle}`;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      onClick={() => setSaved((value) => !value)}
      className="absolute end-2 top-2 inline-flex size-11 items-center justify-center rounded-full bg-[color:var(--color-surface)]/90 text-[color:var(--color-foreground)] shadow-[var(--shadow-card)] transition-transform duration-[var(--motion-duration-fast)] active:scale-95"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-4.35-9.5-8.5C.9 9.6 2.2 5.5 6 5.5c2.2 0 3.6 1.3 4.5 2.6.9-1.3 2.3-2.6 4.5-2.6 3.8 0 5.1 4.1 3.5 7C19 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}
