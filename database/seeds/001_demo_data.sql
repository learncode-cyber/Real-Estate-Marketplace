-- DEMO SEED: synthetic development data only. Every property is flagged is_demo = true and
-- titled "Demo". Never run this against production. Idempotent: safe to re-run.
-- Prices are integer minor units (BDT paisa): 1 BDT = 100.

BEGIN;

INSERT INTO "areas" ("id","slug","nameEn","nameBn","city","countryCode") VALUES
  ('10000000-0000-4000-8000-000000000001','sonadanga','Sonadanga','সোনাডাঙ্গা','Khulna','BD'),
  ('10000000-0000-4000-8000-000000000002','khalishpur','Khalishpur','খালিশপুর','Khulna','BD'),
  ('10000000-0000-4000-8000-000000000003','daulatpur','Daulatpur','দৌলতপুর','Khulna','BD'),
  ('10000000-0000-4000-8000-000000000004','boyra','Boyra','বয়রা','Khulna','BD'),
  ('10000000-0000-4000-8000-000000000005','newmarket','New Market','নিউমার্কেট','Khulna','BD')
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "developers" ("id","slug","name","verified","updatedAt") VALUES
  ('20000000-0000-4000-8000-000000000001','demo-developer','Demo Developer (sample)',false,now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "properties" ("id","slug","title","description","listingType","kind","status","priceMinor","currencyCode","bedrooms","bathrooms","areaSqm","isDemo","areaId","developerId","updatedAt","publishedAt") VALUES
  ('30000000-0000-4000-8000-000000000001','demo-sonadanga-3bed-rent','Demo: 3-bedroom apartment, Sonadanga','Demo listing. Synthetic data for development only.','RENT','APARTMENT','PUBLISHED',2500000,'BDT',3,2,135,true,'10000000-0000-4000-8000-000000000001',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000002','demo-khalishpur-2bed-sale','Demo: 2-bedroom flat, Khalishpur','Demo listing. Synthetic data for development only.','SALE','APARTMENT','PUBLISHED',3820000000,'BDT',2,2,98,true,'10000000-0000-4000-8000-000000000002',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000003','demo-newmarket-studio-rent','Demo: Studio apartment, New Market','Demo listing. Synthetic data for development only.','RENT','APARTMENT','PUBLISHED',1200000,'BDT',1,1,55,true,'10000000-0000-4000-8000-000000000005',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000004','demo-daulatpur-4bed-house-sale','Demo: 4-bedroom house, Daulatpur','Demo listing. Synthetic data for development only.','SALE','HOUSE','PUBLISHED',9600000000,'BDT',4,3,210,true,'10000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001',now(),now()),
  ('30000000-0000-4000-8000-000000000005','demo-boyra-2bed-rent','Demo: 2-bedroom apartment, Boyra','Demo listing. Synthetic data for development only.','RENT','APARTMENT','PUBLISHED',1800000,'BDT',2,2,90,true,'10000000-0000-4000-8000-000000000004',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000006','demo-boyra-land-sale','Demo: Residential plot, Boyra','Demo listing. Synthetic data for development only.','SALE','LAND','PUBLISHED',1200000000,'BDT',NULL,NULL,300,true,'10000000-0000-4000-8000-000000000004',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000007','demo-newmarket-shop-rent','Demo: Ground-floor shop, New Market','Demo listing. Synthetic data for development only.','RENT','COMMERCIAL','PUBLISHED',3500000,'BDT',NULL,1,80,true,'10000000-0000-4000-8000-000000000005',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000008','demo-sonadanga-3bed-sale','Demo: 3-bedroom apartment, Sonadanga','Demo listing. Synthetic data for development only.','SALE','APARTMENT','PUBLISHED',6800000000,'BDT',3,3,160,true,'10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',now(),now()),
  ('30000000-0000-4000-8000-000000000009','demo-daulatpur-3bed-house-rent','Demo: 3-bedroom house, Daulatpur','Demo listing. Synthetic data for development only.','RENT','HOUSE','PUBLISHED',3000000,'BDT',3,2,150,true,'10000000-0000-4000-8000-000000000003',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000010','demo-khalishpur-1bed-sale','Demo: 1-bedroom flat, Khalishpur','Demo listing. Synthetic data for development only.','SALE','APARTMENT','PUBLISHED',280000000,'BDT',1,1,62,true,'10000000-0000-4000-8000-000000000002',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000011','demo-khalishpur-2bed-rent','Demo: 2-bedroom flat, Khalishpur','Demo listing. Synthetic data for development only.','RENT','APARTMENT','PUBLISHED',1600000,'BDT',2,2,95,true,'10000000-0000-4000-8000-000000000002',NULL,now(),now()),
  ('30000000-0000-4000-8000-000000000012','demo-newmarket-2bed-sale','Demo: 2-bedroom apartment, New Market','Demo listing. Synthetic data for development only.','SALE','APARTMENT','PUBLISHED',4500000000,'BDT',2,2,110,true,'10000000-0000-4000-8000-000000000005',NULL,now(),now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "property_media" ("id","propertyId","url","altText","sortOrder")
SELECT
  ('40000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  ('30000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  '/images/property-placeholder.svg',
  'Placeholder illustration of a property (demo)',
  0
FROM generate_series(1, 12) AS n
ON CONFLICT ("propertyId","sortOrder") DO NOTHING;

COMMIT;
