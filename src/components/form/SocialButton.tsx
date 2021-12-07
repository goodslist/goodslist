import styles from '../../styles/components/form.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import Google from '../../../public/images/google.svg'
// import Yahoo from '../../../public/images/yahoo.png'
// import BtnSpinner from '../Spinner'
// import { OAuthTwitter } from '../auth/AuthTwitter'
// import { OAuthLine } from '../auth/OAuthLine'

const SocialButton = (props: any) => {
  let style
  let icon
  let auth

  switch (props.provider) {
    case 'Twitter':
      style = styles.btn_login_twitter
      icon = <Twitter />
      auth = props.auth
      break
    case 'LINE':
      style = styles.btn_login_line
      icon = <Line />
      auth = props.auth
      break
    case 'Google':
      style = styles.btn_login_google
      icon = <Google />
      auth = props.auth
      break
    case 'Yahoo':
      style = styles.btn_login_yahoo
      icon = <Line />
      auth = props.auth
      break
  }

  return (
    <button className={style} onClick={auth}>
      {props.provider}
      {props.type == 'signin' ? 'でログイン' : 'で登録'}
      <span>{icon}</span>
    </button>
  )
}

export default SocialButton
