import { useLanguage } from '../i18n/useLanguage'
import type { StatsRange } from '../lib/api'

const RANGES: StatsRange[] = ['7d', '30d', '90d', '1y']

type Props = { value: StatsRange; onChange: (range: StatsRange) => void }

export function RangePicker({ value, onChange }: Props) {
  const { t } = useLanguage()

  return (
    <div
      role="radiogroup"
      aria-label={t('range.label')}
      className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-sm dark:border-stone-800 dark:bg-stone-950"
    >
      {RANGES.map((range) => {
        const selected = range === value
        return (
          <button
            key={range}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(range)}
            className={`rounded-md px-3 py-1 transition ${
              selected
                ? 'bg-white font-medium text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-50'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            {t(`range.${range}`)}
          </button>
        )
      })}
    </div>
  )
}
