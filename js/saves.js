document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById('list-saves');
    const partidaGuardada = localStorage.getItem('save');

    // 1. SI NO HI HA PARTIDA: Missatge i tornem enrere
    if (!partidaGuardada) {
        listContainer.innerHTML = "<p style='color: red;'>⚠️ No s'ha trobat cap partida guardada.</p>";
        setTimeout(() => {
            alert("No hi ha partides! Et tornem al menú principal.");
            window.location.assign("../index.html");
        }, 1500);
        return;
    }

    // 2. SI HI HA PARTIDA: La mostrem maca
    const data = JSON.parse(partidaGuardada);
    
    const slot = document.createElement('div');
    slot.className = "save-slot";
    slot.innerHTML = `
        <div style="border: 2px solid #2c3e50; padding: 20px; margin: 10px; cursor: pointer; background: #ecf0f1;">
            <h3>Partida: Mode ${data.gameMode}</h3>
            <p>Nivell: ${data.level} | Punts: ${data.score}</p>
            <p><small>Dificultat: ${data.difficulty} | Grups de: ${data.groupSize}</small></p>
            <button class="btn-load-action">Carregar aquesta partida</button>
        </div>
    `;

    // En clicar a la partida, la carreguem
    slot.onclick = () => {
        sessionStorage.setItem('load', partidaGuardada);
        window.location.assign("canvasgame.html");
    };

    listContainer.appendChild(slot);
});