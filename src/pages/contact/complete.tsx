import Link from 'next/link'
import styles from '../../styles/Contact.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Title from '../../components/view/title'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import { MetaProps } from '../../components/types'
import Box from '../../components/view/Box'
import BoxLineText from '../../components/view/BoxLineText'
import LinkButton from '../../components/view/LinkButton'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const ContactComplete = (data: Props) => {
  const meta: MetaProps = {
    title: 'GOODSist イベントのグッズ代が計算できるWEBアプリ',
    url: 'https://goodslist-pearl.vercel.app/contact/complete',
    image: 'https://goodslist-pearl.vercel.app/images/ogp9.png',
  }
  return (
    <>
      <Meta title={meta.title} url={meta.url} image={meta.image} />
      <Header />
      <Box background='#fff' padding='60px 20px 60px 20px'>
        <Title title='Contact' />
        <BoxLineText>
          <p className={styles.contact_text_title}>お問い合わせを受け付けました。</p>
          <p className={styles.contact_text}>
            入力いただいたメールアドレス宛に確認メールを送信しました。自動送信専用のメールアドレスですので返信されても確認ができませんのでご注意ください。
            <br />
            お問い合わせは全て読ませていただきますが、返信の確約はできかねること、また日数がかかることををご了承ください。
            <br />
            この度はお問い合わせいただきありがとうございました。
            今後とも当サイトをよろしくお願いいたします。
          </p>
          <LinkButton text='Top' />
        </BoxLineText>
      </Box>
    </>
  )
}

export default ContactComplete
