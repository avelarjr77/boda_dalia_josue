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
    // Si la fecha ya pasó este año, usar el próximo año
    if (now > targetDate) {
        targetDate.setFullYear(year + 1);
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