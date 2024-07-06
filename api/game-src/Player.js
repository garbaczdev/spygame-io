const { GameRoomUtils } = require('./GameRoomUtils.js');


class Player {
  constructor(deviceId, sockets, name, isHost=false) {
    this.deviceId = deviceId;
    this.sockets = sockets;
    this.name = name;
    this.isHost = isHost;
  }

  kill(message) {
    this.sockets.forEach(socket => GameRoomUtils.killSocket(socket, message));
  }
}


module.exports = { Player };
