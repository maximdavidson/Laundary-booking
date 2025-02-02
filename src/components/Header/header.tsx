import { FC, useState } from 'react'
import styles from './header.module.scss'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/Authcontext'
import { RegisterModal } from '../../ui/RegisterModal/registerModal'

export const Header: FC = () => {
  const { user } = useAuth()
  const [isModalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)
  return (
    <header className={styles.header}>
      <img src={logo} alt='logo' className={styles.logo} />
      {user ? (
        <div>
          <span className={styles.user_name}>Привет, {user.displayName || user.email} !</span>
        </div>
      ) : (
        <button onClick={handleOpenModal} className={styles.button}>
          Войти
        </button>
      )}
      {isModalOpen && <RegisterModal closeModal={handleCloseModal} />}
    </header>
  )
}
