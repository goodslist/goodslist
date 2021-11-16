import styles from '../../styles/components/form.module.css'

const Step = (props: any) => {
  return (
    <div className={styles.step_container}>
      <div className={styles.step_on}>
        01<span>確認メール送信</span>
      </div>
      <div className={Number(props.step) >= 2 ? styles.step_on : styles.step_off}>
        02<span>必要事項入力</span>
      </div>

      <div className={Number(props.step) == 3 ? styles.step_on : styles.step_off}>
        03<span>登録完了</span>
      </div>
    </div>
  )
}

export default Step
