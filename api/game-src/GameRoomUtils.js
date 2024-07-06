
class GameRoomUtils {
  static killSocket(socket, message="") {
    socket.emit('gameState', {finished: true, message});
    socket.disconnect(true);
  }
}

module.exports = { GameRoomUtils };
