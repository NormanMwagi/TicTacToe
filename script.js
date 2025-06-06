function Cell() {
  let value = "";
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  return { addToken, getValue };
}

function MakeBoard() {
  const size = 3;
  let board = [];

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = Cell();
    }
  }

  const getBoard = () => board;

  const dropToken = (row, col, player) => {
    const cell = board[row][col];
    if (cell.getValue() !== "") return false;
    cell.addToken(player);
    return true;
  };

  const reset = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        board[i][j] = Cell();
      }
    }
  };

  return { getBoard, dropToken, reset };
}

function GameController(playerOneName = "Player X", playerTwoName = "Player O") {
  const board = MakeBoard();
  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" }
  ];
  let activePlayer = players[0];
  let isGameOver = false;

  const turnDisplay = document.getElementById("turn-display");
  const gameboardDiv = document.getElementById("gameboard");
  const resetBtn = document.getElementById("reset-btn");

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const renderBoard = () => {
    const boardArray = board.getBoard();
    gameboardDiv.innerHTML = "";

    boardArray.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        const value = cell.getValue();

        if (value) {
          cellDiv.textContent = value;
          cellDiv.classList.add("taken");
        }

        cellDiv.addEventListener("click", () => {
          if (isGameOver) return;

          const success = board.dropToken(rowIndex, colIndex, getActivePlayer().token);
          if (!success) return;

          renderBoard();
          const winner = checkWinner();

          if (winner) {
            turnDisplay.textContent = `${getActivePlayer().name} (${getActivePlayer().token}) wins! 🎉`;
            isGameOver = true;
            return;
          }

          if (isBoardFull()) {
            turnDisplay.textContent = "It's a draw!";
            isGameOver = true;
            return;
          }

          switchPlayerTurn();
          printNewRound();
        });

        gameboardDiv.appendChild(cellDiv);
      });
    });
  };

  const checkWinner = () => {
    const b = board.getBoard().map(row => row.map(cell => cell.getValue()));
    const lines = [
      // Rows
      [b[0][0], b[0][1], b[0][2]],
      [b[1][0], b[1][1], b[1][2]],
      [b[2][0], b[2][1], b[2][2]],
      // Columns
      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],
      // Diagonals
      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]],
    ];

    return lines.some(line => {
      return line.every(cell => cell === getActivePlayer().token);
    });
  };

  const isBoardFull = () => {
    return board.getBoard().every(row =>
      row.every(cell => cell.getValue() !== "")
    );
  };

  const printNewRound = () => {
    turnDisplay.textContent = `${getActivePlayer().name}'s turn (${getActivePlayer().token})`;
  };

  const resetGame = () => {
    board.reset();
    activePlayer = players[0];
    isGameOver = false;
    renderBoard();
    printNewRound();
  };

  resetBtn.addEventListener("click", resetGame);

  const start = () => {
    renderBoard();
    printNewRound();
  };

  return { start };
}

const game = GameController();
game.start();
