document.addEventListener('DOMContentLoaded', () => {
  // Динамический фон
  const bgImages = window.bgImages || [];
  let currentIndex = 0;
  const bgElement = document.getElementById('dynamic-bg');

  if (bgElement && bgImages.length > 0) {
    function changeBackground() {
      bgElement.style.backgroundImage = `url(${bgImages[currentIndex]})`;
      currentIndex = (currentIndex + 1) % bgImages.length;
    }
    changeBackground();
    setInterval(changeBackground, 7000);
  }

  // Анимация появления
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Мобильное меню
  const menuToggle = document.querySelector('.menu-toggle');
  const menuList = document.querySelector('.menu-list');
  if (menuToggle && menuList) {
    const setMenuState = (isOpen) => {
      menuList.classList.toggle('is-open', isOpen);
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    };

    menuToggle.addEventListener('click', () => {
      setMenuState(!menuList.classList.contains('is-open'));
    });

    menuList.addEventListener('click', (event) => {
      if (event.target && event.target.matches('a')) {
        setMenuState(false);
      }
    });

    document.addEventListener('click', (event) => {
      if (!menuList.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuState(false);
      }
    });
  }

  // Карусель
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-item');
  if (slides.length > 0) {
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
    }
    window.nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };
    window.prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };
    showSlide(currentSlide);
  }

  // Калькулятор
  window.calculate = () => {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const pricePerSqm = parseFloat(document.getElementById('calc-package').value) || 0;
    const total = area * pricePerSqm;
    document.getElementById('total').textContent = total.toLocaleString('ru-RU');
  };

  // Форма
  let closeConsultationModal = null;

  const submitLeadForm = async (form) => {
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const packageField = form.querySelector('[name="package"]');
    const resultDiv = form.querySelector('.form-result') || form.querySelector('#form-result');
    const csrfInput = form.querySelector('input[name="csrfmiddlewaretoken"]');
    const csrfToken = csrfInput ? csrfInput.value : '';

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const packageValue = packageField ? packageField.value : '';

    if (!name || !phone || (packageField && !packageValue)) {
      if (resultDiv) {
        resultDiv.textContent = 'Пожалуйста, заполните все поля.';
        resultDiv.style.color = 'red';
      }
      return;
    }

    const payload = { name, phone };
    if (packageField) payload.package = packageValue;

    try {
      const response = await fetch('/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.status === 'ok') {
        if (resultDiv) {
          resultDiv.textContent = 'Спасибо! Мы скоро свяжемся с вами.';
          resultDiv.style.color = '#27ae60';
        }

        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (packageField && packageField.tagName === 'SELECT') packageField.value = '';

        if (form.id === 'popup-form' && closeConsultationModal) {
          setTimeout(() => closeConsultationModal(), 900);
        }
      } else {
        if (resultDiv) {
          resultDiv.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз.';
          resultDiv.style.color = 'red';
        }
      }
    } catch (error) {
      if (resultDiv) {
        resultDiv.textContent = 'Ошибка сети. Проверьте соединение и попробуйте снова.';
        resultDiv.style.color = 'red';
      }
    }
  };

  window.submitForm = async (event) => {
    if (event) event.preventDefault();
    const form = event && event.target ? event.target : document.getElementById('lead-form');
    await submitLeadForm(form);
  };

  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', submitForm);
  }

  const popupForm = document.getElementById('popup-form');
  if (popupForm) {
    popupForm.addEventListener('submit', submitForm);
  }

  // Кнопка "Наверх"
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    const toggleButton = () => {
      backToTopButton.classList.toggle('show', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleButton);
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleButton();
  }

  // Запуск калькулятора
  if (document.getElementById('area')) calculate();

  // Модальное окно консультации
  const consultationModal = document.getElementById('consultation-modal');
  if (consultationModal) {
    const nameField = consultationModal.querySelector('input[name="name"]');
    const openModal = () => {
      consultationModal.classList.add('is-visible');
      consultationModal.setAttribute('aria-hidden', 'false');
      if (nameField) {
        nameField.focus();
      }
    };

    const closeModal = () => {
      consultationModal.classList.remove('is-visible');
      consultationModal.setAttribute('aria-hidden', 'true');
    };

    closeConsultationModal = closeModal;

    consultationModal.querySelectorAll('[data-modal-close]').forEach((element) => {
      element.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });

    setTimeout(() => {
      if (!consultationModal.classList.contains('is-visible')) {
        openModal();
      }
    }, 15000);
  }
});
