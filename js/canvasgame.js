import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame, getTimer, getScore, getStreak, getPenalty, getLevel, getMode} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let cards = [];
const e_click = {click: false, x: -1, y: -1}
let key = null;
const c_w = 96;
const c_h = 128;
let idxSel = -1;

if (canvas){
    game.attr("width", 800);
    game.attr("height", 800);
    start();
    update();
}

function start(){
    selectCards();
    const margin = 15;
    const cardsXRow = (gameItems.length > 10) ? 6 : 4;
    const topOffset = 100;
    cards = gameItems.map((c, indx) => {
        const col = indx % cardsXRow;
        const row = Math.floor(indx / cardsXRow);

        return {
            texture: c,
            position: {
                xMin: margin + (c_w + margin) * col,
                xMax: margin + (c_w + margin) * col + c_w,
                yMin: topOffset + (c_h + margin) * row,
                yMax: topOffset + (c_h + margin) * row + c_h
            }
        };
    });
    cards.forEach((card, indx) => {
        initCard(val => card.texture = val);
        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax &&
                   y >= this.position.yMin && y <= this.position.yMax;
        }
    });
    // Vincular events
    game.on('click', function(e){
        e_click.click = true;
        e_click.x = e.pageX - this.offsetLeft;
        e_click.y = e.pageY - this.offsetTop;
    });
    $('#save').on('click', function(){
        saveGame(); 
    });
    $(document).keydown(e=>key = e.key);
    startGame();
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function dibuixarForma(ctx, tipus, x, y, w, h){
    ctx.save();
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = w/3;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    switch (tipus) {
        case 'cercle':
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF5733';
            break;
        case 'quadrat':
            ctx.rect(cx - r, cy - r, 2 * r, 2 * r);
            ctx.fillStyle = '#33FF57';
            break;
        case 'triangle':
            ctx.moveTo(cx, cy - r);
            ctx.lineTo(cx - r, cy + r);
            ctx.lineTo(cx + r, cy + r);
            ctx.closePath();
            ctx.fillStyle = '#3357FF';
            break;
        case 'creu':
            ctx.moveTo(cx - r, cy - r);
            ctx.lineTo(cx + r, cy + r);
            ctx.moveTo(cx + r, cy - r);
            ctx.lineTo(cx - r, cy + r);
            ctx.strokeStyle = '#F333FF';
            break;
        case 'rombe':
            ctx.moveTo(cx, cy - r); 
            ctx.lineTo(cx + r, cy);
            ctx.lineTo(cx, cy + r); 
            ctx.lineTo(cx - r, cy);
            ctx.closePath();
            ctx.fillStyle = "#FFFF33";
            break;
        case 'estrella':
            for (let i = 0; i < 10; i++) {
                const radi = (i % 2 === 0) ? r : r / 2;
                const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
                const px = cx + radi * Math.cos(angle);
                const py = cy + radi * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = "#E67E22";
            break;
        case 'hexagon':
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(cx + r * Math.cos(i * Math.PI / 3), 
                           cy + r * Math.sin(i * Math.PI / 3));
            }
            ctx.closePath();
            ctx.fillStyle = "#00CED1"; 
            break;
        case 'cor':
            ctx.moveTo(cx, cy + r);
            ctx.bezierCurveTo(cx - r, cy, cx - r, cy - r, cx, cy - r);
            ctx.bezierCurveTo(cx + r, cy - r, cx + r, cy, cx, cy + r);
            ctx.fillStyle = "#FF0000";
            break;
        case 'revers':
            ctx.rect(x+5, y+5, w-10, h-10);
            ctx.fillStyle = '#2c3e50';
            break;
        default:
            ctx.rect(x + 5, y + 5, w - 10, h - 10);
            ctx.fillStyle = "#2C3E50";
            break;
    }
    if (tipus !== 'creu') 
        ctx.fill();

    ctx.strokeStyle = (tipus === 'creu') ? ctx.strokeStyle : "black";
    ctx.stroke();
    ctx.restore();

}

function draw(){
    canvas.clearRect(0, 0, 800, 600);
    canvas.save();
    canvas.font = "bold 20px Arial";
    canvas.fillStyle = "#333";
    canvas.textAlign = "left";
    canvas.fillText(`Punts: ${getScore()}`, 20, 30);

    if (getMode() == 2) {
        canvas.fillStyle = "#2980b9";
        canvas.fillText(`Nivell: ${getLevel()}`, 20, 55);
    }

    if (getStreak() > 1) {
        canvas.fillStyle = "#e67e22";
        canvas.fillText("Multiplicador: x" + getStreak().toFixed(1), 20, 80);
    }

    if (getTimer() < 10) {
        canvas.fillStyle = "red";
    } else {
        canvas.fillStyle = "#333";
    }
    canvas.textAlign = "right";
    canvas.fillText(`Temps: ${getTimer()}s`, 780, 30);

    canvas.font = "14px Arial";
    canvas.fillStyle = "#c0392b";
    canvas.fillText("Error: -" + getPenalty() + " pts", 780, 55);

    canvas.restore();
    cards.forEach((card, indx)=>{
        const p = card.position;

        canvas.fillStyle = 'white';
        canvas.strokeStyle = 'black';
        canvas.lineWidth = 2;
        canvas.fillRect(p.xMin, p.yMin, c_w, c_h);
        canvas.strokeRect(p.xMin, p.yMin, c_w, c_h);

        dibuixarForma(canvas, card.texture, p.xMin, p.yMin, c_w, c_h);

        if (idxSel === indx) {
            canvas.strokeStyle = "#FFD700";
            canvas.lineWidth = 5;
            canvas.strokeRect(p.xMin - 2, p.yMin - 2, c_w + 4, c_h + 4);
        }
    });
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx)=>{
            let click = card.onClick(e_click.x, e_click.y);
            if (click) clickCard(indx);
            return click;
        });
    }
    if (key){
        let prevIndx = idxSel;
        switch(key){
            case "Escape":
                saveGame();
                break;
            case "ArrowRight":
                idxSel = (idxSel + 1)%cards.length;
                break;
            case "ArrowLeft":
                idxSel = (idxSel - 1 + cards.length)%cards.length;
                break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla "+key+" no reconeguda.");
        }
        if (idxSel != prevIndx){
            if (prevIndx >= 0) {
                cards[prevIndx].position.xMin += 2;
            }
            cards[idxSel].position.xMin -= 2;
        }
    }
    e_click.click = key = false;
}

