'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { X, BookMarked } from 'lucide-react'
import styles from './AuthRequiredModal.module.css'

interface AuthRequiredModalProps {
  onClose: () => void
}

export default function AuthRequiredModal ({ onClose }: AuthRequiredModalProps) {
  const { t } = useTranslation()

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role='dialog' aria-modal='true'>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label={t('authRequired.close')}>
          <X size={15} />
        </button>

        <div className={styles.iconWrap}>
          <BookMarked size={32} className={styles.icon} />
        </div>

        <h2 className={styles.title}>{t('authRequired.title')}</h2>
        <p className={styles.subtitle}>{t('authRequired.subtitle')}</p>

        <div className={styles.actions}>
          <Link href='/login' className={styles.btnLogin}>
            {t('authRequired.login')}
          </Link>
          <Link href='/register' className={styles.btnRegister}>
            {t('authRequired.register')}
          </Link>
        </div>
      </div>
    </div>
  )
}
