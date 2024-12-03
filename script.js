const GameBoard = (()=>{
    let board = Array(9).fill(null);
    const getBoard = ()=> board;
    const setmark = (index, mark)=>{
        if (!board[index]) board[index] = mark;
    };
    const reset = ()=> (board = Array(9).fill(null))
    
    return{
        getBoard,
        setmark,
        reset
    }
})();

const PlayerName = (name, mark)=>{
    
    return {
        name,
        mark,
    }
};

const Game = (()=>{
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const start = (player1, player2) =>{
        players = [PlayerName(player1, "X"),PlayerName(player2, "O")]
        currentPlayerIndex = 0;
        GameBoard.reset();
        gameOver = false;
    }
    const playerTurn = (index) => {
        if (gameOver || GameBoard.getBoard()[index]) return;
        GameBoard.setmark (index, players[currentPlayerIndex].mark);

        if (checkWinner()){
            gameOver = true;
            displayController.showresult = (`${players[currentPlayerIndex].name} wins!`);
        } else if (tie()){
            gameOver = true;
            displayController.showresult = ("it's a tie");
        } else{
            currentPlayerIndex = 1 - currentPlayerIndex;
        }
    }
    const checkWinner = ()=>{
        const board = GameBoard.getBoard();
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],            // Diagonals
          ];
          return winningCombos.some(combo => 
            combo.every(index => board[index] === players[currentPlayerIndex].mark))
    }
    const tie = () => GameBoard.getBoard().every((cell)=> cell !== null);
    return{
        start,
        playerTurn
    }
})();

const displayController = (()=>{
    const gameBoardContainer = document.querySelector(".cell-container");
    const resultContainer = document.querySelector(".result");
    const resetBtn = document.querySelector(".reset-btn");
    const submitBtn = document.querySelector(".submit-btn");
    const overlay = document.querySelector(".input-overlay");
    let player1Input = document.querySelector("#player1");
    let player2Input = document.querySelector("#player2");
    const player1point = document.querySelector(".player-point p:first-child");
    const player2point = document.querySelector(".player-point p:last-child");
    const playerTurnDisplay = document.querySelector(".player-turn");

    const render = ()=>{
        gameBoardContainer.innerHTML = "";
        GameBoard.getBoard().forEach((mark, index)=>{
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark || "";
            
            cell.addEventListener('click', ()=>{
                Game.playerTurn(index);
            });

            gameBoardContainer.appendChild(cell);
        });
    };

    const showresult = (message)=>{
        resultContainer.textContent = message;
    };
    
    const showTurn = (PlayerName) =>{
        playerTurnDisplay.textContent = `${PlayerName}'s Turn`;
    };

    submitBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        const player1 = player1Input.value || "player1";
        const player2 = player2Input.value || "player2";

        player1point.textContent = `${player1} (X)`;
        player2point.textContent = `${player2} (O)`
        
        overlay.style.display = "none";
        Game.start(player1, player2);
        render();
        showTurn(player1);
    });
    
    resetBtn.addEventListener("click", ()=>{
        Game.start(player1Input.value || "player1", player2Input.value || "palyer2");
        render();
        showresult("");
        showTurn(player1Input.value || "player1");
    })
    return{
        render,
        showresult,
        showTurn
    }   
})();
displayController.render();