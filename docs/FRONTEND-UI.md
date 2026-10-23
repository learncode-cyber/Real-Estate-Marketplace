# Frontend UI notes (listing cards and mobile grid)

## Layout decision
- Mobile (below 640px): listing cards in **two columns**, tight gaps, photo-first cards.
- Tablet/desktop: three columns at 1024px, four at 1280px.
- Card content order: photo (with "New" badge and save button), price, title, location, then
  bedrooms, bathrooms, area.
- Save button is 44x44px for comfortable touch targets.

## Reference studies (inspiration only, no copied branding or code)
Zillow, Rightmove, Property Finder, Airbnb, Linear, and the two screenshots supplied by the
owner (a rental map-and-grid layout and a portfolio card layout). The card hierarchy and
two-column mobile grid follow those patterns; colours, type, and components are original.

## Library decisions
- Styling: Tailwind CSS 4 using the design-token CSS variables in `src/app/globals.css`.
- Motion: CSS transitions only for now (hover scale, shadow, save-button press). `motion`
  (Motion for React) is deferred until a component needs layout animation. GSAP is not used.
  No 3D library is added; any future 3D viewer must be optional, lazy-loaded, and excluded from
  critical SEO content (PLANNING.md section 10).
- Images: plain `<img>` with explicit width/height and `loading="lazy"` for now. Migrate to a
  responsive image pipeline when the media service exists.

## Internationalisation
All visible strings for listing components are keyed in `src/messages/index.ts` (English and
Bengali). Prices use `Intl.NumberFormat` with integer minor units; no floating-point storage.

## Status
- Preview route `/listings-preview` renders synthetic sample listings. It returns 404 in
  production builds and is marked noindex.
- Real property data, filters, and detail pages are NOT implemented yet.
