//数字を3桁ごとにカンマ区切りする。
export const numberFormat = (num: number): string => {
  return num.toLocaleString()
}

//Date型を日本語にする。
export const dateFormat = (date: string): string => {
  const WeekJp = ['日', '月', '火', '水', '木', '金', '土']
  const result = date.split('-')
  let date_string =
    result[0] +
    '年' +
    result[1] +
    '月' +
    result[2] +
    '日' +
    '(' +
    WeekJp[new Date(date).getDay()] +
    ')'

  return date_string
}
