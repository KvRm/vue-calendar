<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  toDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subDays,
  addDays,
  isSameDay,
  format,
  subMonths,
  addMonths,
} from 'date-fns'

import ArrowRightIcon from '~icons/lucide/arrow-right'
import ArrowLeftIcon from '~icons/lucide/arrow-left'
import { VUE_CALENDAR_DATE_FNS_LOCALE, type VueCalendarLang, capitalize } from '@/components'

export interface VueCalendarProps {
  modelValue?: Date
  lang?: VueCalendarLang
}

const props = withDefaults(defineProps<VueCalendarProps>(), {
  lang: 'ru',
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
}>()

const DAYS_PER_WEEK = 7

const model = computed<Date>({
  get() {
    return toDate(props.modelValue ?? new Date())
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const viewDate = ref<Date>(model.value)

const locale = computed(() => VUE_CALENDAR_DATE_FNS_LOCALE[props.lang])

const days = computed(() => {
  const start = startOfMonth(viewDate.value)
  const end = endOfMonth(viewDate.value)
  return eachDayOfInterval({ start, end })
})

const daysGroupedByWeek = computed(() => {
  const result: Record<string, Date[]> = {}

  days.value.forEach((day) => {
    const week = format(day, 'w')
    if (!result[week]) result[week] = []
    result[week].push(day)
  })

  return result
})

/** Дни, у которых 1 и последняя неделя дополнена до 7 элементов */
const filledDaysGroupedByWeek = computed(() => {
  const result: Record<string, Date[]> = JSON.parse(JSON.stringify(daysGroupedByWeek.value))

  const weeks = Object.keys(result)
  const firstWeek = weeks[0]
  const lastWeek = weeks[weeks.length - 1]

  if (result[firstWeek].length !== DAYS_PER_WEEK) {
    result[firstWeek] = eachDayOfInterval({
      start: subDays(result[firstWeek][0], DAYS_PER_WEEK - result[firstWeek].length),
      end: result[firstWeek][result[firstWeek].length - 1],
    })
  }
  if (result[lastWeek].length !== DAYS_PER_WEEK) {
    result[lastWeek] = eachDayOfInterval({
      start: result[lastWeek][0],
      end: addDays(
        result[lastWeek][result[lastWeek].length - 1],
        DAYS_PER_WEEK - result[lastWeek].length
      ),
    })
  }

  return result
})

function checkIsAnotherMonthDay(value: Date | string) {
  return !Object.values(daysGroupedByWeek.value)
    .flat()
    .some((day) => isSameDay(day, toDate(value)))
}

function handleDayClick(value: Date | string) {
  if (checkIsAnotherMonthDay(value)) return
  model.value = toDate(value)
}

function handlePrevWeek() {
  viewDate.value = subMonths(viewDate.value, 1)
}

function handleNextWeek() {
  viewDate.value = addMonths(viewDate.value, 1)
}
</script>

<template>
  <div :class="s.calendarMenu">
    <div :class="s.header">
      <div :class="s.month">{{ capitalize(format(viewDate, 'LLLL', { locale })) }}</div>
      <div :class="s.controls">
        <ArrowLeftIcon
          :class="s.control"
          role="button"
          tabindex="0"
          @keypress.enter="handlePrevWeek"
          @click="handlePrevWeek"
        />
        <ArrowRightIcon
          :class="s.control"
          role="button"
          tabindex="0"
          @keypress.enter="handleNextWeek"
          @click="handleNextWeek"
        />
      </div>
    </div>

    <div v-for="(days, week) in filledDaysGroupedByWeek" :key="week" :class="s.weeksWrapper">
      <div
        v-for="day in days"
        :key="JSON.stringify(day)"
        role="button"
        :tabindex="checkIsAnotherMonthDay(day) ? undefined : 0"
        :class="[
          s.day,
          {
            [s.disabledDay]: checkIsAnotherMonthDay(day),
            [s.selectedDay]: isSameDay(model, day),
          },
        ]"
        :aria-disabled="checkIsAnotherMonthDay(day)"
        @keypress.enter="handleDayClick(day)"
        @click="handleDayClick(day)"
      >
        {{ format(day, 'd') }}
      </div>
    </div>
  </div>
</template>

<style module="s" lang="scss">
.calendarMenu {
  display: flex;
  flex-direction: column;
  gap: var(--vue-calendar-gap);
  background-color: var(--vue-calendar-backgound);
  padding: var(--vue-calendar-padding);
  border-radius: var(--vue-calendar-border-radius);
  box-shadow: var(--vue-calendar-box-shadow);
}
.weeksWrapper {
  display: flex;
  gap: var(--vue-calendar-gap);
}
.day {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--vue-calendar-border-radius);
  height: var(--vue-calendar-day-size);
  width: var(--vue-calendar-day-size);
  transition: all 0.2s;

  cursor: pointer;

  &:hover {
    background-color: var(--vue-calendar-hover);
  }
}
.selectedDay {
  background-color: var(--vue-calendar-primary);
  color: var(--vue-calendar-primary-text);

  &:hover {
    background-color: var(--vue-calendar-primary);
  }
}
.disabledDay {
  background-color: var(--vue-calendar-disable);
  color: var(--vue-calendar-disable-text);
  cursor: no-drop;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.month {
  font-size: var(--vue-calendar-month-font-size);
  line-height: var(--vue-calendar-month-line-height);
}
.controls {
  display: flex;
  gap: var(--vue-calendar-controls-gap);
}
.control {
  width: var(--vue-calendar-control-size);
  height: var(--vue-calendar-control-size);
  background-color: var(--vue-calendar-primary-ghost);
  border-radius: var(--vue-calendar-border-radius);
  color: var(--vue-calendar-primary-text);

  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--vue-calendar-primary);
  }
}
</style>
