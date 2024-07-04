
class Player {
  constructor(deviceId, name) {
    this.deviceId = deviceId;
    this.name = name;
  }
}


class GameRoom {
  constructor(id, hostDeviceId) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;
    this.players = [];

    this.creationTime = Date.now();
  }

  canBeDeleted() {

  }

  getGameState(deviceId) {
    const currentPlayer = this.players.find(player => player.deviceId === deviceId);
    
    if (!currentPlayer) {
      return {
        "player": {
          "provideName": true,
          "nameTaken": false,
          "current": ""
        }
      }
    }

    return {
      "player": {
        "provideName": false,
        "nameTaken": false,
        "current": currentPlayer.name
      },
      "allPlayers": this.players.map(player => player.name)
    }
  }

  addPlayer(deviceId, name) {
    const playerWithName = this.players.find(player => player.name === name);
    if (playerWithName) return false;     
    const currentPlayer = new Player(deviceId, name);
    this.players.push(currentPlayer);
    return true;
  }
}

module.exports = GameRoom;
