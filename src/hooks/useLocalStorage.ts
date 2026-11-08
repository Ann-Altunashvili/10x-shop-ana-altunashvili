import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { StorageService } from '../models/StorageService'

/** useState that remembers its value in localStorage (through a validated StorageService). */
export function useLocalStorage<T>(
  storage: StorageService<T>,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => storage.get() ?? initialValue)

  useEffect(() => {
    storage.set(value)
  }, [storage, value])

  return [value, setValue]
}
