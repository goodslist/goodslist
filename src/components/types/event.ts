export type EventInfo = {
  content_id: number
  content_name: string
  event_id: number
  event_name: string
  date: string
  url: string
}

export type Item = {
  item_id: number
  item_name: string
  group_id: number
  item_type: string
  color: string
  size: string
  price: number
  goods_count: number
}

export type Group = {
  group_id: number
  group_count: number
  item_name: string
  price: number
  sub_total: number
  open: boolean
}
