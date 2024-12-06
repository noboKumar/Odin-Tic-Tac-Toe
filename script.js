const GameBoard = (()=>{
    let board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ]
    const getBoard = () => board;
    
    const updateBoard = (index, mark) => {
        if(!board[index]){
            board[index] = mark;
        }
    }
    const resetBoard = () => board.fill("");

    return{
        getBoard,
        updateBoard,
        resetBoard
    }
})();

const playerName = (name, mark) => {

    return {
        name,
        mark
    }
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;

    const start = (player1, player2) => {
        players = [playerName(player1, "X"), playerName(player2, "O")];
        currentPlayerIndex = 0;
        GameBoard.resetBoard();
    };

    const currentPlayer = () => players[currentPlayerIndex];

    const switchTurn = () => {
        currentPlayerIndex = 1 - currentPlayerIndex;
    }

    const checkWinner = () => {
        const board = GameBoard.getBoard();
        const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
        ];
        return winningCombos.some((pattern) => {
           return pattern.every((index) => {
               return  board[index] === currentPlayer().mark;
            })
        })
    }

    const tie = () => {
        return GameBoard.getBoard().every(cell => cell);
    }
    return{
        start,
        currentPlayer,
        switchTurn,
        checkWinner,
        tie
    }
})();


const DisplayController = (() => {
    const gameBoardContainer = document.querySelector(".cell-container");
    const resultContainer = document.querySelector(".result");

    const render = () => {
        const board = GameBoard.getBoard();
        gameBoardContainer.innerHTML = "";
        
        board.forEach((cell, index) => {
            const cellContainer = document.createElement("div");
            cellContainer.textContent = cell;
            cellContainer.classList.add("cell");

            cellContainer.addEventListener("click", () => handleCellClick(index));
            gameBoardContainer.appendChild(cellContainer);
        });
    }

    const handleCellClick = (index) => {
        const currentPlayer = GameController.currentPlayer();
        GameBoard.updateBoard(index, currentPlayer.mark);
        render();

        if(GameController.checkWinner()){
            resultContainer.textContent = `${currentPlayer.name} Wins!`;
        } else if(GameController.tie()){
            resultContainer.textContent = "it's a tie!";
        } else{
            GameController.switchTurn();
        }
    }
    return{
        render
    }
})();

const startBtn = document.querySelector(".start-btn"); //sumbit btn
const resetBtn = document.querySelector(".reset-btn"); //reset btn
const player1 = document.querySelector("#player1").value || "player1";
const player2 = document.querySelector("#player2").value || "player2";

startBtn.addEventListener("click", () => {
    GameController.start(player1, player2);
    DisplayController.render();
    document.querySelector(".result").textContent = "";
});

resetBtn.addEventListener("click", () => {
    GameController.start(player1, player2);
    DisplayController.render();
    document.querySelector(".result").textContent = "";
})