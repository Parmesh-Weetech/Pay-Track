# PayTrack

PayTrack is a NestJS + MongoDB backend focused on e-commerce payment flow data modeling. The current codebase is schema-first with a seed pipeline to generate large datasets for local testing.

**Status**: Services and REST controllers are present but currently minimal (no implemented business logic). The data model and seed workflow are the primary completed parts.

## Tech Stack
- Node.js + TypeScript
- NestJS 11
- MongoDB + Mongoose
- Faker for seed data

## Domain Model
Collections and relationships:
- **User**: customer identity and status.
- **Product**: catalog items.
- **Cart**: belongs to a user; contains cart items referencing products.
- **Order**: belongs to a user; contains order items referencing products.
- **Transaction**: belongs to an order and user; contains embedded transaction history.
- **TransactionHistory**: stored both embedded in Transaction and in its own collection with `transactionId` for direct lookup.

Relationship map:
- User -> Orders (1:N)
- User -> Carts (1:N)
- Order -> OrderItems -> Product (N:1)
- Cart -> CartItems -> Product (N:1)
- Order -> Transaction (1:1 in seed generation)
- Transaction -> TransactionHistory (embedded) + TransactionHistory collection (via `transactionId`)

## Project Structure
- `src/app/*` modules for user, product, cart, order, transaction, transaction_history
- `src/app/*/schemas/*.schema.ts` MongoDB schema definitions
- `src/app/*/types/*.ts` enums and interfaces
- `scripts/seed.ts` data seeding pipeline
- `scripts/type.ts` seed type definitions

## Setup
```bash
npm install
```

## Run
```bash
# dev
npm run start:dev

# prod
npm run start:prod
```

The app listens on `PORT` (defaults to `3000`).

## Seeding
```bash
npm run seed
```

Seed behavior:
- Each collection targets **100,000** records.
- If a collection already has 100,000 records, it is skipped.
- If it has fewer, only the remaining records are added.
- `TransactionHistory` is inserted both embedded in `Transaction` and as a standalone collection with `transactionId`.
- A backfill step creates missing `TransactionHistory` records from existing transactions.

Important notes:
- The seed script currently uses a hardcoded Mongo URL in `scripts/seed.ts`.
- Users use deterministic unique emails: `user_<index>@example.com`.

## Scripts
- `npm run start` - start server
- `npm run start:dev` - watch mode
- `npm run start:prod` - production build
- `npm run test` - unit tests
- `npm run test:e2e` - e2e tests
- `npm run seed` - seed database

## Data Model Details
Schemas are defined in:
- `src/app/user/schemas/user.schema.ts`
- `src/app/product/schemas/product.schema.ts`
- `src/app/cart/schemas/cart.schema.ts`
- `src/app/order/schemas/order.schema.ts`
- `src/app/transaction/schemas/transaction.schema.ts`
- `src/app/transaction_history/schemas/transaction_history.schema.ts`

Indexes are explicitly defined on commonly queried fields (see schema files for details).

## Next Steps (Optional)
- Add actual service and controller logic for CRUD and domain workflows.
- Move Mongo connection string to environment config.
- Add validation DTOs and request-level schema validation.
