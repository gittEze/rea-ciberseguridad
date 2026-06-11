/* =====================================================
   REA CIBERSEGURIDAD - APP.JS
   8.º Grado | Uruguay
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/* =====================================================
   INICIALIZACIÓN GENERAL
===================================================== */

function initializeApp() {

    updateProgress();
    setupPasswordChecker();
    setupQuiz();
    setupAccordion();
    setupDragAndDrop();
    setupSectionTracking();
    loadSavedProgress();
    createParticles();
    setupScrollAnimations();
    setupAchievements();
    setupMatchingGame();
    setupAnagramGame();
    setupSentenceGame();

}

function setupAnagramGame(){

    const words = [

        "WEB",
        "VIRUS",
        "DATOS",
        "CLAVE",
        "CORREO",
        "PHISHING",
        "CONTRASEÑA",
        "CIBERSEGURIDAD"

    ];

    let current = 0;

    const lettersContainer =
        document.getElementById(
            "anagramLetters"
        );

    const slotsContainer =
        document.getElementById(
            "anagramSlots"
        );

    const result =
        document.getElementById(
            "anagramResult"
        );

    const progress =
        document.getElementById(
            "anagramProgress"
        );

    const button =
        document.getElementById(
            "checkAnagram"
        );

    if(
        !lettersContainer ||
        !slotsContainer ||
        !button
    ) return;

    loadWord();

    function loadWord(){

        lettersContainer.innerHTML = "";
        slotsContainer.innerHTML = "";
        result.innerHTML = "";

        const word =
            words[current];

        progress.textContent =
            `Palabra ${current+1} de ${words.length}`;

        const shuffled =
            [...word]
            .sort(() => Math.random() - 0.5);

        shuffled.forEach(letter => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "letter";

            div.draggable = true;

            div.textContent =
                letter;

            div.addEventListener(
                "dragstart",
                () => {

                    div.classList.add(
                        "dragging"
                    );

                }
            );

            div.addEventListener(
                "dragend",
                () => {

                    div.classList.remove(
                        "dragging"
                    );

                }
            );

            lettersContainer.appendChild(
                div
            );

        });

        [...word].forEach(() => {

            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "slot";

            slot.addEventListener(
                "dragover",
                e => e.preventDefault()
            );

            slot.addEventListener(
                "drop",
                () => {

                    const dragged =
                        document.querySelector(
                            ".dragging"
                        );

                    if(
                        dragged &&
                        !slot.textContent
                    ){

                        slot.textContent =
                            dragged.textContent;

                        slot.classList.add(
                            "filled"
                        );

                        dragged.remove();

                    }

                }
            );

            slotsContainer.appendChild(
                slot
            );

        });

    }

    button.addEventListener(
        "click",
        () => {

            const answer =
                [...document.querySelectorAll(".slot")]
                .map(
                    slot =>
                    slot.textContent
                )
                .join("");

            if(
                answer ===
                words[current]
            ){

                result.innerHTML =
                    "✅ Correcto";

                current++;

                if(
                    current >=
                    words.length
                ){

                    result.innerHTML =
                    "🏆 ¡Has completado todos los anagramas!";

                    unlockAchievement(
                        "anagram-master",
                        "Maestro del Phishing"
                    );

                    return;
                }

                setTimeout(
                    loadWord,
                    1200
                );

            } else {

            result.innerHTML =
                "❌ Incorrecto. Intenta nuevamente.";

            const letters = [];

            document
                .querySelectorAll(".slot")
                .forEach(slot => {

                    if (slot.textContent) {

                        letters.push(
                            slot.textContent
                        );

                    }

                    slot.textContent = "";

                    slot.classList.remove(
                        "filled"
                    );

                });

            lettersContainer.innerHTML = "";

            letters
                .sort(() => Math.random() - 0.5)
                .forEach(letter => {

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "letter";

                    div.draggable = true;

                    div.textContent =
                        letter;

                    div.addEventListener(
                        "dragstart",
                        () => {

                            div.classList.add(
                                "dragging"
                            );

                        }
                    );

                    div.addEventListener(
                        "dragend",
                        () => {

                            div.classList.remove(
                                "dragging"
                            );

                        }
                    );

                    lettersContainer.appendChild(
                        div
                    );

                });

            }

        }
    );

}

/* =====================================================
   PROGRESO GENERAL
===================================================== */

let completedSections = new Set();

function updateProgress() {

    const totalSections = document.querySelectorAll("main section").length;

    const completed = completedSections.size;

    const percentage = Math.round(
        (completed / totalSections) * 100
    );

    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");

    if (fill) {
        fill.style.width = `${percentage}%`;
    }

    if (text) {
        text.textContent = `${percentage}% completado`;
    }

    localStorage.setItem(
        "cybersecurityProgress",
        JSON.stringify([...completedSections])
    );

}

/* =====================================================
   DETECCIÓN DE SECCIONES VISITADAS
===================================================== */

function setupSectionTracking() {

    const sections = document.querySelectorAll("main section");

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    completedSections.add(
                        entry.target.id
                    );

                    updateProgress();

                }

            });

        },

        {
            threshold: 0.4
        }

    );

    sections.forEach(section => {

        observer.observe(section);

    });

}

/* =====================================================
   CARGAR PROGRESO GUARDADO
===================================================== */

function loadSavedProgress() {

    const saved = localStorage.getItem(
        "cybersecurityProgress"
    );

    if (!saved) return;

    try {

        completedSections = new Set(
            JSON.parse(saved)
        );

        updateProgress();

    } catch (error) {

        console.error(error);

    }

}

/* =====================================================
   EVALUADOR DE CONTRASEÑAS
===================================================== */

function setupPasswordChecker() {

    const btn = document.getElementById(
        "checkPassword"
    );

    const input = document.getElementById(
        "passwordInput"
    );

    const result = document.getElementById(
        "passwordResult"
    );

    if (!btn || !input || !result) return;

    btn.addEventListener("click", () => {

        const password = input.value.trim();

        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let message = "";
        let className = "";

        if (score <= 2) {

            message =
                "🔴 Contraseña débil. Necesita mejoras.";

            className = "weak";

        } else if (score <= 4) {

            message =
                "🟡 Contraseña aceptable.";

            className = "medium";

        } else {

            message =
                "🟢 Contraseña fuerte y segura.";

            className = "strong";

        }

        result.textContent = message;
        result.className = className;

        unlockAchievement(
            "password-master",
            "Experto en Contraseñas"
        );

    });

}

function setupSentenceGame(){

const challenges = [

    {
        sentence:
        "Un _____ puede infectar archivos y propagarse entre dispositivos.",
        answer:"VIRUS",
        options:[
            "VIRUS",
            "NAVEGADOR",
            "PANTALLA",
            "CARPETA"
        ]
    },

    {
        sentence:
        "El _____ es un término general para cualquier software malicioso.",
        answer:"MALWARE",
        options:[
            "MALWARE",
            "TECLADO",
            "INTERNET",
            "VIDEO"
        ]
    },

    {
        sentence:
        "El _____ recopila información del usuario sin su consentimiento.",
        answer:"SPYWARE",
        options:[
            "SPYWARE",
            "CORREO",
            "ANTIVIRUS",
            "USUARIO"
        ]
    },

    {
        sentence:
        "El _____ bloquea archivos y solicita un rescate para recuperarlos.",
        answer:"RANSOMWARE",
        options:[
            "RANSOMWARE",
            "BUSCADOR",
            "DESCARGA",
            "ARCHIVO"
        ]
    },

    {
        sentence:
        "El _____ intenta engañar a las personas para robar sus datos.",
        answer:"PHISHING",
        options:[
            "PHISHING",
            "NUBE",
            "PAGINA",
            "CHAT"
        ]
    },

    {
        sentence:
        "Un _____ ayuda a detectar y eliminar amenazas digitales.",
        answer:"ANTIVIRUS",
        options:[
            "ANTIVIRUS",
            "IMPRESORA",
            "MONITOR",
            "CABLE"
        ]
    }

];

    let current = 0;

    const sentenceText =
        document.getElementById(
            "sentenceText"
        );

    const wordBank =
        document.getElementById(
            "wordBank"
        );

    const result =
        document.getElementById(
            "sentenceResult"
        );

    const progress =
        document.getElementById(
            "sentenceProgress"
        );

    const checkButton =
        document.getElementById(
            "checkSentence"
        );

    if(
        !sentenceText ||
        !wordBank ||
        !checkButton
    ) return;

    loadChallenge();

    function loadChallenge(){

        result.innerHTML="";

        const challenge =
            challenges[current];

        progress.textContent =
            `Frase ${current+1} de ${challenges.length}`;

        sentenceText.innerHTML =
            challenge.sentence.replace(
                "_____",
                '<span class="blank"></span>'
            );

        const blank =
            document.querySelector(
                ".blank"
            );

        blank.addEventListener(
            "dragover",
            e => e.preventDefault()
        );

        blank.addEventListener(
            "drop",
            () => {

                const dragged =
                    document.querySelector(
                        ".dragging"
                    );

                if(
                    dragged &&
                    !blank.textContent
                ){

                    blank.textContent =
                        dragged.textContent;

                    blank.classList.add(
                        "filled"
                    );

                    dragged.remove();

                }

            }
        );

        const options = [...challenge.options];

        wordBank.innerHTML="";

        options.sort(
                () =>
                Math.random() - 0.5
            )
            .forEach(word => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "word-card";

                card.textContent =
                    word;

                card.draggable =
                    true;

                card.addEventListener(
                    "dragstart",
                    () => {

                        card.classList.add(
                            "dragging"
                        );

                    }
                );

                card.addEventListener(
                    "dragend",
                    () => {

                        card.classList.remove(
                            "dragging"
                        );

                    }
                );

                wordBank.appendChild(
                    card
                );

            });

    }

    checkButton.addEventListener(
        "click",
        () => {

            const blank =
                document.querySelector(
                    ".blank"
                );

            const value =
                blank.textContent.trim();

            const answer =
                challenges[current]
                .answer;

            if(
                value === answer
            ){

                result.innerHTML =
                "✅ ¡Correcto!";

                current++;

                if(
                    current >=
                    challenges.length
                ){

                    result.innerHTML =
                    "🏆 ¡Has completado todas las amenazas digitales!";

                    unlockAchievement(
                        "threat-master",
                        "Experto en Amenazas"
                    );

                    return;
                }

                setTimeout(
                    loadChallenge,
                    1200
                );

            }else{

                result.innerHTML =
                "❌ Incorrecto. Intenta nuevamente.";

                setTimeout(() => {

                    loadChallenge();

                }, 1000);
            }

        }
    );

}

/* =====================================================
   QUIZ FINAL
===================================================== */

function setupQuiz() {

    const form = document.getElementById(
        "quizForm"
    );

    const result = document.getElementById(
        "quizResult"
    );

    if (!form || !result) return;

    form.addEventListener("submit", event => {

    event.preventDefault();

    let score = 0;

    // Respuestas correctas actualizadas según el nuevo quiz
    const answers = {
        q1: "b",
        q2: "a",
        q3: "b",
        q4: "c"
    };

    Object.keys(answers).forEach(question => {

        const selected = document.querySelector(
            `input[name="${question}"]:checked`
        );

        if (selected && selected.value === answers[question]) {
            score++;
        }

    });

    const total = Object.keys(answers).length;

    const percentage = Math.round((score / total) * 100);

    let feedback = "";

    if (percentage >= 80) {

        feedback = `🏆 ¡Excelente! ${score}/${total} respuestas correctas. Demostraste un gran dominio sobre ciberseguridad.`;

        unlockAchievement(
            "cyber-expert",
            "Experto en Ciberseguridad"
        );

    } else if (percentage >= 50) {

        feedback = `👍 ¡Buen trabajo! ${score}/${total} respuestas correctas. Vas por buen camino, sigue practicando.`;

    } else {

        feedback = `📚 Sigue aprendiendo. ${score}/${total} respuestas correctas. Revisa los conceptos de ciberseguridad e intenta nuevamente.`;

    }

    result.innerHTML = feedback;

});

}

/* =====================================================
   GLOSARIO ACORDEÓN
===================================================== */

function setupAccordion() {

    const headers = document.querySelectorAll(
        ".accordion-header"
    );

    headers.forEach(header => {

        header.addEventListener("click", () => {

            const content =
                header.nextElementSibling;

            header.classList.toggle("active");

            if (
                content.style.maxHeight
            ) {

                content.style.maxHeight = null;

            } else {

                content.style.maxHeight =
                    content.scrollHeight + "px";

            }

        });

    });

}

/* =====================================================
   DRAG & DROP EDUCATIVO
===================================================== */

function setupDragAndDrop() {

    const draggables =
        document.querySelectorAll(
            ".draggable"
        );

    const dropzones =
        document.querySelectorAll(
            ".dropzone"
        );

    draggables.forEach(item => {

        item.setAttribute(
            "draggable",
            "true"
        );

        item.addEventListener(
            "dragstart",
            e => {

                e.dataTransfer.setData(
                    "text/plain",
                    item.textContent
                );

                item.classList.add(
                    "dragging"
                );

            }
        );

        item.addEventListener(
            "dragend",
            () => {

                item.classList.remove(
                    "dragging"
                );

            }
        );

    });

    dropzones.forEach(zone => {

        zone.addEventListener(
            "dragover",
            e => {

                e.preventDefault();

            }
        );

        zone.addEventListener(
            "drop",
            e => {

                e.preventDefault();

                const text =
                    e.dataTransfer.getData(
                        "text/plain"
                    );

                const element = [
                    ...draggables
                ].find(
                    item =>
                        item.textContent === text
                );

                if (element) {

                    zone.appendChild(
                        element
                    );

                }

                checkActivityCompleted();

            }
        );

    });

}

function checkActivityCompleted() {

    const safeZone =
        document.querySelectorAll(
            ".dropzone"
        )[0];

    const riskZone =
        document.querySelectorAll(
            ".dropzone"
        )[1];

    if (
        safeZone.children.length +
        riskZone.children.length >=
        4
    ) {

        unlockAchievement(
            "activity-completed",
            "Actividad Finalizada"
        );

    }

}

/* =====================================================
   ANIMACIONES DE SCROLL
===================================================== */

function setupScrollAnimations() {

    const cards =
        document.querySelectorAll(
            ".card"
        );

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show"
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );

    cards.forEach(card => {

        observer.observe(card);

    });

}

/* =====================================================
   SISTEMA DE LOGROS
===================================================== */

const achievements = new Set();

function setupAchievements() {

    const saved =
        localStorage.getItem(
            "cyberAchievements"
        );

    if (!saved) return;

    JSON.parse(saved).forEach(item => {

        achievements.add(item);

    });

}

function unlockAchievement(id, title) {

    if (achievements.has(id)) return;

    achievements.add(id);

    localStorage.setItem(
        "cyberAchievements",
        JSON.stringify(
            [...achievements]
        )
    );

    showNotification(
        `🏅 Logro desbloqueado: ${title}`
    );

}

/* =====================================================
   NOTIFICACIONES
===================================================== */

function showNotification(message) {

    const notification =
        document.createElement("div");

    notification.className =
        "achievement-toast";

    notification.innerHTML = message;

    document.body.appendChild(
        notification
    );

    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 100);

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

        setTimeout(() => {

            notification.remove();

        }, 500);

    }, 4000);

}

/* =====================================================
   PARTÍCULAS DE FONDO
===================================================== */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );

    if (!container) return;

    const amount = 40;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.classList.add(
            "particle"
        );

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.animationDuration =
            10 +
            Math.random() * 15 +
            "s";

        particle.style.animationDelay =
            Math.random() * 10 +
            "s";

        particle.style.opacity =
            Math.random();

        container.appendChild(
            particle
        );

    }

}

/* =====================================================
   ATAJOS DE TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "ArrowUp"
        ) {

            window.scrollTo({

                top: 0,
                behavior: "smooth"

            });

        }

    }
);

/* =====================================================
   MENSAJE DE BIENVENIDA
===================================================== */

setTimeout(() => {

    showNotification(
        "👋 Bienvenido al REA de Ciberseguridad"
    );

}, 1200);

/* =====================================================
   ESTADÍSTICAS DEL ESTUDIANTE
===================================================== */

function getStudentStats() {

    return {

        progreso:
            completedSections.size,

        logros:
            achievements.size

    };

}

function setupMatchingGame(){

    const draggables =
        document.querySelectorAll(
            ".draggable-match"
        );

    const zones =
        document.querySelectorAll(
            ".match-zone"
        );

    const result =
        document.getElementById(
            "matchingResult"
        );

    let correct = 0;

    draggables.forEach(item=>{

        item.addEventListener(
            "dragstart",
            ()=>{

                item.classList.add(
                    "dragging"
                );

            }
        );

        item.addEventListener(
            "dragend",
            ()=>{

                item.classList.remove(
                    "dragging"
                );

            }
        );

    });

    zones.forEach(zone=>{

        zone.addEventListener(
            "dragover",
            e=>e.preventDefault()
        );

        zone.addEventListener(
            "drop",
            e=>{

                e.preventDefault();

                const dragged =
                    document.querySelector(
                        ".dragging"
                    );

                if(!dragged) return;

                const draggedId =
                    dragged.dataset.match;

                const zoneId =
                    zone.dataset.match;

                if(draggedId===zoneId){

                    zone.appendChild(
                        dragged
                    );

                    zone.classList.add(
                        "correct"
                    );

                    correct++;

                    if(correct===5){

                        result.innerHTML =
                        "🏆 ¡Excelente! Has completado el desafío.";

                        unlockAchievement(
                            "cyberbullying-game",
                            "Experto en Ciberacoso"
                        );

                    }

                }

            }
        );

    });

}

window.getStudentStats =
    getStudentStats;

/* =====================================================
   FIN DEL APP.JS
===================================================== */