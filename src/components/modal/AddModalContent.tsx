import styles from '../../styles/Modal.module.css'

export default function AddModalContent(props: any) {
  let title: string = ''
  let text: string = ''
  let button_text: string = ''

  if (props.action == 'save') {
    title = 'リストを保存しました。'
    text = ''
    button_text = ''
  } else if (props.action == 'reset') {
    title = 'リストをリセットしますか？'
    text = 'リセットされる項目：購入数、並び替え順、入力欄の開閉'
    button_text = 'リセットする'
  } else {
    title = 'この機能はログインが必要です。'
    text =
      'ログインすると全ての機能を利用できます。Twitter、LINE、Google、Yahoo! JAPANの各ソーシャルアカウントでもログインできます。現在入力中のデータはログイン、新規登録後まで保持されます。'
    button_text = 'ログイン/新規登録する'
  }
  return (
    <>
      <div className={styles.title}>{title}</div>
      {text == '' ? <></> : <div className={styles.text}>{text}</div>}
      {(() => {
        if (props.action == 'reset') {
          return (
            <button className={styles.button} onClick={() => props.reset()}>
              {button_text}
            </button>
          )
        }
      })()}
    </>
  )
}
