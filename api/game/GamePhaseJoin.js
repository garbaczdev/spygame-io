const { Player } = require('./Player.js');
const { GamePhase } = require('./GamePhase.js');
const { GamePhaseSettings } = require('./GamePhaseSettings.js');


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
      this.gameRoom.logger.info(`New player: "${name}"`);
      this.gameRoom.updateAllPlayers();
      return;
    }

    if (actionData.phase === "join" && actionData.type == "startGame") {
      if (!player.isHost) return;

      const canStart = this.gameRoom.players.filter(
        player => player.name.length > 0
      ).length >= 4;
      if (!canStart) return;

      this.gameRoom.logger.info(`Game started`);
      this.gameRoom.gamePhase = new GamePhaseSettings(this.gameRoom);
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


module.exports = { GamePhaseJoin };
