const btnListEntries = document.querySelector("#listEntries");
const btnSolve = document.querySelector("#solve");
const btnAdvance = document.querySelector("#advance");

import * as solve from './solveFcns.js';

if (btnAdvance) {
    btnAdvance.disabled = true;
}

var gameValues = new Array(9);
for (let i = 0; i < gameValues.length; i++) {
    gameValues[i] = new Array(9);
}

const squares = document.querySelectorAll(".square");
const inputs = document.querySelectorAll(".input");
const inputArray = Array.from(inputs);

var advance = false;
var nSteps = 0;

squares.forEach(function (square, i) {
    const name = square.id;
    const row = parseInt(name.slice(3, 4));
    const col = parseInt(name.slice(5));
    const value = parseInt(square.innerText);
    gameValues[row][col] = Number.isInteger(value) ? value : null;
})

btnListEntries.addEventListener('click', () => {
    const entries = listPossibleEntries(gameValues);
    console.log(gameValues);
    console.log(entries);
})

btnSolve.addEventListener('click', () => {
    solve.recursiveSolve(gameValues);
})

btnAdvance.addEventListener('click', () => {
    helper(gameValues, possibleEntries);
})

function holdSolution() {
    btnAdvance.disabled = false;
    while (!advance) {
        setTimeout(function () { }, 1000);
    }
    btnAdvance.disabled = true;
}