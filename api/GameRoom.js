
class GameRoom {
  constructor(id, hostDeviceId) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;

    this.creationTime = Date.now();
  }

  echo() {
    return this.id;
  }
}

module.exports = GameRoom;
