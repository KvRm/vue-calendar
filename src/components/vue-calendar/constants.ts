import type { VueCalendarLang } from '@/components'
import { ru, enUS } from 'date-fns/locale'
import type { Locale } from 'date-fns'

export const VUE_CALENDAR_RU_DATE_FORMAT = 'dd.MM.yyyy'

export const VUE_CALENDAR_LANG = {
  ru: 'ru',
  en: 'en',
} as const

export const VUE_CALENDAR_DATE_FNS_LOCALE = {
  ru: ru,
  en: enUS,
} as const satisfies Record<VueCalendarLang, Locale>
