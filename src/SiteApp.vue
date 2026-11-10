<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdSlot from './components/AdSlot.vue'

const mobileOpen = ref(false)
const dark = ref(false)
const cart = ref([])
const category = ref('Все')
const maxPrice = ref(100)
const sort = ref('popular')
const filtersOpen = ref(false)
const loading = ref(false)
const enrollmentOpen = ref(false)
const selectedCourse = ref('Frontend Developer')
const step = ref(1)
const formError = ref('')
const formDone = ref(false)
const form = ref({ name: '', email: '', city: '', experience: '', format: '' })
const supportOpen = ref(false)
const message = ref('')
const messages = ref([
  { id: 1, mine: false, text: 'Привет! Я помогу подобрать программу. Что хочешь изучать?' },
])

const courses = [
  { id: 1, name: 'Frontend Developer', category: 'Frontend', price: 59, duration: '8 месяцев', image: '/images/lab/course-vue.svg', description: 'Vue 3, JavaScript, TypeScript и современные интерфейсы.' },
  { id: 2, name: 'JavaScript Pro', category: 'Frontend', price: 69, duration: '6 месяцев', image: '/images/lab/course-js.svg', description: 'Глубокое понимание языка и архитектуры приложений.' },
  { id: 3, name: 'UI Systems', category: 'Дизайн', price: 55, duration: '5 месяцев', image: '/images/lab/course-ui.svg', description: 'Дизайн-системы, доступность и работа с Tailwind CSS.' },
  { id: 4, name: 'Backend Developer', category: 'Backend', price: 62, duration: '9 месяцев', image: '/images/lab/course-node.svg', description: 'Node.js, базы данных, API и серверная архитектура.' },
  { id: 5, name: 'Git & Teamwork', category: 'Инструменты', price: 35, duration: '2 месяца', image: '/images/lab/course-git.svg', description: 'Командная разработка, Git Flow и code review.' },
  { id: 6, name: 'Tailwind Intensive', category: 'Frontend', price: 45, duration: '3 месяца', image: '/images/lab/course-tailwind.svg', description: 'Адаптивная вёрстка и компоненты без лишнего CSS.' },
]
const plans = [
  { name: 'Самостоятельный', price: '0 BYN', features: [['Открытые материалы', true], ['Сообщество', true], ['Личный ментор', false]] },
  { name: 'С ментором', price: '79 BYN', popular: true, features: [['Все материалы', true], ['Проверка проектов', true], ['Личный ментор', true]] },
  { name: 'Карьерный', price: '149 BYN', features: [['Всё из тарифа с ментором', true], ['Карьерные консультации', true], ['Гарантия стажировки', true]] },
]
const filteredCourses = computed(() => {
  const list = courses.filter(course => (category.value === 'Все' || course.category === category.value) && course.price <= maxPrice.value)
  return [...list].sort((a, b) => sort.value === 'price-asc' ? a.price - b.price : sort.value === 'price-desc' ? b.price - a.price : a.id - b.id)
})

onMounted(() => { dark.value = localStorage.getItem('devforge-theme') === 'dark' })
watch(dark, value => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('devforge-theme', value ? 'dark' : 'light')
}, { immediate: true })

function openEnrollment(course = 'Frontend Developer') {
  selectedCourse.value = course
  step.value = 1
  formError.value = ''
  formDone.value = false
  enrollmentOpen.value = true
}
function nextStep() {
  formError.value = ''
  if (step.value === 1 && (!form.value.name || !form.value.email)) formError.value = 'Заполни имя и email.'
  if (step.value === 2 && (!form.value.city || !form.value.experience)) formError.value = 'Укажи город и свой уровень.'
  if (step.value === 3 && !form.value.format) formError.value = 'Выбери формат обучения.'
  if (formError.value) return
  if (step.value < 4) step.value++
  else formDone.value = true
}
function sendMessage() {
  if (!message.value.trim()) return
  messages.value.push({ id: Date.now(), mine: true, text: message.value.trim() })
  message.value = ''
}
async function reloadCourses() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 700))
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden transition-colors duration-300">
    <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div class="lab-container flex min-h-16 items-center justify-between gap-4">
        <a href="#top" class="flex items-center gap-2 font-mono font-bold" aria-label="DevForge — главная"><span class="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">DF</span><span>DevForge</span></a>
        <nav class="hidden items-center gap-6 md:flex" aria-label="Основная навигация">
          <a v-for="item in [['Курсы','#courses'],['Преимущества','#features'],['Тарифы','#pricing'],['Отзывы','#reviews'],['FAQ','#faq']]" :key="item[0]" :href="item[1]" class="text-sm font-semibold text-slate-600 transition hover:text-brand-600 dark:text-slate-300">{{ item[0] }}</a>
        </nav>
        <div class="flex items-center gap-2"><button type="button" class="btn-ghost size-10 !p-0" :aria-label="dark ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="dark = !dark">{{ dark ? '☀️' : '🌙' }}</button><a href="admin.html" class="btn-secondary hidden sm:inline-flex">Кабинет</a><button type="button" class="btn-primary hidden lg:inline-flex" @click="openEnrollment()">Записаться</button><button type="button" class="btn-ghost size-10 !p-0 md:hidden" :aria-expanded="mobileOpen" aria-controls="mobile-nav" aria-label="Открыть меню" @click="mobileOpen = !mobileOpen">{{ mobileOpen ? '✕' : '☰' }}</button></div>
      </div>
      <nav v-if="mobileOpen" id="mobile-nav" class="lab-container grid gap-2 border-t border-slate-200 py-3 md:hidden dark:border-slate-800" aria-label="Мобильная навигация"><a v-for="item in [['Курсы','#courses'],['Преимущества','#features'],['Тарифы','#pricing'],['Отзывы','#reviews'],['FAQ','#faq']]" :key="item[0]" :href="item[1]" class="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">{{ item[0] }}</a><a href="admin.html" class="btn-secondary">Личный кабинет</a></nav>
    </header>

    <main id="top" class="pt-16">
      <section class="relative isolate overflow-hidden bg-slate-950 text-white" style="background-image:url('/images/lab/hero-grid.svg');background-size:cover">
        <div class="absolute inset-0 bg-slate-950/75"></div><div class="absolute -left-24 top-32 size-72 animate-pulse rounded-full bg-purple-500/25 blur-3xl"></div><div class="absolute -right-24 bottom-10 size-80 animate-pulse rounded-full bg-pink-500/20 blur-3xl"></div>
        <div class="lab-container relative grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div class="animate-rise"><span class="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">Новый поток стартует 18 ноября</span><h1 class="mt-7 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Освой IT-профессию <span class="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">на реальных проектах</span></h1><p class="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Практические курсы, еженедельное code review и поддержка опытного наставника до первого оффера.</p><div class="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" class="btn bg-white text-slate-950 hover:-translate-y-0.5 hover:bg-blue-50" @click="openEnrollment()">Выбрать программу</button><a href="#courses" class="btn border border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/10">Посмотреть курсы</a></div><div class="mt-9 flex flex-wrap gap-6 text-sm text-slate-300"><span><strong class="block text-xl text-white">1 400+</strong>студентов</span><span><strong class="block text-xl text-white">89%</strong>нашли работу</span><span><strong class="block text-xl text-white">4.9/5</strong>оценка обучения</span></div></div>
          <div class="relative mx-auto w-full max-w-lg"><div class="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur"><div class="mb-4 flex items-center gap-2"><span class="size-3 rounded-full bg-red-400"></span><span class="size-3 rounded-full bg-amber-400"></span><span class="size-3 rounded-full bg-emerald-400"></span><span class="ml-2 font-mono text-xs text-slate-300">career.vue</span></div><pre class="overflow-x-auto rounded-2xl bg-slate-950/80 p-5 font-mono text-sm leading-7 text-slate-300"><code><span class="text-purple-300">const</span> student = <span class="text-blue-300">await</span> learn({
  framework: <span class="text-emerald-300">'Vue 3'</span>,
  practice: <span class="text-amber-300">true</span>,
  mentor: <span class="text-amber-300">true</span>
})

student.<span class="text-blue-300">buildPortfolio</span>()
student.<span class="text-blue-300">getOffer</span>()</code></pre></div></div>
        </div>
      </section>

      <section id="features" class="lab-container py-20"><div class="text-center"><p class="section-kicker">Почему DevForge</p><h2 class="section-title">Всё необходимое для уверенного старта</h2><p class="section-copy mx-auto">Учёба построена вокруг практики, обратной связи и понятного карьерного результата.</p></div><div class="mt-10 grid gap-5 md:grid-cols-3"><article v-for="feature in [['⌘','Проекты в портфолио','Собирай реальные интерфейсы, API и командные проекты.'],['✓','Code review','Получай подробную обратную связь от senior-разработчиков.'],['↗','Карьерный трек','Подготовим резюме, собеседование и поможем найти стажировку.']]" :key="feature[1]" class="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"><span class="grid size-12 place-items-center rounded-2xl bg-brand-50 text-xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950">{{ feature[0] }}</span><h3 class="mt-5 font-display text-xl font-bold">{{ feature[1] }}</h3><p class="mt-2 leading-6 text-slate-600 dark:text-slate-300">{{ feature[2] }}</p></article></div></section>

      <section id="courses" class="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"><div class="lab-container"><div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p class="section-kicker">Каталог программ</p><h2 class="section-title">Выбери своё направление</h2><p class="section-copy">Фильтруй программы по направлению и стоимости.</p></div><div class="flex flex-wrap gap-2"><button type="button" class="btn-secondary lg:hidden" @click="filtersOpen = !filtersOpen">Фильтры</button><select v-model="sort" class="input w-auto" aria-label="Сортировка курсов"><option value="popular">По популярности</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select><button type="button" class="btn-ghost size-10 !p-0" aria-label="Обновить каталог" @click="reloadCourses">↻</button></div></div>
          <div class="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]"><aside class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800" :class="filtersOpen ? 'block' : 'hidden lg:block'"><h3 class="font-bold">Фильтры</h3><label class="mt-4 block"><span class="label">Направление</span><select v-model="category" class="input"><option v-for="item in ['Все','Frontend','Backend','Дизайн','Инструменты']" :key="item">{{ item }}</option></select></label><label class="mt-5 block"><span class="label">До {{ maxPrice }} BYN / мес</span><input v-model="maxPrice" type="range" min="30" max="100" class="w-full accent-blue-600"></label></aside>
            <div class="@container min-w-0"><div v-if="loading" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><div v-for="item in 6" :key="item" class="animate-pulse rounded-2xl border border-slate-200 p-3 dark:border-slate-700"><div class="h-40 rounded-xl bg-slate-200 sm:h-44 lg:h-40 xl:h-44 dark:bg-slate-700"></div><div class="mt-4 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div><div class="mt-3 h-10 rounded bg-slate-200 dark:bg-slate-700"></div></div></div>
              <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"><article v-for="course in filteredCourses" :key="course.id" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950"><img :src="course.image" :alt="`Обложка курса ${course.name}`" class="h-40 w-full object-cover sm:h-44 lg:h-40 xl:h-44"><div class="space-y-4 p-5"><div class="flex items-start justify-between gap-3"><div><span class="badge">{{ course.category }}</span><h3 class="mt-2 font-display text-lg font-bold">{{ course.name }}</h3></div><strong class="whitespace-nowrap text-brand-600 dark:text-blue-300">{{ course.price }} BYN</strong></div><p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{ course.description }}</p><div class="flex items-center justify-between text-xs text-slate-500"><span>{{ course.duration }}</span><span>{{ course.price }} BYN / мес</span></div><div class="flex gap-2"><button type="button" class="btn-primary flex-1" @click="openEnrollment(course.name)">Записаться</button><button type="button" class="btn-secondary size-11 !p-0" :aria-pressed="cart.includes(course.id)" :aria-label="cart.includes(course.id) ? 'Убрать из избранного' : 'Добавить в избранное'" @click="cart.includes(course.id) ? cart = cart.filter(id => id !== course.id) : cart.push(course.id)">{{ cart.includes(course.id) ? '♥' : '♡' }}</button></div></div></article><p v-if="!filteredCourses.length" class="col-span-full rounded-2xl bg-slate-100 p-8 text-center text-slate-500 dark:bg-slate-800">По выбранным фильтрам курсов пока нет.</p></div>
            </div></div></div></section>

      <section class="lab-container py-10 sm:py-12" aria-label="Реклама">
        <AdSlot format="banner" />
      </section>

      <section class="lab-container grid gap-8 py-20 lg:grid-cols-[320px_1fr] lg:items-center"><article class="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900"><img src="/images/lab/avatar.svg" alt="Наставник Анна Ковалёва" class="mx-auto size-20 rounded-full ring-4 ring-blue-100 dark:ring-blue-950"><h2 class="mt-4 font-display text-xl font-bold">Анна Ковалёва</h2><p class="text-sm font-semibold text-brand-600 dark:text-blue-300">Frontend-наставник</p><p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">7 лет в разработке, 120 выпускников и любовь к понятному коду.</p><div class="mt-5 flex gap-3"><button type="button" class="btn-primary flex-1" @click="supportOpen = true">Написать</button><a href="#reviews" class="btn-secondary flex-1">Отзывы</a></div></article><div><p class="section-kicker">Наставники</p><h2 class="section-title">Ты не остаёшься один на один с задачами</h2><p class="section-copy">Ментор помогает составить план, разбирает ошибки и объясняет сложные темы человеческим языком.</p><ul class="mt-6 grid gap-4 sm:grid-cols-2"><li v-for="item in ['Еженедельные встречи 1 на 1','Code review каждой работы','Разбор карьерных целей','Поддержка в учебном чате']" :key="item" class="flex gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900"><span class="text-emerald-500">✓</span><span class="font-semibold">{{ item }}</span></li></ul></div></section>

      <section id="reviews" class="bg-slate-950 py-20 text-white"><div class="lab-container"><div class="text-center"><p class="section-kicker !text-blue-300">Истории студентов</p><h2 class="mt-2 font-display text-3xl font-bold">Результаты, которыми мы гордимся</h2></div><div class="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-thin"><blockquote v-for="review in [['Мария','После курса получила первый оффер во frontend. Особенно помогали code review и поддержка наставника.'],['Илья','Собрал сильное портфолио и перестал бояться технических собеседований.'],['Олег','Удобно совмещал занятия с работой. Все уроки сразу закреплялись на проекте.']]" :key="review[0]" class="min-w-[88%] snap-center rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:min-w-[46%] lg:min-w-[31%]"><p class="text-lg leading-8 text-slate-200">«{{ review[1] }}»</p><footer class="mt-5 font-bold text-blue-300">{{ review[0] }}, выпускник DevForge</footer></blockquote></div></div></section>

      <section id="pricing" class="lab-container py-20"><div class="text-center"><p class="section-kicker">Форматы обучения</p><h2 class="section-title">Выбери подходящий уровень поддержки</h2></div><div class="mt-10 grid gap-5 lg:grid-cols-3 lg:items-center"><article v-for="plan in plans" :key="plan.name" class="relative rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900" :class="plan.popular ? 'ring-2 ring-indigo-500 lg:scale-105 border-indigo-200 dark:border-indigo-900' : 'border-slate-200 dark:border-slate-700'"><span v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">Популярный</span><h3 class="font-display text-xl font-bold">{{ plan.name }}</h3><p class="mt-3 text-3xl font-extrabold">{{ plan.price }} <span class="text-sm font-normal text-slate-500">/ месяц</span></p><ul class="mt-6 divide-y divide-slate-200 text-sm dark:divide-slate-700"><li v-for="feature in plan.features" :key="feature[0]" class="flex gap-3 py-3"><span>{{ feature[1] ? '✅' : '❌' }}</span>{{ feature[0] }}</li></ul><button type="button" class="mt-6 w-full" :class="plan.popular ? 'btn-primary' : 'btn-secondary'" @click="openEnrollment()">Выбрать тариф</button></article></div></section>

      <section id="faq" class="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"><div class="lab-container mx-auto max-w-4xl"><p class="section-kicker">FAQ</p><h2 class="section-title">Частые вопросы</h2><div class="mt-8 space-y-3"><details v-for="item in [['Нужен ли опыт в программировании?','Нет. На стартовых программах мы начинаем с основ и постепенно переходим к проектам.'],['Можно совмещать с работой или учёбой?','Да. Материалы доступны в любое время, а встречи с наставником планируются заранее.'],['Как проходит практика?','Ты выполняешь задания внутри одного проекта, получаешь code review и исправляешь замечания.'],['Помогаете ли вы с трудоустройством?','На карьерном тарифе мы готовим резюме, портфолио и проводим тренировочные собеседования.']]" :key="item[0]" class="group rounded-2xl border border-slate-200 p-5 open:bg-slate-50 dark:border-slate-700 dark:open:bg-slate-800"><summary class="flex cursor-pointer list-none items-center justify-between font-semibold">{{ item[0] }}<span class="transition group-open:rotate-45">＋</span></summary><p class="mt-3 leading-6 text-slate-600 dark:text-slate-300">{{ item[1] }}</p></details></div></div></section>
    </main>

    <footer class="bg-slate-950 py-12 text-slate-300"><div class="lab-container grid gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><strong class="font-mono text-white">&lt;DevForge/&gt;</strong><p class="mt-3 text-sm text-slate-400">Практическое IT-образование для уверенного старта.</p></div><div v-for="group in [['Обучение','Курсы','Тарифы'],['Компания','О нас','Отзывы'],['Помощь','FAQ','Поддержка']]" :key="group[0]"><strong class="text-white">{{ group[0] }}</strong><ul class="mt-3 space-y-2 text-sm"><li><a href="#courses" class="hover:text-white">{{ group[1] }}</a></li><li><a href="#faq" class="hover:text-white">{{ group[2] }}</a></li></ul></div></div><div class="lab-container mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">© 2026 DevForge · Учебный проект</div></footer>

    <button type="button" class="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-brand-600 text-xl text-white shadow-xl transition hover:scale-105" aria-label="Открыть чат поддержки" @click="supportOpen = true">💬</button>
    <aside class="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900" :class="supportOpen ? 'translate-x-0' : 'translate-x-full'" aria-label="Чат с поддержкой"><header class="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700"><div><h2 class="font-display text-lg font-bold">Поддержка DevForge</h2><p class="text-xs text-emerald-500">обычно отвечает сразу</p></div><button type="button" class="btn-ghost size-10 !p-0" aria-label="Закрыть чат" @click="supportOpen = false">✕</button></header><div class="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 scrollbar-thin dark:bg-slate-950"><div v-for="item in messages" :key="item.id" class="flex" :class="item.mine ? 'justify-end' : 'justify-start'"><p class="max-w-[85%] rounded-2xl px-4 py-3 text-sm" :class="item.mine ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-white shadow-sm dark:bg-slate-800'">{{ item.text }}</p></div></div><form class="sticky bottom-0 flex gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900" @submit.prevent="sendMessage"><label class="min-w-0 flex-1"><span class="sr-only">Сообщение</span><input v-model="message" class="input" placeholder="Напиши вопрос…"></label><button type="submit" class="btn-primary" :disabled="!message.trim()">➜</button></form></aside>

    <div v-if="enrollmentOpen" class="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="enrollment-title" @click.self="enrollmentOpen = false"><section class="my-8 w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8 dark:bg-slate-900"><div class="flex items-start justify-between"><div><p class="section-kicker">Заявка на обучение</p><h2 id="enrollment-title" class="mt-2 font-display text-2xl font-bold">{{ selectedCourse }}</h2></div><button type="button" class="btn-ghost size-10 !p-0" aria-label="Закрыть форму" @click="enrollmentOpen = false">✕</button></div><ol class="mt-6 grid grid-cols-4 gap-2" aria-label="Шаги заявки"><li v-for="(label,index) in ['Контакты','Профиль','Формат','Готово']" :key="label"><div class="h-1.5 rounded-full" :class="step >= index + 1 ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'"></div><p class="mt-2 truncate text-[10px] font-semibold sm:text-xs">{{ label }}</p></li></ol><form class="mt-7" @submit.prevent="nextStep"><fieldset v-if="step === 1" class="space-y-4"><legend class="mb-4 font-display text-xl font-bold">Как с тобой связаться?</legend><label class="block"><span class="label">Имя</span><input v-model="form.name" class="input" required></label><label class="block"><span class="label">Email</span><input v-model="form.email" class="input" type="email" required></label></fieldset><fieldset v-else-if="step === 2" class="space-y-4"><legend class="mb-4 font-display text-xl font-bold">Расскажи о себе</legend><label class="block"><span class="label">Город</span><input v-model="form.city" class="input"></label><label class="block"><span class="label">Опыт</span><select v-model="form.experience" class="input"><option value="">Выбрать</option><option>Начинаю с нуля</option><option>Знаю основы</option><option>Уже работаю в IT</option></select></label></fieldset><fieldset v-else-if="step === 3" class="space-y-3"><legend class="mb-4 font-display text-xl font-bold">Формат обучения</legend><label v-for="format in ['Самостоятельный','С ментором','Карьерный']" :key="format" class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 has-[:checked]:border-brand-500 has-[:checked]:bg-blue-50 dark:border-slate-700 dark:has-[:checked]:bg-blue-950/30"><input v-model="form.format" type="radio" name="format" :value="format" class="text-brand-600"><span class="font-semibold">{{ format }}</span></label></fieldset><section v-else><h3 class="font-display text-xl font-bold">Проверь данные</h3><dl class="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-800"><div><dt class="text-slate-500">Имя</dt><dd class="font-semibold">{{ form.name }}</dd></div><div><dt class="text-slate-500">Email</dt><dd class="font-semibold">{{ form.email }}</dd></div><div><dt class="text-slate-500">Уровень</dt><dd class="font-semibold">{{ form.experience }}</dd></div><div><dt class="text-slate-500">Формат</dt><dd class="font-semibold">{{ form.format }}</dd></div></dl></section><p v-if="formError" class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ formError }}</p><p v-if="formDone" class="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">Заявка отправлена. Мы свяжемся с тобой в ближайшее время.</p><div class="mt-6 flex justify-between"><button type="button" class="btn-secondary" :disabled="step === 1" @click="step--; formError = ''">Назад</button><button type="submit" class="btn-primary" :disabled="formDone">{{ step === 4 ? 'Отправить заявку' : 'Далее' }}</button></div></form></section></div>
  </div>
</template>
