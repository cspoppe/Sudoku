const squares = document.querySelectorAll(".square");
const btnRandomSolution = document.querySelector("#randomSolution");
const btnRandomPuzzle = document.querySelector("#randomPuzzle");
const btnShowErrors = document.querySelector("#showErrors");

import * as rand from './randFcns.js';
import * as solve from './solveFcns.js';

btnRandomPuzzle.disabled = true;

var gameValues = new Array(9);
for (let i = 0; i < gameValues.length; i++) {
    gameValues[i] = new Array(9);
}

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        gameValues[i][j] = null;
    }
}

btnRandomSolution.addEventListener('click', () => {
    rand.generateRandomBoardStarter(gameValues);
    console.log(gameValues);
    solve.recursiveSolve(gameValues, false, true);
    btnRandomPuzzle.disabled = false;
})

btnRandomPuzzle.addEventListener('click', () => {
    rand.generateRandomPuzzle(gameValues);
})

btnShowErrors.addEventListener('click', () => {
    console.log(gameValues);
    checkErrors();
})

function checkErrors() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var square = document.querySelector(`#sqR${i}C${j}`);
            var squareText = parseInt(square.innerText);
            if (squareText !== gameValues[i][j]) {
                square.classList.add('conflict');
            }
        }
    }
}