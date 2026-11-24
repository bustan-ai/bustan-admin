import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatLongDate, formatNumber, formatShortDate } from '../i18n/format'
import { useLanguage } from '../i18n/useLanguage'
import { ApiError, statsApi, type StatsPoint, type StatsRange } from '../lib/api'
import { RangePicker } from './RangePicker'

export type StatsMetric = 'users' | 'scans'

// Bar colours per metric; values live in index.css (light and dark variants).
const COLORS: Record<StatsMetric, { bar: string; active: string }> = {
  users: { bar: 'var(--chart-green)', active: 'var(--chart-green-active)' },
  scans: { bar: 'var(--chart-sky)', active: 'var(--chart-sky-active)' },
}

// New items per day for one metric, with the all-time total above the chart.
export function StatsChart({ metric }: { metric: StatsMetric }) {
  const color = COLORS[metric]
  const { t, language } = useLanguage()
  const [range, setRange] = useState<StatsRange>('30d')
  const [showTable, setShowTable] = useState(false)

  const query = useQuery({
    queryKey: ['stats', metric, range, 'day'],
    queryFn: () => statsApi[metric](range, 'day'),
    placeholderData: keepPreviousData,
  })

  const series = query.data?.series ?? []
  const newInRange = series.reduce((sum, p) => sum + p.new, 0)
  const num = (n: number) => formatNumber(language, n)

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">{t(`${metric}.title`)}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{t(`${metric}.subtitle`)}</p>
        </div>
        <RangePicker value={range} onChange={setRange} />
      </div>

      {query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.isPending ? (
        <div className="flex h-80 items-center justify-center text-sm text-stone-500">{t('common.loading')}</div>
      ) : (
        <>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">{t(`${metric}.total`)}</dt>
              <dd className="text-4xl font-semibold text-stone-900 dark:text-stone-50">{num(query.data.total)}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">{t(`${metric}.newInRange`)}</dt>
              <dd className="text-4xl font-semibold text-stone-900 dark:text-stone-50">{num(newInRange)}</dd>
            </div>
          </dl>

          {/* Time always runs left to right, in both languages. */}
          <div
            dir="ltr"
            className={`mt-6 h-72 transition-opacity ${query.isPlaceholderData ? 'opacity-50' : ''}`}
          >
            {newInRange === 0 ? (
              <div dir="auto" className="flex h-full items-center justify-center text-sm text-stone-500">
                {t(`${metric}.empty`)}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                  <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => formatShortDate(language, d)}
                    tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--chart-grid)' }}
                    minTickGap={24}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickFormatter={num}
                    tick={{ fill: 'var(--chart-axis)', fontSize: 12, style: { fontVariantNumeric: 'tabular-nums' } }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--chart-cursor)' }}
                    content={({ active, payload }) =>
                      active && payload?.[0] ? <ChartTooltip metric={metric} point={payload[0].payload as StatsPoint} /> : null
                    }
                  />
                  <Bar
                    dataKey="new"
                    name={t(`${metric}.new`)}
                    fill={color.bar}
                    activeBar={{ fill: color.active }}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-expanded={showTable}
            className="mt-3 text-sm text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
          >
            {showTable ? t('chart.hideTable') : t('chart.showTable')}
          </button>
          {showTable && <DataTable metric={metric} series={series} />}
        </>
      )}
    </section>
  )
}

function ChartTooltip({ metric, point }: { metric: StatsMetric; point: StatsPoint }) {
  const { t, language, dir } = useLanguage()
  return (
    <div
      dir={dir}
      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-md dark:border-stone-700 dark:bg-stone-800"
    >
      <div className="text-stone-500 dark:text-stone-400">{formatLongDate(language, point.date)}</div>
      <div className="mt-1 flex items-center gap-2 text-stone-900 dark:text-stone-50">
        <span aria-hidden className="size-2.5 rounded-sm" style={{ background: COLORS[metric].bar }} />
        <span>{t(`${metric}.new`)}</span>
        <span className="ms-auto ps-4 font-semibold">{formatNumber(language, point.new)}</span>
      </div>
      <div className="mt-0.5 flex text-stone-500 dark:text-stone-400">
        <span>{t('chart.cumulative')}</span>
        <span className="ms-auto ps-4">{formatNumber(language, point.cumulative)}</span>
      </div>
    </div>
  )
}

function DataTable({ metric, series }: { metric: StatsMetric; series: StatsPoint[] }) {
  const { t, language } = useLanguage()
  return (
    <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-800">
      <table className="w-full text-sm tabular-nums">
        <thead className="sticky top-0 bg-stone-50 text-stone-500 dark:bg-stone-950 dark:text-stone-400">
          <tr>
            <th className="px-3 py-2 text-start font-medium">{t('chart.date')}</th>
            <th className="px-3 py-2 text-end font-medium">{t(`${metric}.new`)}</th>
            <th className="px-3 py-2 text-end font-medium">{t('chart.cumulative')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-800 dark:divide-stone-800 dark:text-stone-200">
          {[...series].reverse().map((p) => (
            <tr key={p.date}>
              <td className="px-3 py-1.5">{formatLongDate(language, p.date)}</td>
              <td className="px-3 py-1.5 text-end">{formatNumber(language, p.new)}</td>
              <td className="px-3 py-1.5 text-end">{formatNumber(language, p.cumulative)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const { t } = useLanguage()
  const key =
    error instanceof ApiError && error.status === 403
      ? 'errors.forbidden'
      : error instanceof ApiError && error.status === 0
        ? 'errors.network'
        : 'errors.loadFailed'
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-3 text-sm text-stone-600 dark:text-stone-400">
      <p role="alert">{t(key)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-stone-300 px-3 py-1.5 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
      >
        {t('common.retry')}
      </button>
    </div>
  )
}
