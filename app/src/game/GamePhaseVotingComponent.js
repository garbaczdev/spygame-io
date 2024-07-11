
export function GamePhaseVotingComponent({socket, gameState}) {

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 flex-column"
      style={{padding: "50px", maxWidth: "100vw"}}
    >
      <h1>Vote:</h1>
      {
        gameState.allPlayers.filter(
          otherPlayer => otherPlayer.name !== gameState.player.name
        ).map(
          (otherPlayer, index) => 
          <div 
            key={index}
            className="p-3 m-2"
            style={{fontSize: "30px", ...(gameState.phase.state.votedPlayerName === otherPlayer.name ? {border: '5px solid blue'} : {border: '2px solid grey'})}}
            onClick={() => {
              if (gameState.phase.state.voted) return;
              socket.emit("action", {
                phase: "voting",
                type: "vote",
                data: {
                  votedPlayerName: otherPlayer.name
                }
              });
            }}
          >
            { otherPlayer.name }
          </div>
        )
      }

      {
        gameState.player.isHost
        ?
        <button 
          className="btn btn-lg btn-primary m-4"
          onClick={
          () => {
            socket.emit("action", {
              phase: "voting",
              type: "finishVoting",
              data: {}
            });
          }
        }>
          Force Finish Voting
        </button>
        :
        <></>
          }
    </div>
  );
}
