import Link from 'next/link'
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { supabase } from '../../components/supabase'
import styles from '../../styles/Login.module.css'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Name from '../../../public/images/name.svg'
import Password from '../img/password.svg'
import Image from 'next/image'
import { AuthContext } from '../../components/auth/AuthContext'
import Check from '../../../public/images/check.svg'
import { ModalContext } from '../../components/modal/ModalContext'
import { useRouter } from 'next/router'
import InputLabel from '../../components/form/InputLabel'
import InputText from '../../components/form/InputText'
import InputNotes from '../../components/form/InputNotes'
import Form from '../../components/form/Form'
import SubmitButton from '../../components/form/SubmitButton'
import { validateName } from '../../components/Validation'
import Title from '../../components/view/title'
import Step from '../../components/form/Step'
import SelectBirth from '../../components/form/SelectBirth'

type Props = InferGetStaticPropsType<typeof getStaticProps>

type SignupProps = {
  name: string
  birth_year: number
  birth_month: number
  gender: number
  sign_up: boolean
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = 'テスト'

  return {
    props: { data },
  }
}

const Signup = (data: SignupProps) => {
  const { user, setUser, session, setSession, signOut }: any = useContext(AuthContext)
  const { setOpenClearOverlay }: any = useContext(ModalContext)

  const [name, setName] = useState('')
  const [errorName, setErrorName] = useState('')
  const [validName, setValidName] = useState(false)
  const [year, setYear] = useState(1990)
  const [month, setMonth] = useState(0)
  const [gender, setGender] = useState(0)
  const [genderCss, setGenderCss] = useState(styles.gender_selected)
  const [isSubmit, setIsSubmit] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const router = useRouter()

  //ニックネーム入力のエラーチェック
  useEffect(() => {
    const newErrorName = validateName(name)
    setErrorName(newErrorName)
    if (name.length > 0 && newErrorName == '') setValidName(true)
    else setValidName(false)
  }, [name])

  const inputYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(e.target.value))
  }

  const inputMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(Number(e.target.value))
  }

  const inputGender = (gender: number) => {
    setGender(gender)
    if (gender == 1) setGenderCss(styles.gender_selected_1)
    else if (gender == 2) setGenderCss(styles.gender_selected_2)
    else if (gender == 3) setGenderCss(styles.gender_selected_3)
  }

  //「登録を完了する」ボタンを押下
  const submit = async () => {
    if (validName && year > 0 && month > 0 && gender > 0) {
      setIsButtonLoading(true)
      setOpenClearOverlay(true)

      const { data, error } = await supabase
        .from('users')
        .update({
          user_name: name,
          birth_year: year,
          birth_month: month,
          gender: gender,
          sign_up: true,
        })
        .match({ id: session.user.id })
      if (error) {
        setIsButtonLoading(false)
        setOpenClearOverlay(false)
        console.log({ error })
      } else {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, user_name, avatar_url, sign_up')
          .eq('id', session.user.id)
          .single()
        setUser(user)
        setIsButtonLoading(false)
        setOpenClearOverlay(false)
        router.push({
          pathname: '/signup/complate',
        })
      }
    }
    console.log({ user })
  }

  //全ての入力のバリデーションがtrueならボタンをアクティブにする
  useEffect(() => {
    if (validName && year > 0 && month > 0 && gender > 0) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [validName, year, month, gender])

  return (
    <>
      <Head>
        <title>Goodsist イベントのグッズ代が計算できるWEBアプリ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap&text=Goodsist'
          rel='stylesheet'
        />
      </Head>

      <main className={styles.main}>
        <Title title='必要事項入力' />
        <Form>
          <Step step='2' />
          <div className={styles.notes}>全ての項目を入力し、登録を完了させてください。</div>
          <InputLabel label='ニックネーム' />
          <InputText
            valid={validName}
            name='text'
            type='name'
            placeholder='ニックネーム'
            onChange={setName}
            error={errorName}
          />
          <InputNotes notes='全角半角英数字、30文字以内。' />
          <InputLabel label='誕生年月' />
          <SelectBirth inputYear={inputYear} inputMonth={inputMonth} month={month} />
          <InputNotes notes='変更不可。パスワードを忘れた時や退会時に使用。' />
          <InputLabel label='性別' />
          <div className={styles.gender_container}>
            <span className={genderCss}></span>
            <label
              className={gender == 1 ? styles.input_radio_active : styles.input_radio}
              onClick={() => inputGender(1)}
            >
              女性
            </label>
            <label
              className={gender == 2 ? styles.input_radio_active : styles.input_radio}
              onClick={() => inputGender(2)}
            >
              男性
            </label>
            <label
              className={gender == 3 ? styles.input_radio_active : styles.input_radio}
              onClick={() => inputGender(3)}
            >
              その他
            </label>
          </div>
          <SubmitButton
            isSubmit={isSubmit}
            isButtonLoading={isButtonLoading}
            type='default'
            title='登録する'
            onClick={() => submit()}
            error={errorSubmit}
          />
          <div className={styles.link_cancel}>登録をやめる</div>
        </Form>
      </main>
    </>
  )
}

export default Signup
