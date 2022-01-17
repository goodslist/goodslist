import { supabase } from '../../components/supabase'
import { Events } from '../../components/types'

const searchEvent = async (search_word: string) => {
  let newSearchResults: Events[] = []

  const searchWords = String(search_word).replace(/　/g, ' ').split(' ')

  let data
  if (searchWords.length == 1) {
    data = await searchEventWord1(searchWords)
  } else if (searchWords.length == 2) {
    data = await searchEventWord2(searchWords)
  } else if (searchWords.length == 3) {
    data = await searchEventWord3(searchWords)
  }

  data?.map((doc) => {
    const searchResult: Events = {
      event_id: doc.event_id,
      event_name: doc.event_name,
      content_name: doc.content_name,
      date: doc.date,
    }
    newSearchResults.push(searchResult)
  })

  return newSearchResults
}

const searchEventWord1 = async (search_word: string[]) => {
  const { data, error } = await supabase
    .from('search_events')
    .select('event_id, event_name, content_name, date, search_word')
    .ilike('search_word', '%' + search_word[0] + '%')
    .limit(5)

  return data
}

const searchEventWord2 = async (search_word: string[]) => {
  const { data, error } = await supabase
    .from('search_events')
    .select('event_id, event_name, content_name, date, search_word')
    .ilike('search_word', '%' + search_word[0] + '%')
    .ilike('search_word', '%' + search_word[1] + '%')
    .limit(5)

  return data
}

const searchEventWord3 = async (search_word: string[]) => {
  const { data, error } = await supabase
    .from('search_events')
    .select('event_id, event_name, content_name, date, search_word')
    .ilike('search_word', '%' + search_word[0] + '%')
    .ilike('search_word', '%' + search_word[1] + '%')
    .ilike('search_word', '%' + search_word[2] + '%')
    .limit(5)

  return data
}

export default searchEvent
