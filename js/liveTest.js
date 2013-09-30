//Variable declaration
var xlength = 5;
var ylength = 5;
var timeBetweenSteps = 1000;

var timeStartTest;
var bornCells;
var deadCells;
var currentAliveCells;
var currentDeadCells;

var cells = new Array(xlength);
var i;
for (i = 0; i < xlength; i++) {
    cells[i] = new Array(ylength);
}

function cell(isAlive, posX, posY, div) {
    this.isAlive = isAlive;
    this.posX = posX;
    this.posY = posY;
    this.div = div;
}

function startTest() {
    timeStartTest = new Date();
    bornCells = 0;
    deadCells = 0;
    currentAliveCells = 0;
    currentDeadCells = 0;
    var lifeZone = window.document.getElementById("liveZone");
    while (lifeZone.firstChild) {
        lifeZone.removeChild(lifeZone.firstChild);
    }
    for (i = 0; i < xlength; i++) {
        for (j = 0; j < ylength; j++) {
            var div = document.createElement('div');
            if (Math.random() > 0.5) {
                div.className = "deadCell";
                cells[i][j] = new cell(false, i, j, div);
                deadCells = deadCells + 1;
                currentDeadCells = currentDeadCells + 1;
            } else {
                div.className = "aliveCell";
                cells[i][j] = new cell(true, i, j, div);
                bornCells = bornCells + 1;
                currentAliveCells = currentAliveCells + 1;
            }
            div.appendChild(document.createTextNode(''));
            lifeZone.appendChild(div);
        }
    }
    //Plots a partial summary
    window.setTimeout(lifeProcess, timeBetweenSteps);
    makeReport();
}

function lifeProcess() {
    //Copies the matrix
    var auxMatrix = cells;
    //Traverses the cells
    for (i = 0; i < xlength; i++) {
        for (j = 0; j < ylength; j++) {
            var aliveNeighbors = 0;
            var cell = auxMatrix[i][j];
            //Takes account of the live or dead neighbors
            var rowLimit = auxMatrix.length - 1;
            var columnLimit = auxMatrix[0].length - 1;

            for (x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
                for (y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
                    if (x !== i || y !== j) {
                        var auxCell = auxMatrix[x][y];
                        aliveNeighbors = (auxCell.isAlive === true) ? aliveNeighbors += 1 : aliveNeighbors;
                    }
                }
            }

            //Modifies the state of the cell, based on the original game rules.
            if (cell.isAlive && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                deadCells = deadCells + 1;
                currentDeadCells = currentDeadCells + 1;
                currentAliveCells = currentAliveCells - 1;
                cell.isAlive = false;
                cell.div.className = "deadCell";
            } else if (cell.isAlive === false && aliveNeighbors === 3) {
                bornCells = bornCells + 1;
                currentAliveCells = currentAliveCells + 1;
                currentDeadCells = currentDeadCells - 1;
                cell.isAlive = true;
                cell.div.className = "aliveCell";
            }
        }
    }
    cells = auxMatrix;
    repaintScreen();
    //Plots the sumary of data
    makeReport();
}

function repaintScreen() {
    var lifeZone = window.document.getElementById("liveZone");
    while (lifeZone.firstChild) {
        lifeZone.removeChild(lifeZone.firstChild);
    }
    for (i = 0; i < xlength; i++) {
        for (j = 0; j < ylength; j++) {
            var cell = cells[i][j];
            lifeZone.appendChild(cell.div);
        }
    }
    window.setTimeout(lifeProcess, timeBetweenSteps);
}

function makeReport(){
    timeEllapsed = new Date() - timeStartTest;
    divTime = window.document.getElementById("timeEllapsed");
    divCellsBorn = window.document.getElementById("cellsBorn");
    divCellsDead = window.document.getElementById("cellsDead");
    divCurrentAliveCells = window.document.getElementById("currentAliveCells");
    divCurrentDeadCells = window.document.getElementById("currentDeadCells");
    divTime.innerHTML = timeEllapsed;
    divCellsBorn.innerHTML = bornCells;
    divCellsDead.innerHTML = deadCells;
    divCurrentAliveCells.innerHTML = currentAliveCells;
    divCurrentDeadCells.innerHTML = currentDeadCells;
}