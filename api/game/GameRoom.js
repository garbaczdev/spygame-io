const { GamePhaseJoin } = require('./GamePhaseJoin.js');
const { GameRoomUtils } = require('./GameRoomUtils.js');
const { Player } = require('./Player.js');

const winston = require('winston');


class GameRoom {
  constructor(id, hostDeviceId, killMePleaseCallback=()=>{}) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;
    this.killMePleaseCallback = killMePleaseCallback;

    this.creationTime = Date.now();
    this.gamePhase = null;
    this.players = [];
    this.setupNewRoom();

    this.logger.info(`New GameRoom "${id}"`)
  }
  
  setupNewRoom() {
    this.creationTime = Date.now();
    this.players.forEach(player => {
      player.name = "";
      player.role = null;
    });
    this.gamePhase = new GamePhaseJoin(this);
    
    if (process.env.INSERT_MOCK_PLAYERS === '1') {
      for (let i = 1; i <= 6; i++) this.players.push(new Player(String(i), [], `Player ${i}`, false))
    }

    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}][${this.id}][${level}] ${message}`;
            })
          ),
        }),
        new winston.transports.File({
          filename: 'app.log',
          format:  winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => 
              JSON.stringify({ id: this.id, timestamp, level, message })
            )
          ),
        }),
      ],
    });

    this.updateAllPlayers();
  }

  addSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);
    
    if (playerWithDeviceId) {
      if (!playerWithDeviceId.sockets.includes(socket)) {
        playerWithDeviceId.sockets.push(socket);
      }      
    } else {
      this.gamePhase.addNewPlayer(socket, deviceId);
    }

    const player = this.players.find(player => player.deviceId == deviceId);

    socket.on('action', actionData => {
      this.logger.debug(`${player.name.length > 0 ? player.name : player.deviceId} - ${JSON.stringify(actionData)}`);
      if (!actionData.phase) return;
      if (!actionData.type) return;
      if (!actionData.data) return;
      try {
        this.gamePhase.action(player, actionData);
      } catch (error) {
        this.logger.error(error.message + " - " + error.stack);
        this.killMePleaseCallback();
      }
    })

    if (player === undefined || player === null) {
      GameRoomUtils.killSocket(socket, "No player found");
      this.logger.debug(`Player not found for ${deviceId}`);
      return;
    }

    socket.emit('gameState', this.gamePhase.getState(player));
  }

  removeSocket(socket, deviceId) {
    const playerWithDeviceId = this.players.find(player => player.deviceId === deviceId);

    if (playerWithDeviceId && playerWithDeviceId.sockets.includes(socket)) {
      playerWithDeviceId.sockets = playerWithDeviceId.sockets.filter(
        s => s != socket
      );
    }

    if (playerWithDeviceId.name === "" && playerWithDeviceId.sockets.length === 0) {
      this.players = this.players.filter(player => player != playerWithDeviceId);
      this.updateAllPlayers();
    }
  }

  updateAllPlayers() {
    this.players.forEach(player => {
      player.updateGameState(this.gamePhase.getState(player))
    });
  }

  canBeDeleted() {
    const minutesSinceCreation = Math.floor((new Date() - this.creationTime) / 1000 / 60);
    if (
      minutesSinceCreation > 60
    ) return true;
    if (
      this.players.every(player => player.sockets.length === 0)
      && this.players.every(player => player.name.length === 0)
    ) return true;
    
    return false;
  }

  kill() {
    this.players.forEach(player => player.kill("Game room closed!"));
    this.players = [];
    this.hostDeviceId = "";
    this.logger.info("Killed game room");
  }

  kickPlayer(player) {
    player.kill();
    this.players = this.players.filter(otherPlayer => otherPlayer != player);
  }
}


module.exports = { GameRoom };
