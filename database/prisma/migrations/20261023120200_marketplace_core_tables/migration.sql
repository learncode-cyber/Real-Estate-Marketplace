-- Marketplace core tables: areas, developers, properties, property_media.
-- PROVENANCE: hand-authored to match prisma/schema.prisma (the sandbox cannot run the Prisma
-- schema engine). Reconcile with `prisma migrate diff` against a disposable database before
-- production use.

-- CreateEnum
CREATE TYPE "listing_type" AS ENUM ('SALE', 'RENT');
CREATE TYPE "listing_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "property_kind" AS ENUM ('APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL');

-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "nameEn" VARCHAR(120) NOT NULL,
    "nameBn" VARCHAR(120) NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "countryCode" CHAR(2) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developers" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "listingType" "listing_type" NOT NULL,
    "kind" "property_kind" NOT NULL,
    "status" "listing_status" NOT NULL DEFAULT 'DRAFT',
    "priceMinor" BIGINT NOT NULL,
    "currencyCode" CHAR(3) NOT NULL,
    "bedrooms" SMALLINT,
    "bathrooms" SMALLINT,
    "areaSqm" INTEGER,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "areaId" UUID NOT NULL,
    "developerId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "publishedAt" TIMESTAMPTZ(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_media" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "altText" VARCHAR(200) NOT NULL,
    "sortOrder" SMALLINT NOT NULL,

    CONSTRAINT "property_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_slug_key" ON "areas"("slug");
CREATE INDEX "areas_countryCode_city_idx" ON "areas"("countryCode", "city");
CREATE UNIQUE INDEX "developers_slug_key" ON "developers"("slug");
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");
CREATE INDEX "properties_status_listingType_priceMinor_idx" ON "properties"("status", "listingType", "priceMinor");
CREATE INDEX "properties_areaId_idx" ON "properties"("areaId");
CREATE UNIQUE INDEX "property_media_propertyId_sortOrder_key" ON "property_media"("propertyId", "sortOrder");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "properties" ADD CONSTRAINT "properties_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
