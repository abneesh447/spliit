'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { localeLabels } from '@/i18n/request';
import { setUserLocale } from '@/lib/locale';
import { useLocale } from 'next-intl';
export function LocaleSwitcher() {
    const locale = useLocale();
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="-my-3 text-primary">
          <span>{localeLabels[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(localeLabels).map(([locale, label]) => (<DropdownMenuItem key={locale} onClick={() => setUserLocale(locale)}>
            {label}
          </DropdownMenuItem>))}
      </DropdownMenuContent>
    </DropdownMenu>);
}
