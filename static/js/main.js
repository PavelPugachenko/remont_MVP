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
  window.submitForm = async (event) => {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const packageSelect = document.getElementById('package-select');
    const resultDiv = document.getElementById('form-result');
    const form = document.getElementById('lead-form');
    const csrfInput = form ? form.querySelector('input[name="csrfmiddlewaretoken"]') : null;
    const csrfToken = csrfInput ? csrfInput.value : '';

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const packageValue = packageSelect ? packageSelect.value : '';

    if (!name || !phone || !packageValue) {
      resultDiv.textContent = 'Пожалуйста, заполните все поля.';
      resultDiv.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
          name,
          phone,
          package: packageValue
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.status === 'ok') {
        resultDiv.textContent = 'Спасибо! Мы скоро свяжемся с вами.';
        resultDiv.style.color = '#27ae60';

        // Очистка формы
        nameInput.value = '';
        phoneInput.value = '';
        packageSelect.value = '';
      } else {
        resultDiv.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз.';
        resultDiv.style.color = 'red';
      }
    } catch (error) {
      resultDiv.textContent = 'Ошибка сети. Проверьте соединение и попробуйте снова.';
      resultDiv.style.color = 'red';
    }
  };

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
});
