import styles from '../../../styles/Search.module.css'
import { dateFormat } from '../../../components/Utils'
import Link from 'next/link'
import { Events } from '../../../components/types'
import SearchEventForm from '../../../components/SearchEventForm'

const Pagination = (props: any) => {
  return (
    <div className={styles.pagination_container}>
      <ul>
        {[...Array(props.pageCount)].map((link, index) => (
          <>
            {props.currentPage == index + 1 ? (
              <li className={styles.pagination_current} key={index}>
                <b>{index + 1}</b>
              </li>
            ) : (
              <Link href={`/search?keyword=${props.param}&page=${index + 1}`}>
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
  )
}

export default Pagination
