:root {
    --neon-blue: #00f2fe;
    --neon-green: #2ecc71;
    --deep-dark: #121212;
    --card-bg: #1e1e2e;
    --fire: #ff4757;
}

body {
    margin: 0; font-family: 'Fredoka', sans-serif;
    background: var(--deep-dark); color: white; overflow: hidden;
    height: 100vh;
}

#game-container { display: flex; flex-direction: column; height: 100vh; max-width: 500px; margin: auto; }

/* HUD Superior */
.hud-top {
    padding: 15px; display: flex; justify-content: space-between; align-items: center;
    background: rgba(30, 30, 46, 0.9); border-bottom: 2px solid var(--neon-blue);
}

.user-profile { display: flex; gap: 10px; cursor: pointer; }
#avatar-container { font-size: 30px; background: #333; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--neon-blue); }
.user-info span { display: block; font-size: 12px; }
#player-name { font-weight: bold; font-family: 'Orbitron'; color: var(--neon-blue); }

.streak-counter { background: rgba(255, 71, 87, 0.2); padding: 5px 15px; border-radius: 20px; border: 1px solid var(--fire); }

/* Mundo y Mascota */
#world-viewport { flex-grow: 1; position: relative; transition: 1s; overflow: hidden; }
.gray-land { background: #2c3e50; filter: grayscale(0.8); }
.vivid-land { background: linear-gradient(to top, #134e5e, #71b280); filter: grayscale(0); }

#pet-companion {
    position: absolute; bottom: 20%; right: 20px;
    font-size: 50px; text-align: center; transition: 0.5s;
    filter: drop-shadow(0 0 10px white);
}

#pet-speech {
    position: absolute; top: -60px; right: 0; background: white; color: black;
    padding: 8px; border-radius: 10px; font-size: 12px; width: 120px;
}

/* Terminal IA */
.ai-terminal { background: var(--card-bg); padding: 15px; border-radius: 30px 30px 0 0; }
.xp-progress { height: 20px; background: #333; border-radius: 10px; position: relative; margin-bottom: 10px; overflow: hidden; }
#xp-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--neon-blue), var(--neon-green)); transition: 1s; }
#xp-text { position: absolute; width: 100%; text-align: center; font-size: 10px; line-height: 20px; font-weight: bold; }

.terminal-body { display: flex; flex-direction: column; gap: 10px; }
#ai-chat-history { height: 80px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px; font-size: 13px; color: #aaa; }
textarea { background: #2c2c3e; border: 1px solid #444; color: white; border-radius: 10px; padding: 10px; resize: none; }
#btn-transmit { background: var(--neon-blue); border: none; padding: 12px; border-radius: 10px; font-family: 'Orbitron'; font-weight: bold; cursor: pointer; }

/* Boss y Modales */
#boss-container { position: absolute; top: 20%; left: 50%; transform: translateX(-50%); text-align: center; }
#boss-visual { font-size: 80px; animation: float 2s infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100; display: flex; align-items: center; justify-content: center; }
.card-content { background: linear-gradient(45deg, #1e1e2e, #3a3a5a); padding: 30px; border-radius: 20px; border: 3px solid var(--neon-blue); text-align: center; width: 300px; }
.hidden { display: none; }
