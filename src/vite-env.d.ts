/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override of the DummyJSON base URL, e.g. for offline development. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
