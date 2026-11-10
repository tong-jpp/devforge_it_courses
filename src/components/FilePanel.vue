<script setup>
defineProps({ files: Array })
defineEmits(['delete'])
</script>
<template>
  <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <h2 class="font-display text-xl font-bold">Локальные файлы</h2><p class="mt-1 text-sm text-slate-500">Загруженные таблицы сохраняются в хранилище браузера (IndexedDB).</p>
    <div v-for="file in files" :key="file.id" class="flex items-center justify-between gap-4 border-b border-slate-100 py-4 dark:border-slate-800"><div><b>{{ file.name }}</b><small class="block text-slate-500">{{ file.date }} · {{ file.size }}</small></div><button class="btn-ghost !text-red-600" @click="$emit('delete', file)">Удалить</button>
    </div>
    <p v-if="!files.length" class="py-8 text-center text-slate-500">Загруженных файлов нет.</p>
  </section>
</template>
