# FieldStock — E-Commerce Frontend

A production-style React frontend for an online store, built with React 18, React Router 6, and Vite, by **Engr Fazl Ullah**. `src/services/api.js` calls the real FieldStock backend (see `../ecommerce-backend`) — the backend must be running for products, login, and orders to work.

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your backend isn't on localhost:5001
npm run dev             # start the dev server (http://localhost:5173)
npm run build           # production build to dist/
```

Start the backend first (see its README), then run this. The cart and wishlist still live in `localStorage` on the client; everything else — products, auth, orders, reviews, coupons — comes from the API.

## What's implemented

- **Pages**: Home, Shop/Products (filters, sort, search, load more), Product Details (variants, specs, reviews), Categories, Cart, Wishlist, multi-step Checkout, Order Success, Orders, Order Details (tracking timeline), Profile (tabs: profile, orders, wishlist, addresses), Login, Register, Forgot Password, About, 404.
- **Global state**: `AuthContext` (mock auth, no real passwords stored), `CartContext` (localStorage-backed, computes subtotal/discount/shipping/tax/total), `WishlistContext` (localStorage-backed), `ToastContext` (notifications, no `alert()`).
- **API layer**: `src/services/api.js` exposes `getProducts`, `getProductById`, `getCategories`, `searchProducts`, `loginUser`, `registerUser`, `getOrders`, `createOrder`, `validateCoupon`, etc. Each simulates network latency and mocks data; each maps 1:1 to a future REST endpoint (listed at the top of the file).
- **UX details**: skeleton loading states, error states with retry, empty states with a call to action, coupon codes (`SAVE10`, `WELCOME20`), quick view modal, responsive layout down to 320px, keyboard-accessible forms/buttons/focus states.

## Known simplifications

- Payments are UI-only — no real payment gateway is wired in yet (see the backend README).
- Product images are emoji placeholders standing in for real photography.
- Addresses still persist in `localStorage` rather than the backend; the cart does too, for guest shopping before login.
