const { GamePhase } = require('./GamePhase.js');


class GamePhaseSettings extends GamePhase {
  getPhaseState(player) {
    return {
      name: "settings",
      state: {}
    }
  }

  action(player, actionData) {
    super.action(player, actionData);
  }
}


module.exports = { GamePhaseSettings };
