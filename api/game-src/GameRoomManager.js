const crypto = require('crypto');

const { GameRoom } = require('./GameRoom.js');
const { GameRoomUtils } = require('./GameRoomUtils.js');


class GameRoomManager {

  constructor() {
    this.gameRooms = {};
    const cleanupIntervalId = setInterval(() => this.cleanupRooms(), 5000);
  }

  createRoom(hostDeviceId) {
    const createdGameRoom = Object.values(this.gameRooms).find(
      gameRoom => gameRoom.hostDeviceId === hostDeviceId
    );
    if (createdGameRoom) return createdGameRoom.id;

    let gameRoomId;
    do {
      gameRoomId = Array(6).fill(0).map(i => crypto.randomInt(0, 9).toString()).join("")
    } while (gameRoomId in this.gameRooms);

    this.gameRooms[gameRoomId] = new GameRoom(gameRoomId, hostDeviceId);
    
    return gameRoomId;
  }

  addSocket(socket, gameRoomId, deviceId) {

    if (!(gameRoomId in this.gameRooms)) {
      GameRoomUtils.killSocket(socket, "No such gameroom with that ID!");
      return;
    }

    this.gameRooms[gameRoomId].addSocket(socket, deviceId);

    socket.on('disconnect', () => {
      const gameRoom = this.gameRooms[gameRoomId];
      if (gameRoom) gameRoom.removeSocket(socket, deviceId);
      if (gameRoom.canBeDeleted()) {
        gameRoom.cleanRoom();
        delete this.gameRooms[gameRoomId];
      }
    });
  }
  
  cleanupRooms() {
    const gameRoomsToDelete = [];
    for (const gameRoomId of Object.keys(this.gameRooms)) {
      if (this.gameRooms[gameRoomId].canBeDeleted()) {
        gameRoomsToDelete.push(gameRoomId);
      }
    }
    for (const gameRoomId of gameRoomsToDelete) {
      this.gameRooms[gameRoomId].cleanRoom();
      delete this.gameRooms[gameRoomId];
    }
  }
}


module.exports = { GameRoomManager };
