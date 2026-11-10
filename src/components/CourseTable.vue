<script setup>
defineProps({ rows: Array, page: Number, pageCount: Number, total: Number, search: String })
const emit = defineEmits(['edit', 'remove', 'page', 'load-more', 'update:search', 'create'])
</script>

<template>
  <section class="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div class="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-700"><input class="input sm:max-w-xs" :value="search" placeholder="Поиск по курсам" @input="emit('update:search', $event.target.value)"><span class="text-sm text-slate-500">{{ total }} записей</span><button v-if="rows.length < total" class="btn-secondary" @click="emit('load-more')">Загрузить ещё</button><button class="btn-primary sm:ml-auto" @click="emit('create')">＋ Добавить курс</button>
    </div>
    <div class="overflow-x-auto scrollbar-thin">
      <table class="w-full min-w-[760px] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
          <tr>
            <th class="p-4">Курс</th><th class="p-4">Описание</th><th class="p-4">Длительность</th><th class="p-4">Цена / мес</th><th class="p-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            <td class="p-4"><strong>{{ row.name }}</strong><small class="block text-slate-500">{{ row.category || 'Обучение' }}</small></td><td class="max-w-xs p-4 text-slate-600 dark:text-slate-300">{{ row.description }}</td><td class="p-4">{{ row.duration }}</td><td class="p-4 font-semibold">{{ row.price }}</td><td class="whitespace-nowrap p-4 text-right"><button class="btn-ghost" @click="emit('edit', row)">Изменить</button><button class="btn-ghost !text-red-600" @click="emit('remove', row)">Удалить</button></td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="5" class="p-10 text-center text-slate-500">Курсов пока нет. Добавьте запись или импортируйте таблицу.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pageCount > 1" class="flex items-center justify-center gap-4 border-t border-slate-200 p-4 dark:border-slate-700"><button class="btn-secondary" :disabled="page === 1" @click="emit('page', page - 1)">Назад</button><span class="text-sm">Страница {{ page }} из {{ pageCount }}</span><button class="btn-secondary" :disabled="page === pageCount" @click="emit('page', page + 1)">Далее</button></div>
  </section>
</template>
