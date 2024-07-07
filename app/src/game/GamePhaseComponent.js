import { GamePhaseJoinComponent } from './GamePhaseJoinComponent.js';
import { GamePhaseSettingsComponent } from './GamePhaseSettingsComponent.js';


export function GamePhaseComponent({socket, gameState}) {
  const decideGamePhaseComponent = (gamePhase) => {
    if (gamePhase === "join") return <GamePhaseJoinComponent socket={socket} gameState={gameState} />;
    if (gamePhase === "settings") return <GamePhaseSettingsComponent socket={socket} gameState={gameState} />;
  }
  return decideGamePhaseComponent(gameState.phase.name);
}
