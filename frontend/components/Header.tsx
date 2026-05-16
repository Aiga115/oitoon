'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Sparkles,
  Palette,
  PenLine,
  Trophy,
  Rocket,
  Search,
  BookMarked,
  LogOut,
  UserCircle2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'
import GB from 'country-flag-icons/react/3x2/GB'
import RU from 'country-flag-icons/react/3x2/RU'
import KG from 'country-flag-icons/react/3x2/KG'
import styles from './Header.module.css'
import BecomeAuthorModal from './BecomeAuthorModal'
import AuthRequiredModal from './AuthRequiredModal'
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
  const pathname = usePathname()
  const { user, isLoggedIn, logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const NAV_ITEMS = [
    { label: t('nav.stories'), href: '/stories', icon: <BookOpen size={14} /> },
    { label: t('nav.fanfics'), href: '/fanfics', icon: <Sparkles size={14} /> },
    { label: t('nav.comics'), href: '/comics', icon: <Palette size={14} />, disabled: true },
    { label: t('nav.authors'), href: '/authors', icon: <PenLine size={14} /> },
    { label: t('nav.ratings'), href: '/ratings', icon: <Trophy size={14} />, disabled: true },
    { label: t('nav.favourites'), href: '/favourites', icon: <BookMarked size={14} /> }
  ]

  return (
    <div className={styles.wrapper}>
      {/* Top bar: logo + search + auth */}
      <header className={styles.topBar}>
        <Link href='/' className={styles.logo}>
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

        {/* Language switcher */}
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
              <span className={styles.userGreeting}>
                <UserCircle2 size={15} />
                {user?.username}
              </span>
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

      {/* Subnav */}
      <div className={styles.subnav}>
        {NAV_ITEMS.map(item =>
          item.disabled ? (
            <span
              key={item.href}
              className={`${styles.navLink} ${styles.navLinkDisabled}`}
            >
              {item.icon}
              {item.label}
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}

        <div className={styles.subnavRight}>
          <button
            className={styles.btnBecomeAuthor}
            onClick={() => isLoggedIn ? setIsModalOpen(true) : setIsAuthModalOpen(true)}
          >
            <Rocket size={13} />
            {t('nav.becomeAuthor')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <BecomeAuthorModal onClose={() => setIsModalOpen(false)} />
      )}
      {isAuthModalOpen && (
        <AuthRequiredModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  )
}
