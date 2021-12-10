import { useState, useRef, useLayoutEffect, createRef } from 'react'
import { Item, ItemCount, Group } from '../../types'

export const useItems = (propsItems: Item[]) => {
  //グループの配列
  const [items, setItems] = useState(propsItems.map((item: Item) => Object.assign({}, item)))

  //アイテムカウントの配列(DBとローカルストレージに保存する配列)
  const [itemCounts, setItemCounts] = useState<ItemCount[]>([])

  //今セーブできるかどうかのフラグ
  const [isSave, setIsSave] = useState<boolean>(false)

  //プラスボタンが押されたら、グッズのカウントを+1し、アイテムカウントを更新する。
  const countPlus = (itemId: number) => {
    const newItems = [...items]
    const newItemCounts: ItemCount[] = []
    newItems.map((item) => {
      if (item.item_id == itemId) {
        if (99 > item.item_count) item.item_count = item.item_count + 1
      }
      if (item.item_count > 0)
        newItemCounts.push({
          item_id: item.item_id,
          item_count: item.item_count,
        })
    })
    setItems(newItems)
    setItemCounts(newItemCounts)
    setIsSave(true)
  }

  //マイナスボタンが押されたら、グッズのカウントを-1し、アイテムカウントを更新する。
  const countMinus = (itemId: number) => {
    const newItems = [...items]
    const newItemCounts: ItemCount[] = []
    newItems.map((item) => {
      if (item.item_id == itemId) {
        if (item.item_count > 0) item.item_count = item.item_count - 1
      }
      if (item.item_count > 0)
        newItemCounts.push({
          item_id: item.item_id,
          item_count: item.item_count,
        })
    })
    setItems(newItems)
    setItemCounts(newItemCounts)
    setIsSave(true)
  }

  return [
    items,
    setItems,
    itemCounts,
    setItemCounts,
    countPlus,
    countMinus,
    isSave,
    setIsSave,
  ] as const
}
