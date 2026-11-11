# Progress note 2 (8 Nov 2026)

## Done

- **8 Nov:** 65 commits in one long session, 14 Pull Requests (#31 - #44), all merged with merge commits.
  - CORE: AuthContext and Login (#31), cart state with the `Cart` class, reducer and context (#32), catalog (#33), product page (#34), cart page and protected checkout (#35).
  - First deploy to Vercel. Refreshing a product page gave 404; fixed with `vercel.json` rewrites (#36, DEBUG-LOG entry 1). Tag `v0.1-core`.
  - FULL: catalog search, category, sorting and pagination kept in the URL (#37), promo code, reviews and related products (#38), dark theme (#39), Orders and Profile (#40), Login rebuilt with Formik + Yup (#41).
  - Optimization: lazy routes (#42), `React.memo` for `ProductCard` after a Profiler session (#43, DEBUG-LOG entry 4).
  - New colour palette (#44) and Lighthouse runs before and after (`docs/lighthouse/`).

## Planned next

- Read the whole code base page by page until I can explain it and change it live.
- Final README, REPORT, progress notes, tag `v1.0.0`.

## Blockers

- The schedule was compressed, so almost all of the code landed on one day. The commit history is honest about that.

## Hours spent

Not tracked. One long working day (8 Nov) from the afternoon until after midnight.
