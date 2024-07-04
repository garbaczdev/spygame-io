
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const GameRoom = require('./GameRoom.js');

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = socketIo(server);

const port = 5000;

const gameRooms = {}


app.get('/api', (req, res) => {
  res.send('echo');
});

app.get('/api/device-id', (req, res) => {
  const deviceId = crypto.randomBytes(64).toString('hex').slice(0, 64);
  res.cookie(
    'deviceId',
    deviceId,
    {
      maxAge: 900000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/'
    });
  res.send(deviceId);
});

app.post('/api/create-game-room', (req, res) => {
  
  const { deviceId } = req.cookies;
  if (!deviceId) return res.status(401);

  let gameRoomId = "";

  do {
    // gameRoomId = crypto.randomBytes(8).toString('hex').slice(0, 8);
    gameRoomId = Array(6).fill(0).map(i => crypto.randomInt(0, 9).toString()).join("")
  } while (gameRoomId in gameRooms);

  gameRooms[gameRoomId] = new GameRoom(gameRoomId, deviceId);
  console.log(gameRoomId);

  res.send(gameRoomId);
});

io.on('connection', (socket) => {
  const cookies = socket.handshake.headers.cookie
    ? Object.fromEntries(
        socket.handshake.headers.cookie.split('; ').map(c => c.split('='))
      )
    : {};
  const deviceId = cookies.deviceId;

  if (!deviceId) {
    console.log("No deviceId - disconnecting...");
    socket.disconnect(true);
  }

  const gameRoomId = socket.handshake.query.gameRoomId;
  if (!gameRoomId) {
    console.log("No gameRoomId - disconnecting...");
    socket.disconnect(true);
  }

  if (gameRoomId in gameRooms) {
    socket.join(gameRoomId);
    socket.emit('gameState', gameRooms[gameRoomId].getGameState(deviceId));
    console.log(`${deviceId} connected to ${gameRoomId}`);
  } else {
    console.log("No such gameroom - disconnecting...");
    socket.emit('noGameRoom', 'No such game room');
    socket.disconnect(true);
  }

  // Handle messages from clients to a specific room
  socket.on('message', ({ gameRoomId, message }) => {
    io.to(gameRoomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`${deviceId} disconnected from ${gameRoomId}`);
    socket.leave(gameRoomId);
  });
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
