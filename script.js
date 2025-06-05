// gameboard object with array
//players object
// object to control the flow of the game itself.


const players = {
    x: "X", 
    o: "O"
};

function makeBoard(){
    const row = 3;
    const columns = 3;
    let board = [];

    for(let i =0; i <= 3; i++ ){
        board[i] = [];
        for(let j =0; j <= 3; j++ ){
            board[i].push();
        }
    }
    const getBoard = () => board;
    const dropToken = (column, player) => {
        const availableCells = board.filter((row) => row[column].getValue()
    === 0 ).map(row => row[column]);

    if(!availableCells.length) return;
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);

    };
}

