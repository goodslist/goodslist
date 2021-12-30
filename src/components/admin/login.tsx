import { useRouter } from 'next/router'
import { supabase } from '../../components/supabase'
import Link from 'next/link'
import styles from '../../styles/Search.module.css'
import Title from '../../components/view/title'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import InputText from '../../components/form/InputText'
import Form from '../../components/form/Form'
import { useEffect, useState } from 'react'

export default function AdminLogin() {
  const router = useRouter()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    console.log(id)
  }, [id])

  useEffect(() => {
    console.log(password)
  }, [password])

  return (
    <main className={styles.main}>
      <Title title='管理者ログイン' />
      <Form>
        <InputText name='id' type='text' placeholder='ID' onChange={setId} />
        <InputText
          name='password'
          type='password'
          placeholder='パスワード'
          onChange={setPassword}
        />
      </Form>
    </main>
  )
}
