# 10X Shop

A demo online store built with **React 19, TypeScript (strict) and Tailwind CSS v4**. Products come from the public [DummyJSON](https://dummyjson.com) API. Login and checkout are local simulations: there is no real authentication and no payment.

- **Live demo:** https://10x-shop-ana-altunashvili.vercel.app
- **Repository:** https://github.com/Ann-Altunashvili/10x-shop-ana-altunashvili

## Features

**CORE**

- Layout with header, footer, skip link and React Router: `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*` (404)
- Login through React Context (local simulation) with controlled-form validation
- Protected checkout: a guest is sent to `/login` and returned to the page they wanted
- Catalog from `GET /products` with loading skeletons, error + Retry and empty states
- Product page: gallery, quantity selection, stock limits, Add to cart; unknown ids show a 404 page
- Shared cart (Context + reducer): add, change quantity, remove, subtotal / shipping / total, persisted in localStorage
- Checkout form with validation and a local order confirmation
- Responsive from 375px up, visible hover / focus / disabled states
- Error Boundary around every page

**FULL**

- Search (debounced 400 ms), category filter, sorting and pagination - all kept in the URL, so links and the Back button work
- Reviews (stored locally) and related products on the product page
- Promo code `10X10` (10% off, case-insensitive) and free shipping from $100
- Orders list and order details with a status computed from time (Processing → Shipped → Delivered), Re-order
- Profile page (validated form), "Clear my data"
- Dark mode (saved preference, system default, no flash on load)
- Login form rebuilt with Formik + Yup
- Lazy-loaded routes (`React.lazy` + `Suspense`), lazy images, toasts with `aria-live`
- Accessibility: labelled forms, 44px touch targets, semantic landmarks, reduced-motion support

## Tech stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 (`@theme` tokens, dark variant, custom breakpoints) · React Router 7 · Formik + Yup (Login only) · ESLint with `react-hooks` rules

## Run it locally

Requires Node.js 20.19+ (or 22.12+).

```bash
git clone https://github.com/Ann-Altunashvili/10x-shop-ana-altunashvili.git
cd 10x-shop-ana-altunashvili
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run typecheck` | `tsc` in strict mode, no emit |
| `npm run lint` | ESLint |
| `npm run build` | typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build locally |

Optional: copy `.env.example` to `.env.local` and set `VITE_API_URL` to use another API server.

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Catalog (`?q=&category=&sort=&page=`) | public |
| `/products/:id` | Product details | public |
| `/cart` | Cart | public |
| `/login` | Login | public |
| `/checkout` | Checkout | logged in |
| `/orders`, `/orders/:id` | Orders | logged in |
| `/profile` | Profile | logged in |
| `*` | 404 | public |

## Project structure

```text
src/
  api/          ApiClient, ApiError, endpoint builders
  components/   ui/ (Button, TextField, ...), layout/, product/, cart/, catalog/, reviews/, orders/, ErrorBoundary
  context/      AuthContext, CartContext (+ reducer), ThemeContext, ToastContext
  hooks/        useFetch<T>, useDebounce, useLocalStorage
  models/       Cart, OrderModel, StorageService<T>, storage registry
  pages/        one file per route
  routes/       AppRoutes (lazy), ProtectedRoute
  types/        domain types
  utils/        formatters, validators, URL helpers, type guards (utils/guards)
```

## Design decisions

- **The URL is the state of the catalog.** `parseCatalogParams` reads `?q`, `category`, `sort`, `page` defensively; `nextCatalogParams` keeps the rules in one place (search clears the category, any filter change returns to page 1).
- **Data from outside is `unknown` until a type guard proves its shape.** The API response, localStorage and router state all go through guards in `utils/guards`, so pages and components never trust external data with an `as` cast (the only casts left are the JSON → `T` step inside `ApiClient`, which is reached only through `getValidated`, and the `Object.keys` typing inside `validateForm`).
- **`useFetch<T>(path, guard)`** returns one `AsyncState<T>` (idle / loading / success / error) and aborts the previous request in its cleanup, so a slow old response can never overwrite a newer one.
- **Cart arithmetic lives in a plain `Cart` class** (no React). The reducer is pure; persistence happens in an effect.
- **Order status is computed, not stored**: `getOrderStatus(placedAt, now)` is a pure function of elapsed time.
- **Search vs. category:** DummyJSON cannot search inside a category, so a search wins and clears the category.

## localStorage keys

`shop_cart`, `shop_user`, `shop_orders`, `shop_reviews`, `shop_theme`. Every read goes through `StorageService<T>`, which validates the value and falls back to the default if it is corrupted or storage is blocked. The password is never stored.

## Deployment

Deployed on Vercel. Because this is a single-page app, `vercel.json` rewrites every path to `index.html` (and `public/_redirects` does the same for Netlify), so a direct visit or refresh on `/products/5` works.

## Documentation

- [`PLAN.md`](PLAN.md) - scope, work breakdown, risks
- [`REPORT.md`](REPORT.md) - planned vs delivered, metrics, hardest problems
- [`DEBUG-LOG.md`](DEBUG-LOG.md) - real bugs: symptom → tool → cause → fix
- [`docs/progress/`](docs/progress) - progress notes (one per two working days)
- [`docs/lighthouse/`](docs/lighthouse) - Lighthouse before / after

## Known limitations

- Login and checkout are simulations. Nothing is sent to a server, no payment data is collected.
- Cart, orders, reviews and profile live in this browser only.
- DummyJSON is a demo API: the data does not change, and new reviews are saved locally only.

## AI assistance

This project was built with the help of an AI assistant (Claude). REPORT.md describes what was delegated, what was reviewed and changed by hand, and what was rejected.
