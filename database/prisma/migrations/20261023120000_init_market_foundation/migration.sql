-- Initial foundation migration: market configuration table and lifecycle enum.
--
-- PROVENANCE: hand-authored to match prisma/schema.prisma because the sandbox used to build
-- this phase could not run the Prisma schema engine (binaries.prisma.sh is unreachable).
-- Before first production use, reconcile it against the engine output:
--   npm run migrate:dev -w @property-platform/database   (against a disposable Neon branch)
-- and confirm `prisma migrate diff` reports no drift.

-- CreateEnum
CREATE TYPE "market_lifecycle" AS ENUM ('CONFIGURED', 'READINESS_REVIEW', 'LAUNCHED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "markets" (
    "id" UUID NOT NULL,
    "countryCode" CHAR(2) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "currencyCode" CHAR(3) NOT NULL,
    "currencyMinorUnits" SMALLINT NOT NULL DEFAULT 2,
    "timezone" VARCHAR(64) NOT NULL,
    "defaultLocale" VARCHAR(8) NOT NULL,
    "supportedLocales" VARCHAR(8)[],
    "expansionOrder" SMALLINT NOT NULL,
    "lifecycle" "market_lifecycle" NOT NULL DEFAULT 'CONFIGURED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "markets_countryCode_key" ON "markets"("countryCode");

-- CreateIndex
CREATE INDEX "markets_lifecycle_idx" ON "markets"("lifecycle");
