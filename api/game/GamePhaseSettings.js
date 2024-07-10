const { GamePhase } = require('./GamePhase.js');
const { GamePhaseRoles } = require('./GamePhaseRoles.js');


class GamePhaseSettings extends GamePhase {

  constructor(gameRoom) {
    super(gameRoom);
    this.settings = this.calculateDefaultSettings();
  }

  getPhaseState(player) {
    return {
      name: "settings",
      state: player.isHost ? {settings: this.settings} : {}
    }
  }

  action(player, actionData) {

    if (actionData.phase === "settings" && actionData.type == "confirmSettings") {
      if (!player.isHost) return;
      
      const newSettings = actionData.data.settings;
      if (!(typeof newSettings === 'object') || newSettings === undefined) return;
      if (!this.areSettingsValid(newSettings)) return;
      
      this.settings = {
        spiesNumber: newSettings["spiesNumber"],
        discussionSeconds: newSettings["discussionSeconds"],
      }

      this.gameRoom.logger.info(`Settings changed to ${JSON.stringify(this.settings)}`);

      this.gameRoom.gamePhase = new GamePhaseRoles(this.gameRoom, this.settings);
      this.gameRoom.updateAllPlayers();
      this.gameRoom.logger.info(`Game proceeded to roles phase`);

      return;
    }

    super.action(player, actionData);
  }

  calculateDefaultSettings() {
    return {
      spiesNumber: Math.floor(this.gameRoom.players.length / 3),
      discussionSeconds: 300,
    };
  }

  areSettingsValid(settings) {
    if (!Number.isInteger(settings["spiesNumber"])) return false;
    if (!Number.isInteger(settings["discussionSeconds"])) return false;
    if (settings["spiesNumber"] <= 0) return false;
    if (settings["spiesNumber"] > Math.floor(this.gameRoom.players.length/2)) return false;
    if (settings["discussionSeconds"] <= 0) return false;
    if (settings["discussionSeconds"] > 3600) return false;
    
    return true;
  }
}


module.exports = { GamePhaseSettings };
