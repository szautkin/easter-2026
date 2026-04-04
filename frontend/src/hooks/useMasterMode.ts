import { useMemo } from 'react'

export function useMasterMode(): boolean {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('mode') === 'master'
  }, [])
}
