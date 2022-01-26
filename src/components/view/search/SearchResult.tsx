import styles from '../../../styles/Search.module.css'
import BoxGrid from '../../../components/view/BoxGrid'
import { dateFormat } from '../../../components/Utils'
import Link from 'next/link'
import { Events } from '../../../components/types'

const SearchResult = (props: any) => {
  //ページ数を計算する
  let pageCount = props.searchResultsTotalCount / 10
  if (pageCount > 0) {
    pageCount = Math.trunc(pageCount) + 1
  } else {
    pageCount = 1
  }

  return (
    <BoxGrid background='#f1f1f1' padding='80px 20px 60px 20px'>
      <div className={styles.search_result_title}>
        {props.keyword}　を含む検索結果({props.searchResultsTotalCount}件)
        <br />
        {(props.currentPage - 1) * 10 + 1}～
        {props.searchResults.length == 10
          ? '10'
          : (props.currentPage - 1) * 10 + props.searchResults.length}
        件目
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

        <div className={styles.pagination_container}>
          <ul>
            {[...Array(pageCount)].map((link, index) => (
              <>
                {props.currentPage == index + 1 ? (
                  <li className={styles.pagination_current} key={index}>
                    <b>{index + 1}</b>
                  </li>
                ) : (
                  <Link href={`/search?keyword=${props.keyword}&page=${index + 1}`}>
                    <a>
                      <li className={styles.pagination_link} key={index}>
                        {index + 1}
                      </li>
                    </a>
                  </Link>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
    </BoxGrid>
  )
}

export default SearchResult
