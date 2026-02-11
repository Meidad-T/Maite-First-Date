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

        let delta = 150; // Constant speed
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
        // Animate "Leaving" the top section
        initialContent.style.transform = "translate(-50%, -150%)"; // Move up out of view
        initialContent.style.opacity = "0";

        // Show surprise content appearing from bottom
        surpriseContent.classList.remove('hidden');
        surpriseContent.style.display = 'flex'; // Ensure flex layout
        surpriseContent.style.opacity = "0";
        surpriseContent.style.top = "150%"; // Start below

        // Slight delay to allow display:flex to apply
        requestAnimationFrame(() => {
            // Use timeout to ensure CSS transition catches
            setTimeout(() => {
                surpriseContent.style.transition = "all 1s ease";
                surpriseContent.style.top = "50%"; // Move to center
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
            // Force reflow
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
            // Success - just show the letter (it's hardcoded in HTML now)
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
};
