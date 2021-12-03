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

//2021-12-02T12:21:18.057026+00:00
//timestamp型を日本語にする。
export const timeStampFormat = (date: string): string => {
  const result = date.split('-')
  const result2 = date.split(':')
  let date_string =
    result[0] +
    '年' +
    result[1] +
    '月' +
    result[2].substr(0, 2) +
    '日' +
    result2[0].substr(-2) +
    '時' +
    result2[1] +
    '分'
  //  + result2[2].substr(0, 2) + '秒'

  return date_string
}
