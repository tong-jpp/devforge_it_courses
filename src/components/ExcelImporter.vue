<script setup>
import { ref } from 'vue'
const emit = defineEmits(['import', 'error'])
const dragging = ref(false)
const input = ref(null)
function choose(event) { const file = event.target.files?.[0]; event.target.value = ''; if (file) emit('import', file) }
function drop(event) { dragging.value = false; const file = event.dataTransfer.files?.[0]; if (file) emit('import', file) }
</script>

<template>
  <div class="grid min-h-36 cursor-pointer place-items-center rounded-2xl border border-dashed p-5 text-center transition" :class="dragging ? 'border-brand-500 bg-blue-50 dark:bg-blue-950/30' : 'border-slate-300 bg-slate-50 hover:border-brand-500 dark:border-slate-600 dark:bg-slate-800'" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="drop" @click="input.click()">
    <div><div class="text-2xl text-brand-600">⇧</div><b class="mt-1 block">Перетащите табличный файл сюда</b><span class="mt-1 block text-xs text-slate-500">Excel, CSV или TSV · Numbers экспортируйте в CSV</span></div>
    <input ref="input" type="file" accept=".xlsx,.xls,.csv,.tsv,.numbers,.ods" hidden @change="choose">
  </div>
  <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"><span>Нужен пример структуры?</span><a class="font-semibold text-brand-600" href="templates/kursy-dlya-importa.csv" download>Скачать шаблон CSV</a><span class="w-full">Откройте его в Numbers и сохраните как CSV или Excel.</span></div>
</template>
