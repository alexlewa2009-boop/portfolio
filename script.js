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

function createComet() {
  const container = document.getElementById('stars-background');
  if (!container) return;

  const star = document.createElement('div');
  star.className = 'star';
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const minRadius = Math.min(window.innerWidth, window.innerHeight) * 0.14;
  const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
  
  // Spawn from a random point in the central depth volume
  const angle = Math.random() * Math.PI * 2;
  const startDist = minRadius + Math.random() * (maxRadius - minRadius);
  const startX = centerX + Math.cos(angle) * startDist;
  const startY = centerY + Math.sin(angle) * startDist;
  
  // Move outward toward the edge
  const edgeDistance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
  const endX = centerX + Math.cos(angle) * edgeDistance;
  const endY = centerY + Math.sin(angle) * edgeDistance;
  
  const sx = endX - startX;
  const sy = endY - startY;
  const angleRad = angle + Math.PI / 2;
  const startScale = 0.18 + (1 - startDist / maxRadius) * 0.35;
  const size = 4 + Math.random() * 4;
  
  star.style.width = `${size}px`;
  star.style.height = `${size * 8}px`;
  star.style.opacity = `${0.4 + Math.random() * 0.5}`;
  star.style.setProperty('--sx', `${sx}px`);
  star.style.setProperty('--sy', `${sy}px`);
  star.style.setProperty('--angle', `${angleRad}rad`);
  star.style.setProperty('--start-scale', `${startScale}`);
  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  
  const duration = 1.8 + Math.random() * 0.6;
  star.style.animation = `space-fly ${duration}s ease-in forwards`;
  
  container.appendChild(star);
  
  setTimeout(() => star.remove(), duration * 1000);
}

// Generate a moving starfield with lower CPU load
setInterval(() => {
  for (let i = 0; i < 3; i++) {
    createComet();
  }
}, 90);

// Initial batch of stars
for (let i = 0; i < 40; i++) {
  setTimeout(() => createComet(), i * 20);
}
