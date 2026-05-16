'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookMarked } from 'lucide-react'
import Header from '@/components/Header'
import AuthRequiredModal from '@/components/AuthRequiredModal'
import { useAuth } from '@/lib/auth'
import styles from './page.module.css'

export default function FavouritesPage () {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const [showModal, setShowModal] = useState(!isLoggedIn)

  return (
    <>
      <Header />
      <main className={styles.main}>
        {isLoggedIn ? (
          <div className={styles.empty}>
            <BookMarked size={40} className={styles.emptyIcon} />
            <p className={styles.emptyText}>{t('favourites.empty')}</p>
          </div>
        ) : (
          <div className={styles.empty}>
            <BookMarked size={40} className={styles.emptyIcon} />
            <p className={styles.emptyText}>{t('favourites.signInPrompt')}</p>
          </div>
        )}
      </main>

      {showModal && (
        <AuthRequiredModal onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
