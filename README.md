# 10X Shop

A demo online store built with **React 19, TypeScript and Tailwind CSS v4**. Products come from the public [DummyJSON](https://dummyjson.com) API. Login and checkout are local simulations: there is no real authentication and no payment.

**Live demo:** _added after the first deploy_

## Run it locally

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run typecheck` | `tsc` in strict mode, no emit |
| `npm run lint` | ESLint (including `react-hooks/exhaustive-deps`) |
| `npm run build` | typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## CORE features

- Layout with header, footer and React Router (`/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*`)
- Login (local Context simulation) with controlled form validation
- Checkout is protected: a guest is sent to `/login` and brought back after signing in
- Catalog from `GET /products` with loading, error (Retry) and empty states
- Product page with gallery, quantity selection and Add to cart; unknown ids show a 404 page
- Shared cart (Context + reducer): add, change quantity, remove, subtotal / shipping / total, saved in localStorage
- Checkout form with validation and a local order confirmation
- Responsive down to 375px, visible hover / focus / disabled states
- Error Boundary: a crash in one page shows a fallback, not a white screen

## Tech

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · React Router · DummyJSON API

## Known limitations

- Login and checkout are simulations. Nothing is sent to a server and no payment data is collected.
- The cart is stored in this browser only (localStorage).
