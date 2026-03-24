let trophies = 0;
let currentQuestion = 0;
let score = 0;

const questions = {
    fisica: [
        { q: "¿Cuál es la unidad de la fuerza?", a: ["Newton", "Joule", "Watt"], correct: 0 },
        // Añadir más aquí...
    ],
    // Resto de materias...
};

function startBattle() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const subject = document.getElementById('subject-select').value;
    const qData = questions[subject][currentQuestion % questions[subject].length];
    
    document.getElementById('question-text').innerText = qData.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    qData.a.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });
}

function checkAnswer(index) {
    const subject = document.getElementById('subject-select').value;
    if(index === questions[subject][currentQuestion % questions[subject].length].correct) {
        score++;
    }
    
    currentQuestion++;
    if(currentQuestion < 10) {
        loadQuestion();
        document.getElementById('question-count').innerText = `Pregunta: ${currentQuestion + 1}/10`;
    } else {
        endBattle();
    }
}

function endBattle() {
    let crowns = 0;
    let earnedTrophies = 0;

    if (score >= 9) { crowns = 3; earnedTrophies = 30; }
    else if (score >= 7) { crowns = 2; earnedTrophies = 20; }
    else if (score >= 5) { crowns = 1; earnedTrophies = 10; }
    else { crowns = 0; earnedTrophies = -15; }

    trophies += earnedTrophies;
    alert(`¡Fin! Coronas: ${crowns} | Copas: ${earnedTrophies}`);
    location.reload(); // Reinicia para la siguiente "arena"
}
