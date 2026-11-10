# Сравнительный анализ бесплатных хостингов

**Сценарий:** статический сайт на Vue 3 + Vite + Tailwind CSS с возможным размещением рекламы.  
**Дата проверки:** 10 ноября 2026 года.

## Сравнительная таблица

| Параметр | Cloudflare Pages | GitHub Pages | Netlify Free | Vercel Hobby |
|---|---|---|---|---|
| Трафик | Запросы к статическим файлам [бесплатны и не ограничены](https://developers.cloudflare.com/pages/functions/pricing/#static-asset-requests) | Мягкий лимит [100 ГБ/месяц](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | 300 кредитов/мес.; 1 ГБ трафика = 20 кредитов, 10 000 запросов = 2 кредита | [100 ГБ](https://vercel.com/docs/plans) Fast Data Transfer |
| Сборки | [500 в месяц](https://developers.cloudflare.com/pages/platform/limits/), одна одновременно, до 20 минут | Мягкий лимит 10 сборок/час, до 10 минут | Production-deploy стоит [15 кредитов](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/); preview-deploy бесплатен | 6 000 минут, 100 deployment/день, одна сборка одновременно |
| Коммерческое использование | Отдельного запрета для Pages Free нет; действуют общие условия Cloudflare | Нельзя использовать как бесплатный хостинг для online business, e-commerce и SaaS | [Коммерческие проекты разрешены](https://www.netlify.com/blog/introducing-netlify-free-plan/) | [Только личное и некоммерческое](https://vercel.com/legal/terms) использование |
| Реклама | Специального запрета нет; низкий риск при соблюдении общих правил | Разрешена умеренная монетизация, но сайт не должен быть преимущественно рекламным | Отдельного запрета нет, но рекламный трафик расходует кредиты | Реклама создаёт риск как коммерческая деятельность |
| Свой домен + SSL | Да; до 100 доменов на проект Free | [Да, HTTPS поддерживается](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) | Да, автоматический HTTPS | Да, автоматический HTTPS |
| Git-deploy | [GitHub и GitLab](https://developers.cloudflare.com/pages/configuration/git-integration/), автосборка при push | Нативно из GitHub, включая Actions | [GitHub, GitLab, Bitbucket и Azure DevOps](https://docs.netlify.com/start/quickstarts/deploy-from-repository/) | GitHub, GitLab и Bitbucket, preview-deploy |
| Подходящий сценарий | Статический Vue-сайт с рекламой и запасом по трафику | Личный или учебный проект с минимальной монетизацией | Небольшой коммерческий сайт с низким трафиком | Личный некоммерческий проект без рекламы |

## Анализ лимитов

Для данного проекта лимиты Cloudflare Pages имеют наибольший запас. Сайт состоит из HTML, CSS, JavaScript и нескольких SVG-изображений, поэтому даже лимит Free в 20 000 файлов и 25 МиБ на один файл не станет практическим ограничением. Пятьсот сборок в месяц позволяют публиковать даже несколько изменений ежедневно. Двадцатиминутный timeout также велик: текущая локальная сборка занимает менее секунды.

Технические лимиты GitHub Pages тоже достаточны: итоговый сайт намного меньше 1 ГБ, а 100 ГБ месячного трафика достаточны для учебной публикации. Ограничение здесь связано прежде всего с политикой, а не с мощностью хостинга. Vercel предлагает ещё более чем достаточные сборочные ресурсы, но они не компенсируют запрет коммерческого использования Hobby.

Кредитная модель Netlify требует более внимательного расчёта. Если потратить все 300 кредитов только на production-deploy, получится 20 публикаций в месяц без запаса на трафик. Если не делать новых публикаций и не учитывать число запросов, теоретический предел составит 15 ГБ. В реальности оба типа расхода идут одновременно, поэтому точный лимит трафика заранее не фиксирован.

## Совместимость с DevForge

Проект имеет две HTML-точки входа: главную страницу `index.html` и кабинет `admin.html`. Vite собирает обе страницы в `dist`, поэтому Cloudflare Pages не нужны функции, база данных или серверная конфигурация. На поддомене `pages.dev` приложение размещается от корня домена. Это совпадает с текущими абсолютными путями `/images/...`, поэтому `base` в `vite.config.js` менять не нужно.

При GitHub Pages проект по умолчанию был бы доступен в подпапке вида `username.github.io/repository/`. Для такого размещения пришлось бы задать `base` и исправить абсолютные пути к изображениям. Свой домен решил бы проблему, но добавил бы лишний шаг. Netlify и Vercel технически также совместимы с текущей сборкой: для них достаточно указать `npm run build` и `dist`. Следовательно, итоговый выбор определяют не возможности Vite, а правила рекламы, трафик и удобство адресов.

## Риски, связанные с политикой платформ

Главный риск создаёт Vercel. В [условиях Hobby](https://vercel.com/docs/plans/hobby) прямо указано, что бесплатный тариф предназначен для личного и некоммерческого использования. Даже если сайт учебный, доход от рекламы может быть признан коммерческим использованием. Поэтому Vercel Hobby не следует выбирать для этого сценария, несмотря на удобную сборку Vue-проектов.

GitHub Pages занимает промежуточное положение. [Правила GitHub](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies#10-advertising-on-github) не запрещают рекламу в целом, но основным назначением контента не должна быть реклама или продвижение. Дополнительные [условия Pages](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages) разрешают некоторые формы монетизации, но запрещают использовать Pages как бесплатный хостинг онлайн-бизнеса, интернет-магазина или SaaS. Один ненавязчивый баннер в учебном проекте выглядит допустимо, однако формулировки оставляют «серую зону».

Netlify разрешает коммерческие проекты на Free, поэтому риск блокировки из-за самого факта рекламы низок. Основной минус — не политика, а кредитные лимиты. Трафик, запросы и каждая production-публикация расходуют общие 300 кредитов. Даже маленький сайт может исчерпать их при частых сборках или неожиданном росте посещаемости; на Free действует жёсткий лимит без автопополнения.

Cloudflare Pages не публикует специального запрета на рекламу или коммерческие статические сайты. Это вывод из отсутствия такого ограничения, а не прямая гарантия Cloudflare: сайт всё равно должен соблюдать общие условия и политику допустимого использования. Для обычного учебного сайта с одним рекламным блоком риск ниже, чем у GitHub Pages и Vercel Hobby.

## Рекомендация

Для DevForge предпочтителен **Cloudflare Pages**. Проект целиком статический, поэтому получает неограниченные запросы к файлам, а 500 ежемесячных сборок более чем достаточно. Интеграция с GitHub автоматически запустит `npm run build` и опубликует папку `dist`. Альтернатива — **Netlify Free**: он также разрешает коммерческие проекты и просто работает с Vite, но уступает Cloudflare из-за общего лимита 300 кредитов.

## Ключевые факторы выбора

1. **Соответствие правилам.** Реклама может превратить учебный проект в монетизируемый, поэтому явный запрет Vercel важнее больших технических лимитов.
2. **Запас по трафику.** Реклама имеет смысл только при посещаемости. Неограниченная раздача статических файлов снижает риск неожиданной приостановки сайта.
3. **Автоматизация Git и Vite.** Проект уже собирается командой `npm run build`; хостингу нужно лишь забрать код из GitHub и опубликовать `dist`. Это упрощает первое развёртывание и все последующие обновления.

## Источники

- [Cloudflare Pages: лимиты](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages: цена статических запросов](https://developers.cloudflare.com/pages/functions/pricing/#static-asset-requests)
- [Cloudflare Pages: Git-интеграция](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [GitHub Pages: лимиты](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub: реклама в Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies#10-advertising-on-github)
- [GitHub: дополнительные условия Pages](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages)
- [Netlify: кредиты Free](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
- [Netlify: коммерческие проекты на Free](https://www.netlify.com/blog/introducing-netlify-free-plan/)
- [Vercel: тариф Hobby](https://vercel.com/docs/plans/hobby)
- [Vercel: условия использования](https://vercel.com/legal/terms)
