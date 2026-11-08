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
