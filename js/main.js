/* =========================
   CONFIG
========================= */

const LAUNCH_DATE = new Date('2026-02-01T00:00:00Z');
const MAX_PARTICLES = 60;

/* =========================
   COUNTDOWN
========================= */

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date();
    const diff = LAUNCH_DATE - now;

    if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent =
        minutesEl.textContent = secondsEl.textContent = '00';
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================
   PARTICLES
========================= */

const particleContainer = document.querySelector('.particles');

function createParticle() {
    if (particleContainer.children.length >= MAX_PARTICLES) return;

    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 6 + 4;
    p.style.width = p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.animationDuration = `${10 + Math.random() * 10}s`;
    p.style.setProperty('--drift', `${Math.random() * 80 - 40}px`);

    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 22000);
}

for (let i = 0; i < 40; i++) createParticle();
setInterval(createParticle, 800);

/* =========================
   FIREWORK BURST + SCORE
========================= */

let score = 0;
const scoreEl = document.querySelector('.score');

document.addEventListener('click', (e) => {
    let hits = 0;

    document.querySelectorAll('.particle').forEach(p => {
        const rect = p.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;

        if (Math.hypot(dx, dy) < 140) {
            p.style.left = `${rect.left}px`;
            p.style.top = `${rect.top}px`;
            p.style.animation = 'none';

            const angle = Math.atan2(dy, dx);
            const power = 120 + Math.random() * 80;

            p.style.setProperty('--bx', `${Math.cos(angle) * power}px`);
            p.style.setProperty('--by', `${Math.sin(angle) * power}px`);
            p.classList.add('burst');

            hits++;
            setTimeout(() => p.remove(), 700);
        }
    });

    if (hits) {
        score += hits;
        scoreEl.textContent = `✨ Score: ${score}`;
        scoreEl.classList.add('pop');
        setTimeout(() => scoreEl.classList.remove('pop'), 200);
    }
});

// Animate progress text
        const progressText = document.querySelector('.progress-text');
        const percentages = ["18%", "21%", "24%", "36%", "39%", "42%", "45%"];
        let currentPercent = 0;
        
        setInterval(() => {
            progressText.textContent = `Website Progress: ${percentages[currentPercent]}`;
            currentPercent = (currentPercent + 1) % percentages.length;
        }, 2000);

/* =========================
   OWL EYE TRACKING
========================= */

const owl = document.getElementById('owl');
const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    const rect = owl.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    const distance = Math.min(6, Math.hypot(dx, dy) / 40);
    const angle = Math.atan2(dy, dx);

    pupils.forEach(p =>
        p.style.transform =
            `translate(${Math.cos(angle) * distance}px,
                       ${Math.sin(angle) * distance}px)`
    );
});
