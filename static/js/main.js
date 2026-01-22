document.addEventListener('DOMContentLoaded', () => {
  // === Динамический фон ===
  const bgImages = window.BG_IMAGES || [];
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

  // === Карусель (если не реализована) ===
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

  // === Калькулятор ===
  window.calculate = () => {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const pricePerSqm = parseFloat(document.getElementById('calc-package').value) || 0;
    const total = area * pricePerSqm;
    document.getElementById('total').textContent = total.toLocaleString('ru-RU');
  };

  // === Отправка формы (заглушка) ===
  window.submitForm = () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const resultDiv = document.getElementById('form-result');
    if (name && phone) {
      resultDiv.textContent = 'Спасибо! Мы скоро свяжемся с вами.';
      resultDiv.style.color = 'green';
    } else {
      resultDiv.textContent = 'Пожалуйста, заполните все поля.';
      resultDiv.style.color = 'red';
    }
  };

  // === Кнопка "Наверх" ===
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Запустить калькулятор при загрузке
  if (document.getElementById('area')) {
    calculate();
  }
});