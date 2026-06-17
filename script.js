const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const revealElements = document.querySelectorAll('.reveal');
const themeStates = ['dark', 'light', 'transparent'];
const themeNames = {
  dark: 'Тёмная тема',
  light: 'Белая тема',
  transparent: 'Прозрачная тема',
};
let currentThemeIndex = 0;

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('is-open');
});

function updateTheme() {
  const currentTheme = themeStates[currentThemeIndex];
  document.documentElement.classList.toggle('light-theme', currentTheme === 'light');
  document.documentElement.classList.toggle('transparent-theme', currentTheme === 'transparent');
  themeToggle.textContent = ` ${themeNames[currentTheme]}`;
}

themeToggle.addEventListener('click', () => {
  currentThemeIndex = (currentThemeIndex + 1) % themeStates.length;
  updateTheme();
});

updateTheme();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));
