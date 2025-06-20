const { GamePhase } = require('./GamePhase.js');
const { GamePhaseDiscussion } = require('./GamePhaseDiscussion.js');
const { allRoles, Role } = require('./Role.js');


function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


class GamePhaseRoles extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
    this.distributeRoles();
  }

  getPhaseState(player) {
    return {
      name: "roles",
      state: { 
        roleHint: player.role.hint, 
        ...(
          player.role.isSpy 
          ?
          {
            otherSpies: this.gameRoom.players.filter(
              otherPlayer => otherPlayer.role.isSpy
            ).map(
              otherPlayer => otherPlayer.name
            ).filter(
              otherPlayerName => otherPlayerName !== player.name
            )
          } 
          :
          {}
        )}
    }
  }

  action(player, actionData) {
    if (actionData.phase === "roles" && actionData.type == "startDiscussion") {
      if (!player.isHost) return;

      this.gameRoom.gamePhase = new GamePhaseDiscussion(this.gameRoom, this.settings);
      this.gameRoom.updateAllPlayers();
      this.gameRoom.logger.info(`Game proceeded to discussion phase`);

      return;
    }
    super.action(player, actionData);
  }

  distributeRoles() {
    const role = allRoles[Math.floor(Math.random() * allRoles.length)];

    const shuffledPlayers = this.gameRoom.players.slice();
    shuffle(shuffledPlayers);
    // const shuffledPlayers = this.gameRoom.players.slice().sort(() => 0.5 - Math.random());

    const spyPlayers = shuffledPlayers.slice(0, this.settings.spiesNumber);
    const normalPlayers = shuffledPlayers.slice(this.settings.spiesNumber, shuffledPlayers.length);
    
    spyPlayers.forEach(player => {
      const randomHint = role.hints.length > 0 ? role.hints[Math.floor(Math.random() * role.hints.length)] : "";
      player.setRole(new Role("", true, randomHint));
    });

    normalPlayers.forEach(player => player.setRole(new Role(role.role, false, "")));
    this.gameRoom.logger.info(`ROLE: "${role.role}" SPIES: [${spyPlayers.map(player => player.name)}] NORMAL: [${normalPlayers.map(player => player.name)}]`);
  }
}


module.exports = { GamePhaseRoles };
