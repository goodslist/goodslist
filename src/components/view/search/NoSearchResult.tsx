import styles from '../../../styles/Search.module.css'
import Box from '../../../components/view/Box'
import { dateFormat } from '../../../components/Utils'
import Link from 'next/link'
import { Events } from '../../../components/types'
import SearchEventForm from '../../../components/SearchEventForm'

const NoSearchResult = (props: any) => {
  return (
    <Box background='#f1f1f1' padding='80px 20px 60px 20px'>
      <p className={styles.search_result_title}>{props.keyword}　を含む検索結果(0件)</p>
      <SearchEventForm />
      <p className={styles.no_search_result_container}>
        一致するイベントがありませんでした。
        <br />
        検索ワードを変えて再度検索してください。
      </p>
    </Box>
  )
}

export default NoSearchResult
