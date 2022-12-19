
class Tile {

    elem;
    valueElem;
    popupElem;
    value;
    flagAssigned = false;
    x;
    y;

    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.genModel();
        this.elem.onclick = () => {
            this.elem.style = `cursor: context-menu`;
            // this.valueElem.style.visibility = "visible";
            Table.removeAllSelected();
            console.log("mudado visibilidade")
            this.popupElem.style.visibility = "visible";
            if (value == -2)
                console.log("Boom!")
        }
    }

    genModel() {
        let elem = document.createElement("div");
        // elem.innerHTML = this.value;
        // elem.innerHTML = `
        //     <div class="value">${this.value}</div>
        //     <div class="pop-up-menu"></div>
        // `;

        let valueContainer = document.createElement("div");
        valueContainer.innerText = this.value;
        valueContainer.classList.add("content");

        let color;
        switch(this.value) {
            case 1: color = "#961189"; break;
            case 2: color = "#119620"; break;
            case 3: color = "#42cbf5"; break;
            case 4: color = "#427ef5"; break;
            case 5: color = "#ffcc00"; break;
            case 6: color = "#f58442"; break;
            case 7: color = "#f54242"; break;
            case 8: color = "black"; break;
            default: color = "transparent";
        }
        valueContainer.style.color = color;
        elem.appendChild( valueContainer );
        
        let popupContainer = document.createElement("div");
        popupContainer.classList.add("pop-up-container");

        const e = document.createElement('div');
        const eee = document.createElement('div');
        e.classList.add('close-container');
        e.innerHTML += '<img src="./icons/close.png">';
        e.addEventListener('click', (e) => {
            // Impede do click do elemento pai ser executado
            e.stopImmediatePropagation();

            Table.removeAllSelected();
        });

        const ee = document.createElement('div');
        ee.appendChild(e);
        ee.appendChild(eee);

        popupContainer.innerHTML = `
            <div>
                <div class="showel-container"><img src="./icons/showel.png"></div>
                <div class="flag-container"><img src="./icons/flag.png"></div>
            </div>
        `;

        popupContainer.appendChild(ee);

        elem.appendChild( popupContainer );
        
        this.elem = elem;
        this.valueElem = valueContainer;
        this.popupElem = popupContainer;
    }
}


const Table =  {
    nBombs: 35,
    gridSizeX: 18,
    gridSizeY: 11,
    table: document.querySelector("#table-container"),

    start() {
        this.table.innerHTML = "";
        Table.genTable(
            Table.addIndicators(
                Table.genBombs()
            )
        );
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
        console.log(e)
        console.log("remove select")
        let popups = document.querySelectorAll(".pop-up-container");
        for (let i = 0; i < popups.length; i++) {
            popups[i].style.visibility = "";
        }
    }

}

Table.start();



