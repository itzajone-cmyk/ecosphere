// --- ESTADO DEL JUEGO Y CONFIGURACIÓN ---
let game = {
    xp: 0,
    lvl: 1,
    streak: 0,
    isHealthy: false,
    musicPlaying: false
};

// Configuración de los 10 Rangos (Para que quieran subir de nivel)
const ranks = [
    {xp: 0, name: "Semilla Inerte", icon: "🌑"},
    {xp: 200, name: "Brote de Esperanza", icon: "🌱"},
    {xp: 500, name: "Raíz Maestra", icon: "🌿"},
    {xp: 900, name: "Tallo Guardián", icon: "🎍"},
    {xp: 1400, name: "Hoja Fotosintética", icon: "🍃"},
    {xp: 2000, name: "Arbusto Resiliente", icon: "🌳"},
    {xp: 2800, name: "Árbol Sabio", icon: "🌲"},
    {xp: 3800, name: "Bosque Ancestral", icon: "🏞️"},
    {xp: 5000, name: "Bioma Legendario", icon: "🌍"},
    {xp: 7000, name: "Guardián de Gaia", icon: "💎"}
];

// Emojis de Naturaleza Vivos para plantar
const vividEmojis = ["🌳", "🌴", "🌲", "🌱", "🌿", "🍀", "🌸", "🌻", "🦋", "🍄"];

// Referencias a elementos de la UI
const ui = {
    input: document.getElementById('task-input'),
    chat: document.getElementById('ai-chat-history'),
    xpFill: document.getElementById('xp-fill'),
    xpText: document.getElementById('xp-text'),
    rank: document.getElementById('rank-name'),
    coreVisual: document.getElementById('core-visual'),
    world: document.getElementById('world-view'),
    nature: document.getElementById('nature-container'),
    message: document.getElementById('env-msg'),
    bgMusic: document.getElementById('bg-music'),
    sfxSuccess: document.getElementById('sfx-success'),
    musicBtn: document.getElementById('music-toggle'),
    streak: document.getElementById('streak-counter')
};

// --- CONTROL DE MÚSICA Y AUDIO ---
// La música se activa en el primer click (regla del navegador)
function toggleMusic() {
    if (game.musicPlaying) {
        ui.bgMusic.pause();
        ui.musicBtn.innerText = "🎵 OFF";
    } else {
        ui.bgMusic.play().catch(()=> {
            console.log("Audio falló, interactúa primero.");
        });
        ui.musicBtn.innerText = "🎵 ON";
    }
    game.musicPlaying = !game.musicPlaying;
}

// --- ACCIÓN PRINCIPAL ADICTIVA: handleStudySubmission ---
function handleStudySubmission() {
    const text = ui.input.value.trim();
    
    // Feedback visual si está vacío
    if (!text) {
        showAIResponse("ADVERTENCIA: No se ha detectado tema de estudio. Energía vital cero.");
        triggerVisualError();
        return;
    }

    // Calcular XP (Simulado, basado en longitud, adictivo)
    const earnedXP = Math.min(Math.floor(text.length * 1.5), 100);
    
    // Inyectar XP y retroalimentación instantánea
    addXP(earnedXP);
    
    // Simulación de IA Maestra (Resuelve tu problema de aprendizaje)
    const aiHack = generateAIStudyHack(text);
    showAIResponse(text, aiHack, earnedXP);
    
    // Feedback sonoro y visual
    ui.sfxSuccess.play();
    ui.input.value = "";
    
    // Plantar visualmente la naturaleza (explosión adictiva)
    plantNature(earnedXP > 50 ? 3 : 1);
    
    // Iniciar racha (siempre adictivo)
    incrementStreak();
}

// --- GESTIÓN DE PUNTOS Y NIVELES (El bucle de adicción) ---
function addXP(amount) {
    game.xp += amount;
    
    // Subida de nivel visual (cada 250 xp de bachillerato)
    game.lvl = Math.floor(game.xp / 250) + 1;
    
    // Feedback visual de level up instantáneo
    ui.coreVisual.style.transform = "scale(1.2)";
    setTimeout(()=> ui.coreVisual.style.transform = "scale(1)", 300);
    
    updateUI();
}

// --- ACTUALIZACIÓN DE LA INTERFAZ (UI Modernizada - ¡Adiós Neón!) ---
function updateUI() {
    // 1. Encontrar el Rango Actual
    let rankIdx = 0;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (game.xp >= ranks[i].xp) {
            rankIdx = i;
            break;
        }
    }
    const currentRank = ranks[rankIdx];

    // 2. Actualizar textos con colores vivos (vivid-blue y vivid-green)
    ui.rank.innerText = `Rango: ${currentRank.name}`;
    ui.rank.className = game.xp > 500 ? "vivid-blue" : "vivid-green";

    // 3. Barra de XP (Progresión visual adictiva de 0 a 250)
    const xpInLevel = game.xp % 250;
    const progressPercent = (xpInLevel / 250) * 100;
    ui.xpFill.style.width = progressPercent + "%";
    ui.xpText.innerText = `${xpInLevel} / 250 XP (LVL ${game.lvl})`;

    // 4. Transformación Visual del Mundo (A partir del rango Tallo Guardián)
    if (rankIdx >= 3 && !game.isHealthy) {
        game.isHealthy = true;
        transitionWorld('healthy');
    } else if (rankIdx < 3 && game.isHealthy) {
        game.isHealthy = false;
        transitionWorld('polluted');
    }
}

// --- GENERADOR DE RESPUESTAS DE IA SIMULADA (Resuelve problemas) ---
function generateAIStudyHack(userInput) {
    const hacks = [
        `Hack de estudio para '${userInput.substring(0,10)}...': Prueba la técnica Pomodoro (25 min de estudio intenso, 5 de descanso).`,
        `¡Transmisión validada! Consejo Maestra IA: Explica '${userInput.substring(0,15)}...' en voz alta a alguien (Técnica Feynman) para dominarlo.`,
        `Energía vital registrada. Tip de bachillerato: Crea un mapa mental visual de '${userInput.substring(0,10)}...' para conectar ideas rápido.`,
        `Cargando red neuronal... El Oráculo aconseja: No solo leas '${userInput.substring(0,10)}...', haz autoevaluaciones flash de 5 min.`
    ];
    return hacks[Math.floor(Math.random() * hacks.length)];
}

function showAIResponse(userText, aiHack, xp) {
    // Limpiar chat anterior
    ui.chat.innerHTML = "";
    
    // Mensaje de Usuario
    const userLine = document.createElement('p');
    userLine.className = "user-msg";
    userLine.innerText = `► TRANSMITIENDO: ${userText.substring(0, 30)}... +${xp} XP`;
    ui.chat.appendChild(userLine);
    
    // Mensaje de IA Maestra
    const aiLine = document.createElement('p');
    aiLine.className = "ai-msg";
    aiLine.innerText = `► ORÁCULO: ${aiHack}`;
    ui.chat.appendChild(aiLine);
    
    // Auto scroll
    ui.chat.scrollTop = ui.chat.scrollHeight;
}

// --- TRANSFORMACIÓN ADICTIVA DEL MUNDO (Grises vs Colores Vivos) ---
function transitionWorld(state) {
    if (state === 'healthy') {
        ui.world.className = "vivid-world";
        ui.message.innerText = "¡La Cyber-Gaia se ha activado! Sigue plantando vida.";
        ui.message.style.color = "var(--primary-vivid-green)";
        plantNature(5); // Plantar muchos árboles al activarse
    } else {
        ui.world.className = "polluted-world";
        ui.message.innerText = "Ecosistema inerte. Esperando tu conocimiento.";
        ui.message.style.color = "var(--text-dark)";
        ui.nature.innerHTML = ""; // Limpiar árboles si vuelve a contaminarse
    }
}

// --- MECÁNICA DE PLANTAR (Explosión Visual popIn secuencial) ---
function plantNature(count) {
    // Solo plantar si el mundo ha sanado visualmente (Nivel > 1 visualmente)
    if (game.xp < ranks[1].xp) return;

    for (let i = 0; i < count; i++) {
        // Retraso para que se vea la explosión secuencial
        setTimeout(() => {
            const span = document.createElement('span');
            span.innerText = vividEmojis[Math.floor(Math.random() * vividEmojis.length)];
            
            // Posición aleatoria en el canvas
            span.style.left = Math.random() * 85 + 5 + "%"; 
            span.style.top = Math.random() * 60 + 15 + "%";
            
            // Profundidad z-index aleatoria
            span.style.zIndex = Math.floor(Math.random() * 5);
            
            ui.nature.appendChild(span);
        }, i * 100);
    }
}

// --- MECÁNICAS EXTRA DE ADICCIÓN ---
function incrementStreak() {
    game.streak++;
    ui.streak.innerText = `🔥 ${game.streak}`;
    ui.streak.style.transform = "scale(1.2)";
    setTimeout(()=> ui.streak.style.transform = "scale(1)", 200);
}

function triggerVisualError() {
    ui.input.style.borderColor = "#ff4757";
    ui.input.style.boxShadow = "0 0 10px rgba(255, 71, 87, 0.2)";
    setTimeout(() => {
        ui.input.style.borderColor = "#eee";
        ui.input.style.boxShadow = "none";
    }, 500);
}

// --- INICIAR JUEGO MAESTRO VIVO Y MODERNO ---
function init() {
    updateUI();
    // La música se activará en el primer clic que dé el usuario en cualquier lugar.
    document.addEventListener('click', function musicInitializer() {
        toggleMusic(); // Intenta prender la música
        document.removeEventListener('click', musicInitializer); // Quitar este detector
    }, { once: true });
}

init();
