import { GamePhaseJoinComponent } from './GamePhaseJoinComponent.js';
import { GamePhaseSettingsComponent } from './GamePhaseSettingsComponent.js';
import { GamePhaseRolesComponent } from './GamePhaseRolesComponent.js';
import { GamePhaseDiscussionComponent } from './GamePhaseDiscussionComponent.js';
import { GamePhaseVotingComponent } from './GamePhaseVotingComponent.js';


export function GamePhaseComponent({socket, gameState}) {
  const decideGamePhaseComponent = (gamePhase) => {
    if (gamePhase === "join") return <GamePhaseJoinComponent socket={socket} gameState={gameState} />;
    if (gamePhase === "settings") return <GamePhaseSettingsComponent socket={socket} gameState={gameState} />;
    if (gamePhase === "roles") return <GamePhaseRolesComponent socket={socket} gameState={gameState} />;
    if (gamePhase === "discussion") return <GamePhaseDiscussionComponent socket={socket} gameState={gameState} />;
    if (gamePhase === "voting") return <GamePhaseVotingComponent socket={socket} gameState={gameState} />;
  }
  return decideGamePhaseComponent(gameState.phase.name);
}
