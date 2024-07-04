import io from 'socket.io-client';


const socket = io(window.location.origin, {
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;
