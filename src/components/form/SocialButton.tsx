import styles from '../../styles/components/SocialButton.module.css'
import Twitter from '../../../public/images/twitter.svg'
import Line from '../../../public/images/line.svg'
import Google from '../../../public/images/google.svg'
import Mail from '../../../public/images/email.svg'
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
    case 'メール':
      style = styles.btn_login_mail
      icon = <Mail />
      auth = props.auth
  }

  return (
    <button className={style} onClick={auth}>
      {props.provider}
      {props.type == 'signin' ? 'でログイン' : 'でシェア'}
      <span>{icon}</span>
    </button>
  )
}

export default SocialButton
