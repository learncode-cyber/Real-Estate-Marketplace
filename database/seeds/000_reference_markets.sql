-- REFERENCE SEED: market configuration rows. Verified configuration only, no listings.
-- Idempotent: safe to re-run. Lifecycle defaults to CONFIGURED; no market is activated here.
-- Activation requires the readiness checklist (PLANNING.md Phase 9) and owner approval.

INSERT INTO "markets" ("id","countryCode","name","currencyCode","currencyMinorUnits","timezone","defaultLocale","supportedLocales","expansionOrder","lifecycle","updatedAt") VALUES
  ('50000000-0000-4000-8000-000000000001','BD','Bangladesh','BDT',2,'Asia/Dhaka','en',ARRAY['en','bn']::varchar[],1,'CONFIGURED',now()),
  ('50000000-0000-4000-8000-000000000002','AE','United Arab Emirates','AED',2,'Asia/Dubai','en',ARRAY['en','ar']::varchar[],2,'CONFIGURED',now()),
  ('50000000-0000-4000-8000-000000000003','SA','Saudi Arabia','SAR',2,'Asia/Riyadh','en',ARRAY['en','ar']::varchar[],3,'CONFIGURED',now()),
  ('50000000-0000-4000-8000-000000000004','EG','Egypt','EGP',2,'Africa/Cairo','en',ARRAY['en','ar']::varchar[],4,'CONFIGURED',now())
ON CONFLICT ("countryCode") DO NOTHING;
