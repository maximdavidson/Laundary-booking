import { useState } from 'react'
import style from './registerModal.module.scss'
import googleLogo from '../../assets/googleLogo.png'
import { loginWithEmail, loginWithGoogle, registrationWithEmail } from '../../service/authService'
import { useTranslation } from 'react-i18next'

interface RegisterModalProps {
  closeModal: () => void
}

export const RegisterModal = ({ closeModal }: RegisterModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { t } = useTranslation()

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
        <h2>{t(isLoginMode ? 'registerModal.login' : 'registerModal.registration')}</h2>

        {!isLoginMode && (
          <input
            type='text'
            placeholder={t('registerModal.name')}
            value={name}
            onChange={handleSetName}
          />
        )}

        <input
          type='email'
          placeholder={t('registerModal.email')}
          value={email}
          onChange={handleSetEmail}
        />
        <input
          type='password'
          placeholder={t('registerModal.password')}
          value={password}
          onChange={handleSetPassword}
        />

        <button className={`${style.button} ${style.register}`} onClick={handleSubmit}>
          {t(isLoginMode ? 'registerModal.submitLogin' : 'registerModal.submitRegister')}
        </button>

        <div className={style.switch_mode}>
          {isLoginMode ? t('registerModal.noAccount') : t('registerModal.haveAccount')}
          <a className={style.mode_toggle} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? t('registerModal.switchToRegister') : t('registerModal.switchToLogin')}
          </a>
        </div>

        <p>{t('registerModal.or')}</p>

        <button className={`${style.button} ${style.google}`} onClick={loginWithGoogle}>
          <img src={googleLogo} alt='Google' />
          {t('registerModal.continueWithGoogle')}
        </button>
      </div>
    </div>
  )
}
