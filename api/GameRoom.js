
class GameRoom {
  constructor(id, hostDeviceId) {
    this.id = id;
    this.hostDeviceId = hostDeviceId;
  }

  echo() {
    return "id"
  }
}

module.exports = GameRoom;
