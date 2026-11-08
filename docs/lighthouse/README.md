# Lighthouse results

Measured on the deployed site, https://10x-shop-ana-altunashvili.vercel.app/ (home page), on 8 Nov 2026.
Chrome incognito window, Lighthouse in DevTools, Navigation mode, **Mobile** preset, all four categories.

| Run | Time | Code that was deployed | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- | --- | --- |
| Before | 20:01 | CORE: `main` after stage 38 (before the FULL features and the lazy routes) | 90 | 98 | 100 | 92 |
| After 1 | 20:36 | FULL: `main` after PR #42 (lazy routes) | 89 | 98 | 100 | 92 |
| After 2 | 20:38 | same | 90 | 98 | 100 | 92 |
| After 3 | 20:39 | same | 91 | 98 | 100 | 92 |

Screenshots: [`before.png`](before.png) (Before), [`after.png`](after.png) and [`after-metrics.png`](after-metrics.png) (After 3).

## Metrics of the After 3 run (Mobile)

| First Contentful Paint | Largest Contentful Paint | Total Blocking Time | Cumulative Layout Shift | Speed Index |
| --- | --- | --- | --- | --- |
| 1.9 s | 3.4 s | 0 ms | 0 | 1.9 s |

The metrics of the Before run were not saved (its report window was closed), so only the four scores are compared.

## What changed

- **The Performance score did not change.** The three After runs (89, 90, 91) include the Before value (90), so the difference is ordinary run-to-run variation.
- **The first JavaScript download is smaller.** `npm run build` before PR #42 (commit `f4b1e19`) produced one main file of 399.71 kB (124.34 kB gzip). After PR #42 the main file is 279.83 kB (88.97 kB gzip), 28% smaller in gzip, and every page is a separate file. The Login page file is 79.20 kB (24.95 kB gzip) because it contains Formik and Yup; it is downloaded only when `/login` is opened.
- **Why the score stayed the same:** the catalog is the first page and is needed immediately, so splitting the other pages out does not make the first screen appear sooner. The benefit is for the pages the visitor does not open.
- **Largest Contentful Paint (3.4 s) is the metric that keeps Performance below 100.** Not checked yet: which element is the LCP element and whether it is delayed by the product images using `loading="lazy"` or by the wait for the API response.

## A result that must not be compared

A first After run on the deployment-specific address (`10x-shop-ana-altunashvili-j91g2mi6q.vercel.app`) gave SEO 58. The most likely reason is that Vercel marks addresses other than the main project address as not indexable (not verified), so that run is not comparable and is not in the table above.
