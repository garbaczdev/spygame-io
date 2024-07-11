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
      if (!name) return;

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
      ).length >= 3;
      if (!canStart) return;
      
      const playersToKick = this.gameRoom.players.filter(player => player.name.length === 0);
      playersToKick.forEach(playerToKick => this.gameRoom.kickPlayer(playerToKick));

      this.gameRoom.gamePhase = new GamePhaseSettings(this.gameRoom);
      this.gameRoom.updateAllPlayers();
      this.gameRoom.logger.info(`Settings phase started`);

      return;
    }

    super.action(player, actionData);
  }

  addNewPlayer(socket, deviceId) {
    if (this.gameRoom.players.find(player => player.deviceId === deviceId)) return;
    const newPlayer = new Player(deviceId, [socket], "", deviceId === this.gameRoom.hostDeviceId);
    this.gameRoom.players.push(newPlayer);
    this.gameRoom.logger.debug(`New player connected: "${deviceId}"`)
    this.gameRoom.updateAllPlayers()
  }
}


module.exports = { GamePhaseJoin };
