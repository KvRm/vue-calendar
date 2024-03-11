<script setup lang="ts">
import { VUE_CALENDAR_RU_DATE_FORMAT, VueCalendar } from '@/components'
import { ref } from 'vue'
import { addDays, format } from 'date-fns'
import './variables.scss'

const model = ref(addDays(new Date(), 2))
</script>

<template>
  <div :class="s.wrapper">
    <div>{{ format(model, VUE_CALENDAR_RU_DATE_FORMAT) }}</div>
    <!-- Для модели лучше передавать значение в формате Date/number, а форматирование использовать лишь для отображения -->
    <VueCalendar v-model="model" />
  </div>
</template>

<style module="s" lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 200px 0;
  align-items: center;
  justify-content: center;
}
</style>
