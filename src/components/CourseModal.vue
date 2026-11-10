<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ course: { type: Object, default: null } })
const emit = defineEmits(['save', 'close'])
const draft = reactive({ name: '', category: '', description: '', duration: '', price: '' })
watch(() => props.course, value => Object.assign(draft, value || { name: '', category: '', description: '', duration: '', price: '' }), { immediate: true })
</script>

<template>
  <div class="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" @click.self="emit('close')">
    <section class="relative my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
      <button class="btn-ghost absolute right-4 top-4 size-10 !p-0" aria-label="Закрыть" @click="emit('close')">×</button><p class="section-kicker">Каталог курсов</p><h2 class="mt-2 font-display text-2xl font-bold">{{ course ? 'Редактировать курс' : 'Новый курс' }}</h2>
      <form class="mt-6 space-y-4" @submit.prevent="emit('save', { ...draft })">
        <label class="block"><span class="label">Название</span><input v-model.trim="draft.name" class="input" required></label><label class="block"><span class="label">Категория</span><input v-model.trim="draft.category" class="input"></label><label class="block"><span class="label">Описание</span><textarea v-model.trim="draft.description" class="input" rows="3"></textarea></label><div class="grid gap-4 sm:grid-cols-2"><label><span class="label">Длительность</span><input v-model.trim="draft.duration" class="input" placeholder="8 месяцев"></label><label><span class="label">Цена / месяц</span><input v-model.trim="draft.price" class="input" placeholder="59 BYN"></label></div><button class="btn-primary w-full">Сохранить</button>
      </form>
    </section>
  </div>
</template>
