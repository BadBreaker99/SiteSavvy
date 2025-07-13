document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  } else {
    console.error('Burger or navLinks not found');
  }
});

