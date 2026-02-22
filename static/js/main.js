document.addEventListener('DOMContentLoaded', () => {
  const getById = (id) => document.getElementById(id);

  // Динамический фон
  const fallbackBgImages = [
    'images/bg1.jpg',
    'images/bg2.jpg',
    'images/bg3.jpg',
  ];
  const bgImages = Array.isArray(window.bgImages) && window.bgImages.length > 0
    ? window.bgImages
    : fallbackBgImages;
  let currentBgIndex = 0;
  const bgElement = getById('dynamic-bg');

  if (bgElement && bgImages.length > 0) {
    const changeBackground = () => {
      bgElement.style.backgroundImage = `url(${bgImages[currentBgIndex]})`;
      currentBgIndex = (currentBgIndex + 1) % bgImages.length;
    };

    changeBackground();
    setInterval(changeBackground, 7000);
  }

  // Анимация появления
  const fadeInElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, localObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('appear');
        localObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    fadeInElements.forEach((element) => observer.observe(element));
  } else {
    fadeInElements.forEach((element) => element.classList.add('appear'));
  }

  // Карусель
  let currentSlide = 0;
  const slides = Array.from(document.querySelectorAll('.carousel-item'));
  if (slides.length > 0) {
    const showSlide = (index) => {
      slides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== index;
      });
    };

    const moveSlide = (step) => {
      currentSlide = (currentSlide + step + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    window.nextSlide = () => moveSlide(1);
    window.prevSlide = () => moveSlide(-1);
    showSlide(currentSlide);
  } else {
    window.nextSlide = () => {};
    window.prevSlide = () => {};
  }

  // Калькулятор
  const areaInput = getById('area');
  const calcPackageSelect = getById('calc-package');
  const totalElement = getById('total');

  const calculate = () => {
    if (!areaInput || !calcPackageSelect || !totalElement) {
      return;
    }

    const area = Number.parseFloat(areaInput.value) || 0;
    const pricePerSqm = Number.parseFloat(calcPackageSelect.value) || 0;
    const total = Math.max(0, area * pricePerSqm);

    totalElement.textContent = total.toLocaleString('ru-RU');
  };

  window.calculate = calculate;
  calculate();

  // Форма
  const leadForm = getById('lead-form');
  const nameInput = getById('name');
  const phoneInput = getById('phone');
  const packageSelect = getById('package-select');
  const resultDiv = getById('form-result');

  const submitForm = () => {
    if (!nameInput || !phoneInput || !packageSelect || !resultDiv) {
      return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const selectedPackage = packageSelect.value;

    if (name && phone && selectedPackage) {
      resultDiv.textContent = 'Спасибо! Мы скоро свяжемся с вами.';
      resultDiv.style.color = '#27ae60';

      nameInput.value = '';
      phoneInput.value = '';
      packageSelect.value = '';
    } else {
      resultDiv.textContent = 'Пожалуйста, заполните все поля.';
      resultDiv.style.color = 'red';
    }
  };

  window.submitForm = submitForm;
  if (leadForm) {
    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm();
    });
  }

  // Кнопка "Наверх"
  const backToTopButton = getById('back-to-top');
  if (backToTopButton) {
    const toggleButton = () => {
      backToTopButton.classList.toggle('show', window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleButton, { passive: true });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleButton();
  }
});
