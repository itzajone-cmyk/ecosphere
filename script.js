import { GoogleGenerativeAI } from "@google/generative-ai";

// === CONFIGURACIÓN ===
const API_KEY = "AIzaSyCh4FzSPH8MjVLlXlrFkZcqmoqUASksvcA"; // ⚠️ PON TU LLAVE AQUÍ
const genAI = new GoogleGenerativeAI(API_KEY);

// === CONFIGURACIÓN DE ARENAS (Copas necesarias) ===
const ARENA_THRESHOLDS = [
    { trophies: 0, name: "Arena 1", theme: "theme-arena1" }, // Tierra Amanecer
    { trophies: 100, name: "Arena 2", theme: "theme-arena2" }, // Atardecer
    { trophies: 250, name: "Arena 3", theme: "theme-arena3" }, // Noche
    { trophies: 500, name: "Arena 4", theme: "theme-arena4" }, // Infierno
    { trophies: 1000, name: "Arena 5", theme: "theme-arena5" } // Cielo Divino
];

// === ESTADO DEL JUEGO ===
let gameState = {
    trophies: 0,
    totalCrowns: 0,
    currentArena: ARENA_THRESHOLDS[0], // Empezamos en Arena 1
    currentQuestionNumber: 1,
    correctAnswersInMatch: 0,
    currentSubject: ""
};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    // Asegurar que la arena inicial es correcta según las copas cargadas
    updateArenaProgression(false); 
    updateUISync();
});

// === FUNCIONES DE UI Y ARENAS ===

function updateUISync() {
    // Actualizar textos
    document.getElementById('trophies').innerText = gameState.trophies;
    document.getElementById('total-crowns').innerText = gameState.totalCrowns;
    document.getElementById('rank-text').innerText = gameState.currentArena.name;

    // Actualizar CLASE DEL BODY para cambiar el CSS
    document.body.className = ''; // Limpiar clases antiguas
    document.body.classList.add(gameState.currentArena.theme);
}

function updateArenaProgression(showAlert = true) {
    let highestArena = ARENA_THRESHOLDS[0];
    
    // Buscar la arena más alta alcanzada
    for (let i = ARENA_THRESHOLDS.length - 1; i >= 0; i--) {
        if (gameState.trophies >= ARENA_THRESHOLDS[i].trophies) {
            highestArena = ARENA_THRESHOLDS[i];
            break;
        }
    }

    // Si hubo cambio de arena
    if (highestArena.theme !== gameState.currentArena.theme) {
        gameState.currentArena = highestArena;
        if (showAlert) {
            alert(`¡INCREÍBLE! Has avanzado a la ${highestArena.name}. El campo de batalla ha cambiado.`);
        }
        saveProgress();
    }
}

// === LÓGICA DE BATALLA ===

window.startBattle = async function() {
    gameState.currentSubject = document.getElementById('subject-select').value;
    gameState.currentQuestionNumber = 1;
    gameState.correctAnswersInMatch = 0;

    showScreen('battle-screen');
    await fetchQuestionFromGemini();
}

async function fetchQuestionFromGemini() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prompt optimizado con contexto de la Arena actual
    const prompt = `Actúa como el Guardián de la materia ${gameState.currentSubject} en un juego de fantasía.
    Dificultad basada en: ${gameState.currentArena.name}.
    Genera una pregunta de opción múltiple.
    Responde ÚNICAMENTE con un objeto JSON plano, sin formato markdown, con esta estructura:
    {"p": "¿pregunta?", "o": ["opción A", "opción B", "opción C"], "c": 0, "m": "frase corta de guardián temática de la arena"}`;

    try {
        document.getElementById('question-text').innerText = "Invocando sabiduría ancestral...";
        document.getElementById('options-container').innerHTML = "";

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Limpiar formato markdown si Gemini lo añade
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanJson);
        
        renderQuestion(data);
    } catch (error) {
        console.error("Error Gemini:", error);
        document.getElementById('question-text').innerText = "La conexión espiritual se ha perdido. Reintentando...";
        setTimeout(fetchQuestionFromGemini, 2000);
    }
}

function renderQuestion(data) {
    document.getElementById('ia-dialogue').innerText = data.m;
    document.getElementById('question-text').innerText = data.p;
    document.getElementById('question-count').innerText = `Pregunta ${gameState.currentQuestionNumber} de 10`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    data.o.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => handleAnswer(index === data.c);
        container.appendChild(btn);
    });
}

async function handleAnswer(isCorrect) {
    if (isCorrect) {
        gameState.correctAnswersInMatch++;
    }

    if (gameState.currentQuestionNumber < 10) {
        gameState.currentQuestionNumber++;
        await fetchQuestionFromGemini();
    } else {
        endMatch();
    }
}

// === FINALIZACIÓN Y SISTEMA DE COPAS/CORONAS ===

function endMatch() {
    let earnedCrowns = 0;
    let earnedTrophies = 0;
    const score = gameState.correctAnswersInMatch;

    // Lógica basada en porcentaje de aciertos
    if (score >= 9) { // 90-100%
        earnedCrowns = 3;
        earnedTrophies = 30;
    } else if (score >= 7) { // 70-89%
        earnedCrowns = 2;
        earnedTrophies = 20;
    } else if (score >= 5) { // 50-69%
        earnedCrowns = 1;
        earnedTrophies = 10;
    } else { // Menos del 50%
        earnedCrowns = 0;
        earnedTrophies = -15; // Se pierden copas
    }

    // Actualizar estado global
    gameState.trophies += earnedTrophies;
    if (gameState.trophies < 0) gameState.trophies = 0; // No copas negativas
    
    gameState.totalCrowns += earnedCrowns;

    // Verificar progreso de arena ANTES de recargar
    updateArenaProgression(true);
    saveProgress();
    
    alert(`FIN DE LA PARTIDA\n\nAciertos: ${score}/10\nCoronas: ${earnedCrowns} 👑\nCopas: ${earnedTrophies} 🏆`);
    
    // Regresar a inicio y sincronizar UI
    showScreen('setup-screen');
    updateUISync();
}

// === UTILIDADES ===

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
    document.getElementById(screenId).classList.add('show');
}

function saveProgress() {
    localStorage.setItem('clashKnowledgeRealmsSave', JSON.stringify(gameState));
}

function loadProgress() {
    const saved = localStorage.getItem('clashKnowledgeRealmsSave');
    if (saved) {
        gameState = {...gameState, ...JSON.parse(saved)};
    }
}
