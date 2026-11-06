/** DummyJSON by default; VITE_API_URL can point the app at another server (see .env.example). */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

/** Products per catalog page. */
export const PAGE_SIZE = 12
