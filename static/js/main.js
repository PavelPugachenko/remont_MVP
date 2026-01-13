// === КАРУСЕЛЬ ===
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function showSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;
  const offset = -currentSlide * 100;
  document.getElementById('carousel').style.transform = `translateX(${offset}%)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

// Автопрокрутка каждые 5 сек
setInterval(nextSlide, 5000);

// === КАЛЬКУЛЯТОР ===
function calculate() {
  const area = parseFloat(document.getElementById('area').value) || 0;
  const pricePerSq = parseFloat(document.getElementById('calc-package').value) || 0;
  const total = area * pricePerSq;
  document.getElementById('total').textContent = total.toLocaleString('ru-RU') + ' ₽';
}
calculate(); // сразу посчитать при загрузке

// === ОТПРАВКА ФОРМЫ ===
async function submitForm() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const pack = document.getElementById('package-select').value;

  if (!name || !phone || !pack) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  // Простая валидация телефона: минимум 10 цифр
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    alert('Введите корректный номер телефона (минимум 10 цифр)');
    return;
  }

  try {
    const response = await fetch('/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ name, phone, package: pack })
    });

    const result = await response.json();
    const resDiv = document.getElementById('form-result');

    if (result.status === 'ok') {
      resDiv.innerHTML = '<p style="color:#4CAF50;">✅ Заявка успешно отправлена! Скоро свяжемся.</p>';
      document.getElementById('name').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('package-select').value = '';
    } else {
      resDiv.innerHTML = '<p style="color:#F44336;">❌ Произошла ошибка. Попробуйте позже.</p>';
    }
  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('form-result').innerHTML = '<p style="color:#F44336;">❌ Не удалось отправить заявку.</p>';
  }
}

// Вспомогательная функция для CSRF (обязательна в Django)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// === АНИМАЦИЯ ПРИ СКРОЛЛЕ ===
function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const isVisible = elementTop < window.innerHeight - 100;
    if (isVisible) {
      el.classList.add('appear');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// === КНОПКА "НАВЕРХ" ===
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
