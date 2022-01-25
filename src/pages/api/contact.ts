import { createTransport } from 'nodemailer'

export default async (req: any, res: any) => {
  const newEmail = JSON.parse(req.body)

  const autoReplyText =
    'この度はお問い合わせいただきありがとうございます。下記の内容で受け付けました。\n自動送信専用のメールアドレスですので返信されても確認ができませんのでご注意ください。\n※こちらのメールに覚えがない場合は、お手数ですがそのままメールの破棄をお願いします。\n\n'

  const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  })
  await transporter
    .sendMail({
      from: `GOODSist<${process.env.RECEIVE_EMAIL}>`,
      to: process.env.RECEIVE_EMAIL,
      subject: newEmail.subject,
      text: newEmail.text,
    })
    .then(async () => {
      await transporter
        .sendMail({
          from: `GOODSist<${process.env.RECEIVE_EMAIL}>`,
          to: newEmail.email,
          subject: 'お問い合わせ確認メール(自動送信)',
          text: autoReplyText + newEmail.text,
        })
        .then(() => {
          res.status(200).send()
        })
        .catch(() => {
          res.status(404).send()
        })
    })
    .catch(() => {
      res.status(404).send()
    })
}
