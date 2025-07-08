document.addEventListener('DOMContentLoaded', () => {
  // === BURGER MENU ===
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('nav ul');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }

  // === ACTIVE LINK HIGHLIGHTING ===
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // === GO TO TOP BUTTON ===
  const toTopBtn = document.getElementById('toTopBtn');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === DARK MODE TOGGLE ===
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // === SHADOW ON NAVBAR SCROLL ===
  const navbar = document.querySelector('.responsive-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // === SMOOTH SCROLL ON INTERNAL LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
