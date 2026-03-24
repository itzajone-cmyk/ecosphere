let state = { xp: 0, lvl: 1, rankIdx: 0 };
const ranks = [
    {n: "Semilla", i: "🌑"}, {n: "Brote", i: "🌱"}, {n: "Raíz", i: "🌿"}, 
    {n: "Tallo", i: "🎍"}, {n: "Hoja", i: "🍃"}, {n: "Arbusto", i: "🌳"},
    {n: "Árbol", i: "🌲"}, {n: "Bosque", i: "🏞️"}, {n: "Bioma", i: "🌍"}, {n: "Guardián", i: "💎"}
];

function processStudy() {
    const input = document.getElementById('task-input');
    const val = input.value.trim();
    if(!val) return;

    const gainedXp = Math.min(val.length * 2, 80);
    state.xp += gainedXp;
    
    // Feedback IA
    document.getElementById('ai-text').innerText = `Analizando... ¡Energía vital detectada! +${gainedXp} XP.`;
    document.getElementById('status-led').classList.add('active');
    
    input.value = "";
    updateGame();
    spawnNature();
}

function updateGame() {
    // Niveles (cada 250 xp)
    state.lvl = Math.floor(state.xp / 250) + 1;
    document.getElementById('level-num').innerText = state.lvl;
    
    // Rangos (10 niveles)
    state.rankIdx = Math.min(Math.floor(state.xp / 150), ranks.length - 1);
    document.getElementById('rank-name').innerText = ranks[state.rankIdx].n;
    document.getElementById('rank-icon').innerText = ranks[state.rankIdx].i;

    // UI
    document.getElementById('xp-fill').style.width = (state.xp % 250) / 2.5 + "%";
    document.getElementById('xp-counter').innerText = `${state.xp % 250} / 250 XP`;

    // Mundo
    if(state.xp > 200) {
        document.getElementById('world-view').className = "vivid-world";
        document.getElementById('env-msg').innerText = "¡El ecosistema está vivo!";
    }
}

function spawnNature() {
    if(state.xp < 100) return;
    const icons = ["🌳", "🌸", "🌻", "🌿", "🦋"];
    const span = document.createElement('span');
    span.innerText = icons[Math.floor(Math.random() * icons.length)];
    span.style.left = Math.random() * 80 + 10 + "%";
    span.style.top = Math.random() * 70 + 10 + "%";
    document.getElementById('nature-layer').appendChild(span);
}
