const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const pageBackground = document.querySelector('.page-background');
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

const shapeTypes = ['square', 'circle', 'triangle'];
const shapeColors = [
  { fill: 'rgba(122, 92, 255, 0.72)', glow: 'rgba(122, 92, 255, 0.42)' },
  { fill: 'rgba(29, 226, 255, 0.68)', glow: 'rgba(29, 226, 255, 0.38)' },
  { fill: 'rgba(255, 208, 108, 0.7)', glow: 'rgba(255, 208, 108, 0.42)' },
  { fill: 'rgba(255, 112, 166, 0.68)', glow: 'rgba(255, 112, 166, 0.38)' },
];
const recentShapePositions = [];
const maxRecentShapePositions = 14;
const minShapeDistance = 18;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function distanceBetween(firstPoint, secondPoint) {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}

function getRandomShapePosition() {
  let position = { x: randomBetween(8, 92), y: randomBetween(14, 88) };

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const nextPosition = { x: randomBetween(8, 92), y: randomBetween(14, 88) };
    const hasNearbyPosition = recentShapePositions.some(
      (recentPosition) => distanceBetween(nextPosition, recentPosition) < minShapeDistance
    );

    if (!hasNearbyPosition) {
      position = nextPosition;
      break;
    }
  }

  recentShapePositions.push(position);

  if (recentShapePositions.length > maxRecentShapePositions) {
    recentShapePositions.shift();
  }

  return position;
}

function createBurst(position, color) {
  const burst = document.createElement('span');

  burst.className = 'background-burst';
  burst.style.setProperty('--x', `${position.x}%`);
  burst.style.setProperty('--y', `${position.y}%`);
  burst.style.setProperty('--shape-color', color.fill);
  pageBackground.append(burst);

  burst.addEventListener('animationend', () => burst.remove(), { once: true });
}

function createBackgroundShape() {
  if (!pageBackground || reduceMotion.matches) {
    return;
  }

  const position = getRandomShapePosition();
  const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
  const shape = document.createElement('span');
  const duration = Math.floor(randomBetween(1800, 2600));

  shape.className = `background-shape background-shape--${type}`;
  shape.style.setProperty('--x', `${position.x}%`);
  shape.style.setProperty('--y', `${position.y}%`);
  shape.style.setProperty('--size', `${Math.floor(randomBetween(52, 92))}px`);
  shape.style.setProperty('--rotate', `${Math.floor(randomBetween(0, 180))}deg`);
  shape.style.setProperty('--shape-color', color.fill);
  shape.style.setProperty('--shape-glow', color.glow);
  shape.style.setProperty('--shape-duration', `${duration}ms`);
  pageBackground.append(shape);

  window.setTimeout(() => createBurst(position, color), duration - 180);
  shape.addEventListener('animationend', () => shape.remove(), { once: true });
}

if (pageBackground && !reduceMotion.matches) {
  for (let index = 0; index < 4; index += 1) {
    window.setTimeout(createBackgroundShape, index * 360);
  }

  window.setInterval(createBackgroundShape, 620);
}

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
