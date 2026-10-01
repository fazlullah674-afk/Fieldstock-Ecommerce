# FieldStock — Backend API

Node.js + Express REST API for the FieldStock storefront, built by **Engr Fazl Ullah**. Uses Sequelize as the ORM so the same code runs against Microsoft SQL Server in production or SQLite for local development — no code changes, just one `.env` setting.

## Stack

- Express 4, Sequelize 6
- SQL Server (`mssql`/`tedious`) in production, SQLite for local dev/testing
- JWT auth (`jsonwebtoken`), password hashing (`bcryptjs`)
- CORS restricted to your frontend's origin

## 1. Install

```bash
npm install
cp .env.example .env
```

## 2. Configure `.env`

**Quickest path (no SQL Server install needed) — SQLite:**
```
DB_DIALECT=sqlite
DB_STORAGE=./dev.sqlite
```

**Production — SQL Server:**
```
DB_DIALECT=mssql
DB_HOST=localhost
DB_PORT=1433
DB_NAME=fieldstock
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
```
Also set a real `JWT_SECRET` (any long random string) and `CLIENT_ORIGIN` to your frontend's URL.

## 3. Seed the database

```bash
npm run seed
```

This drops and recreates all tables, then loads 6 categories, 12 products, and two coupon codes (`SAVE10`, `WELCOME20`) — the same catalog the frontend previously mocked locally.

## 4. Run

```bash
npm run dev     # nodemon, auto-restart on changes
npm start       # plain node
```

Server starts on `http://localhost:5001` (or `PORT` from `.env`). Check `GET /api/health`.

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | – | `{ name, email, password }` |
| POST | `/api/auth/login` | – | `{ email, password }` |
| POST | `/api/auth/forgot-password` | – | `{ email }` |
| GET | `/api/users/profile` | ✅ | |
| PUT | `/api/users/profile` | ✅ | `{ name, phone, address }` |
| GET | `/api/categories` | – | |
| GET | `/api/products` | – | query: `category, search, minPrice, maxPrice, minRating, inStockOnly, discountedOnly, sort` |
| GET | `/api/products/featured` | – | |
| GET | `/api/products/:id` | – | |
| GET | `/api/products/:id/reviews` | – | |
| POST | `/api/reviews` | ✅ | `{ productId, rating, text }` |
| GET | `/api/cart` | ✅ | |
| POST | `/api/cart` | ✅ | `{ productId, quantity, variant }` |
| PUT | `/api/cart/:id` | ✅ | `{ quantity }` |
| DELETE | `/api/cart/:id` | ✅ | |
| POST | `/api/coupons/validate` | – | `{ code }` |
| POST | `/api/orders` | ✅ | `{ items, shippingAddress, deliveryMethod, paymentMethod, couponCode }` — prices/stock are re-checked server-side |
| GET | `/api/orders` | ✅ | |
| GET | `/api/orders/:id` | ✅ | |

Send the JWT from login/register as `Authorization: Bearer <token>` on every ✅ route.

## Notes

- `sequelize.sync()` in `server.js` auto-creates tables for development convenience. For a real production rollout, switch to Sequelize migrations so schema changes are tracked and reversible.
- Order totals (subtotal, discount, shipping, tax, total) are always recalculated from the database on the server — the client can't manipulate prices by editing the request body.
- Stock is decremented when an order is placed and re-validated against the cart before the order is created.
