
class Tile {

    elem;
    valueElem;
    popupElem;
    showelBtn;
    flagBtn;
    flagElem;
    value = undefined;
    revealed = false;
    flagAssigned = false;
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.genModel();
        this.elem.onclick = () => {
            if (this.value == undefined) {
                Table.setBombs(this.x, this.y);
                Table.setIndicators();
                Table.clockStart();
                this.reveal();
            } else {
                Table.hidePopUps();
                if (!this.revealed || (Table.countRoundFlags(this.x, this.y) == this.value && this.value != 0 ))
                    this.showPopUp()
                
            }
        }
        this.elem.onauxclick = (e) => {
            if ( !this.revealed ) {
                e.stopImmediatePropagation();
                this.switchFlag();
                Table.hidePopUps();
            }
        }
    }

    genModel() {
        this.elem = document.createElement("div");

        this.valueElem = document.createElement("div");
        this.valueElem.classList.add("content");
        this.elem.appendChild( this.valueElem );

        this.flagElem = document.createElement("img");
        this.flagElem.src = "./icons/flag.png";
        this.flagElem.classList.add("flag");
        this.elem.appendChild(this.flagElem);  
        
        this.popupElem = document.createElement("div");
        this.popupElem.classList.add("pop-up-container");

        const container1 = document.createElement("div");
        {
            const showelContainer = document.createElement("div");
            showelContainer.classList.add("showel-container");
            showelContainer.innerHTML += '<img src="./icons/showel.png">';
            showelContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                this.reveal();
                this.revealed = true;
                Table.hidePopUps();
            });
            this.showelBtn = showelContainer;
            container1.appendChild( showelContainer );

            const flagContainer = document.createElement("div");
            flagContainer.classList.add("flag-container");
            flagContainer.innerHTML += '<img src="./icons/flag.png">';
            flagContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                this.switchFlag();
                Table.hidePopUps();
            });
            this.flagBtn = flagContainer;
            container1.appendChild( flagContainer );
        }
        this.popupElem.appendChild(container1);

        const container2 = document.createElement('div');
        {
            const closeContainer = document.createElement("div");
            closeContainer.classList.add("close-container");
            closeContainer.innerHTML += '<img src="./icons/close.png">';
            closeContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                Table.hidePopUps();
            });
            container2.appendChild( closeContainer );
            container2.appendChild( document.createElement("div") );
        }
        this.popupElem.appendChild(container2);

        this.elem.appendChild( this.popupElem );
    }

    setValue(value) {
        this.value = value;
        this.valueElem.innerText = value;
        let color;
        switch(this.value) {
            case -2:
                this.valueElem.innerHTML = `<img src="./icons/explosion.png">`;
                color = "transparent";
                break;
            case 1: color = "#961189"; break;
            case 2: color = "#119620"; break;
            case 3: color = "#42cbf5"; break;
            case 4: color = "#427ef5"; break;
            case 5: color = "#ffcc00"; break;
            case 6: color = "#f58442"; break;
            case 7: color = "#f54242"; break;
            case 8: color = "#000000"; break;
            default: color = "transparent";
        }
        this.valueElem.style.color = color;
    }

    reveal(chainReveal) {
        if (!this.revealed) {
            this.revealed = true;
            this.flagBtn.style.visibility = "hidden";

            if (this.value != -2) {
                if (this.flagAssigned) {
                    console.log("wrong flag")
                    this.flagElem.src = "./icons/wrong-flag.png";
                }
                this.elem.classList.add("reveal");
                if (Table.winVerify()) {
                    Table.endGame(true);
                }
            } else if (!this.flagAssigned) {
                console.log(this.flagAssigned)
                this.elem.classList.add("reveal");
            }

            if (this.value == 0) {
                Table.revealRound(this.x, this.y);
            }
            if (this.value == -2) {
                Table.revealBombs(this);
                Table.endGame(false);
            }
        } else if (!chainReveal) {
            if ( Table.countRoundFlags(this.x, this.y) == this.value ) {
                Table.revealRound(this.x, this.y);
            }
        }
    }

    switchFlag() {
        if (!this.flagAssigned) {
            this.flagAssigned = true;
            this.flagElem.style.visibility = "visible";
            this.showelBtn.style.visibility = "hidden";
            Table.nFlags--;
        } else {
            this.flagAssigned = false;
            this.flagElem.style.visibility = "hidden";
            this.showelBtn.style.visibility = "";
            Table.nFlags++;
        }
        Table.nFlagsElem.innerHTML = Table.nFlags;
        console.log(Table.nBombs)
    }

    showPopUp() {
        this.popupElem.style.visibility = "visible";
    }

    hidePopUp() {
        this.popupElem.style.visibility = "";
    }
    
}


// Gerar Table.grid vazia (value = undefined)

const Table =  {
    nBombs: 35,
    nFlags: 35,
    score: 0,
    clockId: undefined,
    gridSizeX: 18,
    gridSizeY: 11,
    elem: document.querySelector("#table-container"),
    modalElem: document.querySelector("#modal"),
    nFlagsElem: document.querySelector("#flag-value"),
    scoreElem: document.querySelector("#score-value"),
    grid:[],
    bombs:[],
    flags: [],
    gameEnds: false,

    clockStart() {
        Table.clockId = setInterval( () => {
            if (Table.score < 999) {
                Table.score++;
                Table.scoreElem.innerHTML = Table.score;
            }
        }, 1000 );
    },

    clockStop() {
        clearInterval( Table.clockId );
    },

    genTable() {
        Table.grid = [];
        for (let rowPos = 0; rowPos < Table.gridSizeY; rowPos++) {
            let gridRow = [];
            for (let colPos = 0; colPos < Table.gridSizeX; colPos++) {
                gridRow.push( new Tile(colPos, rowPos) );
            }
            Table.grid.push( gridRow );
        }
    },

    createTable() {
        Table.genTable();
        Table.elem.innerHTML = "";
        Table.scoreElem.innerHTML = 0;
        for (let rowPos = 0; rowPos < Table.gridSizeY; rowPos++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let colPos = 0; colPos < Table.gridSizeX; colPos++) {
                row.appendChild( Table.grid[rowPos][colPos].elem );
            }
            Table.elem.appendChild( row );
        }
    },

    random() {
        let row, col;
        do {
            row = Math.floor( Math.random()*100 );
        } while (row >= this.gridSizeY);

        do {
            col = Math.floor( Math.random()*100 );
        } while (col >= this.gridSizeX);

        return {row, col};
    },

    setBombs(clickedX, clickedY) {
        let settedBombs = 0;
        for (settedBombs; settedBombs < Table.nBombs; settedBombs++) {
            let pos;
            do {
                pos = Table.random();
        } while ( Table.grid[pos.row][pos.col].value == -2 || !( pos.col < clickedX - 1 || pos.col > clickedX + 1 || pos.row < clickedY - 1 || pos.row > clickedY + 1 ) );
            Table.grid[pos.row][pos.col].setValue(-2);
            Table.bombs.push( Table.grid[pos.row][pos.col] );
        }
    },

    revealBombs(bomb) {
        for (let i = 0, j = 0; i < Table.bombs.length; i++) {
            if (Table.bombs[i] != bomb) {
                setTimeout( () => {
                    Table.bombs[i].reveal();
                }, j*200 );
                j++;
            }
        }
    },

    setIndicators() {
        for (let col = 0; col < Table.gridSizeX; col++) {
            for (let row = 0; row < Table.gridSizeY; row++) {

                if (Table.grid[row][col].value == -2) continue;

                let roundBombs = 0;
                if (col-1 >= 0) {
                    roundBombs += Table.grid[row][col-1].value == -2 ? 1 : 0;

                    if (row-1 >= 0) {
                        roundBombs += Table.grid[row-1][col-1].value == -2 ? 1 : 0;
                    }
                    
                    if (row+1 < Table.gridSizeY) {
                        roundBombs += Table.grid[row+1][col-1].value == -2 ? 1 : 0;
                    }
                    
                }
                
                if (col+1 < Table.gridSizeX) {
                    roundBombs += Table.grid[row][col+1].value == -2 ? 1 : 0;

                    if (row-1 >= 0) {
                        roundBombs += Table.grid[row-1][col+1].value == -2 ? 1 : 0;
                    }
                    
                    if (row+1 < Table.gridSizeY) {
                        roundBombs += Table.grid[row+1][col+1].value == -2 ? 1 : 0;
                    }

                }
                
                if (row-1 >= 0) {
                    roundBombs += Table.grid[row-1][col].value == -2 ? 1 : 0;
                }
                
                if (row+1 < Table.gridSizeY) {
                    roundBombs += Table.grid[row+1][col].value == -2 ? 1 : 0;
                }

                Table.grid[row][col].setValue( roundBombs );
            }
        }
    },

    revealRound(col, row) {
        
        if (col-1 >= 0) {
            Table.grid[row][col-1] != undefined && !Table.grid[row][col-1].flagAssigned ? Table.grid[row][col-1].reveal(true) : "";

            if (row-1 >= 0) {
                Table.grid[row-1][col-1] != undefined && !Table.grid[row-1][col-1].flagAssigned ? Table.grid[row-1][col-1].reveal(true) : "";
            }
            
            if (row+1 < Table.gridSizeY) {
                Table.grid[row+1][col-1] != undefined && !Table.grid[row+1][col-1].flagAssigned ? Table.grid[row+1][col-1].reveal(true) : "";
            }
            
        }
        
        if (col+1 < Table.gridSizeX) {
            Table.grid[row][col+1] != undefined && !Table.grid[row][col+1].flagAssigned ? Table.grid[row][col+1].reveal(true) : "";

            if (row-1 >= 0) {
                Table.grid[row-1][col+1] != undefined && !Table.grid[row-1][col+1].flagAssigned ? Table.grid[row-1][col+1].reveal(true) : "";
            }
            
            if (row+1 < Table.gridSizeY) {
                Table.grid[row+1][col+1] != undefined && !Table.grid[row+1][col+1].flagAssigned ? Table.grid[row+1][col+1].reveal(true) : "";
            }

        }
        
        if (row-1 >= 0) {
            Table.grid[row-1][col] != undefined && !Table.grid[row-1][col].flagAssigned ? Table.grid[row-1][col].reveal(true) : "";
        }
        
        if (row+1 < Table.gridSizeY) {
            Table.grid[row+1][col] != undefined && !Table.grid[row+1][col].flagAssigned ? Table.grid[row+1][col].reveal(true) : "";
        }
    },

    countRoundFlags(col, row) {

        let nFlags = 0;

        if (col-1 >= 0) {
            Table.grid[row][col-1] != undefined && Table.grid[row][col-1].flagAssigned ? nFlags++ : "";

            if (row-1 >= 0) {
                Table.grid[row-1][col-1] != undefined && Table.grid[row-1][col-1].flagAssigned ? nFlags++ : "";
            }
            
            if (row+1 < Table.gridSizeY) {
                Table.grid[row+1][col-1] != undefined && Table.grid[row+1][col-1].flagAssigned ? nFlags++ : "";
            }
        }
        
        if (col+1 < Table.gridSizeX) {
            Table.grid[row][col+1] != undefined && Table.grid[row][col+1].flagAssigned ? nFlags++ : "";

            if (row-1 >= 0) {
                Table.grid[row-1][col+1] != undefined && Table.grid[row-1][col+1].flagAssigned ? nFlags++ : "";
            }
            
            if (row+1 < Table.gridSizeY) {
                Table.grid[row+1][col+1] != undefined && Table.grid[row+1][col+1].flagAssigned ? nFlags++ : "";
            }

        }
        
        if (row-1 >= 0) {
            Table.grid[row-1][col] != undefined && Table.grid[row-1][col].flagAssigned ? nFlags++ : "";
        }
        
        if (row+1 < Table.gridSizeY) {
            Table.grid[row+1][col] != undefined && Table.grid[row+1][col].flagAssigned ? nFlags++ : "";
        }

        return nFlags;
    },

    hidePopUps() {
        for (let row = 0; row < Table.gridSizeY; row++) {
            for (let col = 0; col < Table.gridSizeX; col++) {
                Table.grid[row][col].hidePopUp();
            }
        }
    },
    
    winVerify() {
        let nRevealed = 0;
        for (let col = 0; col < Table.gridSizeX; col++) {
            for (let row = 0; row < Table.gridSizeY; row++) {
                if (Table.grid[row][col].revealed)
                    nRevealed++;
            }
        }
        if (nRevealed == Table.gridSizeX * Table.gridSizeY - Table.nBombs) {
            return true;
        }
        return false;
    },

    showModal() {
        Table.modalElem.style.visibility = "visible";
        Table.modalElem.style.opacity = 1;
    },

    endGame(win) {
        if (!Table.gameEnds) {
            Table.gameEnds = true;
            Table.clockStop();
            Table.showModal();
            // if (win) {

            // } else {
            //     Table.score = 0;
            //     Table.scoreElem.innerHTML = "--";
            // }
        }
    }

}

let Storage = {
    get(key) {
        return JSON.parse( window.localStorage.getItem(key) );
    },

    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value) );
    } 
}

Table.createTable();
