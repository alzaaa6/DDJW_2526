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
    lastCard: null,
    score: 200,
    pairs: 2,
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
            this.lastCard = toLoad.lastCard;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
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
        this.goFront(indx);
        if (this.lastCard === null) {
            this.lastCard = indx;
        } 
        else {
            if (this.items[this.lastCard] === this.items[indx]) {
                this.pairs--;
                this.states[this.lastCard] = this.states[indx] = StateCard.DONE;
                
                if (this.pairs <= 0) {
                    setTimeout(() => {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    }, 500);
                }
                this.lastCard = null; 
            } 
            else {
                this.ready = 0; 
                this.score -= 25;

    
                setTimeout(() => {
                    this.goBack(indx);
                    this.goBack(this.lastCard);
                    
                    this.lastCard = null; 
                    this.ready = this.items.length; 

                    if (this.score <= 0) {
                        alert("Has perdut");
                        window.location.assign("../");
                    }
                }, 1000); 
            }
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            lastCard: this.lastCard,
            score: this.score,
            pairs: this.pairs
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
