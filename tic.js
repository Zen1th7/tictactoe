// Game state
let gameState = {
    currentPlayer: 'X',
    board: Array(9).fill(''),
    scores: { X: 0, O: 0 },
    gameHistory: [],
    gameActive: true
};

// Winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Get cell index from ID
const getCellIndex = (cellId) => parseInt(cellId.replace('b', '')) - 1;

// Update game status display
const updateStatus = () => {
    const status = document.getElementById('status');
    if (!gameState.gameActive) {
        const winner = checkWinner();
        status.textContent = winner 
            ? `Player ${winner} Wins!` 
            : "It's a Tie!";
    } else {
        status.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
};

// Check for winner
const checkWinner = () => {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            highlightWinningCells(combo);
            return gameState.board[a];
        }
    }
    return null;
};

// Highlight winning cells
const highlightWinningCells = (cells) => {
    cells.forEach(index => {
        document.getElementById(`b${index + 1}`).classList.add('winner');
    });
};

// Handle player move
function handleMove(cell) {
    if (!gameState.gameActive || cell.value) return;

    const index = getCellIndex(cell.id);
    gameState.board[index] = gameState.currentPlayer;
    
    // Update cell
    cell.value = gameState.currentPlayer;
    cell.classList.add(gameState.currentPlayer.toLowerCase());
    cell.disabled = true;

    // Check game state
    const winner = checkWinner();
    const isDraw = !gameState.board.includes('');

    if (winner || isDraw) {
        gameState.gameActive = false;
        if (winner) {
            gameState.scores[winner]++;
            updateScores();
        }
        addToHistory(winner || 'Tie');
    } else {
        // Switch player
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    }

    updateStatus();
}

// Update score display
const updateScores = () => {
    document.getElementById('score-x').textContent = gameState.scores.X;
    document.getElementById('score-o').textContent = gameState.scores.O;
};

// Add game to history
const addToHistory = (result) => {
    const historyItem = {
        gameNumber: gameState.gameHistory.length + 1,
        result: result
    };
    gameState.gameHistory.push(historyItem);
    updateHistory();
};

// Update history display
const updateHistory = () => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = gameState.gameHistory
        .map(game => `
            <div class="history-item">
                <span>Game ${game.gameNumber}</span>
                <span class="winner-${game.result.toLowerCase()}">
                    ${game.result === 'Tie' ? 'Tie Game' : `${game.result} Wins`}
                </span>
            </div>
        `)
        .join('');
};

// Start new game
function newGame() {
    // Reset board
    gameState.board = Array(9).fill('');
    gameState.gameActive = true;
    gameState.currentPlayer = 'X';

    // Reset UI
    document.querySelectorAll('.cell').forEach(cell => {
        cell.value = '';
        cell.disabled = false;
        cell.className = 'cell';
    });

    updateStatus();
}

// Reset all scores and history
function resetScores() {
    gameState.scores = { X: 0, O: 0 };
    gameState.gameHistory = [];
    updateScores();
    updateHistory();
    newGame();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    newGame();
    updateScores();
});