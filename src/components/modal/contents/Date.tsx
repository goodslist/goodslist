import styles from '../../../styles/Modal.module.css'
import { useEffect, useState } from 'react'
import SelectDate from '../../form/SelectDate'

const Date = (props: any) => {
  const [year, setYear] = useState(2021)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [lastDay, setLastDay] = useState(31)

  useEffect(() => {
    const [defaultYear, defaultMonth, defaultDay] = props.date.split('-')
    setYear(Number(defaultYear))
    setMonth(Number(defaultMonth))
    setDay(Number(defaultDay))
    console.log(day)
  }, [])

  //年か月が変更されたら、合わせて日の最終日を変更する。
  useEffect(() => {
    setLastDay(29)
  }, [year, month])

  const setDate = () => {
    const selectedDate = year + '-' + month + '-' + day
    props.setDate(selectedDate)
    console.log(year)
  }
  return (
    <>
      <div className={styles.title}>日程を選択</div>
      <SelectDate
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        day={day}
        setDay={setDay}
        lastDay={lastDay}
      />

      {props.date}
      <button className={styles.button} onClick={() => setDate()}>
        決定
      </button>
    </>
  )
}

export default Date
