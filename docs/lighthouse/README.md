# Lighthouse results

Measured on the deployed site, https://10x-shop-ana-altunashvili.vercel.app/ (home page), on 8 Nov 2026.
Chrome incognito window, Lighthouse in DevTools, Navigation mode, **Mobile** preset, all four categories.

| Run | Time | Code that was deployed | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- | --- | --- |
| Before | 20:01 | CORE: `main` after stage 38 (before the FULL features and the lazy routes) | 90 | 98 | 100 | 92 |
| After 1 | 20:36 | FULL: `main` after PR #42 (lazy routes) | 89 | 98 | 100 | 92 |
| After 2 | 20:38 | same | 90 | 98 | 100 | 92 |
| After 3 | 20:39 | same | 91 | 98 | 100 | 92 |
| After palette, dark | 23:19 | FULL + the new gel-dye colour palette (PR #44), **dark theme** | 89 | 98 | 100 | 92 |
| After palette, light, run 1 | 23:21 | same code, **light theme** | 84 | 98 | 100 | 92 |
| After palette, light, run 2 | 23:24 | same | 84 | 98 | 100 | 92 |
| After palette, light, run 3 | 23:25 | same | 88 | 98 | 100 | 92 |

Screenshots: [`before.png`](before.png) (Before), [`after.png`](after.png) and [`after-metrics.png`](after-metrics.png) (After 3).
After palette, dark: [`after-palette-dark.png`](after-palette-dark.png) and [`after-palette-dark-metrics.png`](after-palette-dark-metrics.png).
After palette, light: [`after-palette-light.png`](after-palette-light.png) and [`after-palette-light-metrics.png`](after-palette-light-metrics.png) (run 1), [`after-palette-light-run2.png`](after-palette-light-run2.png) (run 2), [`after-palette-light-run3.png`](after-palette-light-run3.png) (run 3).

## Metrics of the After 3 run (Mobile)

| First Contentful Paint | Largest Contentful Paint | Total Blocking Time | Cumulative Layout Shift | Speed Index |
| --- | --- | --- | --- | --- |
| 1.9 s | 3.4 s | 0 ms | 0 | 1.9 s |

The metrics of the Before run were not saved (its report window was closed), so only the four scores are compared.

The first four runs (Before and After 1-3) were measured with the old blue palette. The "After palette" runs have the new colours: one run in the dark theme and three in the light theme.

| After palette run (Mobile) | First Contentful Paint | Largest Contentful Paint | Total Blocking Time | Cumulative Layout Shift | Speed Index |
| --- | --- | --- | --- | --- | --- |
| Dark theme, 23:19 | 1.9 s | 3.6 s | 0 ms | 0 | 2.3 s |
| Light theme, run 1, 23:21 | 1.9 s | 3.6 s | 0 ms | **0.13** | 2.0 s |
| Light theme, run 2, 23:24 | 2.1 s | 4.1 s | 10 ms | 0 | 2.9 s |
| Light theme, run 3, 23:25 | 1.9 s | 3.7 s | 0 ms | 0 | 1.9 s |

The first light-theme run had a Cumulative Layout Shift of 0.13 (Lighthouse marks values above 0.1 as "needs improvement"). I ran the light theme twice more, a few minutes later, and both runs had CLS 0, so it did not repeat. I did not find which element shifted in run 1 and I do not claim a cause; I treat it as a one-off.

## What changed

- **The Performance score did not change.** The three After runs (89, 90, 91) include the Before value (90), so the difference is ordinary run-to-run variation.
- **The new colour palette did not change Accessibility.** It stayed at 98 in both themes in all four runs, so the new colours did not lower the score.
- **Single Lighthouse runs vary a lot.** The same code in the light theme gave Performance 84, 84 and 88 and Largest Contentful Paint between 3.6 s and 4.1 s. A difference of a few points between two runs therefore means little, and I do not draw a conclusion about speed from one run.
- **The first JavaScript download is smaller.** `npm run build` before PR #42 (commit `f4b1e19`) produced one main file of 399.71 kB (124.34 kB gzip). After PR #42 the main file is 279.83 kB (88.97 kB gzip), 28% smaller in gzip, and every page is a separate file. The Login page file is 79.20 kB (24.95 kB gzip) because it contains Formik and Yup; it is downloaded only when `/login` is opened.
- **Why the score stayed the same:** the catalog is the first page and is needed immediately, so splitting the other pages out does not make the first screen appear sooner. The benefit is for the pages the visitor does not open.
- **Largest Contentful Paint (3.4 s) is the metric that keeps Performance below 100.** Not checked yet: which element is the LCP element and whether it is delayed by the product images using `loading="lazy"` or by the wait for the API response.

## A result that must not be compared

A first After run on the deployment-specific address (`10x-shop-ana-altunashvili-j91g2mi6q.vercel.app`) gave SEO 58. The most likely reason is that Vercel marks addresses other than the main project address as not indexable (not verified), so that run is not comparable and is not in the table above.
