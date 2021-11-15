import styles from '../../styles/components/form.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import BtnSpinner from '../Spinner'

const SocialButton = (props: any) => {
  let style
  let icon

  switch (props.provider) {
    case 'Twitter':
      style = styles.btn_login_twitter
      icon = <Twitter />
      break
    case 'LINE':
      style = styles.btn_login_line
      icon = <Line />
      break
  }

  return (
    <button className={style}>
      {props.provider}
      {props.type == 'signin' ? 'でログイン' : 'で登録'}
      <span>{icon}</span>
    </button>
  )
}

export default SocialButton
