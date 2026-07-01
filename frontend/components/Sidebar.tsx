'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  Sparkles,
  Palette,
  PenLine,
  Trophy,
  Rocket,
  BookMarked,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { getOrCreateAuthorByUsername } from '@/lib/mockAuthors'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()

  const NAV_ITEMS = [
    { label: t('nav.stories'), href: '/stories', icon: <BookOpen size={15} /> },
    { label: t('nav.fanfics'), href: '/fanfics', icon: <Sparkles size={15} /> },
    { label: t('nav.comics'), href: '/comics', icon: <Palette size={15} />, disabled: true },
    { label: t('nav.authors'), href: '/authors', icon: <PenLine size={15} /> },
    { label: t('nav.ratings'), href: '/ratings', icon: <Trophy size={15} />, disabled: true },
    { label: t('nav.favourites'), href: '/favourites', icon: <BookMarked size={15} /> },
  ]

  const handleBecomeAuthor = () => {
    if (isLoggedIn && user) {
      const author = getOrCreateAuthorByUsername(user.username)
      router.push(`/authors/${author.id}/dashboard`)
    } else {
      router.push('/login?redirect=become-author')
    }
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item =>
          item.disabled ? (
            <span key={item.href} className={`${styles.navItem} ${styles.navItemDisabled}`}>
              {item.icon}
              {item.label}
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname.startsWith(item.href) ? styles.navItemActive : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.btnBecomeAuthor} onClick={handleBecomeAuthor}>
          <Rocket size={13} />
          {t('nav.becomeAuthor')}
        </button>
      </div>
    </aside>
  )
}
