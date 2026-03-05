const API = 'http://localhost:5000/api';

function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.width = p.style.height = (3 + Math.random() * 4) + 'px';
    container.appendChild(p);
  }
}
