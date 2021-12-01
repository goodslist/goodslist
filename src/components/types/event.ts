export type EventInfo = {
  content_id: number
  content_name: string
  event_id: number
  event_name: string
  date: string
  place: string
  url: string
  memo: string
}

export type Item = {
  item_id: number
  item_name: string
  group: number
  item_type: string
  color: string
  size: string
  price: number
  item_count: number
}

export type Group = {
  group: number
  group_count: number
  item_name: string
  price: number
  sub_total: number
  open: boolean
}

export type ItemCount = {
  item_id: number
  item_count: number
}
