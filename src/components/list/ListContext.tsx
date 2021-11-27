import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
import { Group, Item } from '../../components/types/event'
import { useRouter } from 'next/router'

interface ListContextProps {
  currentListId: string | null | undefined
  setCurrentListId: Dispatch<SetStateAction<string | null | undefined>>
  currentEventId: Number
  setCurrentEventId: Dispatch<SetStateAction<Number>>
  currentItems: Item[]
  setCurrentItems: Dispatch<SetStateAction<Item[]>>
  currentGroups: Group[]
  setCurrentGroups: Dispatch<SetStateAction<Group[]>>
}

export const ListContext = createContext({} as ListContextProps)
export const ListProvider: FC = ({ children }) => {
  const [currentListId, setCurrentListId] = useState<string | null | undefined>(undefined)
  const [currentEventId, setCurrentEventId] = useState<Number>(0)
  const [currentItems, setCurrentItems] = useState<Item[]>([])
  const [currentGroups, setCurrentGroups] = useState<Group[]>([])

  return (
    <ListContext.Provider
      value={{
        currentListId,
        setCurrentListId,
        currentEventId,
        setCurrentEventId,
        currentItems,
        setCurrentItems,
        currentGroups,
        setCurrentGroups,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}
