# Seeds

| File | Purpose | Environments |
|---|---|---|
| `000_reference_markets.sql` | Market configuration rows (BD, AE, SA, EG). Lifecycle CONFIGURED. | All |
| `001_demo_data.sql` | Synthetic demo areas, one developer, 12 demo listings, placeholder media. Flagged `isDemo`. | Development only |

Rules: seeds are idempotent (`ON CONFLICT DO NOTHING`), never fabricate real people, real
listings, reviews, or testimonials, and are never run against production data without review.
