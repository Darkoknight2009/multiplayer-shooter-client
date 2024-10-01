const socket = io('https://butter-battle-purpose.glitch.me/'); // Link to the Glitch server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 400, y: 300 };
const players = {};

const keys = {};
document.addEventListener('keydown', (event) => keys[event.key] = true);
document.addEventListener('keyup', (event) => keys[event.key] = false);

function updateMovement() {
    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;
    if (keys['ArrowUp']) player.y -= 5;
    if (keys['ArrowDown']) player.y += 5;

    socket.emit('playerMove', { x: player.x, y: player.y });
}

socket.on('updatePlayers', (serverPlayers) => {
    Object.assign(players, serverPlayers);
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the current player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, 50, 50);

    // Draw other players
    for (let id in players) {
        if (id !== socket.id) {
            ctx.fillStyle = 'red';
            ctx.fillRect(players[id].x, players[id].y, 50, 50);
        }
    }
}

function gameLoop() {
    updateMovement();
    drawGame();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
