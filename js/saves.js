document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById('list-saves');
    const allGames = JSON.parse(localStorage.getItem('saved_games') || "[]");

    if (allGames.length === 0) {
        listContainer.innerHTML = "<p>No hi ha partides guardades.</p>";
        return;
    }


    listContainer.innerHTML = "";
    allGames.forEach((partida) => {
        const slot = document.createElement('div');
        const nomMode = (partida.gameMode == 2) ? "Progressiu" : "Clàssic";
        slot.className = "save-slot"; 
        
        slot.innerHTML = `
            <div class="save-header">
                <h2>👤 ${partida.playerName}</h2>
                <span class="date">${partida.dateLabel}</span>
            </div>
            
            <div class="save-grid">
                <p><strong>Mode:</strong> ${nomMode}</p>
                <p><strong>Nivell:</strong> ${partida.level}</p>
                <p><strong>Punts:</strong> <span class="points">${partida.score}</span></p>
                <p><strong>Dificultat:</strong> ${partida.difficulty.toUpperCase()}</p>
            </div>

            <div class="save-actions">
                <button class="btn-load btn-principal">Carregar</button>
                <button class="btn-delete btn-danger">Esborrar</button>
            </div>
        `;

        slot.querySelector('.btn-load').onclick = () => {
            sessionStorage.setItem('load', JSON.stringify(partida));
            sessionStorage.setItem('playerAlias', partida.playerName)
            window.location.assign("canvasgame.html");
        };

        slot.querySelector('.btn-delete').onclick = () => {
            if(confirm(`Vols esborrar la partida de ${partida.playerName}?`)) {
                const filtered = allGames.filter(g => g.saveId !== partida.saveId);
                localStorage.setItem('saved_games', JSON.stringify(filtered));
                location.reload();
            }
        };

        listContainer.appendChild(slot);
        });
});

