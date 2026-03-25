/* ============================================================
   Jobidy — Coming Soon  ·  main.js
   BlueOwl © 2026
============================================================ */

/* ────────────────────────────────────────
   CONFIG
──────────────────────────────────────── */

const LAUNCH_DATE  = new Date('2026-10-01T00:00:00Z');
const MAX_PARTICLES = 55;

/* ────────────────────────────────────────
   COUNTDOWN
──────────────────────────────────────── */

const daysEl    = document.getElementById('days');
const hoursEl   = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const diff = LAUNCH_DATE - Date.now();

    if (diff <= 0) {
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.textContent = '00');
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff /   60000) % 60);
    const s = Math.floor((diff /    1000) % 60);

    daysEl.textContent    = String(d).padStart(2, '0');
    hoursEl.textContent   = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ────────────────────────────────────────
   PARTICLES
──────────────────────────────────────── */

const particleContainer = document.querySelector('.particles');

function createParticle() {
    if (particleContainer.children.length >= MAX_PARTICLES) return;

    const p    = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 5 + 3;
    p.style.width            = `${size}px`;
    p.style.height           = `${size}px`;
    p.style.left             = `${Math.random() * 100}vw`;
    p.style.animationDuration = `${12 + Math.random() * 10}s`;
    p.style.animationDelay   = `${Math.random() * -14}s`;
    p.style.setProperty('--drift', `${Math.random() * 80 - 40}px`);

    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 24000);
}

for (let i = 0; i < 35; i++) createParticle();
setInterval(createParticle, 900);

/* ────────────────────────────────────────
   OWL EYE TRACKING  (nav logo)
──────────────────────────────────────── */

const owl    = document.getElementById('owl');
const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    if (!owl) return;
    const rect  = owl.getBoundingClientRect();
    const dx    = e.clientX - (rect.left + rect.width  / 2);
    const dy    = e.clientY - (rect.top  + rect.height / 2);
    const dist  = Math.min(5, Math.hypot(dx, dy) / 45);
    const angle = Math.atan2(dy, dx);

    pupils.forEach(p => {
        p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    });
});

/* ────────────────────────────────────────
   EMAIL WAITLIST FORM
──────────────────────────────────────── */

const form       = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const successMsg = document.getElementById('formSuccess');
const submitBtn  = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    /* Loading state */
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
        const body = new FormData();
        body.append('email', email);

        const res  = await fetch('submit.php', { method: 'POST', body });
        const data = await res.json();

        if (data.success) {
            form.style.display = 'none';
            successMsg.classList.remove('hidden');
        } else {
            throw new Error(data.message || 'Something went wrong.');
        }
    } catch (err) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Get Early Access';
        alert(err.message || 'Could not sign up. Please try again.');
    }
});
