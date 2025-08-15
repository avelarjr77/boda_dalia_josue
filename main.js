document.addEventListener('DOMContentLoaded', () => {

    window.scrollTo(0, 0);

logAfterOneMillisecond();

    // Animación extra: efecto de resplandor en el título al pasar el mouse
    const header = document.querySelector('header h1');
    if (header) {
        header.addEventListener('mouseenter', () => {
            header.style.textShadow = '0 0 16px #e7bfa7, 0 0 8px #a786df';
        });
        header.addEventListener('mouseleave', () => {
            header.style.textShadow = '';
        });
    }

    // Temporizador de cuenta regresiva
    // Fecha objetivo: 17 de agosto del año actual
    const now = new Date();
    const year = now.getFullYear();
    const targetDate = new Date(year, 7, 17, 9, 30, 0); // 17 de agosto a las 9:30 (Mes 7 = agosto, 0-indexado)
    // const targetDate = new Date(year, 7, 13, 14, 27, 0); // 13 de agosto de este año a las 15:27 (3:27 pm)
    // Si la fecha ya pasó este año, usar el próximo año
    if (now > targetDate) {
        // Si la fecha ya pasó, dejar la cuenta regresiva en cero y no avanzar al próximo año
        targetDate.setTime(now.getTime());
    }

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            // Lanzar confeti de corazones una sola vez cuando termine la cuenta
            if (!window.__heartsEndCelebrated) {
                window.__heartsEndCelebrated = true;
                launchHearts({ count: 120, colors: ['#e63946', '#870925', '#ff7a90', '#f1a7b5'], durationRange: [6, 10] });
            }
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Pequeño saludo de corazones al cargar
    setTimeout(() => {
        launchHearts({ count: 40, colors: ['#e63946', '#870925', '#ff7a90', '#f1a7b5'], durationRange: [5, 8] });
    }, 400);

    // Iniciar confeti de corazones permanente
    startContinuousHearts();

    // Microinteracciones adicionales sin cambiar diseño
    initButtonRipple();
    initHeaderParallaxTilt();

    // Pausar/resumir el confeti cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (window.__heartsIntervalId) {
                clearInterval(window.__heartsIntervalId);
                window.__heartsIntervalId = null;
            }
        } else {
            startContinuousHearts();
        }
    });

    // IntersectionObserver para animaciones fade-in al hacer scroll
    try {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-in').forEach(el => {
            // Si ya está en viewport al cargar, marcar visible inmediatamente
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
                el.classList.add('visible');
            } else {
                observer.observe(el);
            }
        });
    } catch (e) {
        console.warn('IntersectionObserver no disponible o falló:', e);
        // Fallback: mostrar todo
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
});



function playAudioOnce() {
    const audio = document.getElementById("wedding-audio");
    if (audio) {
        audio.play().then(() => {
            console.log("Audio reproducido correctamente.");
        }).catch((err) => {
            console.warn("Fallo al reproducir audio:", err);
        });
    }
    document.removeEventListener('click', playAudioOnce);
}

function logAfterOneMillisecond() {
    setTimeout(() => {
        console.log('Ha pasado un milisegundo desde que se abrió o recargó la página.');
        document.addEventListener('click', playAudioOnce);
    }, 1);
}

// ==========================
// Confeti de corazones
// ==========================
function launchHearts(options = {}) {
    const {
        count = 60,
        colors = ['#e63946', '#870925', '#ff7a90', '#f1a7b5'],
        minSize = 14,
        maxSize = 28,
        durationRange = [6, 9], // segundos
        spawnArea = { left: 0, right: 100 } // en vw
    } = options;

    const container = document.getElementById('heart-confetti-container');
    if (!container) return;

    const rand = (a, b) => Math.random() * (b - a) + a;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-confetti';
        const inner = document.createElement('span');
        inner.className = 'heart-inner';
        inner.textContent = '❤';

        const size = rand(minSize, maxSize);
        const left = rand(spawnArea.left, spawnArea.right); // vw
        const delay = rand(0, 1.2); // s
        const duration = rand(durationRange[0], durationRange[1]); // s
        const opacity = rand(0.7, 1);

        heart.style.left = left + 'vw';
        heart.style.setProperty('--fall', duration + 's');
        heart.style.animationDelay = delay + 's';
        heart.style.opacity = String(opacity);

        inner.style.fontSize = size + 'px';
        inner.style.color = pick(colors);
        inner.style.setProperty('--spin', rand(2.2, 4.2) + 's');

        heart.appendChild(inner);
        container.appendChild(heart);

        const cleanup = () => {
            heart.removeEventListener('animationend', cleanup);
            heart.remove();
        };
        heart.addEventListener('animationend', cleanup);
    }
}

// Spawner continuo de corazones
function startContinuousHearts(options = {}) {
    // Evitar múltiples intervalos activos
    if (window.__heartsIntervalId) return;

    const {
        tickMs = 900,          // cada cuánto cae un grupo
        countPerTick = 10,     // cuántos corazones por grupo
        colors = ['#e63946', '#870925', '#ff7a90', '#f1a7b5'],
        durationRange = [6, 10]
    } = options;

    window.__heartsIntervalId = setInterval(() => {
        // Si la pestaña está oculta, no generamos para ahorrar recursos
        if (document.hidden) return;
        launchHearts({ count: countPerTick, colors, durationRange, spawnArea: { left: -5, right: 105 } });
    }, tickMs);
}

// ==========================
// Efecto ripple en botones
// ==========================
function initButtonRipple() {
    document.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.btn-outline');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}

// ======================================
// Parallax y tilt ligero en el header
// ======================================
function initHeaderParallaxTilt() {
    const header = document.querySelector('header');
    if (!header) return;

    // Parallax suave en scroll
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const offset = window.scrollY * 0.25; // factor de parallax
                header.style.backgroundPositionY = `calc(50% + ${offset}px)`;
                ticking = false;
            });
            ticking = true;
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Tilt muy sutil al mover el mouse
    let tiltRAF;
    header.addEventListener('mousemove', (ev) => {
        const rect = header.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (ev.clientX - cx) / rect.width;  // -0.5..0.5 aprox
        const dy = (ev.clientY - cy) / rect.height; // -0.5..0.5 aprox
        cancelAnimationFrame(tiltRAF);
        tiltRAF = requestAnimationFrame(() => {
            header.style.transform = `perspective(800px) rotateX(${(-dy * 3).toFixed(2)}deg) rotateY(${(dx * 3).toFixed(2)}deg)`;
        });
    });
    header.addEventListener('mouseleave', () => {
        header.style.transform = '';
    });
}

function playAudioOnce() {
    const audio = document.getElementById("wedding-audio");
    if (audio) {
        audio.play().then(() => {
            console.log("Audio reproducido correctamente.");
        }).catch((err) => {
            console.warn("Fallo al reproducir audio:", err);
        });
    }
    document.removeEventListener('click', playAudioOnce);
}

function logAfterOneMillisecond() {
    setTimeout(() => {
        console.log('Ha pasado un milisegundo desde que se abrió o recargó la página.');
        document.addEventListener('click', playAudioOnce);
    }, 1);
}