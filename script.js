const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const modalButton = document.getElementById('modalButton');
const scoreLevelDisplay = document.getElementById('scoreLevel');

const unit = 20; // size of one block
let snake = [{ x: 5 * unit, y: 5 * unit }];
let ball = spawnRandomPosition();
let fireballs = [spawnRandomPosition(), spawnRandomPosition()];
let direction = 'RIGHT';
let score = 0;
let level = 1;
let ballsCaught = 0; // To track balls caught per level
let speed = 200; // Base speed, 200ms
let gameInterval;

// Initialize game state
function resetGame() {
    snake = [{ x: 5 * unit, y: 5 * unit }];
    ball = spawnRandomPosition();
    fireballs = [spawnRandomPosition(), spawnRandomPosition()];
    direction = 'RIGHT';
    score = 0;
    ballsCaught = 0;
    speed = 200 - (level - 1) * 30; // Make the game faster as the level increases
    scoreLevelDisplay.textContent = `Score: ${score} | Level: ${level}`;
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    gameInterval = setInterval(drawGame, speed);
});

modalButton.addEventListener('click', () => {
    // After level completion, increment level
    level++; 
    resetGame();
    // Update modal button text for the next level
    modalButton.textContent = `Start Level ${level}`;
    // Hide modal and start the game again
    gameOverModal.style.display = 'none';
    canvas.style.display = 'block';
    gameInterval = setInterval(drawGame, speed); // restart the game loop
});

function spawnRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
        y: Math.floor(Math.random() * (canvas.height / unit)) * unit
    };
}

function showLevelCompleteMessage() {
    // Show the correct level in the modal
    gameOverMessage.textContent = `You've completed level ${level}! 🎉😊`;
    modalButton.textContent = `Start Level ${level + 1}`; // Update button text to reflect next level
    gameOverModal.style.display = 'flex';
    clearInterval(gameInterval); // stop game loop at level completion
}

function showGameOverMessage() {
    gameOverMessage.textContent = `Game Over! Score: ${score}`;
    modalButton.textContent = `Try Again`; // Change button to "Try Again" for game over
    gameOverModal.style.display = 'flex';
    clearInterval(gameInterval); // stop game loop at game over
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(part.x, part.y, unit, unit);
    });

    // Draw ball
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(ball.x + unit / 2, ball.y + unit / 2, unit / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw fireballs
    fireballs.forEach(fireball => {
        drawFireball(fireball.x, fireball.y);
    });

    // Move snake
    let head = { ...snake[0] };
    if (direction === 'UP') head.y -= unit;
    if (direction === 'DOWN') head.y += unit;
    if (direction === 'LEFT') head.x -= unit;
    if (direction === 'RIGHT') head.x += unit;

    // Check for collision with wall or self
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(gameInterval);
        showGameOverMessage();
        return;
    }

    // Check for collision with ball
    if (head.x === ball.x && head.y === ball.y) {
        score++;
        ballsCaught++;

        // If 5 balls are caught, move to the next level
        if (ballsCaught >= 5) {
            showLevelCompleteMessage();
            return; // Exit game loop after level completion
        } else {
            ball = spawnRandomPosition();
            fireballs.push(spawnRandomPosition());
            adjustSpeed();
        }
    } else {
        snake.pop();
    }

    // Check for collision with fireballs
    if (fireballs.some(f => f.x === head.x && f.y === head.y)) {
        clearInterval(gameInterval);
        showGameOverMessage();
        return;
    }

    snake.unshift(head);

    // Update score and level display
    scoreLevelDisplay.textContent = `Score: ${score} | Level: ${level}`;
}

function drawFireball(x, y) {
    const gradient = ctx.createRadialGradient(x + unit / 2, y + unit / 2, unit / 8, x + unit / 2, y + unit / 2, unit / 1.5);
    gradient.addColorStop(0, 'orange');
    gradient.addColorStop(0.5, 'red');
    gradient.addColorStop(1, 'darkred');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + unit / 2, y + unit / 2, unit / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x + unit / 2, y + unit / 2 - 5, unit / 6, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + unit / 2 + 5, y + unit / 2, unit / 6, 0, Math.PI);
    ctx.fill();
}

function adjustSpeed() {
    clearInterval(gameInterval);
    speed = Math.max(50, speed - 10); // Make the game faster as the score increases
    gameInterval = setInterval(drawGame, speed);
}
