
class Tile {

    elem;
    valueElem;
    popupElem;
    flagElem;
    value;
    revealed = false;
    flagAssigned = false;
    x;
    y;

    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.genModel();
        this.elem.onclick = () => {
            // this.valueElem.style.visibility = "visible";
            Table.removeAllSelected();
            if (!this.revealed)
            this.popupElem.style.visibility = "visible";
            if (value == -2)
                console.log("Boom!")
        }
    }

    genModel() {
        let elem = document.createElement("div");

        let valueContainer = document.createElement("div");
        valueContainer.innerText = this.value;
        valueContainer.classList.add("content");

        let color;
        switch(this.value) {
            case -2:
                console.log(this.value == -2)
                valueContainer.innerHTML = `<img src="./icons/explosion.png">`;
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
        valueContainer.style.color = color;
        elem.appendChild( valueContainer );

        this.flagElem = document.createElement("img");
        this.flagElem.src = "./icons/flag.png";
        elem.appendChild(this.flagElem);
        
        
        let popupContainer = document.createElement("div");
        popupContainer.classList.add("pop-up-container");

        const container1 = document.createElement("div");

            const showelContainer = document.createElement("div");
            showelContainer.classList.add("showel-container");
            showelContainer.innerHTML += '<img src="./icons/showel.png">';
            showelContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                this.reveal();
                this.revealed = true;
                Table.removeAllSelected();
            });

            const flagContainer = document.createElement("div");
            flagContainer.classList.add("flag-container");
            flagContainer.innerHTML += '<img src="./icons/flag.png">';
            flagContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                this.switchFlag();
                Table.removeAllSelected();
            });
        
        container1.appendChild( showelContainer );
        container1.appendChild( flagContainer );

        const container2 = document.createElement('div');

            const closeContainer = document.createElement("div");
            closeContainer.classList.add("close-container");
            closeContainer.innerHTML += '<img src="./icons/close.png">';
            closeContainer.addEventListener("click", (e) => {
                // Impede o click do elemento pai ser executado
                e.stopImmediatePropagation();
                Table.removeAllSelected();
            });

        container2.appendChild( closeContainer );
        container2.appendChild( document.createElement("div") );
        
        
        popupContainer.appendChild(container1);
        popupContainer.appendChild(container2);

        elem.appendChild( popupContainer );
        
        this.elem = elem;
        this.valueElem = valueContainer;
        this.popupElem = popupContainer;
    }

    reveal() {
        this.elem.classList.add("reveal");
        if (this.value == -2) {
            Table.revealBombs();
        }
    }

    switchFlag() {
        if (!this.flagAssigned) {
            this.flagAssigned = true;
            this.flagElem.style.visibility = "visible";
        } else {
            this.flagAssigned = false;
            this.flagElem.style.visibility = "hidden";
        }
    }
}


const Table =  {
    nBombs: 35,
    gridSizeX: 18,
    gridSizeY: 11,
    table: document.querySelector("#table-container"),
    bombs:[],

    start() {
        this.table.innerHTML = "";
        let tiles = Table.genBombs();
        Table.genTable(
            Table.addIndicators(
                tiles
            )
        );
        for (let i = 0; i < tiles.length; i++) {
            for (let j = 0; j < tiles[i].length; j++) {
                if (tiles[j][i] == -2) {
                    Table.bombs.push( Table.table.querySelectorAll(".row")[j].querySelectorAll("div")[i] );
                }
            }
        }
    },

    genTable(table) {
        for (let i = 0; i < Table.gridSizeY; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < Table.gridSizeX; j++) {
                row.appendChild( new Tile(j, i, table[j][i]).elem );
            }
            this.table.appendChild( row );
        }
    },

    random() {
        let x, y;
        do {
            x = Math.floor( Math.random()*100 );
        } while (x >= this.gridSizeX);

        do {
            y = Math.floor( Math.random()*100 );
        } while (y >= this.gridSizeY);

        return {x, y};
    },

    genBombs() {
        let table = Array();
        for (let i = 0; i < Table.gridSizeX; i++) {
            let array = Array();
            for (let j = 0; j < Table.gridSizeY; j++) {
                array.push(0);
            }
            table.push(array);
        }

        let settedBombs = 0;
        for (settedBombs; settedBombs < Table.nBombs; settedBombs++) {
            let pos;
            do {
                pos = Table.random();
            } while (table[pos.x][pos.y] != 0);
            table[pos.x][pos.y] = -2;
        }
        return table;
    },

    revealBombs(x, y) {
        for (let i = 0; i < Table.bombs.length; i++) {
            setTimeout( () => {
                // Table.bombs[i].style.visibility = "visible" 
            }, i*500 );
        }
    },

    addIndicators(table) {
        for (let i = 0; i < Table.gridSizeX; i++) {
            for (let j = 0; j < Table.gridSizeY; j++) {
                if (table[i][j] != -2) {
                    let roundBombs = 0;
                    if (i-1 >= 0) {
                        if (table[i-1][j] == -2) roundBombs++;
                        if (j-1 >= 0)
                            if (table[i-1][j-1] == -2) roundBombs++;
                        if (j+1 < Table.gridSizeX)
                            if (table[i-1][j+1] == -2) roundBombs++;
                    }

                    if (i+1 < Table.gridSizeY) {
                        if (table[i+1][j] == -2) roundBombs++;
                        if (j-1 >= 0)
                            if (table[i+1][j-1] == -2) roundBombs++;
                        if (j+1 < Table.gridSizeX)
                            if (table[i+1][j+1] == -2) roundBombs++;
                    }
                    
                    if (j-1 >= 0)
                            if (table[i][j-1] == -2) roundBombs++;
                    if (j+1 < Table.gridSizeX)
                        if (table[i][j+1] == -2) roundBombs++;

                    table[i][j] = roundBombs
                }
            }
        }
        return table;
    },

    removeAllSelected(e) {
        let popups = document.querySelectorAll(".pop-up-container");
        for (let i = 0; i < popups.length; i++) {
            popups[i].style.visibility = "";
        }
    }

}

Table.start();



