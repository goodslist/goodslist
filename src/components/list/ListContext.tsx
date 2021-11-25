import React, { Dispatch, SetStateAction, createContext, FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

class Item {
  item_id: number = 0
  item_name: string = ''
  group_id: number = 0
  item_type: string = ''
  color: string = ''
  size: string = ''
  price: number = 0
  goods_count: number = 0
}

class Group {
  group_id: number = 0
  group_count: number = 0
  item_name: string = ''
  price: number = 0
  sub_total: number = 0
  open: boolean = true
}

interface ListContextProps {
  currentListId: string | null | undefined
  setCurrentListId: Dispatch<SetStateAction<string | null | undefined>>
  currentItems: Item[] | null | undefined
  setCurrentItems: Dispatch<SetStateAction<Item[] | null | undefined>>
  currentGroups: Group[] | null | undefined
  setCurrentGroups: Dispatch<SetStateAction<Group[] | null | undefined>>
}

export const ListContext = createContext({} as ListContextProps)
export const ListProvider: FC = ({ children }) => {
  const [currentListId, setCurrentListId] = useState<string | null | undefined>(undefined)
  const [currentItems, setCurrentItems] = useState<Item[] | null | undefined>(undefined)
  const [currentGroups, setCurrentGroups] = useState<Group[] | null | undefined>(undefined)

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
