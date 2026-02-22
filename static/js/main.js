document.addEventListener('DOMContentLoaded', () => {
  const getById = (id) => document.getElementById(id);

  const setResultMessage = (element, message, status) => {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.remove('is-success', 'is-error');
    if (status === 'success') {
      element.classList.add('is-success');
    } else if (status === 'error') {
      element.classList.add('is-error');
    }
  };

  // Dynamic background
  const fallbackBgImages = [
    '/static/images/bg1.jpg',
    '/static/images/bg2.jpg',
    '/static/images/bg3.jpg',
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

  // Fade-in animation
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
    }, { threshold: 0.12 });

    fadeInElements.forEach((element) => observer.observe(element));
  } else {
    fadeInElements.forEach((element) => element.classList.add('appear'));
  }

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const menuList = getById('site-menu');

  const setMenuState = (open) => {
    if (!menuToggle || !menuList) {
      return;
    }

    menuToggle.classList.toggle('is-open', open);
    menuList.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  if (menuToggle && menuList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    menuList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!menuList.contains(target) && !menuToggle.contains(target)) {
        setMenuState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }

  // Active menu link by section
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const menuLinks = Array.from(document.querySelectorAll('.menu-link'));

  if (sections.length > 0 && menuLinks.length > 0 && 'IntersectionObserver' in window) {
    const byId = new Map(menuLinks.map((link) => [link.getAttribute('href'), link]));
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const key = `#${entry.target.id}`;
        menuLinks.forEach((link) => link.classList.remove('is-active'));
        const current = byId.get(key);
        if (current) {
          current.classList.add('is-active');
        }
      });
    }, { threshold: 0.45 });

    sections.forEach((section) => activeObserver.observe(section));
  }

  // Modal
  const modal = getById('consultation-modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');

  const openModal = () => {
    if (!modal) {
      return;
    }

    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const firstFocusable = modal.querySelector('input, button, select, textarea');
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  if (modal) {
    openModalButtons.forEach((button) => {
      button.addEventListener('click', () => openModal());
    });

    modal.querySelectorAll('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', () => closeModal());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  // Carousel
  let currentSlide = 0;
  const slides = Array.from(document.querySelectorAll('.carousel-item'));
  const carousel = document.querySelector('.carousel');
  const dotsContainer = getById('carousel-dots');
  let carouselAutoplay = null;

  const dots = [];

  const updateDots = (index) => {
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== index;
    });
    currentSlide = index;
    updateDots(index);
  };

  const moveSlide = (step) => {
    if (slides.length === 0) {
      return;
    }

    const nextIndex = (currentSlide + step + slides.length) % slides.length;
    showSlide(nextIndex);
  };

  const stopAutoplay = () => {
    if (carouselAutoplay) {
      clearInterval(carouselAutoplay);
      carouselAutoplay = null;
    }
  };

  const startAutoplay = () => {
    if (slides.length <= 1) {
      return;
    }

    stopAutoplay();
    carouselAutoplay = setInterval(() => {
      moveSlide(1);
    }, 5500);
  };

  if (slides.length > 0) {
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Слайд ${index + 1}`);
        dot.addEventListener('click', () => {
          showSlide(index);
          startAutoplay();
        });
        dotsContainer.append(dot);
        dots.push(dot);
      });
    }

    window.nextSlide = () => {
      moveSlide(1);
      startAutoplay();
    };

    window.prevSlide = () => {
      moveSlide(-1);
      startAutoplay();
    };

    showSlide(currentSlide);
    startAutoplay();

    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
      carousel.addEventListener('touchend', startAutoplay, { passive: true });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  } else {
    window.nextSlide = () => {};
    window.prevSlide = () => {};
  }

  // Calculator
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

  // Phone formatting and validation
  const normalizePhoneDigits = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) {
      return '';
    }

    let normalized = digitsOnly;
    if (normalized.startsWith('8')) {
      normalized = `7${normalized.slice(1)}`;
    } else if (!normalized.startsWith('7')) {
      normalized = `7${normalized}`;
    }

    return normalized.slice(0, 11);
  };

  const formatPhone = (value) => {
    const digits = normalizePhoneDigits(value);
    if (!digits) {
      return '';
    }

    const local = digits.slice(1);
    const part1 = local.slice(0, 3);
    const part2 = local.slice(3, 6);
    const part3 = local.slice(6, 8);
    const part4 = local.slice(8, 10);

    let output = '+7';
    if (part1) {
      output += ` (${part1}`;
      if (part1.length === 3) {
        output += ')';
      }
    }
    if (part2) {
      output += ` ${part2}`;
    }
    if (part3) {
      output += `-${part3}`;
    }
    if (part4) {
      output += `-${part4}`;
    }

    return output;
  };

  const isPhoneValid = (value) => normalizePhoneDigits(value).length === 11;

  const phoneInputs = Array.from(document.querySelectorAll('input[type="tel"]'));
  phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.value = formatPhone(input.value);
      input.setCustomValidity('');
    });

    input.addEventListener('blur', () => {
      if (input.value && !isPhoneValid(input.value)) {
        input.setCustomValidity('Введите телефон в формате +7 (900) 123-45-67');
        input.reportValidity();
      } else {
        input.setCustomValidity('');
      }
    });
  });

  const getApiErrorText = (errorCode) => {
    if (errorCode === 'invalid_package') {
      return 'Выберите корректный пакет ремонта.';
    }
    if (errorCode === 'missing_fields') {
      return 'Заполните все обязательные поля.';
    }
    return 'Не удалось отправить заявку. Попробуйте еще раз.';
  };

  const submitRepairForm = async (form, resultElement) => {
    const endpoint = form.dataset.endpoint || '/submit/';
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const packageType = String(formData.get('package') || '').trim();

    if (!name || !phone || !packageType) {
      setResultMessage(resultElement, 'Пожалуйста, заполните все поля.', 'error');
      return false;
    }

    if (!isPhoneValid(phone)) {
      setResultMessage(resultElement, 'Укажите корректный номер телефона.', 'error');
      return false;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.status !== 'ok') {
        const errorCode = typeof payload.error === 'string' ? payload.error : '';
        setResultMessage(resultElement, getApiErrorText(errorCode), 'error');
        return false;
      }

      form.reset();
      phoneInputs.forEach((input) => {
        if (form.contains(input)) {
          input.value = '';
        }
      });
      setResultMessage(resultElement, 'Спасибо! Мы скоро свяжемся с вами.', 'success');
      return true;
    } catch (_error) {
      setResultMessage(resultElement, 'Проблема с сетью. Проверьте подключение и попробуйте снова.', 'error');
      return false;
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = form.id === 'popup-form' ? 'Получить консультацию' : 'Отправить заявку';
      }
    }
  };

  const leadForm = getById('lead-form');
  const leadResult = getById('form-result');

  if (leadForm) {
    leadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitRepairForm(leadForm, leadResult);
    });
  }

  const popupForm = getById('popup-form');
  const popupResult = getById('popup-result');

  if (popupForm) {
    popupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitted = await submitRepairForm(popupForm, popupResult);
      if (submitted) {
        setTimeout(() => {
          closeModal();
          setResultMessage(popupResult, '', '');
        }, 1200);
      }
    });
  }

  // Scroll to top
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
