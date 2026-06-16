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

const lavaBalls = Array.from(document.querySelectorAll('.lava-ball'));
const lavaState = {
  width: window.innerWidth,
  height: window.innerHeight,
  balls: [],
  lastTime: null,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function initLavaBalls() {
  lavaState.balls = lavaBalls.map((el) => {
    const rect = el.getBoundingClientRect();
    const radius = rect.width / 2;
    const x = radius + Math.random() * (lavaState.width - radius * 2);
    const y = radius + Math.random() * (lavaState.height - radius * 2);
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.06 + Math.random() * 0.12; // px per ms, примерно в 3 раза быстрее
    return {
      el,
      radius,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      collideTimer: 0,
    };
  });
}

function updateBounds() {
  lavaState.width = window.innerWidth;
  lavaState.height = window.innerHeight;
}

function resolveBallCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;
  if (dist <= 0 || dist >= minDist) return;

  const overlap = minDist - dist;
  const nx = dx / dist;
  const ny = dy / dist;

  a.x -= nx * overlap * 0.5;
  a.y -= ny * overlap * 0.5;
  b.x += nx * overlap * 0.5;
  b.y += ny * overlap * 0.5;

  const dvx = a.vx - b.vx;
  const dvy = a.vy - b.vy;
  const impact = dvx * nx + dvy * ny;
  if (impact > 0) return;

  const mass = a.radius * a.radius;
  const massB = b.radius * b.radius;
  const impulse = (2 * impact) / (mass + massB);

  a.vx -= impulse * massB * nx;
  a.vy -= impulse * massB * ny;
  b.vx += impulse * mass * nx;
  b.vy += impulse * mass * ny;

  const minSpeed = 0.03;
  if (Math.hypot(a.vx, a.vy) < minSpeed) {
    const push = Math.random() * minSpeed * 0.8 + minSpeed * 0.2;
    a.vx += Math.cos(Math.random() * Math.PI * 2) * push;
    a.vy += Math.sin(Math.random() * Math.PI * 2) * push;
  }
  if (Math.hypot(b.vx, b.vy) < minSpeed) {
    const push = Math.random() * minSpeed * 0.8 + minSpeed * 0.2;
    b.vx += Math.cos(Math.random() * Math.PI * 2) * push;
    b.vy += Math.sin(Math.random() * Math.PI * 2) * push;
  }

  a.collideTimer = 10;
  b.collideTimer = 10;
}

function updateLava(timestamp) {
  if (!lavaState.lastTime) lavaState.lastTime = timestamp;
  const delta = Math.min(timestamp - lavaState.lastTime, 50);
  lavaState.lastTime = timestamp;

  lavaState.balls.forEach((ball) => {
    ball.x += ball.vx * delta;
    ball.y += ball.vy * delta;

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
      ball.collideTimer = 4;
    }
    if (ball.x + ball.radius > lavaState.width) {
      ball.x = lavaState.width - ball.radius;
      ball.vx = -Math.abs(ball.vx);
      ball.collideTimer = 4;
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
      ball.collideTimer = 4;
    }
    if (ball.y + ball.radius > lavaState.height) {
      ball.y = lavaState.height - ball.radius;
      ball.vy = -Math.abs(ball.vy);
      ball.collideTimer = 4;
    }
  });

  for (let i = 0; i < lavaState.balls.length; i += 1) {
    for (let j = i + 1; j < lavaState.balls.length; j += 1) {
      resolveBallCollision(lavaState.balls[i], lavaState.balls[j]);
    }
  }

  lavaState.balls.forEach((ball) => {
    const speedMag = Math.hypot(ball.vx, ball.vy);
    if (speedMag < 0.01) {
      const angle = Math.random() * Math.PI * 2;
      ball.vx += Math.cos(angle) * 0.02;
      ball.vy += Math.sin(angle) * 0.02;
    }

    const scale = ball.collideTimer > 0 ? 1.08 : 1;
    const transform = `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0) scale(${scale})`;
    ball.el.style.transform = transform;

    if (ball.collideTimer > 0) {
      ball.el.classList.add('collide');
      ball.collideTimer -= 1;
    } else {
      ball.el.classList.remove('collide');
    }
  });

  requestAnimationFrame(updateLava);
}

window.addEventListener('resize', () => {
  updateBounds();
});

initLavaBalls();
updateBounds();
requestAnimationFrame(updateLava);
