const { GamePhase } = require('./GamePhase.js');


class GamePhaseDiscussion extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;

    this.finishTime = new Date();
    this.finishTime.setUTCMinutes(this.finishTime.getUTCMinutes() + this.settings.discussionMinutes);
  }

  getPhaseState(player) {
    return {
      name: "discussion",
      state: {
        finishTime: this.finishTime.toISOString(),
      }
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
