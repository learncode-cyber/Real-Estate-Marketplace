-- Reviewed SQL: database-level guards that Prisma's schema language cannot express.
-- Enforces ISO-shaped codes, bounded currency exponents, and positive expansion order.

ALTER TABLE "markets"
  ADD CONSTRAINT "markets_country_code_format"
    CHECK ("countryCode" ~ '^[A-Z]{2}$'),
  ADD CONSTRAINT "markets_currency_code_format"
    CHECK ("currencyCode" ~ '^[A-Z]{3}$'),
  ADD CONSTRAINT "markets_currency_minor_units_range"
    CHECK ("currencyMinorUnits" BETWEEN 0 AND 4),
  ADD CONSTRAINT "markets_expansion_order_positive"
    CHECK ("expansionOrder" >= 1),
  ADD CONSTRAINT "markets_default_locale_known"
    CHECK ("defaultLocale" IN ('en', 'bn', 'ar'));
