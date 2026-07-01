// ----------------------------------------
// Premium Café Website Interactions
// ----------------------------------------

const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const loader = document.querySelector('.loader');
const backToTop = document.querySelector('.back-to-top');
const progressBar = document.querySelector('.progress-bar');
const year = document.getElementById('year');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
const heartButtons = document.querySelectorAll('.heart-btn');
const testimonials = Array.from(document.querySelectorAll('.testimonial'));
const dotsContainer = document.querySelector('.slider-dots');
const reservationForm = document.getElementById('reservationForm');
const newsletterForm = document.getElementById('newsletterForm');
const successModal = document.getElementById('successModal');
const popupModal = document.getElementById('popupModal');
const closeButtons = document.querySelectorAll('.close-modal');

// ----------------------------------------
// Loader and smooth page entry
// ----------------------------------------
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('is-hidden');
    body.classList.add('loaded');
  }, 600);
});

// ----------------------------------------
// Scroll progress, header styling, back-to-top
// ----------------------------------------
const updateProgressBar = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  header.classList.toggle('scrolled', scrollTop > 40);
  backToTop.classList.toggle('visible', scrollTop > 600);
};

window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ----------------------------------------
// Mobile navigation
// ----------------------------------------
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ----------------------------------------
// Dark mode toggle
// ----------------------------------------
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

const applyThemeIcon = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
};

applyThemeIcon();

themeToggle?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  applyThemeIcon();
});

// ----------------------------------------
// Scroll reveal animations
// ----------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// ----------------------------------------
// Animated counters
// ----------------------------------------
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const duration = 1200;
      const startTime = performance.now();

      const tick = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toString();
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// ----------------------------------------
// Menu category filtering
// ----------------------------------------
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    menuCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

// ----------------------------------------
// Heart button animation
// ----------------------------------------
heartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '♥' : '♡';
  });
});

// ----------------------------------------
// Testimonials carousel
// ----------------------------------------
const createDots = () => {
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => showTestimonial(index));
    dotsContainer.appendChild(dot);
  });
};

const showTestimonial = (index) => {
  testimonials.forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });

  const dots = dotsContainer.querySelectorAll('button');
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
};

let currentTestimonial = 0;
const rotateTestimonials = () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
};

if (testimonials.length > 0) {
  createDots();
  showTestimonial(0);
  setInterval(rotateTestimonials, 5000);
}

// ----------------------------------------
// Countdown timer
// ----------------------------------------
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 8);
targetDate.setHours(20, 0, 0, 0);

const updateCountdown = () => {
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
};

updateCountdown();
setInterval(updateCountdown, 1000);

// ----------------------------------------
// Form validation and modal feedback
// ----------------------------------------
const showModal = (modal) => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const hideModal = (modal) => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

reservationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const date = formData.get('date')?.toString().trim();
  const time = formData.get('time')?.toString().trim();
  const guests = formData.get('guests')?.toString().trim();

  if (!name || !email || !phone || !date || !time || !guests) {
    alert('Please complete all reservation details.');
    return;
  }

  reservationForm.reset();
  showModal(successModal);
});

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  newsletterForm.reset();
  alert('You are subscribed to our newsletter.');
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeButtons.forEach((btn) => {
      const modal = btn.closest('.modal');
      if (modal) hideModal(modal);
    });
  });
});

window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    hideModal(event.target);
  }
});

// ----------------------------------------
// Newsletter popup after delay
// ----------------------------------------
setTimeout(() => {
  showModal(popupModal);
}, 6500);

// ----------------------------------------
// Gallery lightbox
// ----------------------------------------
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.createElement('div');
lightbox.className = 'modal';
lightbox.innerHTML = '<div class="modal-card"><img src="" alt="Expanded gallery view" /></div>';
body.appendChild(lightbox);

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const image = lightbox.querySelector('img');
    image.src = item.src;
    image.alt = item.alt;
    lightbox.classList.add('open');
  });
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('open');
  }
});

// ----------------------------------------
// Custom cursor movement
// ----------------------------------------
window.addEventListener('mousemove', (event) => {
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
  cursorOutline.style.left = `${event.clientX}px`;
  cursorOutline.style.top = `${event.clientY}px`;
});

document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .menu-card, .feature-card').forEach((element) => {
  element.addEventListener('mouseenter', () => {
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
  });
  element.addEventListener('mouseleave', () => {
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ----------------------------------------
// Button ripple effect
// ----------------------------------------
document.querySelectorAll('.btn, .filter-btn, .heart-btn, .menu-toggle').forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ----------------------------------------
// Footer year
// ----------------------------------------
year.textContent = new Date().getFullYear();
