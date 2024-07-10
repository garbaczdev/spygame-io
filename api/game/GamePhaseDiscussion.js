const { GamePhase } = require('./GamePhase.js');


class GamePhaseDiscussion extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
  }

  getPhaseState(player) {
    return {
      name: "discussion",
      state: {}
    }
  }

  action(player, actionData) {
    if (actionData.phase === "discussion" && actionData.type == "finishDiscussion") {
      if (!player.isHost) return;

      return;
    }
    if (actionData.phase === "discussion" && actionData.type == "addMinute") {
      if (!player.isHost) return;

      return;
    }
    super.action(player, actionData);
  }
}


module.exports = { GamePhaseDiscussion };
