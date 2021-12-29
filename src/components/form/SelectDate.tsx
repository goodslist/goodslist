import styles from '../../styles/components/form.module.css'

const SelectDate = (props: any) => {
  const currentTime = new Date()
  const thisYear = currentTime.getFullYear()

  return (
    <div className={styles.birth_container}>
      <div className={styles.year_container}>
        <select
          className={styles.input_select_active}
          onChange={(e) => props.setYear(e.target.value)}
        >
          {(() => {
            const years = []
            for (let i = 2021; i < thisYear + 2; i++) {
              if (i == props.year) {
                years.push(
                  <option value={String(i)} selected>
                    {String(i) + '年'}
                  </option>,
                )
              } else {
                years.push(<option value={String(i)}>{String(i) + '年'}</option>)
              }
            }
            return years
          })()}
        </select>
        <span className={styles.select_arrow} />
      </div>

      <div className={styles.month_container}>
        <select
          className={styles.input_select_small_active}
          onChange={(e) => props.setMonth(e.target.value)}
        >
          {(() => {
            const months = []
            for (let i = 1; i < 13; i++) {
              if (i == props.month) {
                months.push(
                  <option value={String(i)} selected>
                    {String(i) + '月'}
                  </option>,
                )
              } else {
                months.push(<option value={String(i)}>{String(i) + '月'}</option>)
              }
            }
            return months
          })()}
        </select>
        <span className={styles.select_arrow} />
      </div>

      <div className={styles.day_container}>
        <select
          className={styles.input_select_small_active}
          onChange={(e) => props.setDay(e.target.value)}
        >
          {/* <option value='1'>01月</option>
          <option value='2'>02月</option>
          <option value='3'>03月</option>
          <option value='4'>04月</option>
          <option value='5'>05月</option>
          <option value='6'>06月</option>
          <option value='7'>07月</option>
          <option value='8'>08月</option>
          <option value='9'>09月</option>
          <option value='10'>10月</option>
          <option value='11'>11月</option>
          <option value='12'>12月</option> */}
          {(() => {
            const days = []
            for (let i = 1; i < props.lastDay + 1; i++) {
              if (i == props.day) {
                if (i < 10) {
                  days.push(
                    <option value={String(i)} selected>
                      {'0' + String(i) + '日'}
                    </option>,
                  )
                } else {
                  days.push(
                    <option value={String(i)} selected>
                      {String(i) + '日'}
                    </option>,
                  )
                }
              } else {
                if (i < 10) {
                  days.push(<option value={String(i)}>{'0' + String(i) + '日'}</option>)
                } else {
                  days.push(<option value={String(i)}>{String(i) + '日'}</option>)
                }
              }
            }
            return days
          })()}
        </select>
        <span className={styles.select_arrow} />
      </div>
    </div>
  )
}

export default SelectDate
