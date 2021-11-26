import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
import { Group, Item } from '../../components/types/event'
import { useRouter } from 'next/router'

interface ListContextProps {
  currentListId: string | null | undefined
  setCurrentListId: Dispatch<SetStateAction<string | null | undefined>>
  currentItems: Item[] | null | undefined
  setCurrentItems: Dispatch<SetStateAction<Item[]>>
  currentGroups: Group[] | null | undefined
  setCurrentGroups: Dispatch<SetStateAction<Group[]>>
}

export const ListContext = createContext({} as ListContextProps)
export const ListProvider: FC = ({ children }) => {
  const [currentListId, setCurrentListId] = useState<string | null | undefined>(undefined)
  const [currentItems, setCurrentItems] = useState<Item[]>([])
  const [currentGroups, setCurrentGroups] = useState<Group[]>([])

  return (
    <ListContext.Provider
      value={{
        currentListId,
        setCurrentListId,
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
