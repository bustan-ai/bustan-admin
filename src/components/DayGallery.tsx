import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { formatLongDate, formatNumber, formatTime } from '../i18n/format'
import { useLanguage } from '../i18n/useLanguage'
import { scansApi, type AdminScan, type StatsPoint } from '../lib/api'
import { ErrorState } from './ErrorState'
import { PhotoViewer } from './PhotoViewer'

// Photo links stop working after an hour, so get new ones well before that.
const LINKS_FRESH_MS = 30 * 60 * 1000

type Props = { point: StatsPoint; onClose: () => void }

// Photos of the scans taken on one day, newest first.
export function DayGallery({ point, onClose }: Props) {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [openCode, setOpenCode] = useState<string | null>(null)

  const query = useQuery({
    // The count is part of the key: new scans on this day load the photos again.
    queryKey: ['scans', point.date, point.new],
    queryFn: () => scansApi.between(point.date, point.date),
    staleTime: LINKS_FRESH_MS,
    refetchInterval: LINKS_FRESH_MS,
  })

  const ready = query.isSuccess
  useEffect(() => {
    if (ready) sectionRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [ready])

  const items = query.data?.items ?? []
  // The chart counts scans that users later removed from their history; the photo list leaves them out.
  const removed = ready ? Math.max(0, point.new - items.length) : 0
  const openIndex = items.findIndex((scan) => scan.code_user_scan === openCode)

  return (
    <section
      ref={sectionRef}
      aria-label={`${t('gallery.title')}: ${formatLongDate(language, point.date)}`}
      className="mt-4 rounded-lg border border-stone-200 p-4 dark:border-stone-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50">
            {formatLongDate(language, point.date)}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t('gallery.title')}
            {ready && <>: {formatNumber(language, items.length)}</>}
            {removed > 0 && (
              <>
                {' · '}
                {t('gallery.removed')}: {formatNumber(language, removed)}
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-stone-300 px-3 py-1 text-sm text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          {t('common.close')}
        </button>
      </div>

      {query.isPending ? (
        <div className="flex h-40 items-center justify-center text-sm text-stone-500">{t('common.loading')}</div>
      ) : query.isError && !query.data ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} className="h-40" />
      ) : items.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-stone-500">{t('gallery.empty')}</div>
      ) : (
        <ul className="mt-4 grid max-h-[32rem] grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((scan) => (
            <li key={scan.code_user_scan}>
              <Thumbnail scan={scan} onOpen={() => setOpenCode(scan.code_user_scan)} />
            </li>
          ))}
        </ul>
      )}

      {openIndex >= 0 && (
        <PhotoViewer
          scans={items}
          index={openIndex}
          onChange={(index) => setOpenCode(items[index].code_user_scan)}
          onClose={() => setOpenCode(null)}
        />
      )}
    </section>
  )
}

function Thumbnail({ scan, onOpen }: { scan: AdminScan; onOpen: () => void }) {
  const { t, language } = useLanguage()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    >
      <span className="block aspect-square overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
        <img
          src={scan.thumbnail_url}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform group-hover:scale-105"
        />
      </span>
      <span className="mt-1 block truncate text-sm text-stone-800 dark:text-stone-200">
        <bdi>{scan.result.plant_name ?? t('gallery.unknownPlant')}</bdi>
      </span>
      <span className="block text-xs text-stone-500 dark:text-stone-400">{formatTime(language, scan.created_at)}</span>
    </button>
  )
}
