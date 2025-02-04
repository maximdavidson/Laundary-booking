import { FC, useState } from 'react'
import styles from './tabs.module.scss'
import { tabsData } from '../../mock/tabsData'

export const Tabs: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tab1')

  const handleTabclick = (id: string, disabled: boolean | undefined) => () => {
    if (!disabled) setActiveTab(id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} role='tablist'>
        {tabsData.map(({ id, label, disabled }) => (
          <div
            key={id}
            className={`${styles.tabItem} ${activeTab === id ? styles.active : ''} ${
              disabled ? styles.disabled : ''
            }`}
            aria-disabled={disabled}
            role='tab'
            onClick={handleTabclick(id, disabled)}
          >
            <span className={styles.tabLabel}>{label}</span>
          </div>
        ))}
      </div>
      <div className={styles.content}>{tabsData.find(tab => tab.id === activeTab)?.content}</div>
    </div>
  )
}
