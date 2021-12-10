import { useState, useRef, useLayoutEffect, createRef } from 'react'
import { Item, Group } from '../../types'
import {
  getPrevGroupHeights,
  sortGroups,
  getAfterGroupHeights,
  getDifferenceGroupHeights,
  returnPosition,
  startSortAnimation,
} from '../../event/Sort'

export const useGroups = (propsGroups: Group[]) => {
  //グループの配列
  const [groups, setGroups] = useState(propsGroups.map((group: Group) => Object.assign({}, group)))
  const [isAllOpenArrow, setIsAllOpenArrow] = useState(false)
  const [isAllCloseArrow, setIsAllCloseArrow] = useState(true)

  //ソート前のグループの配列
  const [prevGroups, setPrevGroups] = useState(
    groups.map((group: Group) => Object.assign({}, group)),
  )
  //ソート前のグループの配列の高さ
  const [prevGroupHeights, setPrevGroupHeights] = useState<any>([])

  //ソート後のグループの配列の高さ
  const nowGroupHeights = useRef<any>([])
  const [isDefaultSort, setIsDefaultSort] = useState(true)
  const [sortFlag, setSortFlag] = useState(false)

  //小計を計算する。
  const countSubTotal = (items: Item[]) => {
    const newItems = [...items]
    const newGroups = [...groups]
    newGroups.map((newGroup) => {
      newGroup.group_count = 0
      newItems.map((item) => {
        if (newGroup.group == item.group) {
          if (99 > newGroup.group_count)
            newGroup.group_count = newGroup.group_count + item.item_count
        }
      })
      newGroup.sub_total = newGroup.price * newGroup.group_count
      if (newGroup.sub_total > 9999999) newGroup.sub_total = 9999999
    })
    setGroups(newGroups)
  }

  //グループの矢印がクリックされたら、アイテムの入力蘭を開閉する。
  const openOrCloseItemInput = (group: number) => {
    const newGroups = [...groups]
    if (groups[group].open == true) {
      newGroups[group].open = false
    } else {
      newGroups[group].open = true
    }
    setGroups(newGroups)
    setIsAllOpenArrow(true)
    setIsAllCloseArrow(true)
  }

  //トップの上向きの矢印がクリックされたら、全てのアイテムの入力蘭を閉じる。
  const closeAllItemInputs = () => {
    const newGroups = [...groups]
    newGroups.map((newGroup) => {
      newGroup.open = false
    })
    setGroups(newGroups)
    setIsAllOpenArrow(true)
    setIsAllCloseArrow(false)
  }

  //トップの下向きの矢印がクリックされたら、全てのアイテムの入力蘭を開く。
  const openAllItemInputs = () => {
    const newGroups = [...groups]
    newGroups.map((newGroup) => {
      newGroup.open = true
    })
    setGroups(newGroups)
    setIsAllOpenArrow(false)
    setIsAllCloseArrow(true)
  }

  //グループの高さを取得する
  prevGroups.forEach((_: any, i: number) => {
    nowGroupHeights.current[i] = createRef()
  })

  const sort = (sortType: string) => {
    //ソート直前のリストを保持する
    setPrevGroups([...groups])

    //ソート前のグループの高さを取得する
    const newPrevGroupHeights = getPrevGroupHeights(nowGroupHeights)
    setPrevGroupHeights(newPrevGroupHeights)

    //ソートボタンの色を変える
    sortType == 'buy' ? setIsDefaultSort(false) : setIsDefaultSort(true)

    //グループをソートする（この時点ではまだ画面にレンダリングはされていない）
    const sortedGroups = sortGroups(sortType, groups)
    setGroups(sortedGroups)

    // フラグを変えてuseLayoutEffectを呼び出す
    sortFlag ? setSortFlag(false) : setSortFlag(true)
  }

  //ソート処理の続き（useLayoutEffectなのでまだレンダリング前）
  useLayoutEffect(() => {
    //ソート直後のリストの高さを取得する
    const newGroupHeights = getAfterGroupHeights(nowGroupHeights)

    //ソート前後のリストを比較しグループのtopの値の差分を取得する
    const differenceGroupHeights = getDifferenceGroupHeights(
      groups,
      prevGroups,
      prevGroupHeights,
      newGroupHeights,
    )

    //ソートしたリストを差分を足して一時的に元の位置にずらす
    returnPosition(groups, nowGroupHeights, differenceGroupHeights)

    //requestAnimationFrameにより1フレーム後（ここからレンダリング後）にアニメーションをスタートさせる
    startSortAnimation(groups, nowGroupHeights)
  }, [sortFlag])

  return [
    groups,
    setGroups,
    countSubTotal,
    openOrCloseItemInput,
    closeAllItemInputs,
    openAllItemInputs,
    sort,
    nowGroupHeights,
    isDefaultSort,
    setIsDefaultSort,
    isAllOpenArrow,
    setIsAllOpenArrow,
    isAllCloseArrow,
    setIsAllCloseArrow,
  ] as const
}
