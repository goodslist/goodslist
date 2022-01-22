import styles from '../../../styles/Search.module.css'
import BoxGrid from '../../../components/view/BoxGrid'
import { dateFormat } from '../../../components/Utils'
import Link from 'next/link'
import { Events } from '../../../components/types'

const SearchResult = (props: any) => {
  return (
    <BoxGrid background='#f1f1f1' padding='80px 20px 60px 20px'>
      <div className={styles.search_result_title}>
        {props.keyword}　を含む検索結果({props.searchResults.length}件)
      </div>
      <div className={styles.grid}>
        <ul className={styles.ul_event}>
          {props.searchResults?.map((searchResult: Events) => (
            <li key={searchResult.event_id} className={styles.li_event}>
              <Link href={'event/' + searchResult.event_id}>
                <a>
                  <div className={styles.li_event_padding}>
                    <p className={styles.contents_title}>
                      <b>{searchResult.content_name}</b>
                    </p>
                    <p className={styles.event_date}>{dateFormat(searchResult.date)}</p>
                    <hr className={styles.li_event_line} />
                    <p className={styles.event_title}>{searchResult.event_name}</p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </BoxGrid>
  )
}

export default SearchResult
