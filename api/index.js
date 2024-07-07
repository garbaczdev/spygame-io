
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const { GameRoomManager } = require('./game/GameRoomManager.js');
const { GameRoom } = require('./game/GameRoom.js');
const { GameRoomUtils } = require('./game/GameRoomUtils.js');

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = socketIo(server);


const gameRoomManager = new GameRoomManager();


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
    }
  );
  res.send(deviceId);
});

app.post('/api/create-game-room', (req, res) => {
  const { deviceId } = req.cookies;
  if (!deviceId) return res.status(401);

  res.send(gameRoomManager.createRoom(deviceId));
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
  
  gameRoomManager.addSocket(socket, gameRoomId, deviceId);
});


server.listen(5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
});
