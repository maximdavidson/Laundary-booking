import styles from './footer.module.scss'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.language_switcher}>
        <span
          onClick={() => changeLanguage('ru')}
          className={`${i18n.language === 'ru' ? styles.active : ''} ${styles.language}`}
        >
          RU
        </span>
        <span
          onClick={() => changeLanguage('en')}
          className={`${i18n.language === 'en' ? styles.active : ''} ${styles.language}`}
        >
          EN
        </span>
        <span
          onClick={() => changeLanguage('tk')}
          className={`${i18n.language === 'tk' ? styles.active : ''} ${styles.language}`}
        >
          TK
        </span>
      </div>
    </footer>
  )
}
