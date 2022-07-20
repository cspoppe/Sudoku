export function listNumbersInRow(board, row) {
    const array = board[row];
    // populate array only with non-null values
    return array.filter((v) => (v));
}

export function listNumbersInCol(board, col) {
    // first we construct a new array containing values in this column
    const array = new Array(9);
    for (let row = 0; row < 9; row++) {
        array[row] = board[row][col];
    }
    return array.filter((v) => (v));
}

export function listNumbersInSquare(board, row, col) {
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

    return array.filter((v) => (v));
}


export function updateSquare(row, col, val) {
    const square = document.querySelector(`#sqR${row}C${col}`);
    if (val > 0) {
        square.innerText = val;
    } else {
        square.innerText = '';
    }
}

function recordSolution(positions) {
    var solution = [];

    for (let row of positions) {
        let index = row[1];
        solution.push(row[2][index]);
    }

    return solution;
}

export function recursiveSolve(board, findAllFlag, updateDisplayFlag) {
    var possibleEntries = listPossibleEntries(board);
    var solutions = [];
    var resumeFlag = true;

    function helper(board, positions) {
        // holdSolution();
        // check if board is valid.
        if (checkValidBoard(board)) {
            //console.log('Valid board');
            // if board is valid, check is the board is complete.
            // If it is, then a solution has been found
            if (checkCompleteBoard(board)) {
                //console.log(`Solution found!`);
                let sol = recordSolution(positions);
                solutions.push(sol);
                if (findAllFlag) {
                    // backtrack in order to continue searching and look for further solutions
                    resumeFlag = backtrackPosition(board, positions, updateDisplayFlag);
                } else {
                    resumeFlag = false;
                }
            }
            // If the board is incomplete, fill the next position
            //console.log('Board incomplete');
            fillNextPosition(board, positions, updateDisplayFlag);
        } else {
            // if the board is invalid, undo the last entry
            //console.log('Invalid; backtracking');
            resumeFlag = backtrackPosition(board, positions, updateDisplayFlag);
        }
        // call helper function with updated board
        if (resumeFlag) {
            try {
                helper(board, positions);
            } catch (err) {
                // this is just to catch an error for max call stack size exceeded
                return;
            }
        }
    }

    if (possibleEntries.length > 0) {
        helper(board, possibleEntries);
    } else {
        console.log('No solution possible');
    }

    return solutions.length;
}

// returns true if it was able to backtrack
// return false if backtracking was not possible (all options explored)
function backtrackPosition(board, positions, updateDisplayFlag) {
    // Find the most recent field that has been filled
    // This is the last row where the second entry is zero or greater
    var row = 0;
    for (let i = 0; i < positions.length; i++) {
        if (positions[i][1] === -1) {
            row = i - 1;
            break;
        } else if (i === positions.length - 1) row = i;
    }

    // indicates no solution has been found
    if (row < 0) {
        //console.log('No solution found');
        return false;
    }

    var entry = positions[row];

    // Grab the row and column
    var pos = entry[0];
    var R = Math.floor(pos / 10);
    var C = pos % 10;

    // Update the index so we try out the next possible entry
    var i = entry[1];
    var value = 0;
    // check if there are more possible entries to try at this field
    if (i < entry[2].length - 1) {
        i++;
        value = entry[2][i];
        // update the board
        //console.log(`R: ${R}, C: ${C}, value: ${value}`);
        board[R][C] = value;
        if (updateDisplayFlag) updateSquare(R, C, value);
        // update the positions array to reflect the latest entry
        positions[row][1] = i;
    } else {
        // All possibilities on the latest field have been tried and are invalid
        // The 2nd-latest field needs to be advanced (or backtracked if necessary)
        board[R][C] = null;
        if (updateDisplayFlag) updateSquare(R, C, value);
        positions[row][1] = -1;
        return backtrackPosition(board, positions, updateDisplayFlag);
    }

    return true;
}


// this function takes an incomplete board and lists all the possible entries for
// each empty square
function listPossibleEntries(board) {
    var possibleEntries = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                // let unusedEntries = [];
                // const rowEntries = listNumbersInRow(board, row);
                // const colEntries = listNumbersInCol(board, col);
                // const squEntries = listNumbersInSquare(board, row, col);
                // const entries = [...rowEntries, ...colEntries, ...squEntries];
                // const uniqueEntries = [...new Set(entries)];

                // for (let i = 1; i < 10; i++) {
                //     if (!uniqueEntries.includes(i)) {
                //         unusedEntries.push(i);
                //     }
                // }

                let unusedEntries = getLegalEntries(board, row, col);

                // board position encoded into one number
                // tens digit - row
                // ones digit - column
                // Second entry (-1) will be used by recursive function to keep track of which entry is being used
                // in exploring possible solutions
                const boardPos = row * 10 + col;
                unusedEntries = [boardPos, -1, unusedEntries];

                possibleEntries.push(unusedEntries);
            }
        }
    }


    return possibleEntries;
}

export function getLegalEntries(board, row, col) {
    let unusedEntries = [];
    const rowEntries = listNumbersInRow(board, row);
    const colEntries = listNumbersInCol(board, col);
    const squEntries = listNumbersInSquare(board, row, col);
    const entries = [...rowEntries, ...colEntries, ...squEntries];
    const uniqueEntries = [...new Set(entries)];

    for (let i = 1; i < 10; i++) {
        if (!uniqueEntries.includes(i)) {
            unusedEntries.push(i);
        }
    }

    return unusedEntries;
}

function checkValidBoard(board) {

    try {
        // first check that all rows are valid
        for (var row = 0; row < 9; row++) {
            if (!checkValidRow(board, row)) return false;
        }

        // check that all columns are valid
        for (var col = 0; col < 9; col++) {
            if (!checkValidCol(board, col)) return false;
        }

        // check that all 3x3 squares are valid
        for (var row = 0; row < 9; row += 3) {
            for (var col = 0; col < 9; col += 3) {
                if (!checkValidSquare(board, row, col)) return false;
            }
        }

        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

function checkCompleteBoard(board) {
    var filledFields = 0;
    for (let row of board) {
        filledFields += row.filter((v) => v).length;
    }
    return (filledFields === 81);
}

/*
The array 'positions' looks like:
[
    [08,-1,[1,5,7,8]]
    [14,-1,[2,3,4]]
    [37,-1,[6,9]]
    .
    .
    .
]
First entry in each row is the board position, where tens digit is the row and ones digit is the column
Second entry is the index of the possible value currently being used; -1 indicates this position is currently blank
Third entry is list of legal entries for the position (given that no other empty fields are filled)
*/
function fillNextPosition(board, positions, updateDisplayFlag) {
    // First, we need to figure out where the next empty field to fill in is
    // To do this, we look in the positions array and find the first row for the second entry is -1
    var row = 0;
    for (let i = 0; i < positions.length; i++) {
        if (positions[i][1] === -1) {
            row = i;
            break;
        }
    }

    var entry = positions[row];

    // Next we grab the row, column and value of the next empty field to fill in
    var pos = entry[0];
    var R = Math.floor(pos / 10);
    var C = pos % 10;
    var value = entry[2][0];

    // update the board
    //console.log(`R: ${R}, C: ${C}, value: ${value}`);
    board[R][C] = value;
    if (updateDisplayFlag) updateSquare(R, C, value);
    // update the positions array to reflect that this entry has been filled
    positions[row][1] = 0;
}


function checkValidRow(board, row) {
    var array = listNumbersInRow(board, row);

    const arrayUnique = [...new Set(array)];
    if (arrayUnique.length === array.length) {
        return true;
    }
    return false;
}

function checkValidCol(board, col) {
    var array = listNumbersInCol(board, col);

    const arrayUnique = [...new Set(array)];
    if (arrayUnique.length === array.length) {
        return true;
    }
    return false;

}

function checkValidSquare(board, row, col) {
    var array = listNumbersInSquare(board, row, col);

    const arrayUnique = [...new Set(array)];
    if (arrayUnique.length === array.length) {
        return true;
    }
    return false;

}