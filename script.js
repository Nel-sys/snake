const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const closeModalButton = document.getElementById('closeModalButton');

const unit = 20; // size of one block
let snake = [{ x: 5 * unit, y: 5 * unit }];
let ball = spawnRandomPosition();
let fireballs = [spawnRandomPosition(), spawnRandomPosition()];
let direction = 'RIGHT';
let score = 0;
let speed = 200; // Base speed, 200ms
let gameInterval;

// Initialize game state
function resetGame() {
    snake = [{ x: 5 * unit, y: 5 * unit }];
    ball = spawnRandomPosition();
    fireballs = [spawnRandomPosition(), spawnRandomPosition()];
    direction = 'RIGHT';
    score = 0;
    speed = 200;
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

closeModalButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    startButton.style.display = 'block';
    canvas.style.display = 'none';
    clearInterval(gameInterval);
});

function spawnRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
        y: Math.floor(Math.random() * (canvas.height / unit)) * unit
    };
}

function showGameOverMessage() {
    gameOverMessage.textContent = `Game Over! Score: ${score}`;
    gameOverModal.style.display = 'flex';
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
        ball = spawnRandomPosition();
        fireballs.push(spawnRandomPosition());
        adjustSpeed();
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
    speed = Math.max(50, speed - 10);
    gameInterval = setInterval(drawGame, speed);
}
