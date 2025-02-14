import * as yup from 'yup'
import i18next from 'i18next'

export const getAuthValidationSchema = (isLoginMode: boolean) => {
  return yup.object({
    name: !isLoginMode
      ? yup
          .string()
          .required(i18next.t('validation.nameRequired'))
          .min(2, i18next.t('validation.nameMin'))
      : yup.string(),
    email: yup
      .string()
      .required(i18next.t('validation.emailRequired'))
      .email(i18next.t('validation.emailInvalid')),
    password: yup
      .string()
      .required(i18next.t('validation.passwordRequired'))
      .min(6, i18next.t('validation.passwordMin')),
  })
}
