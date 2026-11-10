<script setup>
defineProps({ logs: Array })
function pretty(value) { return value ? JSON.stringify(value, null, 2) : '—' }
</script>
<template>
  <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <h2 class="font-display text-xl font-bold">История изменений</h2><p class="mt-1 text-sm text-slate-500">Создание, изменение, удаление и импорт записей.</p>
    <article v-for="log in logs" :key="log.id" class="border-b border-slate-100 py-4 dark:border-slate-800"><div class="flex flex-wrap items-center gap-3"><span class="badge">{{ log.action }}</span><b>{{ log.subject }}</b><time class="text-xs text-slate-500 sm:ml-auto">{{ log.date }}</time><button class="btn-ghost" @click="log.open = !log.open">{{ log.open ? 'Скрыть' : 'Сравнить' }}</button></div>
      <div v-if="log.open" class="mt-3 grid gap-4 md:grid-cols-2"><div><h3 class="text-sm font-bold text-slate-500">До</h3><pre class="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-950">{{ pretty(log.before) }}</pre></div><div><h3 class="text-sm font-bold text-slate-500">После</h3><pre class="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-950">{{ pretty(log.after) }}</pre></div>
      </div>
    </article>
    <p v-if="!logs.length" class="py-8 text-center text-slate-500">История пока пуста.</p>
  </section>
</template>
