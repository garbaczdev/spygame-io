
export function GamePhaseRolesComponent({socket, gameState}) {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100 flex-column"
        style={{padding: "50px", maxWidth: "100vw"}}
      >
        {
          gameState.player.role.isSpy
          ?
          <>
            <h2>You are a spy!</h2>
            {
              gameState.phase.state.otherSpies.length > 0
              ?
              <>
                <h4 style={{marginTop: "20px"}}>Other spies are:</h4>
                {
                  gameState.phase.state.otherSpies.map(
                    (player, index) => 
                    <div 
                      key={index}
                      className="border p-3 mb-1"
                    >
                      {
                        player.name
                      }
                    </div>
                  )
                }
              </>
              :
              <></>
            }
          </>
          :
          <>
            <h2>Your role is:</h2>
            <h4>{gameState.player.role.name}</h4>
          </>
        }
        {
          gameState.player.isHost
          ?
          <button 
            className="btn btn-lg btn-primary mt-4"
            onClick={
            () => {
              socket.emit("action", {
                phase: "roles",
                type: "startDiscussion",
                data: {}
              });
            }
          }>
            Start Discussion
          </button>
          :
          <></>
        }
      </div>
    </>
  );
}
