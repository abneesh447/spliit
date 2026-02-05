'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateOnly } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
/** Renders the active date span as a single date, a range, or a dash. */
function formatActiveSpan(firstDate, lastDate, formatDate) {
    if (!firstDate || !lastDate)
        return '—';
    if (firstDate === lastDate)
        return formatDate(firstDate);
    return `${formatDate(firstDate)} – ${formatDate(lastDate)}`;
}
export function SummaryStats({ summary, currency }) {
    const t = useTranslations('Stats.Summary');
    return (<Card className="mb-4">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!summary || !currency ? (<div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (<div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24"/>
                <Skeleton className="h-5 w-16"/>
              </div>))}
          </div>) : summary.expenseCount === 0 ? (<p className="text-sm text-muted-foreground">{t('empty')}</p>) : (<SummaryGrid summary={summary} currency={currency}/>)}
      </CardContent>
    </Card>);
}
function SummaryGrid({ summary, currency, }) {
    const locale = useLocale();
    const t = useTranslations('Stats.Summary');
    const formatDate = (date) => formatDateOnly(new Date(`${date}T00:00:00Z`), locale, {
        dateStyle: 'medium',
    });
    const activeSpan = formatActiveSpan(summary.firstDate, summary.lastDate, formatDate);
    return (<div className="grid grid-cols-2 gap-4">
      <Metric label={t('expenseCount')}>
        <span className="tabular-nums">{summary.expenseCount}</span>
      </Metric>
      <Metric label={t('averageExpense')}>
        <span className="tabular-nums">
          {formatCurrency(currency, summary.averageExpense, locale)}
        </span>
      </Metric>
      <Metric label={t('largestExpense')}>
        <span className="tabular-nums">
          {summary.largestExpense
            ? formatCurrency(currency, summary.largestExpense.amount, locale)
            : '—'}
        </span>
        {summary.largestExpense && (<div className="truncate text-xs text-muted-foreground">
            {summary.largestExpense.title}
          </div>)}
      </Metric>
      <Metric label={t('activeSpan')}>
        <span className="text-sm">{activeSpan}</span>
      </Metric>
    </div>);
}
function Metric({ label, children, }) {
    return (<div className="min-w-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-lg">{children}</div>
    </div>);
}
