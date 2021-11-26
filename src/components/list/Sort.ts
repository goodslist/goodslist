import { Group, Item } from '../types/event'

//ソート前のグループの高さを取得する
export const getPrevGroupHeights = (nowGroupHeights: any) => {
  let newPrevGroupHeights: any = []
  nowGroupHeights.current.map((ref: any, index: number) => {
    if (ref.current) {
      newPrevGroupHeights[index] = ref.current.getBoundingClientRect().top
    }
  })
  return newPrevGroupHeights
}

//グループをソートする
export const sortGroups = (sortType: string, groups: Group[]) => {
  let sortedGroups: Group[] = []
  if (sortType == 'buy') {
    let groupCountTrue: Group[] = []
    let groupCountFalse: Group[] = []
    groups.map((group) => {
      if (group.group_count > 0) groupCountTrue.push(group)
      else groupCountFalse.push(group)
    })
    groupCountTrue.sort(function (a, b) {
      if (a.group_id > b.group_id) {
        return 1
      }
      if (a.group_id < b.group_id) {
        return -1
      }
      return 0
    })
    groupCountFalse.sort(function (a, b) {
      if (a.group_id > b.group_id) {
        return 1
      }
      if (a.group_id < b.group_id) {
        return -1
      }
      return 0
    })

    sortedGroups = groupCountTrue.concat(groupCountFalse)
  } else {
    sortedGroups = [...groups]
    sortedGroups.sort(function (a, b) {
      if (a.group_id > b.group_id) {
        return 1
      }
      if (a.group_id < b.group_id) {
        return -1
      }
      return 0
    })
  }

  return sortedGroups
}

//ソートしたグループと同じ順にアイテムをソートする
// export const sortItems = (sortedGroups: Group[], items: Item[]) => {
//   const sortedItems: Item[] = []
//   sortedGroups.map((sortedGroup) => {
//     items.map((newItem) => {
//       if (sortedGroup.group_id == newItem.group_id) sortedItems.push(newItem)
//     })
//   })

//   return sortedItems
// }

//ソート後のリストの高さを取得する
export const getAfterGroupHeights = (nowGroupHeights: any) => {
  let newGroupHeights: number[] = new Array()
  nowGroupHeights.current.forEach((ref: any, index: number) => {
    if (ref.current) {
    }
    newGroupHeights.push(ref.current.getBoundingClientRect().top)
  })
  return newGroupHeights
}

//ソート前後のリストを比較しグループのtopの値の差分を取得する
export const getDifferenceGroupHeights = (
  prevGroups: Group[],
  groups: Group[],
  prevGroupHeights: any,
  newGroupHeights: any,
) => {
  let differenceGroupHeights: number[] = new Array()
  groups.forEach((after: any, index: number) => {
    prevGroups.forEach((prev: any, index2: number) => {
      if (after.group_id == prev.group_id) {
        differenceGroupHeights.push(prevGroupHeights[index2] - newGroupHeights[index])
      }
    })
  })
  return differenceGroupHeights
}

//移動させたリストを一時的に元の位置にずらす
export const returnPosition = (
  groups: Group[],
  nowGroupHeights: any,
  differenceGroupHeights: number[],
) => {
  nowGroupHeights.current.forEach((ref: any, index: number) => {
    var li = document.getElementById(String(groups[index].group_id))
    if (li) {
      li.style.transform = `translateY(${differenceGroupHeights[index]}px)`
      li.style.transition = `transform 0s`
    }
  })
}

//requestAnimationFrameにより1フレーム後（ここからレンダリング後）にアニメーションをスタートさせる
export const startSortAnimation = (groups: Group[], nowGroupHeights: any) => {
  requestAnimationFrame(() => {
    nowGroupHeights.current.forEach((ref: any, index: number) => {
      var li = document.getElementById(String(groups[index].group_id))
      if (li) {
        li.style.transform = ``
        li.style.transition = `transform 300ms ease`
      }
    })
  })
}
