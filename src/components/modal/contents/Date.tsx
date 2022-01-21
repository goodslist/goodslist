import styles from '../../../styles/Modal.module.css'
import { useEffect, useState, useContext } from 'react'
import SelectDate from '../../form/SelectDate'
import ModalButton from './ModalButton'
import { ModalContext } from '../ModalContext'

const Date = (props: any) => {
  const [year, setYear] = useState(2021)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [lastDay, setLastDay] = useState(31)

  const { setModalType }: any = useContext(ModalContext)

  useEffect(() => {
    const [defaultYear, defaultMonth, defaultDay] = props.date.split('-')
    setYear(Number(defaultYear))
    setMonth(Number(defaultMonth))
    setDay(Number(defaultDay))
  }, [])

  //年、月のいずれかが変更されたら、合わせて月の最終日を変更する。
  useEffect(() => {
    changeLastDay(year, month, day)
  }, [year, month])

  //月の最終日を変更をする。
  const changeLastDay = (year: number, month: number, day: number) => {
    if (month == 4 || month == 6 || month == 9 || month == 11) {
      setLastDay(30)
      if (day > 30) setDay(30)
    } else if (month == 2) {
      //2月だけうるう年の判定をする。
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        setLastDay(29)
        if (day > 29) setDay(29)
      } else {
        setLastDay(28)
        if (day > 28) setDay(28)
      }
    } else {
      setLastDay(31)
    }
  }

  //月と日が一桁ならば、0埋めをする。
  const addZero = (month: number, day: number) => {
    let newMonth = String(month)
    let newDay = String(day)
    if (month < 10) {
      newMonth = '0' + month
    }
    if (day < 10) {
      newDay = '0' + day
    }
    return [newMonth, newDay]
  }

  //エンターが押下されたら、日程を更新して閉じる。
  const setDate = () => {
    const [newMonth, newDay] = addZero(month, day)
    const selectedDate = year + '-' + newMonth + '-' + newDay
    props.setDate(selectedDate)
    props.onClickClose()
    setModalType('blank')
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
      <ModalButton
        onClickClose={props.onClickClose}
        btn_text={props.btn_text}
        onClickEnter={setDate}
      />
    </>
  )
}

export default Date
