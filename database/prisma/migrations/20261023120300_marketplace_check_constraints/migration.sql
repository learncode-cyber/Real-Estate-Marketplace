-- Reviewed SQL: database-level guards that the Prisma schema language cannot express.

ALTER TABLE "areas"
  ADD CONSTRAINT "areas_country_code_format" CHECK ("countryCode" ~ '^[A-Z]{2}$');

ALTER TABLE "properties"
  ADD CONSTRAINT "properties_price_non_negative" CHECK ("priceMinor" >= 0),
  ADD CONSTRAINT "properties_currency_format" CHECK ("currencyCode" ~ '^[A-Z]{3}$'),
  ADD CONSTRAINT "properties_bedrooms_range" CHECK ("bedrooms" IS NULL OR "bedrooms" BETWEEN 0 AND 30),
  ADD CONSTRAINT "properties_bathrooms_range" CHECK ("bathrooms" IS NULL OR "bathrooms" BETWEEN 0 AND 30),
  ADD CONSTRAINT "properties_area_positive" CHECK ("areaSqm" IS NULL OR "areaSqm" > 0),
  ADD CONSTRAINT "properties_published_has_timestamp" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

ALTER TABLE "property_media"
  ADD CONSTRAINT "property_media_sort_order_non_negative" CHECK ("sortOrder" >= 0);
