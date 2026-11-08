# DEBUG-LOG

Real problems found while building 10X Shop. Each entry: symptom, reproduction, tool, root cause, fix, what I learned.
Only things that really happened are listed. An entry marked **Investigation** is a behaviour I looked into that turned out not to be a bug.

---

## 1. Refreshing any page except the home page gave 404 on Vercel (routing / deploy)

- **Symptom:** After the first deploy the home page worked and the links inside the app worked, but refreshing `/products/5`, `/cart` or `/login`, or opening such an address directly in a new tab, showed Vercel's own page "This page doesn't exist - 404 NOT_FOUND" (id `fra1::bx726-1794152718494-32fbbd96ee61`). Screenshot: [`docs/debug/spa-404-before.png`](docs/debug/spa-404-before.png).
- **Reproduction:**
  1. Open https://10x-shop-ana-altunashvili.vercel.app/ (before the fix).
  2. Open any product from the catalog.
  3. Press refresh, or copy the address into a new tab.
- **Tool:** The browser itself. The error page was not my `NotFoundPage` (that one has the shop header and footer), so it came from the server, not from the app. To test the fix before merging it I used the Preview deployment that Vercel builds for every branch (Vercel dashboard, Deployments).
- **Root cause:** The app is a single-page app: only `index.html` exists as a file on the server. Inside the app React Router changes the address in the browser without asking the server, so links work. A refresh or a direct visit sends the whole path to the server, and the server has no file for `/products/5`, so it answers 404.
- **Fix:** `vercel.json` rewrites every path to `/index.html` (and `public/_redirects` does the same on Netlify). [commit 447553a](https://github.com/Ann-Altunashvili/10x-shop-ana-altunashvili/commit/447553a), merged in PR #36. After the fix I refreshed a product page on the Preview deployment, and then opened `/products/5` directly on the production address: both show the product page.
- **What I learned:** Client-side routing lives in the browser, so the server must return `index.html` for every path, otherwise a refresh on a deep link breaks.

## 2. Investigation: the catalog sends the same request twice in development (Network)

- **Symptom:** In DevTools, Network, with the throttling set to Offline, opening the catalog showed two requests to `products?limit=12&skip=0`: the first with status `(canceled)`, the second with status `(failed)`.
- **Reproduction:**
  1. `npm run dev`, open the app, then DevTools, Network, filter Fetch/XHR.
  2. Set throttling to Offline.
  3. Click a header link to another page and then back to the catalog (no page reload).
- **Tool:** The Network tab, the Status column.
- **Root cause:** `main.tsx` wraps the app in `StrictMode`. In development React mounts every component, unmounts it and mounts it again to reveal missing cleanup. `useFetch` aborts its request in the effect cleanup (`controller.abort()`), so the first request is `(canceled)` and the second one is the real one. I did not re-check the production build; React documents that `StrictMode` repeats effects only in development.
- **Fix:** None needed, it is not a bug. The `(canceled)` request is the proof that the cleanup in `useFetch` works.
- **What I learned:** Two identical requests in development can be `StrictMode` checking my cleanup, and I read the Status column before I call it a bug.

## 3. Investigation: the Console showed 15 errors and 3 warnings that did not come from the app (Console)

- **Symptom:** While I checked the Console on every page, it showed 15 errors `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'M_ID')` and 3 warnings `[Telemetry.TS.AgentsExperimentationService]: WARN ...`.
- **Reproduction:**
  1. `npm run dev`, open the app in a normal Chrome window (with my extensions).
  2. DevTools, Console, then open the catalog, a product, the cart, Login, Checkout, Orders, Profile and the 404 page.
- **Tool:** The Console, and the file name in the right column of every message. The errors pointed to `200.js:1` and the warnings to `Grammarly.js:2`. None of them pointed to `src/...tsx` or to `index-....js`, which are the files of my app. To confirm it I opened an incognito window (extensions are off there by default) and went through the same pages: Login, Add to cart, Checkout, Orders, Profile, the 404 page and the theme toggle. The Console stayed empty.
- **Root cause:** The messages came from scripts that browser extensions put into the page. `Grammarly.js` is a Grammarly file; I did not find out which extension `200.js` belongs to.
- **Fix:** None needed, there is no bug in the app. The Console is clean on the dev server in a window without extensions.
- **What I learned:** Read the file name of a Console message before I start debugging, and check in a window without extensions whether the message belongs to my code.

## 4. "Add to cart" re-rendered all 12 product cards (re-render / React Profiler)

- **Symptom:** Nothing was visibly wrong: the toast, the cart badge and the cart page all worked. I recorded a session in the React DevTools Profiler on purpose, to see what React draws again when I click "Add to cart" in the catalog.
- **Reproduction:**
  1. `npm run dev`, open the catalog (12 products per page), then DevTools, Profiler, and press record.
  2. Click "Add to cart" three times, then stop the recording.
  3. Open a commit where `CartProvider` appears, switch to the Ranked chart and select a `ProductCard`.
- **Tool:** The React DevTools Profiler: the Flamegraph, the Ranked chart and the panel "Why did this render?". In the first recorded commit (1 of 7) the Ranked chart listed 12 `ProductCard` rows. The catalog shows 12 cards per page (`PAGE_SIZE = 12`), so that is every card on the page. The panel for the card I selected said "Props changed: (onAdd)", and that card was rendered in 3 commits (at 18.8 s, 23.4 s and 24.3 s), one for each click; those commits took 33.4 ms, 32 ms and 34.7 ms. Screenshot: [`docs/debug/rerender-before.png`](docs/debug/rerender-before.png). These numbers come from the development build (`StrictMode` and the Profiler add time), so they are not production numbers, and about 33 ms is not something a user feels. I treat this as unnecessary work, not as a visible bug.
- **Root cause:** `CatalogPage` reads the cart with `useCart()`, so it renders again on every cart change. `handleAdd` was a normal function written inside the component, so every render created a new function. `ProductCard` was not wrapped in `memo`, so it rendered again every time its parent did, and the Profiler named `onAdd` as the changed prop although `product` was the same. There was a second link in the chain: in `CartContext`, `addItem` depended on `[state.items]`, so it was also a new function after every cart change. Reading the code, `useCallback` on `handleAdd` alone would still have produced a new function exactly when the cart changes.
- **Fix:** Three small changes: `ProductCard` is wrapped in `React.memo`, `handleAdd` in `CatalogPage` uses `useCallback`, and `addItem` in `CartContext` reads the latest items from a `useRef`, so it keeps one identity. [commit b7b771e](https://github.com/Ann-Altunashvili/10x-shop-ana-altunashvili/commit/b7b771e). After the fix I repeated the same experiment (three clicks). In the click commit I opened, the Ranked chart lists `CartProvider`, `Toolbar`, `Header`, `ProductGrid`, `CatalogPage`, `Pagination` and small components, but no `ProductCard`. Screenshot: [`docs/debug/rerender-after.png`](docs/debug/rerender-after.png). I did not open the other two click commits. By hand I also checked that adding to the cart (toast and badge), the cart page, adding quantity 2 on a product page and a page reload still work. I left `Toolbar`, `Header`, `ProductGrid` and `CatalogPage` as they are: they still render on a cart change because I did not wrap them in `memo`.
- **What I learned:** `React.memo` only helps when the props keep the same identity. A function created inside a component is new on every render, so it needs `useCallback` (and the things it depends on must be stable too), and the "Why did this render?" panel names the prop that changed.
