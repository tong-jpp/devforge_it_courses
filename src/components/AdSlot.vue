<script setup>
import { computed } from 'vue'

const props = defineProps({
  format: {
    type: String,
    default: 'banner',
    validator: value => ['banner', 'sidebar'].includes(value),
  },
  label: {
    type: String,
    default: 'Рекламное место',
  },
  width: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
})

const presetDimensions = {
  banner: { width: '100%', minHeight: 'clamp(180px, 22vw, 240px)' },
  sidebar: { width: '100%', minHeight: '320px' },
}

const slotStyle = computed(() => ({
  ...presetDimensions[props.format],
  ...(props.width ? { width: props.width } : {}),
  ...(props.height ? { height: props.height, minHeight: props.height } : {}),
}))
</script>

<template>
  <aside
    class="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-900"
    :style="slotStyle"
    :aria-label="label"
  >
    <div>
      <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Advertisement</span>
      <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{{ label }}</p>
    </div>
  </aside>
</template>
