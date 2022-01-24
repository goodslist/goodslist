import { useEffect, useLayoutEffect } from 'react'

export const useEffectSelect = () => {
  return typeof window !== 'undefined' ? useLayoutEffect : useEffect
}
export default useEffectSelect
