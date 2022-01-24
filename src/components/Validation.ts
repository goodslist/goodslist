//Emailのバリデーション
export const validateEmail = (email: string) => {
  let errorEmail = ''
  if (email.length > 0) {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      errorEmail = errorEmail + 'メールアドレスの形式で入力してください。'
    }
    if (email.length > 257) {
      errorEmail = errorEmail + '256文字以下で入力してください。'
    }
  }
  return errorEmail
}

//Passwordのバリデーション
export const validatePassword = (password: string) => {
  let errorPassword = ''
  if (password.length > 0) {
    if (!password.match(/^[A-Za-z0-9]*$/)) {
      errorPassword = errorPassword + '半角英数字で入力してください。'
    }
    if (password.length < 8 || password.length > 32) {
      errorPassword = errorPassword + '8文字以上32文字以下で入力してください。'
    }
  }
  return errorPassword
}

//確認用Passwordのバリデーション
export const validatePassword2 = (password: string, password2: string) => {
  let errorPassword2 = ''
  if (password2.length > 0) {
    if (!password2.match(/^[A-Za-z0-9]*$/)) {
      errorPassword2 = errorPassword2 + '半角英数字で入力してください。'
    }
    if (password2.length < 8 || password2.length > 32) {
      errorPassword2 = errorPassword2 + '8文字以上32文字以下で入力してください。'
    }

    if (password != password2) {
      errorPassword2 = errorPassword2 + 'パスワードが一致しません。'
    }
  }
  return errorPassword2
}

//Nameのバリデーション
export const validateName = (name: string) => {
  let errorName = ''
  if (name.length > 0) {
    if (name.length > 30) errorName = errorName + '30文字以内で入力してください。'
    if (!name.match(/^[0-9a-zA-Zぁ-んーァ-ヶー一-龠]+$/)) {
      errorName = errorName + '全角半角英数字のみ使用できます。'
    }
  }
  return errorName
}

//ContactのTextのバリデーション
export const validateContactText = (contactText: string) => {
  let errorContactText = ''
  if (contactText.length > 0) {
    if (contactText.length > 500)
      errorContactText = errorContactText + '500文字以内で入力してください。'
    if (!contactText.match(/^[0-9a-zA-Zぁ-んーァ-ヶー一-龠]+$/)) {
      errorContactText = errorContactText + '全角半角英数字のみ使用できます。'
    }
  }
  return errorContactText
}

//Quizのバリデーション
export const validateQuiz = (quiz: number, quizNumbers: number[]) => {
  let errorQuiz = ''

  let Answer = quizNumbers.reduce(function (a, b) {
    return a + b
  })

  if (quiz) {
    if (!String(quiz).match(/^[1-9]*$/)) {
      errorQuiz = errorQuiz + '半角英数字で入力してください。'
    }

    if (quiz > 0) {
      if (quiz != Answer) {
        errorQuiz = errorQuiz + '答えが間違えています。'
      }
    }
  }
  return errorQuiz
}
