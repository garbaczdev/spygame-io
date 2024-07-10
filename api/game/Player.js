const { GameRoomUtils } = require('./GameRoomUtils.js');


class Player {
  constructor(deviceId, sockets, name, isHost=false) {
    this.deviceId = deviceId;
    this.sockets = sockets;
    this.name = name;
    this.isHost = isHost;

    this.role = null;
  }

  kill(message) {
    this.sockets.forEach(socket => GameRoomUtils.killSocket(socket, message));
  }

  updateGameState(gameState) {
    this.sockets.forEach(socket => {
      socket.emit('gameState', gameState);
    }) 
  }
  
  setRole(role) {
    this.role = role;
  }
}


module.exports = { Player };
