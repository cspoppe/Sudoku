import * as solve from './solveFcns.js';

function getValidEntries(board, row, col) {
    const rowEntries = solve.listNumbersInRow(board, row);
    const colEntries = solve.listNumbersInCol(board, col);
    const squEntries = solve.listNumbersInSquare(board, row, col);

    const entries = [...rowEntries, ...colEntries, ...squEntries];
    const uniqueEntries = [...new Set(entries)];

    const unusedEntries = [];
    for (let i = 1; i < 10; i++) {
        if (!uniqueEntries.includes(i)) {
            unusedEntries.push(i);
        }
    }

    return unusedEntries;
}

// returns 9x9 matrix containing (row,col) address of each board position
function returnBoardPos() {
    var positions = [];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            positions.push([row, col]);
        }
    }

    return positions;
}

export function generateRandomBoardStarter(board, displayUpdateFlag) {
    var positions = returnBoardPos();
    var nSteps = 0
    var pos = [];
    var row = 0;
    var col = 0;
    // populate half the board with random entries.
    // After this step, we will use the solver functions to find a solution
    while (nSteps < 10) {
        pos = retrieveRandomPos(positions);
        row = pos[0];
        col = pos[1];
        //grab a list of all the valid numbers that could be entered at this position, given the state of the board
        const validEntries = getValidEntries(board, row, col);
        // choose a random number from these valid entries

        const i = Math.floor(Math.random() * validEntries.length);
        const entry = validEntries[i];

        // set the game board to this value at this position
        board[row][col] = entry;

        // update the display
        if (displayUpdateFlag) solve.updateSquare(row, col, entry);

        // nSteps will kick out of while loop if there is a bug
        nSteps++;
    }
}

export function generateRandomPuzzle(difficulty, board, updateDisplayFlag) {
    var positions = returnBoardPos();
    var nFilledSquares = 0;
    switch (difficulty) {
        case 'easy':
            nFilledSquares = 36;
            break;
        case 'medium':
            nFilledSquares = 30;
            break;
        case 'hard':
            nFilledSquares = 24;
            break;
        case 'debug':
            nFilledSquares = 76;
            break;
    }

    nFilledSquares += Math.floor(Math.random() * 3);

    while (positions.length > nFilledSquares) {
        //var pos = retrieveRandomPos(positions);
        console.log(positions.length);
        const posIndex = Math.floor(Math.random() * positions.length);
        var pos = positions[posIndex];
        // remove that entry from the array
        positions.splice(posIndex, 1);
        var row = pos[0];
        var col = pos[1];

        // save the value of this field in case we need to undo this step later
        var value = board[row][col];

        // make this field in the board blank.
        board[row][col] = null;
        if (updateDisplayFlag) solve.updateSquare(row, col, null);
        // check if there is a unique solution to this puzzle
        var boardCopy = copyGameBoard(board);
        var nSolutions = solve.recursiveSolve(boardCopy, true, false);
        console.log(`# of solutions: ${nSolutions}`);
        if (nSolutions > 1) {
            console.log(`No unique solution; # solutions = ${nSolutions}`)
            // there is not a unique solution to this puzzle, so put the value back in this field
            board[row][col] = value;
            // push this position back into the array
            positions.push([row, col]);
            if (updateDisplayFlag) solve.updateSquare(row, col, value);
        } else if (nSolutions === 0) {
            console.log('No solution found!');
            console.log(board);
            break;
        }
    }

    console.log('Puzzle is ready!');
}

function copyGameBoard(board) {
    var copy = new Array(9);
    for (let i = 0; i < copy.length; i++) {
        copy[i] = new Array(9);
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            copy[i][j] = board[i][j];
        }
    }

    return copy;
}

// function stepRandomPuzzle() {
//     console.log(positions.length);
//     if (positions.length > 40) {
//         //var pos = retrieveRandomPos(positions);

//         const posIndex = Math.floor(Math.random() * positions.length);
//         var pos = positions[posIndex];
//         // remove that entry from the array
//         positions.splice(posIndex, 1);
//         var row = pos[0];
//         var col = pos[1];

//         // save the value of this field in case we need to undo this step later
//         var value = gameValues[row][col];

//         // make this field in the board blank.
//         gameValues[row][col] = null;
//         solve.updateSquare(row, col, null);
//         console.log(gameValues);
//         // check if there is a unique solution to this puzzle
//         var boardCopy = copyGameBoard(gameValues);
//         var nSolutions = solve.recursiveSolve(boardCopy, true, false);
//         console.log(`# of solutions: ${nSolutions}`);
//         if (nSolutions !== 1) {
//             console.log(`No unique solution; # solutions = ${nSolutions}`)
//             // there is not a unique solution to this puzzle, so put the value back in this field
//             gameValues[row][col] = value;
//             // push this position back into the array
//             positions.push([row, col]);
//             solve.updateSquare(row, col, value);
//         } else {
//             if (positions.length <= 40) {
//                 console.log('Puzzle Finished');
//                 btnAdvancePuzzle.disabled = true;
//             }
//         }
//     }
// }

function retrieveRandomPos(positions) {
    // Grab a random entry from the positions array
    const posIndex = Math.floor(Math.random() * positions.length);
    const pos = positions[posIndex];
    // remove that entry from the array
    positions.splice(posIndex, 1);

    return pos;
}