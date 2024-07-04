const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.get('/api', (req, res) => {
  console.log(req.headers.cookie);
  res.send('Hello World!');
});

app.get('/api/device-id', (req, res) => {
  const deviceId = crypto.randomBytes(64).toString('hex').slice(0, 64);
  res.cookie('deviceId', deviceId, { maxAge: 900000, httpOnly: false });
  res.send(deviceId);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
