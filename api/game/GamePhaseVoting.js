const { GamePhase } = require('./GamePhase.js');


class GamePhaseVoting extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;

    this.votes = {};
    this.gameRoom.players.forEach(player => {
      this.votes[player.name] = null;
    });

    this.votingFinished = false;
    this.whoWon = "";
    this.endVotesCount = {};
  }

  getPhaseState(player) {
    
    const endVotesCountToSend = {};
    Object.keys(this.endVotesCount).forEach(playerName => {
      const player = this.gameRoom.players.find(player => player.name === playerName);
      endVotesCountToSend[player.name] = {
        votes: this.endVotesCount[player.name],
        isSpy: player.role.isSpy,
      }
    });

    return {
      name: "voting",
      state: {
        votingFinished: this.votingFinished,
        voted: this.votes[player.name] !== null,
        votedPlayerName: this.votes[player.name] !== null ? this.votes[player.name].name : "",
        endVotesCount: endVotesCountToSend,
        whoWon: this.whoWon,
      }
    }
  }

  action(player, actionData) {
    if (actionData.phase === "voting" && actionData.type == "vote") {
      if (actionData.data.votedPlayerName === undefined) return;
      if (this.votingFinished) return;
      if (this.votes[player.name] !== null) return;

      const votedPlayer = this.gameRoom.players.find(otherPlayer => otherPlayer.name === actionData.data.votedPlayerName);
      if (votedPlayer === undefined) return;
      if (votedPlayer.name === player.name) return;

      this.votes[player.name] = votedPlayer;

      if (Object.values(this.votes).every(votedPlayer => votedPlayer !== null)){
        this.finishVoting();
        this.gameRoom.updateAllPlayers();
      }
      else player.updateGameState(this.getState(player));
      return;
    }

    if (actionData.phase === "voting" && actionData.type == "finishVoting") {
      if (!player.isHost) return;
      if (this.votingFinished) return;
      this.finishVoting();
      this.gameRoom.updateAllPlayers();
      return;
    }

    if (actionData.phase === "voting" && actionData.type == "restartGame") {
      if (!player.isHost) return;
      if (!this.votingFinished) return;

      return;
    }
    super.action(player, actionData);
  }

  finishVoting() {
    if (this.votingFinished) return;

    this.gameRoom.players.forEach(votingPlayer => {
      this.endVotesCount[votingPlayer.name] = 0;
    });

    this.gameRoom.players.forEach(votingPlayer => {
      if (this.votes[votingPlayer.name] === null) return;
      this.endVotesCount[this.votes[votingPlayer.name].name] += 1;
    });

    const maxVotes = Math.max(...Object.values(this.endVotesCount));
    if (
      Object.keys(this.endVotesCount).filter(
        playerName => this.endVotesCount[playerName] === maxVotes
      ).every(playerName => {
        const player = this.gameRoom.players.find(player => player.name === playerName);
        return player.isSpy;
      })
    ) this.whoWon = "roles";
    else this.whoWon = "spies";

    this.gameRoom.logger.info(`Finished Voting with votes" ${JSON.stringify(this.endVotesCount)}. Winner: "${this.whoWon}"`);
    this.votingFinished = true;
  }
}


module.exports = { GamePhaseVoting };
