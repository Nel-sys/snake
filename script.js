const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const unit = 20; // size of one block
let snake = [{ x: 5 * unit, y: 5 * unit }];
let ball = spawnRandomPosition();
let fireballs = [spawnRandomPosition(), spawnRandomPosition()];
let direction = 'RIGHT';
let score = 0;

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

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(part.x, part.y, unit, unit);
    });

    // Draw ball
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ball.x, ball.y, unit, unit);

    // Draw fireballs
    fireballs.forEach(fireball => {
        ctx.fillStyle = 'red';
        ctx.fillRect(fireball.x, fireball.y, unit, unit);
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

// Run the game loop
setInterval(drawGame, 100);
