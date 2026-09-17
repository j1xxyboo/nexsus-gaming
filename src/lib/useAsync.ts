import { useCallback, useEffect, useState } from 'react'

type State<T> = { data: T | null; error: string | null; loading: boolean }

/** Minimal fetch-on-mount helper with a manual reload. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true })

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fn()
      setState({ data, error: null, loading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setState({ data: null, error: message, loading: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    void run()
  }, [run])

  return { ...state, reload: run }
}
