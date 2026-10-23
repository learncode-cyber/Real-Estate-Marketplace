# Database ERD (currently implemented tables)

Covers the live schema verified in `DATABASE-VERIFICATION.md`. The planned tables are in
`DATABASE-MASTER-PLAN.md` and are not implemented yet.

```mermaid
erDiagram
    markets {
        uuid id PK
        char countryCode UK
        varchar name
        char currencyCode
        smallint currencyMinorUnits
        varchar timezone
        varchar defaultLocale
        varchar_arr supportedLocales
        smallint expansionOrder
        market_lifecycle lifecycle
    }
    areas {
        uuid id PK
        varchar slug UK
        varchar nameEn
        varchar nameBn
        varchar city
        char countryCode
    }
    developers {
        uuid id PK
        varchar slug UK
        varchar name
        boolean verified
    }
    properties {
        uuid id PK
        varchar slug UK
        varchar title
        text description
        listing_type listingType
        property_kind kind
        listing_status status
        bigint priceMinor
        char currencyCode
        smallint bedrooms
        smallint bathrooms
        int areaSqm
        boolean isDemo
        uuid areaId FK
        uuid developerId FK
    }
    property_media {
        uuid id PK
        uuid propertyId FK
        varchar url
        varchar altText
        smallint sortOrder
    }
    areas ||--o{ properties : "contains"
    developers o|--o{ properties : "develops"
    properties ||--o{ property_media : "has"
```

`markets` has no foreign keys to the other tables yet. It is configuration that will link to
areas and properties when multi-market support is activated (Phase 9 of PLANNING.md).
