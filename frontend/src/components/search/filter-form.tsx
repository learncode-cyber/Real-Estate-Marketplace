import type { AreaOption } from '@property-platform/shared-types';
import type { ListingMessages, Locale } from '@/messages';

interface FilterFormProps {
  readonly messages: ListingMessages;
  readonly locale: Locale;
  readonly areas: readonly AreaOption[];
  readonly values: Record<string, string>;
}

const fieldClass =
  'w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm text-[color:var(--color-foreground)] min-h-11';
const labelClass = 'flex flex-col gap-1 text-xs font-medium text-[color:var(--color-muted)]';

/** Plain GET form: works without JavaScript and produces shareable URLs. */
export function FilterForm({ messages, locale, areas, values }: FilterFormProps) {
  const name = (key: string) =>
    locale === 'bn' ? areas.find((a) => a.slug === values[key])?.nameBn : undefined;
  void name;
  return (
    <form
      method="get"
      action="/search"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
    >
      <input type="hidden" name="lang" value={locale} />
      <label className={labelClass}>
        {messages.filterType}
        <select
          name="listingType"
          defaultValue={values['listingType'] ?? ''}
          className={fieldClass}
        >
          <option value="">{messages.typeAll}</option>
          <option value="SALE">{messages.typeSale}</option>
          <option value="RENT">{messages.typeRent}</option>
        </select>
      </label>
      <label className={labelClass}>
        {messages.filterArea}
        <select name="area" defaultValue={values['area'] ?? ''} className={fieldClass}>
          <option value="">{messages.areaAll}</option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {locale === 'bn' ? area.nameBn : area.nameEn}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        {messages.minPrice}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          name="minPrice"
          defaultValue={values['minPrice'] ?? ''}
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        {messages.maxPrice}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          name="maxPrice"
          defaultValue={values['maxPrice'] ?? ''}
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        {messages.filterBedrooms}
        <select name="bedrooms" defaultValue={values['bedrooms'] ?? ''} className={fieldClass}>
          <option value="">{messages.bedroomsAny}</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        {messages.sortLabel}
        <select name="sort" defaultValue={values['sort'] ?? 'newest'} className={fieldClass}>
          <option value="newest">{messages.sortNewest}</option>
          <option value="price_asc">{messages.sortPriceAsc}</option>
          <option value="price_desc">{messages.sortPriceDesc}</option>
        </select>
      </label>
      <div className="col-span-2 flex items-end gap-2 md:col-span-3 xl:col-span-6 xl:justify-end">
        <a
          href={`/search?lang=${locale}`}
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-4 text-sm font-medium"
        >
          {messages.resetFilters}
        </a>
        <button
          type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-accent)] px-5 text-sm font-semibold text-[color:var(--color-accent-foreground)] xl:flex-none"
        >
          {messages.applyFilters}
        </button>
      </div>
    </form>
  );
}
