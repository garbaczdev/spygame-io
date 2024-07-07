const { GameRoomUtils } = require('./GameRoomUtils.js');
const { Player } = require('./Player.js');


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

class GamePhaseJoin extends GamePhase {
  getPhaseState(player) {
    return {
      name: "join",
      state: {
        nameRequired: player.name === ""
      }
    }
  }

  action(player, actionData) {
    this.gameRoom.logger.debug(`${player.name.length > 0 ? player.name : player.deviceId} - ${JSON.stringify(actionData)}`);
    if (actionData.phase === "join" && actionData.type == "provideName") {
      let name = actionData.data.name;
      if (!name) {
        player.kill("No name in actionData");
        return
      }
      name = String(name).trim();
      if (name === "" || name.length > 20) return;
      
      const allNames = this.gameRoom.players.map(player => player.name.toLowerCase());
      if (allNames.includes(name.toLowerCase())) return;
      
      player.name = name;
      this.gameRoom.logger.info(`New player: "${name}"`)
      this.gameRoom.updateAllPlayers();
      return;
    }

    super.action(player, actionData);
  }

  addNewPlayer(socket, deviceId) {
    if (this.gameRoom.players.find(player => player.deviceId === deviceId)) return;
    const newPlayer = new Player(deviceId, [socket], "", deviceId === this.gameRoom.hostDeviceId);
    this.gameRoom.players.push(newPlayer);
    this.gameRoom.logger.debug(`New device connected: "${deviceId}"`)
    this.gameRoom.updateAllPlayers()
  }
}


module.exports = { GamePhase, GamePhaseJoin };
