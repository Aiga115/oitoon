'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { X, BookOpen, Users, Rocket, Star, Feather, CheckCircle2 } from 'lucide-react'
import styles from './BecomeAuthorModal.module.css'

const TOTAL_STEPS = 4

interface BecomeAuthorModalProps {
  onClose: () => void
}

export default function BecomeAuthorModal ({ onClose }: BecomeAuthorModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [penName, setPenName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [storyPrompt, setStoryPrompt] = useState('')

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const back = () => setStep(s => Math.max(s - 1, 1))

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
        <button className={styles.closeBtn} onClick={onClose} aria-label={t('becomeAuthorModal.close')}>
          <X size={15} />
        </button>

        {/* Progress bar — only for steps 1-3 */}
        {step < TOTAL_STEPS && (
          <div className={styles.progressBar} aria-hidden='true'>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`${styles.progressSegment} ${step >= s ? styles.progressSegmentActive : ''}`}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <Step1 onNext={next} t={t} />
        )}
        {step === 2 && (
          <Step2
            penName={penName} setPenName={setPenName}
            bio={bio} setBio={setBio}
            website={website} setWebsite={setWebsite}
            instagram={instagram} setInstagram={setInstagram}
            onNext={next} onBack={back} t={t}
          />
        )}
        {step === 3 && (
          <Step3
            storyPrompt={storyPrompt} setStoryPrompt={setStoryPrompt}
            onNext={next} onBack={back} t={t}
          />
        )}
        {step === 4 && (
          <Step4 onClose={onClose} t={t} />
        )}
      </div>
    </div>
  )
}

/* ── Step 1: Welcome ──────────────────────────────── */
function Step1 ({ onNext, t }: { onNext: () => void; t: (k: string) => string }) {
  const bullets = [
    { icon: <BookOpen size={15} />, text: t('becomeAuthorModal.step1.point1') },
    { icon: <Users size={15} />,    text: t('becomeAuthorModal.step1.point2') },
    { icon: <Star size={15} />,     text: t('becomeAuthorModal.step1.point3') }
  ]

  return (
    <>
      <p className={styles.stepLabel}>{t('becomeAuthorModal.step1.stepLabel')}</p>
      <div className={styles.iconWrap}>
        <Rocket size={24} />
      </div>
      <h2 className={styles.title}>{t('becomeAuthorModal.step1.title')}</h2>
      <p className={styles.subtitle}>{t('becomeAuthorModal.step1.subtitle')}</p>

      <div className={styles.bullets}>
        {bullets.map((b, i) => (
          <div key={i} className={styles.bullet}>
            <div className={styles.bulletIcon}>{b.icon}</div>
            <span className={styles.bulletText}>{b.text}</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onNext}>
          {t('becomeAuthorModal.step1.next')}
        </button>
      </div>
    </>
  )
}

/* ── Step 2: Profile Setup ────────────────────────── */
interface Step2Props {
  penName: string; setPenName: (v: string) => void
  bio: string; setBio: (v: string) => void
  website: string; setWebsite: (v: string) => void
  instagram: string; setInstagram: (v: string) => void
  onNext: () => void; onBack: () => void
  t: (k: string) => string
}

function Step2 ({ penName, setPenName, bio, setBio, website, setWebsite, instagram, setInstagram, onNext, onBack, t }: Step2Props) {
  return (
    <>
      <p className={styles.stepLabel}>{t('becomeAuthorModal.step2.stepLabel')}</p>
      <div className={styles.iconWrap}>
        <Feather size={24} />
      </div>
      <h2 className={styles.title}>{t('becomeAuthorModal.step2.title')}</h2>
      <p className={styles.subtitle}>{t('becomeAuthorModal.step2.subtitle')}</p>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>{t('becomeAuthorModal.step2.penName')}</label>
          <input
            className={styles.input}
            value={penName}
            onChange={e => setPenName(e.target.value)}
            placeholder={t('becomeAuthorModal.step2.penNamePlaceholder')}
            maxLength={60}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{t('becomeAuthorModal.step2.bio')}</label>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder={t('becomeAuthorModal.step2.bioPlaceholder')}
            maxLength={300}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>{t('becomeAuthorModal.step2.website')}</label>
            <input
              className={styles.input}
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder={t('becomeAuthorModal.step2.websitePlaceholder')}
              type='url'
              maxLength={200}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('becomeAuthorModal.step2.instagram')}</label>
            <input
              className={styles.input}
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder={t('becomeAuthorModal.step2.instagramPlaceholder')}
              maxLength={60}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onBack}>
          {t('becomeAuthorModal.step2.back')}
        </button>
        <button className={styles.btnPrimary} onClick={onNext}>
          {t('becomeAuthorModal.step2.next')}
        </button>
      </div>
    </>
  )
}

/* ── Step 3: First Story Prompt ───────────────────── */
interface Step3Props {
  storyPrompt: string; setStoryPrompt: (v: string) => void
  onNext: () => void; onBack: () => void
  t: (k: string) => string
}

function Step3 ({ storyPrompt, setStoryPrompt, onNext, onBack, t }: Step3Props) {
  return (
    <>
      <p className={styles.stepLabel}>{t('becomeAuthorModal.step3.stepLabel')}</p>
      <div className={styles.iconWrap}>
        <BookOpen size={24} />
      </div>
      <h2 className={styles.title}>{t('becomeAuthorModal.step3.title')}</h2>
      <p className={styles.subtitle}>{t('becomeAuthorModal.step3.subtitle')}</p>

      <textarea
        className={styles.promptTextarea}
        value={storyPrompt}
        onChange={e => setStoryPrompt(e.target.value)}
        placeholder={t('becomeAuthorModal.step3.promptPlaceholder')}
        maxLength={500}
      />

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onBack}>
          {t('becomeAuthorModal.step3.back')}
        </button>
        <button className={styles.btnGhost} onClick={onNext}>
          {t('becomeAuthorModal.step3.skip')}
        </button>
        <button className={styles.btnPrimary} onClick={onNext}>
          {t('becomeAuthorModal.step3.next')}
        </button>
      </div>
    </>
  )
}

/* ── Step 4: Done ─────────────────────────────────── */
function Step4 ({ onClose, t }: { onClose: () => void; t: (k: string) => string }) {
  return (
    <>
      <div className={styles.doneIconWrap}>
        <CheckCircle2 size={32} />
      </div>
      <h2 className={styles.title}>{t('becomeAuthorModal.step4.title')}</h2>
      <p className={styles.subtitle}>{t('becomeAuthorModal.step4.subtitle')}</p>

      <button className={styles.doneCta} onClick={onClose}>
        {t('becomeAuthorModal.step4.cta')}
      </button>
      <button className={styles.doneDismiss} onClick={onClose}>
        {t('becomeAuthorModal.step4.dismiss')}
      </button>
    </>
  )
}
