import { createTransport } from 'nodemailer'

export default async (req: any, res: any) => {
  const newEmail = JSON.parse(req.body)

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
      from: newEmail.email,
      to: process.env.RECEIVE_EMAIL,
      subject: newEmail.subject,
      text: newEmail.text,
    })
    .then(() => {
      res.status(200).send()
    })
    .catch(() => {
      res.status(404).send()
    })
}
