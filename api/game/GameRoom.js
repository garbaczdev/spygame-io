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

    this.gamePhase = new GamePhaseJoin(this);
    this.players = [];
    
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
    
    this.logger.info(`New GameRoom "${id}"`)
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

    const player = this.players.find(player => player.deviceId === deviceId);

    socket.on('action', actionData => {
      this.logger.debug(`${player.name.length > 0 ? player.name : player.deviceId} - ${JSON.stringify(actionData)}`);
      if (!actionData.phase) {
        GameRoomUtils.killSocket(socket, `action data validation error`);
      } else {
        this.gamePhase.action(player, actionData);
      }
    })

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
      player.sockets.forEach(socket => {
        socket.emit('gameState', this.gamePhase.getState(player));
      }) 
    });
  }

  canBeDeleted() {
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
}

module.exports = { GameRoom };
