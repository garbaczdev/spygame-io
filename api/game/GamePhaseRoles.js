const { GamePhase } = require('./GamePhase.js');
const { GamePhaseDiscussion } = require('./GamePhaseDiscussion.js');
const { allRoles, Role } = require('./Role.js');


class GamePhaseRoles extends GamePhase {

  constructor(gameRoom, settings) {
    super(gameRoom);
    this.settings = settings;
    this.distributeRoles();
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

      this.gameRoom.gamePhase = new GamePhaseDiscussion(this.gameRoom, this.settings);
      this.gameRoom.updateAllPlayers();
      this.gameRoom.logger.info(`Game proceeded to discussion phase`);

      return;
    }
    super.action(player, actionData);
  }

  distributeRoles() {
    const roleName = allRoles[Math.floor(Math.random() * allRoles.length)];

    const shuffledPlayers = this.gameRoom.players.slice().sort(() => 0.5 - Math.random());

    const spyPlayers = shuffledPlayers.slice(0, this.settings.spiesNumber);
    const normalPlayers = shuffledPlayers.slice(this.settings.spiesNumber, shuffledPlayers.length);
    
    spyPlayers.forEach(player => player.setRole(new Role("", true)));
    normalPlayers.forEach(player => player.setRole(new Role(roleName, false)));
    this.gameRoom.logger.info(`ROLE: "${roleName}" SPIES: [${spyPlayers.map(player => player.name)}] NORMAL: [${normalPlayers.map(player => player.name)}]`);
  }
}


module.exports = { GamePhaseRoles };
