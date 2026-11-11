# REPORT - 10X Shop

Author: Anna Altunashvili · Period: 6 Nov - 11 Nov 2026 (retake, compressed schedule)

## 1. Planned vs delivered

| Module | Item | Planned | Delivered | Notes |
| --- | --- | --- | --- | --- |
| React | CORE checklist (Login, Catalog, Product, Cart, Checkout) | yes | yes | Tag `v0.1-core` |
| React | FULL: URL state, reviews, related, promo, Orders, Profile, Formik + Yup | yes | yes | Formik + Yup on Login only; the other forms use my own small validators |
| TypeScript | strict mode, 0 errors, generics, guards, utility types, OOP | yes | yes | `useFetch<T>`, `StorageService<T>`, type guards, `Cart` class |
| Tailwind | v4, responsive 375px + desktop, `@theme`, dark mode | yes | yes | |
| Optimization | Error Boundary, DEBUG-LOG, lazy routes, Lighthouse | yes | partly | DEBUG-LOG has 4 entries; the Largest Contentful Paint element was not investigated |
| Practical | README, PLAN, REPORT, deploy, Git history, Issues, PRs, progress notes | yes | partly | Progress notes 2 and 3 and this report were written on the last evening |

What was **not** done and why:

- The work was not spread over the planned period. Almost all of the code was committed on 8 Nov (65 of 82 commits), because I started late and lost a week to a conference.
- Stock is not reduced after an order. The API is read-only, so the cart only checks the stock number that the API returns.
- Login and checkout are simulations: there is no server, no password check and no payment.
- Hours were not tracked after the first week.

## 2. Metrics

| Metric | Value |
| --- | --- |
| Commits | 82 before the final documentation commit (`git rev-list --count`) |
| Days with commits | 6, 7, 8 and 11 Nov (3 + 14 + 65 commits, then the final documentation) |
| Merged PRs | 16 (#29 - #44) |
| Closed Issues | not counted in this report; see the Issues tab |
| Production bundle (main chunk, gzip) | about 88 kB (was 124 kB before lazy routes, PR #42) |
| Hours per epic | week 1: about 31-38 hours (estimate, see progress note 1); later not tracked |


## 3. The three hardest problems

1. **Refreshing any page except the home page gave 404 on Vercel.** I saw that the error page was Vercel's, not my `NotFoundPage`, so the problem was on the server. Fixed with a rewrite of every path to `index.html` in `vercel.json` (PR #36, DEBUG-LOG entry 1).
2. **"Add to cart" re-rendered all 12 product cards.** Found with the React DevTools Profiler ("Props changed: onAdd"). Fixed with `React.memo` on `ProductCard`, `useCallback` on `handleAdd` and a stable `addItem` in `CartContext` (PR #43, DEBUG-LOG entry 4).
3. **Understanding where each piece of logic lives.** The hardest part for me was not a bug: it was learning to follow one action through the files, for example how a name saved on the Profile page reaches the header (page state, `updateProfile`, `AuthContext`, header), or how the cart checks stock in one place (`checkAddItem`).

## 4. What I would do differently

I would start earlier and commit a little every day instead of one very long day. I would write the progress notes and the report while working, not at the end. I would also explain each page to myself right after building it, because that is where I learned the most.

## 5. How I used AI

I built this project together with an AI assistant (Claude). First we planned it: I went through the requirements with the assistant and we broke the whole project into small tasks. Then we built the project task by task: I applied each stage, committed it, opened and merged the Pull Requests, deployed the app and ran the checks (Lighthouse, Profiler, manual tests). I corrected commit messages that claimed checks I had not done. After the code was finished I went through it page by page with the assistant, retelling each part in my own words and having my explanations corrected.

I had less time to prepare than I needed, so my preparation is not what I wanted it to be, but physically I could not have done more. As far as that time allowed, I know the code of the project: the catalog URL state, the cart and the stock rule, login and protected routes, the profile form and how Context updates the header.
