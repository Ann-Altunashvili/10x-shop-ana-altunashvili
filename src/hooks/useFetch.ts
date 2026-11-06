import { useCallback, useEffect, useState } from 'react'
import { isApiError, getErrorMessage } from '../api/ApiError'
import { apiClient } from '../api/client'
import type { AsyncState } from '../types/api'

/**
 * Loads `path` and keeps loading / error / success in one AsyncState.
 * - `path === null` means "nothing to load yet" (state stays idle).
 * - The cleanup aborts the previous request, so an old response can never overwrite a newer one.
 * - `guard` proves the response has the shape T before it reaches the UI.
 */
export function useFetch<T>(
  path: string | null,
  guard: (data: unknown) => data is T,
): { state: AsyncState<T>; retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (path === null) {
      setState((previous) => (previous.status === 'idle' ? previous : { status: 'idle' }))
      return
    }

    const controller = new AbortController()
    setState({ status: 'loading' })

    apiClient
      .getValidated(path, guard, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message: getErrorMessage(error),
          code: isApiError(error) ? error.status : undefined,
        })
      })

    return () => controller.abort()
  }, [path, guard, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return { state, retry }
}
