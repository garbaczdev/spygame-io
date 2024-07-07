import { JoinGamePhaseComponent } from './JoinGamePhaseComponent.js';


export function GamePhaseComponent({socket, gameState}) {
  const decideGamePhaseComponent = (gamePhase) => {
    if (gamePhase === "join") return <JoinGamePhaseComponent socket={socket} gameState={gameState} />;
  }
  return decideGamePhaseComponent(gameState.phase.name);
}
