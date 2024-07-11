const { GamePhase } = require('./GamePhase.js');


class GamePhaseVoting extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
    this.votes = {};
    this.gameRoom.players.forEach(player => {
      this.votes[player] = null;
    });
    this.votingFinished = false;
  }

  getPhaseState(player) {
    return {
      name: "voting",
      state: {
        votingFinished: this.votingFinished,
        voted: this.votes[player] !== null,
        votedPlayerName: this.votes[player] !== null ? this.votes[player].name : "",
        votes: {},
      }
    }
  }

  action(player, actionData) {
    if (actionData.phase === "voting" && actionData.type == "vote") {
      if (actionData.data.votedPlayerName === undefined) return;
      if (this.votingFinished) return;
      if (this.votes[player] !== null) return;

      const votedPlayer = this.gameRoom.players.find(otherPlayer => otherPlayer.name === actionData.data.votedPlayerName);
      if (votedPlayer === undefined) return;
      if (votedPlayer.name === player.name) return;

      this.votes[player] = votedPlayer;
      console.log(this.votes);

      if (Object.keys(this.votes).every(votedPlayer => votedPlayer !== null)){
        this.finishVoting();
        this.gameRoom.updateAllPlayers();
      }
      else player.updateGameState(this.getState(player));
      return;
    }

    if (actionData.phase === "voting" && actionData.type == "finishVoting") {
      if (!player.isHost) return;
      this.finishVoting();
      this.gameRoom.updateAllPlayers();
      return;
    }

    if (actionData.phase === "voting" && actionData.type == "restartGame") {
      if (!player.isHost) return;
      return;
    }
    super.action(player, actionData);
  }

  finishVoting() {
    this.gameRoom.logger.info("Finished Voting");
    this.votingFinished = true;
  }
}


module.exports = { GamePhaseVoting };
