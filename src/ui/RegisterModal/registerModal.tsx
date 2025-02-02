import { useState } from 'react'
import style from './registerModal.module.scss'
import googleLogo from '../../assets/googleLogo.png'
import { loginWithEmail, loginWithGoogle, registrationWithEmail } from '../../service/authService'

interface RegisterModalProps {
  closeModal: () => void
}

export const RegisterModal = ({ closeModal }: RegisterModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      if (isLoginMode) {
        await loginWithEmail(email, password)
      } else {
        await registrationWithEmail(email, password, name)
      }
      closeModal()
    } catch (error) {
      console.error('Registration Error:', error)
    }
  }

  return (
    <div className={style.modal} onClick={closeModal}>
      <div className={style.modal_content} onClick={e => e.stopPropagation()}>
        <button className={style.close_button} onClick={closeModal}>
          ✖
        </button>
        <h2>{isLoginMode ? 'Вход' : 'Регистрация'}</h2>

        {!isLoginMode && (
          <input type='text' placeholder='Имя' value={name} onChange={handleSetName} />
        )}

        <input type='email' placeholder='Email' value={email} onChange={handleSetEmail} />
        <input type='password' placeholder='Пароль' value={password} onChange={handleSetPassword} />

        <button className={`${style.button} ${style.register}`} onClick={handleSubmit}>
          {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <div className={style.switch_mode}>
          {isLoginMode ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <a className={style.mode_toggle} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
          </a>
        </div>

        <p>или</p>

        <button className={`${style.button} ${style.google}`} onClick={loginWithGoogle}>
          <img src={googleLogo} alt='Google' /> Продолжить с Google
        </button>
      </div>
    </div>
  )
}
