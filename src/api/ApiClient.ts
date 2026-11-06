import { isRecord } from '../utils/guards/common'
import { ApiError } from './ApiError'

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json()
    if (isRecord(body) && typeof body.message === 'string') return body.message
  } catch {
    /* the body was not JSON - use the generic message below */
  }
  return `Request failed with status ${response.status}`
}

/** The only place in the app that calls fetch(). */
export class ApiClient {
  // The public products API needs no user authorization, so there are no auth headers here.
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response
    try {
      response = await fetch(this.baseUrl + path, {
        ...init,
        // A Content-Type header only when there is a body: on a GET it would force a CORS preflight.
        headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
      })
    } catch (error: unknown) {
      // A cancelled request is not an error the user should see.
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new ApiError(0, 'Network error. Check your connection and try again.')
    }

    if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response))
    return (await response.json()) as T
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal })
  }

  post<T, B>(path: string, body: B): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }

  /** GET + proof of shape: the generic T is only returned after the type guard has checked it. */
  async getValidated<T>(
    path: string,
    guard: (data: unknown) => data is T,
    signal?: AbortSignal,
  ): Promise<T> {
    const data = await this.get<unknown>(path, signal)
    if (!guard(data)) throw new ApiError(502, 'The server sent an unexpected response.')
    return data
  }
}
