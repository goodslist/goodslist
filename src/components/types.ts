export type User = {
  user_id: string
  user_name: string
  provider: number
  provider_id: string
  photo: string
  signedup: boolean
}

export type Events = {
  content_name: string
  event_id: number
  event_name: string
  date: string
}

export type Event = {
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
  order: number
  group: number
  item_type: string
  color: string
  size: string
  price: number
  item_count: number
}

export type ShowItem = {
  item_id: number
  item_name: string
  order: number
  group: number
  item_type: string
  color: string
  size: string
  price: number
  item_count: number
  check: boolean
}

export type Group = {
  group: number
  group_count: number
  item_name: string
  price: number
  sub_total: number
  open: boolean
}

export type ShowGroup = {
  group: number
  item_version_count: number
  item_check_count: number
  check: boolean
}

export type ItemCount = {
  item_id: number
  item_count: number
}

export type MyList = {
  list_id: number
  content_id: number
  content_name: string
  event_id: number
  event_name: string
  date: string
  place: string
  memo: string
  item_counts: ItemCount[]
  total_price: number
  total_count: number
  updated_at: Date
}

export type ContentsList = {
  content_id: number
  content_name: string
}

export type Contents = {
  content_id: number
  content_name: string
  content_name_hira: string
  content_name_kana: string
}

export type MetaProps = {
  title: string
  url: string
  image: string
}

export type TopicProps = {
  image: string
  alt: string
  title: string
  text: string
}
