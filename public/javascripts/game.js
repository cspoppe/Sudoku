import * as rand from './randFcns.js';
import * as solve from './solveFcns.js';

const btnErase = document.querySelector("#erase");
const btnClearAll = document.querySelector("#clear");
const btnRandomPuzzle = document.querySelector("#randomPuzzle");
const gameBoard = document.querySelector("#gameBoard");
const gameCover = document.querySelector('.gameCover');
const victoryScreen = document.querySelector('.victoryScreen');
const helperModeSwitch = document.querySelector('#helperModeCheckbox');
const helperModeLabel = document.querySelector('#helperModeLabel');
const difficultySelect = document.querySelector('#difficulty');

btnErase.disabled = true;
btnClearAll.disabled = true;
helperModeSwitch.disabled = true;

var gameValues = new Array(9);
for (let i = 0; i < gameValues.length; i++) {
    gameValues[i] = new Array(9);
}

const squares = document.querySelectorAll(".square");
var inputs = document.querySelectorAll(".input");
var inputArray = Array.from(inputs);

var helperMode = false;

squares.forEach(function (square, i) {
    const name = square.id;
    const row = parseInt(name.slice(3, 4));
    const col = parseInt(name.slice(5));
    const value = parseInt(square.innerText);
    gameValues[row][col] = Number.isInteger(value) ? value : null;
})


function clearSelectedSquares() {
    for (const square of squares) {
        square.classList.remove('selected');
    }
}

function resetSquares() {
    for (const square of squares) {
        square.classList.remove('invalid');
        square.classList.remove('conflict');
    }
}

function getRowOccurrence(board, row, value) {
    const array = board[row];
    return array.filter((v) => (v === value)).length;
}

function getColOccurrence(board, col, value) {
    // first we construct a new array containing values in this column
    const array = new Array(9);
    for (let row = 0; row < 9; row++) {
        array[row] = board[row][col];
    }
    return array.filter((v) => (v === value)).length;
}

function getSquOccurrence(board, row, col, value) {
    const sRow = Math.floor(row / 3);
    const sCol = Math.floor(col / 3);
    const rowStart = sRow * 3;
    const colStart = sCol * 3;
    const array = new Array(9);
    for (let row = rowStart; row < rowStart + 3; row++) {
        for (let col = colStart; col < colStart + 3; col++) {
            array[row * 3 + col] = board[row][col];
        }
    }

    return array.filter((v) => (v === value)).length;
}

function markRowConflicts(row, val) {
    for (let i = 0; i < 9; i++) {
        if (gameValues[row][i] === val) {
            const square = document.querySelector(`#sqR${row}C${i}`);
            if (square.classList.contains('input')) {
                square.classList.add('invalid');
            } else {
                square.classList.add('conflict');
            }
        }
    }
}

function markColConflicts(col, val) {
    for (let i = 0; i < 9; i++) {
        if (gameValues[i][col] === val) {
            const square = document.querySelector(`#sqR${i}C${col}`);
            if (square.classList.contains('input')) {
                square.classList.add('invalid');
            } else {
                square.classList.add('conflict');
            }
        }
    }
}

function markSquConflicts(row, col, val) {
    const sRow = Math.floor(row / 3);
    const sCol = Math.floor(col / 3);
    const rowStart = sRow * 3;
    const colStart = sCol * 3;
    for (let row = rowStart; row < rowStart + 3; row++) {
        for (let col = colStart; col < colStart + 3; col++) {
            if (gameValues[row][col] === val) {
                const square = document.querySelector(`#sqR${row}C${col}`);
                if (square.classList.contains('input')) {
                    square.classList.add('invalid');
                } else {
                    square.classList.add('conflict');
                }
            }
        }
    }
}

function checkFields() {
    var filledFields = 0;
    for (let row of gameValues) {
        filledFields += row.filter((v) => v).length;
    }
    return filledFields;
}

function checkVictoryCondition() {
    const invalidSquares = document.querySelectorAll(".invalid");
    if (invalidSquares.length > 0) {
        console.log(`Invalid solution; # of incorrect entries = ${invalidSquares.length}`);
    } else {
        console.log('Victory!!!');
        victoryScreen.classList.add('show');
        enableNumberButtons(false);
        enableFunctionButtons(false);
        const square = document.querySelector('.selected');
        square.classList.remove('selected');
        var checkbox = document.querySelector('#helperModeCheckbox');
        checkbox.checked = false;
        helperMode = false;
    }
}

function updateSquares(inputVal = null) {
    // check if there is more than one entry of this number in the array.
    // If there is, we have a conflict
    resetSquares();
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            const val = gameValues[row][col];
            if (val !== null) {
                const rowFreq = getRowOccurrence(gameValues, row, val);
                const colFreq = getColOccurrence(gameValues, col, val);
                const squFreq = getSquOccurrence(gameValues, row, col, val);
                if (rowFreq > 1) markRowConflicts(row, val);
                if (colFreq > 1) markColConflicts(col, val);
                if (squFreq > 1) markSquConflicts(row, col, val);
            } else {
                if (helperMode) updateHelperTable(row, col, inputVal);
            }
        }
    }

    // add helper table back to the active square
    const square = document.querySelector('.selected');
    const R = parseInt(square.id.slice(3, 4));
    const C = parseInt(square.id.slice(5));
    if (inputVal < 0) {
        console.log('input deleted');
        if (helperMode) addHelperTable(R, C);
    }
    // check for victory condition
    const numFilledFields = checkFields();
    console.log(numFilledFields);

    if (numFilledFields === 81) checkVictoryCondition();
}

function setInputSquares() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            const val = gameValues[row][col];
            if (val === null) {
                const square = document.querySelector(`#sqR${row}C${col}`);
                square.classList.add('input');
            }
        }
    }

    inputs = document.querySelectorAll(".input");
    inputArray = Array.from(inputs);
    const firstSquare = inputs[0];
    firstSquare.classList.add('selected');
    addInputEventListeners();
}

function displayBoardValues() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var val = gameValues[row][col];
            solve.updateSquare(row, col, val);
        }
    }
}

function clearBoard() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            gameValues[row][col] = null;
        }
    }
    for (const square of squares) {
        square.classList.remove('invalid', 'conflict', 'input', 'selected');
    }
}

function displayHelperMode() {
    inputs.forEach(function (square) {
        const name = square.id;
        const row = parseInt(name.slice(3, 4));
        const col = parseInt(name.slice(5));
        if (!gameValues[row][col]) {
            addHelperTable(row, col);
        }
    })
}

function addHelperTable(row, col) {
    // get all the legal values that could be entered in this field
    const square = document.querySelector(`#sqR${row}C${col}`);
    var helperTable = document.createElement('table');
    for (let i = 0; i < 3; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            var td = document.createElement('td');
            td.classList.add(`hlp${1 + i * 3 + j}`);
            td.classList.add('helperField');
            tr.appendChild(td);
        }
        helperTable.appendChild(tr);
    }
    helperTable.classList.add('helperTable');
    let validEntries = solve.getLegalEntries(gameValues, row, col);
    for (let entry of validEntries) {
        // get the helper field associated with this value
        const tr = helperTable.querySelector(`.hlp${entry}`);
        tr.innerText = entry;
    }
    square.appendChild(helperTable);
    //square.innerText = 'help';
}

function removeHelperMode() {
    const helperTables = document.querySelectorAll('.helperTable');
    helperTables.forEach(tbl => {
        tbl.remove();
    })
    // uncheck the helper mode slider
    var checkbox = document.querySelector('#helperModeCheckbox');
    checkbox.checked = false;
}

function updateHelperTable(row, col, val) {
    const square = document.querySelector(`#sqR${row}C${col}`);
    var helperTable = square.querySelector('.helperTable');
    if (helperTable) {
        //     const tr = helperTable.querySelector(`.hlp${Math.abs(val)}`);
        //     (val > 0) ? tr.innerText = '' : tr.innerText = Math.abs(val);
        let validEntries = solve.getLegalEntries(gameValues, row, col);
        for (let i = 1; i <= 9; i++) {
            const tr = helperTable.querySelector(`.hlp${i}`);
            (validEntries.includes(i)) ? tr.innerText = i : tr.innerText = '';
        }
    }
}

document.querySelectorAll(".numberButton").forEach(item => {
    item.disabled = true;
    item.addEventListener('click', (event) => {
        const square = document.querySelector('.selected');
        const btnName = event.target.id;
        const btnNum = parseInt(btnName.slice(3));
        console.log(`button number ${btnNum}`);
        if (square) {
            const name = square.id;
            const row = parseInt(name.slice(3, 4));
            const col = parseInt(name.slice(5));
            square.innerText = btnNum;
            gameValues[row][col] = btnNum;
            updateSquares(btnNum);
        }
    })
})

function enableNumberButtons(enableState) {
    document.querySelectorAll(".numberButton").forEach(item => {
        item.disabled = !enableState;
    })
}

function enableFunctionButtons(enableState) {
    btnErase.disabled = !enableState;
    btnClearAll.disabled = !enableState;
    helperModeSwitch.disabled = !enableState;
    if (enableState) {
        helperModeLabel.classList.add('enabled');
    }
    else {
        helperModeLabel.classList.remove('enabled');
    }
}

function addInputEventListeners() {
    inputs.forEach(item => {
        item.addEventListener('click', () => {
            clearSelectedSquares();
            item.classList.add('selected');
        })
    })
}

helperModeSwitch.addEventListener('click', () => {
    var checkbox = document.querySelector('#helperModeCheckbox');
    if (checkbox.checked) {
        helperMode = true;
        displayHelperMode();
    } else {
        helperMode = false;
        removeHelperMode();
    }
})

btnErase.addEventListener('click', () => {
    const square = document.querySelector('.selected');
    if (square) {
        const name = square.id;
        const row = parseInt(name.slice(3, 4));
        const col = parseInt(name.slice(5));
        // grab the old value
        const val = gameValues[row][col];
        gameValues[row][col] = null;
        square.innerText = '';
        updateSquares(-val); // negative sign indicates that this value has been removed
    }
})

btnClearAll.addEventListener('click', () => {
    inputs.forEach((input) => {
        const name = input.id;
        const row = parseInt(name.slice(3, 4));
        const col = parseInt(name.slice(5));
        gameValues[row][col] = null;
        input.innerText = '';
    })
    helperMode = false;
    removeHelperMode();
    updateSquares();

})

btnRandomPuzzle.addEventListener('click', () => {
    console.clear();
    victoryScreen.classList.remove('show');
    helperMode = false;
    removeHelperMode();
    helperModeSwitch.disabled = true;
    helperModeLabel.classList.remove('enabled');
    var difficulty = difficultySelect.value;
    console.log(`difficulty: ${difficulty}`);
    // get the difficulty setting

    var nSolutions = 0;
    while (!nSolutions) {
        clearBoard();
        rand.generateRandomBoardStarter(gameValues, false);
        nSolutions = solve.recursiveSolve(gameValues, false, false);
    }
    rand.generateRandomPuzzle(difficulty, gameValues, false);
    enableNumberButtons(true);
    enableFunctionButtons(true);
    displayBoardValues();
    setInputSquares();
    gameBoard.classList.add('boardEnabled');
    gameCover.classList.add('hidden');
})

document.addEventListener('keyup', (event) => {
    const input = parseInt(event.key);
    if (Number.isInteger(input) && input !== 0) {
        const square = document.querySelector('.selected');
        if (square) {
            const name = square.id;
            const row = parseInt(name.slice(3, 4));
            const col = parseInt(name.slice(5));
            square.innerText = input;
            gameValues[row][col] = input;
            updateSquares(input);
        }
    } else if (event.key === 's') {
        console.log(event.key);
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        var nextSquare = square;
        if (i + 1 < inputArray.length) {
            nextSquare = inputs[i + 1];
        } else {
            nextSquare = inputs[0];
        }
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }
    else if (event.key === 'a') {
        console.log(event.key);
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        var nextSquare = square;
        i--
        if (i < 0) i = inputArray.length - 1;
        nextSquare = inputs[i];
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }
    else if (event.key === 'Backspace' || event.key === 'Delete') {
        const square = document.querySelector('.selected');
        if (square) {
            const name = square.id;
            const row = parseInt(name.slice(3, 4));
            const col = parseInt(name.slice(5));
            const val = gameValues[row][col];
            square.innerText = '';
            gameValues[row][col] = null;
            updateSquares(-val);
        }
    }
    else if (event.key === 'ArrowDown') {
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        const name = square.id;
        const col = parseInt(name.slice(5));
        var nextFound = false;
        var nextSquare = square;
        while (!nextFound) {
            i++;
            if (i + 1 === inputArray.length) i = 0;
            nextSquare = inputs[i];
            const newCol = parseInt(nextSquare.id.slice(5));
            if (newCol === col) nextFound = true;
        }
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }
    else if (event.key === 'ArrowUp') {
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        const name = square.id;
        const col = parseInt(name.slice(5));
        var nextFound = false;
        var nextSquare = square;
        while (!nextFound) {
            i--;
            if (i < 0) i = inputArray.length - 1;
            nextSquare = inputs[i];
            const newCol = parseInt(nextSquare.id.slice(5));
            if (newCol === col) nextFound = true;
        }
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }
    else if (event.key === 'ArrowLeft') {
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        const name = square.id;
        const row = parseInt(name.slice(3, 4));
        var nextFound = false;
        var nextSquare = square;
        while (!nextFound) {
            i--;
            if (i < 0) i = inputArray.length - 1;
            nextSquare = inputs[i];
            const newRow = parseInt(nextSquare.id.slice(3, 4));
            if (newRow === row) nextFound = true;
        }
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }
    else if (event.key === 'ArrowRight') {
        const square = document.querySelector('.selected');
        var i = inputArray.indexOf(square);
        const name = square.id;
        const row = parseInt(name.slice(3, 4));
        var nextFound = false;
        var nextSquare = square;
        while (!nextFound) {
            i++;
            if (i + 1 === inputArray.length) i = 0;
            nextSquare = inputs[i];
            const newRow = parseInt(nextSquare.id.slice(3, 4));
            if (newRow === row) nextFound = true;
        }
        clearSelectedSquares();
        nextSquare.classList.add('selected');
    }

})