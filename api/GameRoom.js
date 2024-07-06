
class Player {
  constructor(deviceId, sockets, name) {
    this.deviceId = deviceId;
    this.sockets = sockets;
    this.name = name;
  }
}


class GamePhase {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
  }

  getState(deviceId) {}
  action(socket, deviceId, data) {}

  addNewPlayer(socket, deviceId) {
    socket.emit('gameState', {finished: true});
    socket.disconnect(true);
  }
}

class GameJoinPhase extends GamePhase {

  getState(deviceId) {
    // const playerWithDeviceId = this.gameRoom.players.find(
    //   player => player.deviceId === deviceId
    // );

    // return {
    //   name: "join",
    //   player: {
    //     created: !!playerWithDeviceId,
    //     name: !!playerWithDeviceId ? playerWithDeviceId.name : "",
    //     isHost: deviceId === this.gameRoom.hostDeviceId
    //   }
    // }
  }

  action(socket, deviceId, data) {
    
  }

  addNewPlayer(socket, deviceId) {
    if (this.gameRoom.players.find(player => player.deviceId === deviceId)) return;
    const newPlayer = new Player(deviceId, [socket], "");
    this.gameRoom.players.push(newPlayer);
  }
}


class GameRoom {
  constructor(id, hostDeviceId) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;

    this.creationTime = Date.now();

    this.gamePhase = new GameJoinPhase();
    this.players = [];
  }

  addSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);
    
    if (playerWithDeviceId) {
      if (!playerWithDeviceId.sockets.includes(socket)) {
        playerWithDeviceId.sockets.push(socket);
      }      
    } else {
      this.gamePhase.addNewPlayer(socket, deviceId);
    }

    socket.emit('gameState', this.gamePhase.getState(deviceId));
  }

  removeSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);

    if (playerWithDeviceId && playerWithDeviceId.sockets.includes(socket)) {
      playerWithDeviceId.sockets = playerWithDeviceId.sockets.filter(
        s => s != socket
      );
    }
  }
}

module.exports = GameRoom;
