import { createTransport } from 'nodemailer'
import admin from 'firebase-admin'

export default async (req: any, res: any) => {
  const newEmail = JSON.parse(req.body)
  const link = await admin.auth().generateEmailVerificationLink(newEmail.email)
  const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: newEmail.email,
    subject: newEmail.subject,
    html: link,
  })

  res.status(200).json({
    success: true,
  })
}
