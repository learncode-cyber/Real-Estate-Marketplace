/**
 * UI strings. Every visible string is keyed here so Bengali and English are switched by
 * locale, not hardcoded in components. Placeholders use {name} and are filled by fillMessage.
 */
export type Locale = 'en' | 'bn';

export interface ListingMessages {
  readonly bedrooms: string;
  readonly bathrooms: string;
  readonly area: string;
  readonly perMonth: string;
  readonly newBadge: string;
  readonly save: string;
  readonly saved: string;
  readonly listingsHeading: string;
  readonly empty: string;
  readonly sampleNotice: string;
  readonly searchHeading: string;
  readonly resultsCount: string;
  readonly filterType: string;
  readonly typeAll: string;
  readonly typeSale: string;
  readonly typeRent: string;
  readonly filterArea: string;
  readonly areaAll: string;
  readonly minPrice: string;
  readonly maxPrice: string;
  readonly filterBedrooms: string;
  readonly bedroomsAny: string;
  readonly sortLabel: string;
  readonly sortNewest: string;
  readonly sortPriceAsc: string;
  readonly sortPriceDesc: string;
  readonly applyFilters: string;
  readonly resetFilters: string;
  readonly demoBanner: string;
  readonly apiUnavailable: string;
  readonly pageOf: string;
  readonly previous: string;
  readonly next: string;
  readonly backToSearch: string;
  readonly developerLabel: string;
  readonly descriptionHeading: string;
  readonly factsHeading: string;
  readonly kindLabel: string;
  readonly kindApartment: string;
  readonly kindHouse: string;
  readonly kindLand: string;
  readonly kindCommercial: string;
  readonly detailNotFound: string;
  readonly detailUnavailable: string;
  readonly siteName: string;
  readonly homeTagline: string;
  readonly openSearch: string;
}

export const MESSAGES: Record<Locale, ListingMessages> = {
  en: {
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    perMonth: '/ month',
    newBadge: 'New',
    save: 'Save listing',
    saved: 'Saved',
    listingsHeading: 'Listings',
    empty: 'No listings match your search yet.',
    sampleNotice: 'Sample listings for layout review. Not real properties.',
    searchHeading: 'Find a property',
    resultsCount: '{count} properties',
    filterType: 'Buy or rent',
    typeAll: 'All',
    typeSale: 'Buy',
    typeRent: 'Rent',
    filterArea: 'Area',
    areaAll: 'All areas',
    minPrice: 'Min price (BDT)',
    maxPrice: 'Max price (BDT)',
    filterBedrooms: 'Bedrooms',
    bedroomsAny: 'Any',
    sortLabel: 'Sort',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    applyFilters: 'Apply',
    resetFilters: 'Reset',
    demoBanner: 'Showing demo listings. Connect the API to see live data.',
    apiUnavailable: 'The listings service is unavailable right now. Please try again shortly.',
    pageOf: 'Page {page} of {total}',
    previous: 'Previous',
    next: 'Next',
    backToSearch: 'Back to search',
    developerLabel: 'Developer',
    descriptionHeading: 'About this property',
    factsHeading: 'Key facts',
    kindLabel: 'Property type',
    kindApartment: 'Apartment',
    kindHouse: 'House',
    kindLand: 'Land',
    kindCommercial: 'Commercial',
    detailNotFound: 'This listing could not be found or is no longer available.',
    detailUnavailable: 'We could not load this listing right now. Please try again shortly.',
    siteName: 'Global Property Platform',
    homeTagline: 'Browse homes, apartments and land. Start in Khulna.',
    openSearch: 'Search properties',
  },
  bn: {
    bedrooms: 'শয়নকক্ষ',
    bathrooms: 'বাথরুম',
    area: 'আয়তন',
    perMonth: '/ মাস',
    newBadge: 'নতুন',
    save: 'তালিকাটি সংরক্ষণ করুন',
    saved: 'সংরক্ষিত',
    listingsHeading: 'সম্পত্তির তালিকা',
    empty: 'আপনার অনুসন্ধানের সঙ্গে এখনো কোনো তালিকা মেলেনি।',
    sampleNotice: 'বিন্যাস পর্যালোচনার জন্য নমুনা তালিকা। এগুলো প্রকৃত সম্পত্তি নয়।',
    searchHeading: 'সম্পত্তি খুঁজুন',
    resultsCount: '{count}টি সম্পত্তি',
    filterType: 'কিনুন বা ভাড়া',
    typeAll: 'সব',
    typeSale: 'কেনা',
    typeRent: 'ভাড়া',
    filterArea: 'এলাকা',
    areaAll: 'সব এলাকা',
    minPrice: 'সর্বনিম্ন দাম (টাকা)',
    maxPrice: 'সর্বোচ্চ দাম (টাকা)',
    filterBedrooms: 'শয়নকক্ষ',
    bedroomsAny: 'যেকোনো',
    sortLabel: 'সাজান',
    sortNewest: 'সর্বশেষ',
    sortPriceAsc: 'দাম: কম থেকে বেশি',
    sortPriceDesc: 'দাম: বেশি থেকে কম',
    applyFilters: 'প্রয়োগ করুন',
    resetFilters: 'মুছুন',
    demoBanner: 'ডেমো তালিকা দেখানো হচ্ছে। লাইভ তথ্যের জন্য API সংযুক্ত করুন।',
    apiUnavailable: 'তালিকা সেবাটি এখন পাওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।',
    pageOf: 'পৃষ্ঠা {page} / {total}',
    previous: 'আগের',
    next: 'পরের',
    backToSearch: 'অনুসন্ধানে ফিরুন',
    developerLabel: 'ডেভেলপার',
    descriptionHeading: 'এই সম্পত্তি সম্পর্কে',
    factsHeading: 'মূল তথ্য',
    kindLabel: 'সম্পত্তির ধরন',
    kindApartment: 'অ্যাপার্টমেন্ট',
    kindHouse: 'বাড়ি',
    kindLand: 'জমি',
    kindCommercial: 'বাণিজ্যিক',
    detailNotFound: 'এই তালিকাটি খুঁজে পাওয়া যায়নি বা আর উপলব্ধ নেই।',
    detailUnavailable: 'এখন এই তালিকাটি লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।',
    siteName: 'গ্লোবাল প্রপার্টি প্ল্যাটফর্ম',
    homeTagline: 'বাড়ি, অ্যাপার্টমেন্ট ও জমি খুঁজুন। শুরু হচ্ছে খুলনা থেকে।',
    openSearch: 'সম্পত্তি খুঁজুন',
  },
};

export function getMessages(locale: Locale): ListingMessages {
  return MESSAGES[locale];
}

export function fillMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export function resolveLocale(value: string | undefined): Locale {
  return value === 'bn' ? 'bn' : 'en';
}
