const { GamePhase } = require('./GamePhase.js');


class GamePhaseVoting extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
  }

  getPhaseState(player) {
    return {
      name: "voting",
      state: {}
    }
  }

  action(player, actionData) {
    if (actionData.phase === "voting" && actionData.type == "vote") {

      return;
    }
    super.action(player, actionData);
  }
}


module.exports = { GamePhaseVoting };
