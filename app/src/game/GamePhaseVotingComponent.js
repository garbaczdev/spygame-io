
function VotingNotFinishedComponent({socket, gameState}) {
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


function VotingFinishedComponent({socket, gameState}) {

  const endVotesCount = gameState.phase.state.endVotesCount;

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 flex-column"
      style={{padding: "50px", maxWidth: "100vw"}}
    >
      {
        gameState.phase.state.whoWon === "spies"
        ?
        <h1>Spies won!</h1>
        :
        <h1>Spies lost!</h1>
      }
      {
        Object.keys(endVotesCount).map(
          (playerName, index) => 
          <div 
            key={index}
            className="p-3 m-2"
            style={{
              fontSize: "30px",
              ...(
                gameState.phase.state.votedPlayerName === playerName ? {border: '5px solid blue'} : {border: '2px solid grey'}
              ),
              ...(
                endVotesCount[playerName].isSpy ? {background: '#e74c3c'} : {}
              ),
            }}
          >
            {`(${endVotesCount[playerName].votes}) ${playerName}`}
          </div>
        )
      }
      <button 
        className="btn btn-lg btn-primary m-4"
        onClick={
        () => {
          socket.emit("action", {
            phase: "voting",
            type: "restartGame",
            data: {}
          });
        }
      }>
        Play again
      </button>
    </div>
  );
}

export function GamePhaseVotingComponent({socket, gameState}) {
  if (gameState.phase.state.votingFinished) return <VotingFinishedComponent socket={socket} gameState={gameState} />
  return <VotingNotFinishedComponent socket={socket} gameState={gameState} />
}
