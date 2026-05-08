'use client'

import Link from 'next/link'
import {
  BookOpen,
  Sparkles,
  Palette,
  PenLine,
  Trophy,
  Rocket,
  Search
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'
import GB from 'country-flag-icons/react/3x2/GB'
import RU from 'country-flag-icons/react/3x2/RU'
import KG from 'country-flag-icons/react/3x2/KG'
import styles from './Header.module.css'

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

  const NAV_ITEMS = [
    {
      label: t('nav.stories'),
      href: '/stories',
      icon: <BookOpen size={14} />,
      active: true
    },
    { label: t('nav.fanfics'), href: '/fanfics', icon: <Sparkles size={14} /> },
    { label: t('nav.comics'), href: '/comics', icon: <Palette size={14} /> },
    { label: t('nav.authors'), href: '/authors', icon: <PenLine size={14} /> },
    { label: t('nav.ratings'), href: '/ratings', icon: <Trophy size={14} /> }
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
          <Link href='/login' className={styles.btnLogin}>
            {t('header.login')}
          </Link>
          <Link href='/register' className={styles.btnRegister}>
            {t('header.register')}
          </Link>
        </div>
      </header>

      {/* Subnav */}
      <div className={styles.subnav}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${item.active ? styles.navLinkActive : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className={styles.subnavRight}>
          <Link href='/become-author' className={styles.btnBecomeAuthor}>
            <Rocket size={13} />
            {t('nav.becomeAuthor')}
          </Link>
        </div>
      </div>
    </div>
  )
}
