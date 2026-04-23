const resources = ['cercle', 'quadrat', 'triangle', 'creu', 'rombe', 'estrella', 'hexagon', 'cor'];
const back = 'revers';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selection: [],
    score: 200,
    pairs: 2,
    groupSize: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selection = toLoad.selection || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
        }
        else{ // Nova partida
            const saved = JSON.parse(localStorage.options || "{}");
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');

            if (mode == 1) {
                this.pairs = parseInt(saved.m1_pairs) || 2;
                this.groupSize = parseInt(saved.m1_groupSize) || 2;
            } else {
                this.pairs = 2;
                this.groupSize = parseInt(saved.m2_groupSize) || 2;
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
        }
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
            this.pairs--;
            this.selection.forEach(i => this.states[i] = StateCard.DONE);
            this.selection = []; 
            if (this.pairs <= 0) {
                    setTimeout(() => {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    }, 500);
                }
        } 
        else {
            this.ready = 0;
            this.score -= 25;
            setTimeout(() => {
                this.selection.forEach(i => {
                    this.goBack(i);
                });
            
                this.selection = []; 
                this.ready = this.items.length; 

                if (this.score <= 0) {
                    alert("Has perdut");
                    window.location.assign("../");
                }
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
            groupSize: this.groupSize
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
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
