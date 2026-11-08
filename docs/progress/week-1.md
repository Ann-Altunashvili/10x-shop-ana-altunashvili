# Progress note 1 (27 Oct - 7 Nov 2026)

## Done

- **27 Oct:** read the project requirements (PRD) and went through them in full with Claude. Made the project outline, the list of files and a plan for how the project would be built. No code and no commits yet.
- **31 Oct - 4 Nov:** no work on the project. I was at a conference and could not return to the React project.
- **5 Nov:** started again and began uploading the project to the repository step by step (the first commit is on 6 Nov, 00:58).
- **6-7 Nov:**
  - Repository, `PLAN.md`, 28 Issues with labels and milestones, and a GitHub Project board (Todo / In Progress / Done).
  - Stages 1-15 as separate commits: Vite + React + TypeScript (strict) scaffold, Tailwind CSS v4 with design tokens, domain types, runtime type guards, formatters, `ApiClient` with `ApiError`, `useFetch`, UI components, `ErrorBoundary`, layout (header, footer, skip link), React Router with a 404 page.
  - Pull Requests #29 (types and API) and #30 (layout and routing), merged with merge commits.

## Planned next

- Login with AuthContext, cart state (class, reducer, context), catalog, product page, cart page, protected checkout: the CORE flow.
- Deploy to Vercel, then the FULL features.

## Blockers

- 31 Oct - 4 Nov: conference, no time for the project.
- 7 Nov (daytime): no work, I was too tired after the night session.
- GitHub CLI was not installed and `brew` was not available, so it had to be installed by hand, and macOS blocked the installer until I allowed it in Privacy & Security.
- Three commit messages were wrong or claimed checks that I had not done; I corrected them with `git commit --amend` before pushing.
- The schedule had to be compressed into 6-11 Nov.

## Hours spent

Estimated from memory; the time was not tracked.

| Period | Hours |
| --- | --- |
| 27-30 Oct (requirements, outline, plan), about 4-5 hours a day for 4 days | about 16-20 |
| 5-6 Nov (start, repository, first commits), about 5-6 hours a day for 2 days | about 10-12 |
| 7 Nov (GitHub Project, stages 4-15, two PRs) | about 5-6 |
| **Total** | **about 31-38** |
