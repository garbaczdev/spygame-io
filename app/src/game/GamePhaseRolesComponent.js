import { useState } from 'react';

import { GiSpy } from "react-icons/gi";
import { GoPerson } from "react-icons/go";


export function GamePhaseRolesComponent({socket, gameState}) {
  
  const [showRole, setShowRole] = useState(false);

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100 flex-column"
        style={{padding: "50px", maxWidth: "100vw"}}
      >

        {
          showRole
          ?
          <>
            {
              gameState.player.role.isSpy
              ?
              <>
                <GiSpy style={{ fontSize: '200px' }} />
                <h2>You are a spy!</h2>
                {
                  gameState.phase.state.otherSpies.length > 0
                  ?
                  <>
                    <h4 style={{marginTop: "20px"}}>Other spies are:</h4>
                    {
                      gameState.phase.state.otherSpies.map(
                        (playerName, index) => 
                        <div 
                          key={index}
                          className="border p-3 mb-1"
                        >
                          {
                            playerName
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
                <GoPerson style={{ fontSize: '200px' }} />
                <h2>You are a part of:</h2>
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
          </>
          :
          <button 
            className="btn btn-lg btn-primary mt-4"
            style={{fontSize: "40px"}}
            onClick={ () => setShowRole(true) }
          >
            Show Role
          </button>
        }
      </div>
    </>
  );
}
