import { useTranslation } from 'react-i18next'
import styles from './techWork.module.scss'

export const TechWork = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('techWork')}</h1>
    </div>
  )
}
