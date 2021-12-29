import styles from '../../styles/components/form.module.css'

const SelectDate = (props: any) => {
  const currentTime = new Date()
  const thisYear = currentTime.getFullYear()

  return (
    <div className={styles.birth_container}>
      <span className={styles.select_arrow}>
        <select
          className={styles.input_select_active}
          onChange={(e) => props.inputYear(e)}
          defaultValue={thisYear - 25}
        >
          {(() => {
            const years = []
            for (let i = thisYear - 70; i < thisYear - 10; i++) {
              years.push(<option value={String(i)}>{String(i) + '年'}</option>)
            }
            return years
          })()}
        </select>
      </span>

      <select
        className={props.month > 0 ? styles.input_select_active : styles.input_select}
        onChange={(e) => props.inputMonth(e)}
      >
        <option value='0'>---</option>
        <option value='1'>01月</option>
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
        <option value='12'>12月</option>
      </select>
    </div>
  )
}

export default SelectDate
