
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const GameRoom = require('./GameRoom.js');

const app = express();
app.use(cookieParser());

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
  if (!deviceId) return res.status(401).send('Unauthorized');

  let gameRoomId = "";

  do {
    gameRoomId = crypto.randomBytes(8).toString('hex').slice(0, 8);
  } while (gameRoomId in gameRooms);

  gameRooms[gameRoomId] = new GameRoom(gameRoomId, deviceId);
  console.log(gameRoomId);

  res.send(gameRoomId);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
