// Public entry point for the database package. Application code imports from here, never
// from generated paths directly, so the generator output can change without touching callers.
export {
  PrismaClient,
  MarketLifecycle,
  ListingType,
  ListingStatus,
  PropertyKind,
  Prisma,
} from '../generated/client/client.js';
export type {
  Market,
  Property,
  PropertyMedia,
  Area,
  Developer,
} from '../generated/client/client.js';
