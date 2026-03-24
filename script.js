// --- ESTADO DEL JUEGO FUSIONADO ---
let state = {
    screen: 'lobby',
    subject: 'Física',
    xp: 1250,
    trophies: 0,
    enemyHP: 100,
    playerHP: 100,
    inQuiz: false
};

// Configuración de Rangos (Estilo Free Fire Agresivo)
const ranks = [
    {xp: 0, name: "Recluta I", icon: "🎖️"},
    {xp: 500, name: "Aspirante II", icon: "🥈"},
    {xp: 1200, name: "Heraldo III", icon: "🥇"},
    {xp: 2000, name: "Guardián IV", icon: "🛡️"},
    {xp: 3000, name: "Heroico V", icon: "💎"}
];

// Base de Datos de IA (Clash Quices)
const database = {
    'Física': [
        { q: "¿Cuál es la unidad de la fuerza en el S.I.?", a: ["Newton", "Joule", "Watt"], c: 0 },
        { q: "Si la aceleración es constante, la velocidad es:", a: ["Uniforme", "Cero", "Variable lineal"], c: 2 }
    ],
    'Química': [
        { q: "¿Símbolo del Sodio?", a: ["So", "Na", "S"], c: 1 },
        { q: "¿Cuál es el pH neutro?", a: ["0", "14", "7"], c: 2 }
    ]
};

// --- CONTROL DEL LOBBY (HORIZONTAL) ---
function selectCard(name) {
    state.subject = name;
    document.querySelectorAll('.knowledge-card').forEach(card => {
        card.classList.remove('active');
        if(card.innerText.includes(name)) card.classList.add('active');
    });
}

function startQuantumBattle() {
    // CAMBIO DE ORIENTACIÓN: Lobby (Horizontal) -> Batalla (Vertical)
    document.body.classList.remove('landscape-mode');
    document.body.classList.add('portrait-mode');
    
    state.screen = 'battle';
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    
    // Audio
    document.getElementById('bg-music-lobby').pause();
    document.getElementById('bg-music-battle').play();
    
    resetBattle();
    nextTurn();
}

// --- CONTROL DE BATALLA (VERTICAL - CLASH FUSION) ---
function resetBattle() {
    state.enemyHP = 100;
    state.playerHP = 100;
    updateBars();
}

function nextTurn() {
    const questions = database[state.subject];
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    
    document.getElementById('question-text').innerText = randomQ.q;
    const container = document.getElementById('options-clash-container');
    container.innerHTML = "";
    
    randomQ.a.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "clash-option-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, randomQ.c);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    const sfx = document.getElementById('sfx-hit');
    sfx.play();

    if(selected === correct) {
        // Daño al Boss (Adictivo y Satisfactorio)
        state.enemyHP -= 25;
        document.getElementById('boss-sprite').classList.add('shake');
        setTimeout(() => document.getElementById('boss-sprite').classList.remove('shake'), 300);
    } else {
        // Daño al Jugador
        state.playerHP -= 20;
        document.getElementById('player-sprite').classList.add('shake');
        setTimeout(() => document.getElementById('player-sprite').classList.remove('shake'), 300);
    }

    updateBars();

    if(state.enemyHP <= 0) {
        victory();
    } else if(state.playerHP <= 0) {
        defeat();
    } else {
        nextTurn();
    }
}

function updateBars() {
    document.getElementById('enemy-fill').style.width = state.enemyHP + "%";
    document.getElementById('player-fill').style.width = state.playerHP + "%";
    updateRankUI();
}

// --- SISTEMA DE RANGOS (XP FREE FIRE) ---
function victory() {
    alert("¡VICTORIA QUANTUM! +50 XP");
    addXP(50);
    backToLobby();
}

function defeat() {
    alert("Derrota... Sigue estudiando. -10 XP");
    addXP(-10);
    backToLobby();
}

function addXP(val) {
    state.xp = Math.max(state.xp + val, 0);
    updateRankUI();
}

function updateRankUI() {
    let currentRankIdx = 0;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (state.xp >= ranks[i].xp) {
            currentRankIdx = i;
            break;
        }
    }
    
    const rank = ranks[currentRankIdx];
    const nextRank = ranks[currentRankIdx + 1] || rank;
    
    // UI HUD TOP
    document.getElementById('rank-icon').innerText = rank.icon;
    document.getElementById('rank-name').innerText = rank.name;
    document.getElementById('rank-xp').innerText = `XP: ${state.xp} / ${nextRank.xp}`;
    
    // UI HUD FIRE (Al lado del botón de batalla)
    document.querySelector('.current-rank-display span').innerText = rank.name;
    const progress = (state.xp - rank.xp) / (nextRank.xp - rank.xp) * 100;
    document.getElementById('rank-bar-fill').style.width = progress + "%";
}

function backToLobby() {
    // VOLVER A HORIZONTAL
    document.body.classList.remove('portrait-mode');
    document.body.classList.add('landscape-mode');
    
    state.screen = 'lobby';
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('lobby-screen').classList.remove('hidden');
    
    document.getElementById('bg-music-battle').pause();
    document.getElementById('bg-music-lobby').play();
}

// --- INICIAR QUANTUM FUSION ---
function init() {
    updateRankUI();
    // La música de lobby empieza al primer click
    document.addEventListener('click', () => {
        document.getElementById('bg-music-lobby').play();
    }, { once: true });
}

init();
