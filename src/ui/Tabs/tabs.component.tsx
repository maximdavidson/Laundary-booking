import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './tabs.module.scss'
import { tabsData } from '@mock/tabsData'
import { BookingCalendar } from '@ui/Calendar/calendar.component'

export const Tabs: FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('tab1')

  const handleTabclick = (id: string, disabled: boolean | undefined) => () => {
    if (!disabled) setActiveTab(id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} role='tablist'>
        {tabsData.map(({ id, disabled }) => (
          <div
            key={id}
            className={`${styles.tabItem} ${activeTab === id ? styles.active : ''} ${
              disabled ? styles.disabled : ''
            }`}
            aria-disabled={disabled}
            role='tab'
            onClick={handleTabclick(id, disabled)}
          >
            <span className={styles.tabLabel}>{t(`tabs.${id}`)}</span>
          </div>
        ))}
      </div>
      <div>
        {activeTab === 'tab1' ? (
          <BookingCalendar />
        ) : (
          tabsData.find(tab => tab.id === activeTab)?.content
        )}
      </div>
    </div>
  )
}
