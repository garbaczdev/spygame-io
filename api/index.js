
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const { GameRoom } = require('./game-src/GameRoom.js');
const { GameRoomUtils } = require('./game-src/GameRoomUtils.js');

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
    GameRoomUtils.killSocket(socket, "No deviceId on the socket");
    return;
  }

  const gameRoomId = socket.handshake.query.gameRoomId;
  if (!gameRoomId) {
    GameRoomUtils.killSocket(socket, "gameRoomId not provided");
    return;
  }

  if (!(gameRoomId in gameRooms)) {
    GameRoomUtils.killSocket(socket, "No such gameroom with that ID!");
    return;
  }

  gameRooms[gameRoomId].addSocket(socket, deviceId);

  socket.on('disconnect', () => {
    const gameRoom = gameRooms[gameRoomId];
    if (gameRoom) gameRoom.removeSocket(socket, deviceId);
  });
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
