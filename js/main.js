// Основной интерактивный скрипт DevForge
document.addEventListener('DOMContentLoaded', () => {
  // 1. Адаптивное Бургер-меню для мобильных устройств
  const burgerBtn = document.getElementById('burger-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav__link, .nav__btn');

  function toggleMenu() {
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    burgerBtn.setAttribute('aria-expanded', !isExpanded);
    burgerBtn.classList.toggle('is-active');
    mainNav.classList.toggle('is-open');

    // Блокируем скролл страницы при открытом меню
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }

  function closeMenu() {
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.classList.remove('is-active');
    mainNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', toggleMenu);

    // Закрывать меню при переходе по ссылке
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('is-open')) {
          closeMenu();
        }
      });
    });
  }

  // 2. Обработка клика по кнопкам "Записаться" / CTA
  // Скроллит к форме, фокусирует поле "Имя" и подсвечивает форму
  const ctaButtons = document.querySelectorAll('a[href="#contact"]');
  const nameInput = document.getElementById('name');
  const leadFormCard = document.querySelector('.contact__form-wrap');

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Акцент и фокус в поле ввода после завершения скролла
        setTimeout(() => {
          if (nameInput) {
            nameInput.focus();
          }
          if (leadFormCard) {
            leadFormCard.classList.add('pulse-focus');
            setTimeout(() => leadFormCard.classList.remove('pulse-focus'), 1200);
          }
        }, 500);
      }
    });
  });

  // 3. Валидация и интерактивная отправка формы консультации
  const form = document.getElementById('lead-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('email');
      let isValid = true;

      // Валидация имени
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Валидация Email
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      if (isValid) {
        // Успешная отправка
        successMsg.style.display = 'block';
        form.reset();

        // Прячем сообщение через 5 секунд
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    });

    // Очистка ошибок при вводе
    ['name', 'email'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }
});
