const words = ["Maite", "MaiMai", "Beautiful", "Maria", "Adorable"];
const dynamicNameElement = document.getElementById('dynamic-name');
const helloBtn = document.getElementById('hello-btn');
const initialContent = document.getElementById('initial-content');
const surpriseContent = document.getElementById('surprise-content');

// TypeWriter Implementation - Smooth
class TypeWriter {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick = this.tick.bind(this);
        requestAnimationFrame(this.tick);
    }

    tick() {
        let i = this.loopNum % this.toRotate.length;
        let fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = this.txt;

        let delta = 150;
        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => requestAnimationFrame(this.tick), delta);
    }
}

window.onload = function () {
    // Start Typewriter
    new TypeWriter(dynamicNameElement, words, 2000);

    // Show Hello Button after 1.2 seconds
    setTimeout(() => {
        helloBtn.classList.add('visible');
        helloBtn.classList.remove('hidden');
    }, 1200);

    // Interaction 1: Transitions ("Scroll Down" effect)
    helloBtn.addEventListener('click', () => {
        initialContent.style.transform = "translate(-50%, -150%)";
        initialContent.style.opacity = "0";

        surpriseContent.classList.remove('hidden');
        surpriseContent.style.display = 'flex';
        surpriseContent.style.opacity = "0";
        surpriseContent.style.top = "150%";

        requestAnimationFrame(() => {
            setTimeout(() => {
                surpriseContent.style.transition = "all 1s ease";
                surpriseContent.style.top = "50%";
                surpriseContent.style.opacity = "1";
            }, 50);
        });
    });

    // Interaction 2: Open Popup
    const openPopupBtn = document.getElementById('open-popup-btn');
    const securityPopup = document.getElementById('security-popup');

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', () => {
            securityPopup.classList.remove('hidden');
            void securityPopup.offsetWidth;
            securityPopup.classList.add('visible');
        });
    }

    // Interaction 3: Popup Flow
    const itsMeBtn = document.getElementById('its-me-btn');
    const step1 = document.getElementById('popup-step-1');
    const step2 = document.getElementById('popup-step-2');
    const answerInput = document.getElementById('security-answer');
    const submitBtn = document.getElementById('submit-answer-btn');
    const errorMsg = document.getElementById('error-msg');
    const attemptsSpan = document.getElementById('attempts-left');

    itsMeBtn.addEventListener('click', () => {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        answerInput.focus();
    });

    // Logic 4: Validation
    let attempts = 3;
    let validAnswers = ["beetlejuice", "beetlejuce", "beatlejuice", "beetlejuise"];

    submitBtn.addEventListener('click', validateAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAnswer();
    });

    function validateAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();

        if (validAnswers.includes(userAnswer)) {
            // Success
            document.getElementById('success-screen').classList.remove('hidden');
            securityPopup.classList.remove('visible');
        } else {
            // Fail
            attempts--;
            attemptsSpan.innerText = attempts;
            errorMsg.classList.remove('hidden');
            answerInput.classList.add('error');

            // Shake effect
            answerInput.style.transform = "translateX(10px)";
            setTimeout(() => answerInput.style.transform = "translateX(0)", 100);
            setTimeout(() => answerInput.style.transform = "translateX(-10px)", 200);
            setTimeout(() => answerInput.style.transform = "translateX(0)", 300);

            if (attempts <= 0) {
                alert("Self destruct initiated... (Just kidding, try again later!)");
                location.reload();
            }
        }
    }

    // Response Button Handlers
    const btnYes = document.getElementById('btn-yes');
    const btnAww = document.getElementById('btn-aww');
    const btnNo = document.getElementById('btn-no');

    // "See you then!" - Show celebration with confetti
    btnYes.addEventListener('click', () => {
        document.getElementById('success-screen').classList.add('hidden');
        document.getElementById('surprise-content').classList.add('hidden');
        const celebrationScreen = document.getElementById('celebration-screen');
        celebrationScreen.classList.remove('hidden');

        startConfetti();

        // Stop confetti after 3 seconds
        setTimeout(() => {
            stopConfetti();
        }, 3000);
    });

    // "Awwwww" - Float emoji
    btnAww.addEventListener('click', () => {
        createFloatingEmoji();
    });

    // "Nope" - Replace with disabled message
    btnNo.addEventListener('click', () => {
        btnNo.classList.add('disabled');
        btnNo.innerHTML = "That was not an option,<br>sorry about that!";
        btnNo.style.pointerEvents = 'none';
    });
};

// Confetti Animation
let confettiCanvas, confettiCtx, confettiParticles = [], confettiAnimationId;

function startConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#ff69b4', '#ff1493', '#a8c0ff', '#3f5efb', '#ffd700', '#ff6347'];

    // Create confetti particles
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 150,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0
        });
    }

    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = (Math.sin(p.tiltAngle - (index / 3))) * 15;

        if (p.y > confettiCanvas.height) {
            confettiParticles[index] = {
                ...p,
                x: Math.random() * confettiCanvas.width,
                y: -10
            };
        }

        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r / 2;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        confettiCtx.stroke();
    });

    confettiAnimationId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }
    confettiParticles = [];
}

// Floating Emoji Animation
function createFloatingEmoji() {
    const emojiContainer = document.getElementById('emoji-container');
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '🥺';

    // Random horizontal position
    const randomX = Math.random() * (window.innerWidth - 100) + 50;
    emoji.style.left = randomX + 'px';

    emojiContainer.appendChild(emoji);

    // Remove after animation completes
    setTimeout(() => {
        emoji.remove();
    }, 3000);
}
