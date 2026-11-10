<script setup>
import { reactive, ref, computed } from 'vue'

const emit = defineEmits(['authenticated'])
const mode = ref('login')
const error = ref('')
const form = reactive({ name: '', email: '', password: '' })
const title = computed(() => ({ login: 'Войти в кабинет', register: 'Создать аккаунт', forgot: 'Восстановить пароль' })[mode.value])
const button = computed(() => ({ login: 'Войти', register: 'Зарегистрироваться', forgot: 'Отправить инструкцию' })[mode.value])

function submit() {
  error.value = ''
  if (mode.value === 'forgot') {
    window.alert('Если аккаунт существует, инструкция отправлена.')
    mode.value = 'login'
    return
  }
  const users = JSON.parse(localStorage.getItem('dfUsers') || '{}')
  let name = form.name || form.email
  if (mode.value === 'login') {
    if (form.email === 'admin@devforge.ru' && form.password === '1234') name = 'Администратор'
    else if (!users[form.email] || users[form.email] !== form.password) {
      error.value = 'Неверный email или пароль. Демо: admin@devforge.ru / 1234'
      return
    }
  } else {
    if (form.email === 'admin@devforge.ru' || users[form.email]) {
      error.value = 'Этот email уже используется'
      return
    }
    users[form.email] = form.password
    localStorage.setItem('dfUsers', JSON.stringify(users))
  }
  localStorage.setItem('dfUser', name)
  emit('authenticated', name)
}
</script>

<template>
  <section class="mx-auto mt-12 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 dark:border-slate-700 dark:bg-slate-900">
    <p class="section-kicker">Личный кабинет</p><h1 class="mt-2 font-display text-3xl font-bold">{{ title }}</h1><p class="mt-2 text-sm text-slate-500">Управляйте каталогом и учебным процессом DevForge</p>
    <form class="mt-7 space-y-4" @submit.prevent="submit">
      <label v-if="mode === 'register'" class="block"><span class="label">Имя</span><input v-model.trim="form.name" class="input" required></label>
      <label class="block"><span class="label">Email</span><input v-model.trim="form.email" class="peer input invalid:border-red-500" type="email" required><span class="mt-1 hidden text-xs text-red-500 peer-invalid:block">Введите корректный email.</span></label>
      <label v-if="mode !== 'forgot'" class="block"><span class="label">Пароль</span><input v-model="form.password" class="input" type="password" minlength="4" required></label>
      <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p><button class="btn-primary w-full">{{ button }}</button>
    </form>
    <div class="mt-5 flex flex-wrap justify-between gap-3 text-sm"><button class="font-semibold text-brand-600" @click="mode = 'login'">Войти</button><button class="font-semibold text-brand-600" @click="mode = 'register'">Регистрация</button><button class="font-semibold text-brand-600" @click="mode = 'forgot'">Забыли пароль?</button></div>
    <small class="mt-4 block text-slate-500">Демо: admin@devforge.ru / 1234</small>
  </section>
</template>
