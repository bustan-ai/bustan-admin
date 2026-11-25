import { useEffect, useRef, useState } from 'react'
import { formatNumber, formatTime } from '../i18n/format'
import { useLanguage } from '../i18n/useLanguage'
import type { AdminScan } from '../lib/api'

type Props = {
  scans: AdminScan[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

// One photo in full size, over the page. Arrow keys move between photos, Esc closes.
export function PhotoViewer({ scans, index, onChange, onClose }: Props) {
  const { t, language, dir } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scan = scans[index]

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  const hasPrevious = index > 0
  const hasNext = index < scans.length - 1
  const previous = () => {
    if (hasPrevious) onChange(index - 1)
  }
  const next = () => {
    if (hasNext) onChange(index + 1)
  }

  const buttonClass =
    'rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <dialog
      ref={dialogRef}
      aria-label={scan.result.plant_name ?? t('gallery.unknownPlant')}
      // Esc: let React close it, so the state stays in sync.
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // The content fills the dialog, so a click on the dialog itself is on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        // "Next" is on the left in Arabic.
        if (e.key === 'ArrowRight') (dir === 'rtl' ? previous : next)()
        if (e.key === 'ArrowLeft') (dir === 'rtl' ? next : previous)()
      }}
      className="m-auto w-[min(56rem,94vw)] max-w-none rounded-xl bg-stone-900 text-stone-50 backdrop:bg-black/70"
    >
      <div className="p-4">
        <Photo key={scan.image_url} src={scan.image_url} />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 text-sm">
            <p className="font-semibold">
              <bdi>{scan.result.plant_name ?? t('gallery.unknownPlant')}</bdi>
            </p>
            <p className="text-stone-300">
              <bdi>{scan.result.headline}</bdi>
            </p>
            <p className="mt-1 text-stone-400">
              {formatTime(language, scan.created_at)} · <bdi>{scan.code_user}</bdi>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <bdi dir="ltr" className="text-sm text-stone-400 tabular-nums">
              {formatNumber(language, index + 1)} / {formatNumber(language, scans.length)}
            </bdi>
            <button type="button" onClick={previous} disabled={!hasPrevious} className={buttonClass}>
              {t('gallery.previous')}
            </button>
            <button type="button" onClick={next} disabled={!hasNext} className={buttonClass}>
              {t('gallery.next')}
            </button>
            <button type="button" onClick={onClose} className={buttonClass}>
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

function Photo({ src }: { src: string }) {
  const { t } = useLanguage()
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex h-[70vh] items-center justify-center">
      {failed ? (
        <p role="alert" className="text-sm text-stone-300">
          {t('gallery.photoFailed')}
        </p>
      ) : (
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      )}
    </div>
  )
}
