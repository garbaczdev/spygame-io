const { GamePhase } = require('./GamePhase.js');
const { GamePhaseVoting } = require('./GamePhaseVoting.js');


class GamePhaseDiscussion extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;

    this.finishTime = new Date();
    this.finishTime.setUTCMinutes(this.finishTime.getUTCMinutes() + this.settings.discussionMinutes);
    
    this.finished = false;

    this.checkFinishInterval = setInterval(() => {
      
      if (this.finished || this.gameRoom.players.length === 0) {
        clearInterval(this.checkFinishInterval);
        return;
      }

      const currentTime = new Date();

      if (currentTime >= this.finishTime) {
        this.gameRoom.logger.info("Discussion finish time passed!");
        this.finishDiscussion();
        clearInterval(this.checkFinishInterval);
      }
    }, 1000);
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
      this.finishDiscussion();
      return;
    }
    if (actionData.phase === "discussion" && actionData.type == "addMinute") {
      if (!player.isHost) return;
      this.finishTime.setUTCMinutes(this.finishTime.getUTCMinutes() + 1);
      console.log(`Increased to ${this.finishTime}`);
      this.gameRoom.updateAllPlayers();
      return;
    }
    super.action(player, actionData);
  }

  finishDiscussion() {
    if (this.finished) return;
    this.finished = true;
    this.gameRoom.gamePhase = new GamePhaseVoting(this.gameRoom);
    this.gameRoom.updateAllPlayers();
    this.gameRoom.logger.info("Voting phase started");
  }
}


module.exports = { GamePhaseDiscussion };
