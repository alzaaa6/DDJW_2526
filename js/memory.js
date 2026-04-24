const resources = ['cercle', 'quadrat', 'triangle', 'creu', 'rombe', 'estrella', 'hexagon', 'cor'];
const back = 'revers';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

function registrarPuntuacio(punts, g) { 
    if (!g) return; 
    
    let alias = sessionStorage.getItem('playerAlias') || "Anònim";
    let rankings = JSON.parse(localStorage.getItem('rankings') || "[]");
    
    rankings.push({
        name: alias,
        score: punts,
        mode: g.gameMode,
        difficulty: g.difficulty,
        groupSize: g.groupSize,
        shapes: (g.items.length / g.groupSize) 
    });
    
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 10);
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selection: [],
    score: 0,
    pairs: 2,
    groupSize: 2,
    difficulty: 'normal',
    penalty: 25,
    streak: 1,
    timer: 60,
    timerInterval: null,
    level: 1,
    gameMode: 1,
    initialGroupSize: 2,

    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        const urlParams = new URLSearchParams(window.location.search);
        this.gameMode = parseInt(urlParams.get('mode')) || 1;
        let toLoad = sessionStorage.load ? JSON.parse(sessionStorage.load) : null;

        const isLoadingPersistent = urlParams.get('load') === '1';

        if (isLoadingPersistent) {
            toLoad = localStorage.save ? JSON.parse(localStorage.save) : null;
            if (toLoad) sessionStorage.setItem('load', JSON.stringify(toLoad));
        } else {
            toLoad = sessionStorage.load ? JSON.parse(sessionStorage.load) : null;
        }

        if (toLoad && toLoad.items){ 
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selection = toLoad.selection || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
            this.difficulty = toLoad.difficulty || 'normal';
            this.timer = toLoad.timer || 60;
            this.level = toLoad.level || 1;
            this.penalty = toLoad.penalty || 25;
            this.initialGroupSize = toLoad.initialGroupSize || 2;
            this.gameMode = toLoad.gameMode || this.gameMode;
            return;
        }

        const saved = JSON.parse(localStorage.options || "{}");

        if (toLoad) {
            this.score = toLoad.score || 0;
            this.level = toLoad.level || 1;
            this.difficulty = toLoad.difficulty || 'normal';
            this.initialGroupSize = toLoad.initialGroupSize || 2;
        } else {
            this.score = 0;
            this.level = 1;
            if (this.gameMode == 1) {
                this.difficulty = saved.m1_difficulty || 'normal';
                this.initialGroupSize = parseInt(saved.m1_groupSize) || 2;
            } else {
                this.difficulty = saved.m2_difficulty || 'normal';
                this.initialGroupSize = parseInt(saved.m2_groupSize) || 2;
            }
        }
         
        if (this.gameMode == 1) {
            this.pairs = parseInt(saved.m1_pairs) || 2;
            this.groupSize = this.initialGroupSize;
        } else {
            this.pairs = 2 + Math.floor((this.level - 1) / 2);
            if (this.pairs > 8) this.pairs = 8;
            let levelGroupSize = 2;
            if (this.level >= 3) levelGroupSize = 3;
            if (this.level >= 5) levelGroupSize = 4;
            this.groupSize = Math.max(this.initialGroupSize, levelGroupSize);
        }
        
        let tempsPerGrup = 10;
        let basePenalty = 25;

        if (this.difficulty === 'easy') { 
            tempsPerGrup = 15; 
            basePenalty = 10; 
        } else if (this.difficulty === 'hard') { 
            tempsPerGrup = 7; 
            basePenalty = 50; 
        }

        this.timer = this.pairs * tempsPerGrup;

        if (this.gameMode == 2 && this.level > 1) {
            this.timer = Math.max(15, this.timer - ((this.level - 1) * 2));
            this.penalty = basePenalty + ((this.level - 1) * 5);
        } else {
            this.penalty = basePenalty;
        }

        this.items = resources.slice();          
        shuffe(this.items); 
        let selectedShapes = this.items.slice(0, this.pairs);

        this.items = [];
        selectedShapes.forEach(shape => {
            for (let i = 0; i < this.groupSize; i++) {
                this.items.push(shape); // Afegim la forma N vegades
            }
        });
                
        shuffe(this.items);
        this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        this.selection = [];

    },

    startTimer: function() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer--;
            if (this.timer <= 0) {
                this.timer = 0;
                clearInterval(this.timerInterval);
                registrarPuntuacio(this.score, this);
                alert("Has perdut per temps!");
                window.location.assign("../");
            }
        }, 1000);
    },

    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                    if (indx === this.items.length - 1) this.startTimer();
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx) {
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        if (this.selection.includes(indx)) return;
        this.goFront(indx);
        this.selection.push(indx);

        if (this.selection.length < this.groupSize) return;

        let firstCardVal = this.items[this.selection[0]];
        let isMatch = this.selection.every(i => this.items[i] === firstCardVal);

        if (isMatch) {
            this.score += Math.floor(100 * this.streak);
            this.streak += 0.5;

            this.pairs--;
            this.selection.forEach(i => this.states[i] = StateCard.DONE);
            this.selection = []; 

            if (this.pairs <= 0) {
                clearInterval(this.timerInterval);
                let puntsBase = this.score;
                let bonusTemps = this.timer * 10;
                this.score += bonusTemps;

                this.score += (this.timer * 10);
                    setTimeout(() => {
                        if (this.gameMode == 2) {
                            alert(`NIVELL ${this.level} COMPLETAT!\nBonus temps: +${bonusTemps}\nPrepareu-vos pel Nivell ${this.level + 1}`);
                            sessionStorage.setItem('load', JSON.stringify({
                                score: this.score,
                                level: this.level + 1,
                                difficulty: this.difficulty,
                                initialGroupSize: this.groupSize,
                                gameMode: this.gameMode
                            }));
                            location.reload();
                        } else {
                            alert(
                                "VICTÒRIA!\n\n" +
                                "• Punts de joc: " + puntsBase + "\n" +
                                "• Bonus temps (" + this.timer + "s x 10): +" + bonusTemps + "\n" +
                                "----------------------------\n" +
                                "TOTAL: " + this.score + " punts"
                            );
                            registrarPuntuacio(this.score, this);
                        window.location.assign("../");
                        }
                    }, 500);
                }
        } 
        else {
            this.ready = 0;
            this.score = Math.max(0, this.score - this.penalty);
            this.streak = 1;
            setTimeout(() => {
                this.selection.forEach(i => {
                    this.goBack(i);
                });
            
                this.selection = []; 
                this.ready = this.items.length; 
            }, 1000); 

        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            selection: this.selection,
            score: this.score,
            pairs: this.pairs,
            groupSize: this.groupSize,
            difficulty: this.difficulty,
            timer: this.timer,
            level: this.level,
            penalty: this.penalty,
            initialGroupSize: this.initialGroupSize,
            gameMode: this.gameMode
        });
        localStorage.save = to_save;
        alert("Partida guardada");

        sessionStorage.removeItem('load');
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}

export function getTimer() {
    return game.timer;
}

export function getScore() {
    return game.score;
}

export function getStreak() {
    return game.streak;
}

export function getPenalty() {
    return game.penalty;
}

export function getLevel() {
    return game.level; 
}
export function getMode() {
    return game.gameMode; 
}