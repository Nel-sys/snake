const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const closeModalButton = document.getElementById('closeModalButton');
const scoreLevelDisplay = document.getElementById('scoreLevel');

const unit = 20; // size of one block
let snake;
let ball;
let fireballs;
let direction;
let score;
let level;
let ballsCaught;
let speed;
let gameInterval;

// Initialize game state
function resetGame() {
    // Start the snake in the center of the canvas
    snake = [{ x: Math.floor(canvas.width / 2 / unit) * unit, y: Math.floor(canvas.height / 2 / unit) * unit }];
    ball = spawnRandomPosition();
    fireballs = [spawnRandomPosition(), spawnRandomPosition()];
    direction = 'RIGHT';
    score = 0;
    ballsCaught = 0;
    level = 1;
    speed = 200; // Base speed, 200ms
    scoreLevelDisplay.textContent = `Score: ${score} | Level: ${level}`;
}

// Game start logic
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    gameInterval = setInterval(drawGame, speed);
});

// Start next level after level completion
closeModalButton.addEventListener('click', () => {
    if (level > 1) {
        startNextLevel();
    } else {
        resetGame(); // Reset to Level 1 if game over
        gameOverModal.style.display = 'none';
        canvas.style.display = 'block';
    }
});

function spawnRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
        y: Math.floor(Math.random() * (canvas.height / unit)) * unit
    };
}

function showLevelCompleteMessage() {
    gameOverMessage.textContent = `Level ${level} completed! 🎉`;
    gameOverModal.style.display = 'flex';
    closeModalButton.textContent = `Start Level ${level + 1}`;
    closeModalButton.onclick = startNextLevel;  // Set the button to start next level
}

function startNextLevel() {
    level++;
    resetGame(); // Reset the game state for the new level
    gameOverModal.style.display = 'none'; // Hide the modal
    canvas.style.display = 'block'; // Show the canvas again
    gameInterval = setInterval(drawGame, speed); // Start the new level
}

function showGameOverMessage() {
    gameOverMessage.textContent = `Game Over! Score: ${score}`;
    gameOverModal.style.display = 'flex';
    closeModalButton.textContent = "Start Level 1";
    closeModalButton.onclick = resetGame; // Reset to Level 1 on game over
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
            showLevelCompleteMessage(); // Show level complete message
            clearInterval(gameInterval); // Stop game interval
            return;
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
