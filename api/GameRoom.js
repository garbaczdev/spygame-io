
class GameRoomUtils {
  static killSocket(socket, message="") {
    socket.emit('gameState', {finished: true, message});
    socket.disconnect(true);
  }
}


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


class GamePhase {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
  }

  getState(player) {
    return {
      allPlayers: this.gameRoom.players.map(otherPlayer => {
        return {
          "name": otherPlayer.name,
          "isHost": otherPlayer.isHost,
          "isCurrentPlayer": otherPlayer === player,
        }  
      }),
      player: {
        "name": player.name,
        "isHost": player.isHost,
      },
      phase: this.getPhaseState(player),
    }
  }

  getPhaseState(player) {}

  action(player, actionData) {
    player.sockets.forEach(socket => {
      GameRoomUtils.killSocket(socket, `state ${JSON.stringify(actionData)} not recognized.`);
    })
  }

  addNewPlayer(socket, deviceId) {
    GameRoomUtils.killSocket(socket, "Can not add players in the current game phase")
  }
}

class GameJoinPhase extends GamePhase {
  getPhaseState(player) {
    return {
      name: "join",
      state: {
        nameRequired: player.name === ""
      }
    }
  }

  action(player, actionData) {
    console.log(player.deviceId, actionData);
    if (actionData.phase === "join" && actionData.type == "provideName") {
      let name = actionData.data.name 
      if (!name) {
        player.kill("No name in actionData");
        return
      }
      name = String(name);
      if (name === "" || name.length > 20) return;
      
      player.name = name;
      this.gameRoom.updateAllPlayers();
      return;
    }

    super.action(player, actionData);
  }

  addNewPlayer(socket, deviceId) {
    if (this.gameRoom.players.find(player => player.deviceId === deviceId)) return;
    const newPlayer = new Player(deviceId, [socket], "", deviceId === this.gameRoom.hostDeviceId);
    this.gameRoom.players.push(newPlayer);
    this.gameRoom.updateAllPlayers()
  }
}


class GameRoom {
  constructor(id, hostDeviceId) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;

    this.creationTime = Date.now();

    this.gamePhase = new GameJoinPhase(this);
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

    const player = this.players.find(player => player.deviceId === deviceId);

    socket.on('action', actionData => {
      if (!actionData.phase) {
        GameRoomUtils.killSocket(socket, `action data validation error`);
      } else {
        this.gamePhase.action(player, actionData);
      }
    })

    socket.emit('gameState', this.gamePhase.getState(player));
  }

  removeSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);

    if (playerWithDeviceId && playerWithDeviceId.sockets.includes(socket)) {
      playerWithDeviceId.sockets = playerWithDeviceId.sockets.filter(
        s => s != socket
      );
    }

    if (playerWithDeviceId.name === "" && playerWithDeviceId.sockets.length === 0) {
      this.players = this.players.filter(player => player != playerWithDeviceId);
      this.updateAllPlayers();
    }
  }

  updateAllPlayers() {
    this.players.forEach(player => {
      player.sockets.forEach(socket => {
        socket.emit('gameState', this.gamePhase.getState(player));
      }) 
    });
  }
}

module.exports = { GameRoomUtils, GameRoom };
