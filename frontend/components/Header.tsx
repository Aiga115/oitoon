'use client'

import Link from 'next/link'
import { Search, LogOut, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'
import GB from 'country-flag-icons/react/3x2/GB'
import RU from 'country-flag-icons/react/3x2/RU'
import KG from 'country-flag-icons/react/3x2/KG'
import styles from './Header.module.css'
import { useAuth } from '@/lib/auth'

const LANGUAGES = [
  { code: 'en', label: 'EN', Flag: GB },
  { code: 'ru', label: 'RU', Flag: RU },
  { code: 'ky', label: 'KY', Flag: KG }
]

function changeLanguage (code: string) {
  i18n.changeLanguage(code)
  localStorage.setItem('oitoon-lang', code)
}

export default function Header () {
  const { t, i18n: currentI18n } = useTranslation()
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <header className={styles.topBar}>
      <Link href='/stories' className={styles.logo}>
        oitoon
      </Link>

      <div className={styles.searchWrapper}>
        <Search size={13} className={styles.searchIcon} />
        <input
          type='search'
          placeholder={t('header.searchPlaceholder')}
          className={styles.searchInput}
        />
      </div>

      <div style={{ flex: 1 }} />

      <div className={styles.langSwitcher}>
        {LANGUAGES.map(lang => {
          const active = currentI18n.language === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              title={lang.label}
              className={`${styles.langBtn} ${active ? styles.langBtnActive : ''}`}
            >
              <lang.Flag className={styles.flag} />
            </button>
          )
        })}
      </div>

      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <>
            <Link href='/profile' className={styles.userGreeting}>
              <UserCircle2 size={15} />
              {user?.username}
            </Link>
            <button className={styles.btnLogin} onClick={logout}>
              <LogOut size={13} />
              {t('header.logout')}
            </button>
          </>
        ) : (
          <>
            <Link href='/login' className={styles.btnLogin}>
              {t('header.login')}
            </Link>
            <Link href='/register' className={styles.btnRegister}>
              {t('header.register')}
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
