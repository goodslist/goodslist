import { useState } from 'react'
import { Event, Group } from '../../types/event'

export const useDate = (propsDate: string) => {
  const [date, setDate] = useState(propsDate)

  return [date, setDate] as const
}
