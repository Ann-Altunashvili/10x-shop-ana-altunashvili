# PLAN - 10X Shop (retake)

Author: Anna · Repository: `10x-shop-ana-altunashvili` · Period: 6 Nov - 11 Nov 2026 · Exam: 12 Nov 2026

## 1. Goal and scope

Build the "10X Shop" single-page store with **Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + React Router**, using the DummyJSON API for products. Login is a local simulation (React Context), checkout is a local simulation (controlled form, no real payment).

Order of work: **CORE first, then FULL** (the CORE checkpoint is tagged `v0.1-core`).

Schedule: this is a retake and the work starts on 6 November, so the plan is compressed into six working days (Day 1 = Fri 6 Nov ... Day 6 = Wed 11 Nov). CORE is finished and tagged by the end of Day 3 and deployed on Day 4; FULL features follow as separate branches. The last day is for documentation, final checks and defense preparation. Estimates assume 6-8 focused hours per day.

| Module | CORE (must work first) | FULL (after CORE is deployed) |
| --- | --- | --- |
| React | Layout, Router, AuthContext + Login, Catalog (loading/error/empty), Product details, CartContext, Cart page, Checkout form + confirmation | Search / category / sort / pagination in the URL, reviews, related products, promo code, Orders, Profile, Formik + Yup login, custom hooks |
| TypeScript | Types for Product, Cart, Login/Checkout forms, typed props and state | Generics (`StorageService<T>`, `useFetch<T>`), type guards, utility types, discriminated unions, small OOP layer (`Cart`, `ApiError`, `OrderModel`) |
| Tailwind CSS | v4, utilities, grid/flex, responsive (375px and desktop), hover / focus / disabled | `@theme` tokens, dark mode, custom breakpoints |
| Optimization | Error Boundary, DEBUG-LOG, basic debugging with DevTools | `React.lazy` routes, lazy images, Lighthouse before / after |
| Practical project | README, PLAN, REPORT, deploy with working SPA refresh, real Git history | Issues + Projects board, PR flow, 3 progress notes |

## 2. Work breakdown (estimates in hours)

| Epic | Tasks | Estimate | Day |
| --- | --- | --- | --- |
| Setup | Vite + TS strict + Tailwind v4, repo, PLAN | 2 | 1 |
| Types and API | Domain types, formatters, type guards, ApiClient, `useFetch` | 3 | 1 |
| Layout and routing | UI primitives, Error Boundary, Layout, Header, Router, 404 | 3 | 1-2 |
| Auth | StorageService, AuthContext, Login form, protected checkout | 2 | 2 |
| Cart | `Cart` model, reducer, CartContext, Cart page | 3 | 2-3 |
| Catalog | ProductCard, ProductGrid, Catalog page with loading / error / empty | 3 | 2-3 |
| Product | Gallery, quantity, Add to cart | 2 | 3 |
| Checkout | Validation, form, confirmation | 3 | 3 |
| Deploy | Vercel, SPA rewrites, README for CORE | 2 | 4 |
| Catalog FULL | Debounced search, category, sort, pagination, URL state | 3 | 4 |
| Product FULL | Reviews, related products, promo code | 3 | 4-5 |
| Orders and Profile | Order model, status by time, Orders pages, Profile, dark mode | 3 | 5 |
| Quality | Formik + Yup login, lazy routes, accessibility, 375px check, Lighthouse | 3 | 5 |
| Docs | DEBUG-LOG, REPORT, progress notes, final README | 4 | 1-6 |
| **Total** | | **39** | 1-6 |

## 3. Risks

| Risk | Mitigation |
| --- | --- |
| DummyJSON is slow or unavailable | Every request has loading, error and Retry states; the base URL is configurable through `VITE_API_URL` |
| Not enough time for FULL | CORE is finished, deployed and tagged first; FULL features are separate branches |
| Corrupted or blocked localStorage | All reads go through `StorageService<T>` with a type guard and fall back to defaults |
| Refresh on `/products/5` gives 404 after deploy | Add SPA rewrites (`vercel.json` / `_redirects`) and test a direct URL right after the first deploy |
| Compressed six-day schedule | Small stages with a daily checkpoint; CORE tagged on Day 3 and deployed on Day 4; FULL features are independent branches that can be dropped; no new code on the last evening |
| Search, category and sort cannot be combined in the API | The URL rules are written down once (`nextCatalogParams`): a search clears the category, a filter change returns to page 1 |

## 4. Definition of Done (for every task)

- `npm run typecheck`, `npm run lint` and `npm run build` pass without errors.
- Checked in the browser at 375px and on desktop; no horizontal scroll, no console errors.
- Loading, error and empty states exist where data is fetched.
- Committed with a meaningful message; the related Issue is closed by a merged PR.
