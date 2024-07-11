const { GameRoomUtils } = require('./GameRoomUtils.js');


class GamePhase {
  constructor(gameRoom) {
    this.gameRoom = gameRoom;
    this.creationTime = Date.now();
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
        "role": player.role === null ? {} : {
          "name": player.role.name,
          "isSpy": player.role.isSpy,
        },
      },
      phase: this.getPhaseState(player),
    }
  }

  getPhaseState(player) {}

  action(player, actionData) {
    if (actionData.phase === "all" && actionData.type == "leaveRoom") {
      if (player.isHost) this.gameRoom.killMePleaseCallback();
      else player.kill("Game room left");
      return;
    }
    this.gameRoom.logger.debug(`Unrecognized action: ${JSON.stringify(actionData)} by "${player.name.length > 0 ? player.name : player.deviceId}"`)
  }

  addNewPlayer(socket, deviceId) {
    GameRoomUtils.killSocket(socket, "Can not add players in the current game phase")
  }
}


module.exports = { GamePhase };
