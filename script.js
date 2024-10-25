const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const unit = 20; // size of one block
let snake = [{ x: 5 * unit, y: 5 * unit }];
let ball = spawnRandomPosition();
let fireballs = [spawnRandomPosition(), spawnRandomPosition()];
let direction = 'RIGHT';
let score = 0;
let speed = 200; // Base speed, 200ms

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function spawnRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
        y: Math.floor(Math.random() * (canvas.height / unit)) * unit
    };
}

function drawBackground() {
    // Create a modern gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a2a6c'); // Dark blue
    gradient.addColorStop(0.5, '#b21f1f'); // Red
    gradient.addColorStop(1, '#fdbb2d'); // Yellow-orange
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFireball(x, y) {
    // Create radial gradient to simulate a fireball
    const gradient = ctx.createRadialGradient(x + unit / 2, y + unit / 2, unit / 8, x + unit / 2, y + unit / 2, unit / 2);
    gradient.addColorStop(0, 'orange');
    gradient.addColorStop(0.5, 'red');
    gradient.addColorStop(1, 'darkred');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + unit / 2, y + unit / 2, unit / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw a flicker effect
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x + unit / 2, y + unit / 2, unit / 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawBall(x, y) {
    // Ensure regular balls are never red
    ctx.fillStyle = 'cyan'; // Choose a color distinct from red
    ctx.beginPath();
    ctx.arc(x + unit / 2, y + unit / 2, unit / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawGame() {
    drawBackground(); // Draw the modern background

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(part.x, part.y, unit, unit);
    });

    // Draw the regular ball
    drawBall(ball.x, ball.y);

    // Draw fireballs with new design
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
        alert(`Game Over! Score: ${score}`);
        document.location.reload();
    }

    // Check for collision with ball
    if (head.x === ball.x && head.y === ball.y) {
        score++;
        ball = spawnRandomPosition();
        fireballs.push(spawnRandomPosition()); // Add new fireball as difficulty increases
        adjustSpeed(); // Speed up the game
    } else {
        snake.pop();
    }

    // Check for collision with fireballs
    if (fireballs.some(f => f.x === head.x && f.y === head.y)) {
        alert(`Game Over! Score: ${score}`);
        document.location.reload();
    }

    snake.unshift(head);
}

function adjustSpeed() {
    clearInterval(gameInterval);
    speed = Math.max(50, speed - 10); // Decrease interval time to make the game faster
    gameInterval = setInterval(drawGame, speed);
}

let gameInterval = setInterval(drawGame, speed);
