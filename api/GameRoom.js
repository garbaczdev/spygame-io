
class Player {
  constructor(deviceId, name, sockets) {
    this.deviceId = deviceId;
    this.name = name;
    this.sockets = sockets;
  }
}


class GamePhase {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
  }

  getState(deviceId) {}
  action(socket, deviceId, data) {}

  acceptsNewPlayers() {
    return false;
  }
}

class GameJoinPhase extends GamePhase {
  acceptsNewPlayers() {
    return true;
  }

  getState(deviceId) {
    const playerWithDeviceId = this.gameRoom.players.find(
      player => player.deviceId === deviceId
    );

    return {
      name: "join",
      player: {
        created: !!playerWithDeviceId,
        name: !!playerWithDeviceId ? playerWithDeviceId.name : "",
        isHost: deviceId === this.gameRoom.hostDeviceId
      }
    }
  }

  action(socket, deviceId, data) {

  }
}


class GameRoom {
  constructor(id, hostDeviceId) {

    // console.log(`${deviceId} connected to ${gameRoomId}`);
    // console.log(`${deviceId} disconnected from ${gameRoomId}`);
    this.id = id;
    this.hostDeviceId = hostDeviceId;

    this.creationTime = Date.now();

    this.gamePhase = new GameJoinPhase();
    this.players = [];
    this.newPlayerSockets = [];
  }

  addSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);
    
    if (playerWithDeviceId) {
      if (!playerWithDeviceId.sockets.includes(socket)) {
        playerWithDeviceId.sockets.push(socket)
      }      
    } else {
      if (!this.gamePhase.acceptsNewPlayers()) {
        socket.emit('gameState', {finished: true});
        socket.disconnect(true);
        return;
      }
      if (!this.newPlayerSockets.includes(socket)) {
        this.newPlayerSockets.push(socket);
      }
    }

    socket.emit('gameState', this.getState(deviceId))
  }

  removeSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);

    if (playerWithDeviceId && playerWithDeviceId.sockets.includes(socket)) {
      playerWithDeviceId.sockets = playerWithDeviceId.sockets.filter(
        s => s != socket
      );
    }

    this.newPlayerSockets = this.newPlayerSockets.filter(s => s != socket);
  }

  getState(deviceId) {
    return this.gamePhase.getState(deviceId);
  }
}

module.exports = GameRoom;
