<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import AuthPanel from './components/AuthPanel.vue'
import ChangeLog from './components/ChangeLog.vue'
import CourseModal from './components/CourseModal.vue'
import CourseTable from './components/CourseTable.vue'
import ExcelImporter from './components/ExcelImporter.vue'
import FilePanel from './components/FilePanel.vue'

const seed = [
  { id: 1, name: 'Frontend Developer: React & TypeScript', category: 'Frontend', description: 'Создание современных интерфейсов, работа с React, TypeScript и командная практика.', duration: '8 месяцев', price: '5 900 ₽' },
  { id: 2, name: 'Backend Developer: Python & FastAPI', category: 'Backend', description: 'Разработка API и серверных приложений на Python с практическими проектами.', duration: '9 месяцев', price: '6 200 ₽' },
  { id: 3, name: 'DevOps & Cloud Engineer', category: 'DevOps', description: 'Контейнеризация, облачная инфраструктура, CI/CD и автоматизация развёртывания.', duration: '7 месяцев', price: '6 800 ₽' },
  { id: 4, name: 'Machine Learning & Data Science', category: 'Data Science', description: 'Анализ данных и основы машинного обучения на Python.', duration: '10 месяцев', price: '7 100 ₽' },
]
const user = ref(localStorage.getItem('dfUser') || '')
const rows = ref(JSON.parse(localStorage.getItem('dfCourses') || 'null') || seed)
const logs = ref(JSON.parse(localStorage.getItem('dfLogs') || '[]'))
const files = ref([])
const tab = ref('overview')
const sidebarOpen = ref(false)
const dark = ref(false)
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const modalCourse = ref(undefined)
const error = ref('')
const toast = ref('')
let toastTimer

const kanban = [
  { name: 'Запланировано', color: 'bg-slate-400', tasks: [{ title: 'Обновить программу Vue', tag: 'Контент', priority: 'Средний', avatar: 'АК' }, { title: 'Проверить доступность сайта', tag: 'A11y', priority: 'Высокий', avatar: 'ИП' }] },
  { name: 'В работе', color: 'bg-blue-500', tasks: [{ title: 'Подготовить новый интенсив', tag: 'Курс', priority: 'Высокий', avatar: 'МВ' }, { title: 'Записать вводный урок', tag: 'Видео', priority: 'Средний', avatar: 'ОС' }] },
  { name: 'Готово', color: 'bg-emerald-500', tasks: [{ title: 'Настроить Tailwind 3.4', tag: 'Техника', priority: 'Готово', avatar: 'АК' }] },
]

onMounted(() => { dark.value = localStorage.getItem('devforge-theme') === 'dark' })
watch(dark, value => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('devforge-theme', value ? 'dark' : 'light')
}, { immediate: true })

watch(rows, value => localStorage.setItem('dfCourses', JSON.stringify(value)), { deep: true })
watch(logs, value => localStorage.setItem('dfLogs', JSON.stringify(value)), { deep: true })
watch(search, () => { page.value = 1; pageSize.value = 10 })

const filtered = computed(() => {
  const query = search.value.toLocaleLowerCase('ru')
  return rows.value.filter(row => [row.name, row.category, row.description].join(' ').toLocaleLowerCase('ru').includes(query))
})
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

function notify(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2600)
}
function record(action, subject, before, after) {
  logs.value.unshift({ id: Date.now() + Math.random(), action, subject, before: before ? structuredClone(before) : null, after: after ? structuredClone(after) : null, date: new Date().toLocaleString('ru-RU'), open: false })
}
function authenticated(name) { user.value = name }
function logout() { user.value = ''; localStorage.removeItem('dfUser') }
function saveCourse(value) {
  if (modalCourse.value) {
    const before = rows.value.find(row => row.id === modalCourse.value.id)
    const updated = { ...value, id: modalCourse.value.id }
    rows.value = rows.value.map(row => row.id === updated.id ? updated : row)
    record('Обновление', updated.name, before, updated)
  } else {
    const created = { ...value, id: Date.now() }
    rows.value.unshift(created)
    record('Создание', created.name, null, created)
  }
  modalCourse.value = undefined
  notify('Изменения сохранены')
}
function removeCourse(course) {
  if (!window.confirm(`Удалить курс «${course.name}»?`)) return
  rows.value = rows.value.filter(row => row.id !== course.id)
  record('Удаление', course.name, course, null)
  notify('Курс удалён')
}

const DB_NAME = 'devforgeFiles'
function openFilesDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files', { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
async function filesRequest(operation, value) {
  const db = await openFilesDb()
  return new Promise((resolve, reject) => {
    const store = db.transaction('files', 'readwrite').objectStore('files')
    const request = operation === 'get' ? store.getAll() : operation === 'put' ? store.put(value) : store.delete(value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
async function refreshFiles() {
  try { files.value = (await filesRequest('get')).sort((a, b) => b.id - a.id) } catch { files.value = [] }
}
function normalize(row, index) {
  const get = (...keys) => keys.map(key => row[key]).find(value => value !== undefined && value !== '')
  return {
    id: Date.now() + index,
    name: String(get('Название', 'Курс', 'name', 'course') || Object.values(row)[0] || 'Без названия'),
    category: String(get('Категория', 'category') || ''),
    description: String(get('Описание', 'description') || ''),
    duration: String(get('Длительность', 'duration') || ''),
    price: String(get('Цена', 'price') || ''),
  }
}
async function importFile(file) {
  const extension = file.name.split('.').pop().toLowerCase()
  if (extension === 'numbers') {
    error.value = 'Файл Numbers (.numbers) нужно экспортировать через меню Файл → Экспортировать в → CSV или Excel.'
    return
  }
  if (!['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(extension)) {
    error.value = `Формат .${extension} не поддерживается. Выберите Excel, CSV, TSV или ODS.`
    return
  }
  try {
    const buffer = await file.arrayBuffer()
    const workbook = ['csv', 'tsv'].includes(extension)
      ? XLSX.read(new TextDecoder('utf-8').decode(buffer), { type: 'string', codepage: 65001, FS: extension === 'tsv' ? '\t' : undefined })
      : XLSX.read(buffer, { type: 'array', codepage: 65001 })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    if (!data.length) throw new Error('В таблице нет данных')
    const imported = data.map(normalize)
    const before = rows.value.length
    rows.value = [...imported, ...rows.value]
    record('Импорт таблицы', file.name, { записей: before }, { добавлено: imported.length })
    await filesRequest('put', { id: Date.now(), name: file.name, size: file.size < 1024 ? `${file.size} Б` : `${(file.size / 1024).toFixed(1)} КБ`, date: new Date().toLocaleString('ru-RU'), blob: file })
    await refreshFiles()
    notify(`Импортировано строк: ${imported.length}`)
  } catch {
    error.value = 'Не удалось прочитать таблицу. Проверьте файл и его кодировку UTF-8.'
  }
}
async function deleteFile(file) {
  if (!window.confirm(`Удалить файл «${file.name}» из локального хранилища?`)) return
  await filesRequest('delete', file.id)
  await refreshFiles()
  record('Удаление файла', file.name, file, null)
  notify('Файл удалён')
}
refreshFiles()
</script>

<template>
  <div class="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
    <template v-if="user">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" @click="sidebarOpen = false"></div>
      <aside class="fixed inset-y-0 left-0 z-50 h-screen w-64 overflow-y-auto bg-slate-950 p-5 text-white transition-transform duration-300" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
        <div class="flex items-center justify-between"><a href="index.html" class="flex items-center gap-2 font-mono font-bold"><span class="grid size-9 place-items-center rounded-xl bg-brand-600">DF</span>DevForge</a><button class="lg:hidden" aria-label="Закрыть меню" @click="sidebarOpen = false">✕</button></div>
        <nav class="mt-8 space-y-2" aria-label="Управление"><button v-for="item in [['overview','▦','Обзор'],['courses','◫','Курсы'],['kanban','◧','Учебный план'],['files','⇧','Файлы'],['logs','↻','Журнал']]" :key="item[0]" type="button" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition" :class="tab === item[0] ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'" @click="tab = item[0]; sidebarOpen = false"><span>{{ item[1] }}</span><span>{{ item[2] }}</span><span v-if="item[0] === 'courses'" class="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs">{{ rows.length }}</span></button></nav>
        <div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs text-slate-400">Активный пользователь</p><p class="mt-1 truncate text-sm font-semibold">{{ user }}</p><button class="mt-3 text-xs font-semibold text-red-300 hover:text-red-200" @click="logout">Выйти</button></div>
      </aside>
      <div class="min-w-0 lg:ml-64">
        <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/90"><button class="btn-ghost size-10 !p-0 lg:hidden" aria-label="Открыть меню" @click="sidebarOpen = true">☰</button><label class="relative min-w-0 flex-1 sm:max-w-sm"><span class="sr-only">Поиск</span><input v-model="search" class="input pl-9" type="search" placeholder="Поиск по курсам…"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span></label><a href="index.html" class="btn-ghost hidden sm:inline-flex">Открыть сайт</a><button class="btn-ghost size-10 !p-0" :aria-label="dark ? 'Светлая тема' : 'Тёмная тема'" @click="dark = !dark">{{ dark ? '☀️' : '🌙' }}</button><img src="/images/lab/avatar.svg" alt="Профиль администратора" class="size-9 rounded-full"></header>
        <main class="p-4 sm:p-6 lg:p-8">
          <section v-if="tab === 'overview'">
            <div class="flex flex-wrap items-end justify-between gap-4"><div><p class="section-kicker">Панель управления</p><h1 class="section-title">Добрый день, {{ user }}</h1><p class="section-copy">Следите за каталогом, активностью студентов и учебными задачами.</p></div><button class="btn-primary" @click="modalCourse = null">＋ Добавить курс</button></div>
            <div class="mt-7 grid grid-cols-12 gap-4"><article v-for="stat in [['Курсы',rows.length,'+2 за месяц',true],['Студенты','1 248','+12%',true],['Выручка','24 890 BYN','+8%',true],['Возвраты','3.2%','-3%',false]]" :key="stat[0]" class="group col-span-12 min-w-0 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:col-span-6 xl:col-span-3 dark:bg-slate-900"><p class="truncate text-sm text-slate-500">{{ stat[0] }}</p><div class="mt-2 flex items-end justify-between gap-2"><strong class="truncate text-2xl">{{ stat[1] }}</strong><span class="rounded-full px-2 py-1 text-xs font-bold" :class="stat[3] ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">{{ stat[2] }}</span></div></article>
              <article class="col-span-12 min-w-0 rounded-2xl bg-white p-5 shadow-sm lg:col-span-7 dark:bg-slate-900"><div class="flex items-center justify-between"><h2 class="font-display text-lg font-bold">Активность студентов</h2><select class="input w-auto" aria-label="Период"><option>30 дней</option><option>Год</option></select></div><div class="mt-6 grid h-64 grid-cols-12 items-end gap-1 rounded-xl bg-[linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:100%_25%] p-3 dark:bg-[linear-gradient(to_bottom,#334155_1px,transparent_1px)]"><div v-for="height in [38,54,46,72,62,82,58,76,88,68,92,84]" :key="height" class="rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 transition hover:opacity-75" :style="{ height: `${height}%` }"></div></div></article>
              <article class="col-span-12 min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm lg:col-span-5 dark:bg-slate-900"><div class="border-b border-slate-200 p-5 dark:border-slate-700"><h2 class="font-display text-lg font-bold">Последние операции</h2></div><div class="divide-y divide-slate-100 dark:divide-slate-800"><div v-for="operation in [['Оплата курса','Мария В.','+89 BYN'],['Новый студент','Илья П.','Frontend'],['Возврат','Олег С.','-29 BYN'],['Импорт каталога','admin','6 строк']]" :key="operation[0]" class="flex items-center justify-between gap-3 p-4"><div class="min-w-0"><strong class="block truncate text-sm">{{ operation[0] }}</strong><span class="text-xs text-slate-500">{{ operation[1] }}</span></div><span class="whitespace-nowrap text-sm font-bold">{{ operation[2] }}</span></div></div></article>
            </div>
          </section>
          <section v-else-if="tab === 'courses'"><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="section-kicker">Каталог</p><h1 class="section-title">Курсы и данные</h1><p class="section-copy">Импортируйте таблицу или редактируйте каталог вручную.</p></div><button class="btn-primary" @click="modalCourse = null">＋ Добавить курс</button></div><div class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"><ExcelImporter @import="importFile" /></div><CourseTable :rows="pageRows" :page="page" :page-count="pageCount" :total="filtered.length" :search="search" @update:search="search = $event" @page="page = $event" @create="modalCourse = null" @edit="modalCourse = $event" @remove="removeCourse" @load-more="pageSize = pageSize + 10; page = 1" /></section>
          <section v-else-if="tab === 'kanban'"><p class="section-kicker">Учебный процесс</p><h1 class="section-title">План развития курсов</h1><p class="section-copy">Задачи команды по подготовке материалов и улучшению программ.</p><div class="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin"><section v-for="column in kanban" :key="column.name" class="min-w-[300px] flex-1 snap-start rounded-2xl bg-slate-200/70 p-4 dark:bg-slate-800"><header class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2"><span class="size-2.5 rounded-full" :class="column.color"></span><h2 class="font-bold">{{ column.name }}</h2></div><span class="badge">{{ column.tasks.length }}</span></header><div class="space-y-3"><article v-for="task in column.tasks" :key="task.title" class="group rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900"><div class="flex items-start justify-between"><span class="badge">{{ task.tag }}</span><button class="cursor-grab text-slate-400 opacity-60 group-hover:opacity-100" aria-label="Перетащить задачу">⋮⋮</button></div><h3 class="mt-3 line-clamp-2 font-semibold">{{ task.title }}</h3><div class="mt-4 flex items-center justify-between"><span class="text-xs text-slate-500">{{ task.priority }}</span><span class="grid size-8 place-items-center rounded-full bg-slate-950 text-[10px] font-bold text-white">{{ task.avatar }}</span></div></article><button class="btn-ghost w-full border border-dashed border-slate-400">＋ Добавить задачу</button></div></section></div></section>
          <FilePanel v-else-if="tab === 'files'" :files="files" @delete="deleteFile" />
          <ChangeLog v-else-if="tab === 'logs'" :logs="logs" />
        </main>
      </div>
    </template>
    <main v-else class="lab-container py-8"><a href="index.html" class="font-mono font-bold text-brand-600">← DevForge</a><AuthPanel @authenticated="authenticated" /></main>
    <CourseModal v-if="user && modalCourse !== undefined" :course="modalCourse" @save="saveCourse" @close="modalCourse = undefined" />
    <div v-if="toast" class="fixed bottom-5 right-5 z-[90] rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl" role="status">{{ toast }}</div>
    <div v-if="error" class="fixed inset-0 z-[90] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"><button class="btn-ghost absolute right-4 top-4 size-10 !p-0" aria-label="Закрыть" @click="error = ''">×</button><p class="section-kicker">Не удалось загрузить</p><h2 class="mt-2 font-display text-2xl font-bold">Проверьте файл</h2><p class="mt-3 text-slate-600 dark:text-slate-300">{{ error }}</p><p class="mt-2 text-sm text-slate-500">Поддерживаются .xlsx, .xls, .csv и .tsv. Numbers экспортируйте в CSV или Excel.</p><button class="btn-primary mt-5" @click="error = ''">Понятно</button></div></div>
  </div>
</template>
