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

const LANGUAGES = [
  { code: 'en', label: 'EN', Flag: GB },
  { code: 'ru', label: 'RU', Flag: RU },
  { code: 'ky', label: 'KY', Flag: KG }
]

function changeLanguage (code: string) {
  i18n.changeLanguage(code)
  localStorage.setItem('oitoon-lang', code)
}

const BORDER = '0.5px solid rgba(255,255,255,0.07)'
const BG = '#13102b'

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
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top bar: logo + search + auth */}
      <header
        style={{
          backgroundColor: BG,
          borderBottom: BORDER,
          padding: '0 28px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <Link
          href='/'
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg,#c4b5fd,#a78bfa,#f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'var(--font-roboto-mono)',
            flexShrink: 0,
            textDecoration: 'none'
          }}
        >
          oitoon
        </Link>

        <div
          style={{
            position: 'relative',
            flex: 1,
            maxWidth: '240px',
            marginLeft: '8px'
          }}
        >
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b6887',
              pointerEvents: 'none'
            }}
          />
          <input
            type='search'
            placeholder={t('header.searchPlaceholder')}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: BORDER,
              borderRadius: '8px',
              padding: '7px 12px 7px 30px',
              fontSize: '12px',
              color: '#f1f0fa',
              outline: 'none',
              fontFamily: 'var(--font-roboto-mono)'
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Language switcher */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {LANGUAGES.map(lang => {
            const active = currentI18n.language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                title={lang.label}
                style={{
                  padding: '4px 7px',
                  borderRadius: '6px',
                  lineHeight: 1,
                  cursor: 'pointer',
                  border: active
                    ? '0.5px solid rgba(167,139,250,0.5)'
                    : '0.5px solid rgba(255,255,255,0.07)',
                  backgroundColor: active
                    ? 'rgba(167,139,250,0.15)'
                    : 'transparent',
                  opacity: active ? 1 : 0.45,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <lang.Flag
                  style={{ width: '20px', height: 'auto', display: 'block' }}
                />
              </button>
            )
          })}
        </div>

        <div className='flex items-center gap-2 min-w-48 justify-end'>
          <Link
            href='/login'
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(249,115,22,0.5)',
              color: '#f97316',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            {t('header.login')}
          </Link>
          <Link
            href='/register'
            style={{
              backgroundColor: '#a78bfa',
              color: '#fff',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            {t('header.register')}
          </Link>
        </div>
      </header>

      {/* Subnav */}
      <div
        style={{
          backgroundColor: BG,
          borderBottom: BORDER,
          padding: '0 28px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className='flex items-center gap-1.5 whitespace-nowrap transition-colors'
            style={{
              fontSize: '13px',
              color: item.active ? '#a78bfa' : '#6b6887',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <Link
            href='/become-author'
            className='flex items-center gap-1.5'
            style={{
              backgroundColor: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.35)',
              color: '#f97316',
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            <Rocket size={13} />
            {t('nav.becomeAuthor')}
          </Link>
        </div>
      </div>
    </div>
  )
}
