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
        slot.className = "save-slot"; 
        slot.style = "border: 1px solid #ccc; padding: 10px; margin: 10px; cursor: pointer;";
        
        slot.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; color: #2980b9;">👤 ${partida.playerName}</h2>
                <span style="font-size: 0.8em; color: #7f8c8d;">${partida.dateLabel}</span>
            </div>
            <hr>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                <p><strong>Mode:</strong> ${partida.gameMode}</p>
                <p><strong>Nivell:</strong> ${partida.level}</p>
                <p><strong>Punts:</strong> <span style="color: #27ae60; font-weight: bold;">${partida.score}</span></p>
                <p><strong>Dificultat:</strong> ${partida.difficulty}</p>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <button class="btn-load" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Carregar</button>
                <button class="btn-delete" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-left: 5px;">Esborrar</button>
            </div>
        `;

        slot.querySelector('.btn-load').onclick = () => {
            sessionStorage.setItem('load', JSON.stringify(partida));
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

