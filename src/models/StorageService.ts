/**
 * The only door to localStorage. One instance per key, and every value read back
 * has to pass the type guard - localStorage is user-editable text, not trusted data.
 */
export class StorageService<T> {
  constructor(
    private readonly key: string,
    private readonly isValid: (value: unknown) => value is T,
  ) {}

  get(): T | null {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw === null) return null
      const parsed: unknown = JSON.parse(raw)
      return this.isValid(parsed) ? parsed : null
    } catch {
      // Blocked storage or broken JSON: behave as if nothing was saved.
      return null
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
    } catch {
      /* quota exceeded or storage blocked - the app keeps working without persistence */
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key)
    } catch {
      /* nothing to do */
    }
  }
}
