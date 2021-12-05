import { useState } from 'react'

export const useTotalPrice = () => {
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  //合計金額と合計カウントを計算する。
  const countTotalPrice = (items: any) => {
    const newItems = [...items]
    let newtotalPrice = 0
    let newtotalCount = 0
    newItems.map((newItem) => {
      newtotalPrice = newtotalPrice + newItem.price * newItem.item_count
      newtotalCount = newtotalCount + newItem.item_count
    })
    if (newtotalPrice > 9999999) newtotalPrice = 9999999
    setTotalPrice(newtotalPrice)
    setTotalCount(newtotalCount)
  }

  return [totalPrice, totalCount, countTotalPrice] as const
}
