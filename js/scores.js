document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById('scores-body');
    const rankings = JSON.parse(localStorage.getItem('rankings') || "[]");

    if (rankings.length === 0) {
        body.innerHTML = "<tr><td colspan='7'>No hi ha puntuacions. Sigues el primer!</td></tr>";
        return;
    }

    const traduccioDificultat = {
        'easy': 'Fàcil',
        'normal': 'Normal',
        'hard': 'Difícil'
    };

    const traduccioGrups = {
        2: 'Parelles',
        3: 'Trios',
        4: 'Quartets'
    };

    body.innerHTML = rankings.map((r, i) => {
        const dificultat = traduccioDificultat[r.difficulty] || r.difficulty;
        const grups = traduccioDificultat[r.groupSize] || traduccioGrups[r.groupSize] || `x${r.groupSize}`;
        const formes = r.shapes || r.pairs || "-";
        return `
            <tr style="border-bottom: 1px solid #ddd; height: 45px; text-align: center;">
                <td><strong>${i + 1}</strong></td>
                <td>${r.name}</td>
                <td>${r.score}</td>
                <td>${dificultat}</td>
                <td>${grups}</td>
                <td>${formes}</td>
            </tr>
        `;
    }).join('');
});