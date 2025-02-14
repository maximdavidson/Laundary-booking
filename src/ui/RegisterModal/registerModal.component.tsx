import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import style from './registerModal.module.scss'
import googleLogo from '@assets/googleLogo.png'
import { loginWithEmail, loginWithGoogle, registrationWithEmail } from '../../service/authService'
import { useTranslation } from 'react-i18next'
import { getAuthValidationSchema } from '@validation/authValidation'

interface RegisterModalProps {
  closeModal: () => void
}

export const RegisterModal = ({ closeModal }: RegisterModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(getAuthValidationSchema(isLoginMode)),
    context: { isLoginMode },
    mode: 'onChange',
  })

  const onSubmit = async (data: { name?: string; email: string; password: string }) => {
    try {
      if (isLoginMode) {
        await loginWithEmail(data.email, data.password)
      } else {
        await registrationWithEmail(data.email, data.password, data.name!)
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLoginMode && (
            <div className={style.input_container}>
              <input
                type='text'
                placeholder={t('registerModal.name')}
                className={errors.name ? style.error : ''}
                {...register('name')}
              />
              {errors.name && <p className={style.error_message}>{errors.name.message}</p>}
            </div>
          )}

          <div className={style.input_container}>
            <input
              type='email'
              placeholder={t('registerModal.email')}
              className={errors.email ? style.error : ''}
              {...register('email')}
            />
            {errors.email && <p className={style.error_message}>{errors.email.message}</p>}
          </div>

          <div className={style.input_container}>
            <input
              type='password'
              placeholder={t('registerModal.password')}
              className={errors.password ? style.error : ''}
              {...register('password')}
            />
            {errors.password && <p className={style.error_message}>{errors.password.message}</p>}
          </div>

          <button className={`${style.button} ${style.register}`} type='submit' disabled={!isValid}>
            {t(isLoginMode ? 'registerModal.submitLogin' : 'registerModal.submitRegister')}
          </button>
        </form>

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
