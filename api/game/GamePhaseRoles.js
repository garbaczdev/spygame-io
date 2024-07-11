const { GamePhase } = require('./GamePhase.js');
const { allRoles, Role } = require('./Role.js');


class GamePhaseRoles extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
  }

  getPhaseState(player) {
    return {
      name: "roles",
      state: {}
    }
  }

  action(player, actionData) {
    if (actionData.phase === "roles" && actionData.type == "startDiscussion") {
      if (!player.isHost) return;

      return;
    }
    super.action(player, actionData);
  }
}


module.exports = { GamePhaseRoles };
