import { useState, useEffect } from 'react';


export function GamePhaseSettingsComponent({socket, gameState}) {

  const [spiesNumber, setSpiesNumber] = useState(gameState.phase.state?.settings?.spiesNumber ?? 0);
  const [discussionMinutes, setDiscussionMinutes] = useState(gameState.phase.state?.settings?.discussionMinutes ?? 0);

  const canDecreaseSpies = spiesNumber > 1;
  const canDecreaseMinutes = discussionMinutes > 1;

  const canIncreaseSpies = spiesNumber < Math.ceil(gameState.allPlayers.length/2) - 1;
  const canIncreaseMinutes = discussionMinutes < 60;

  return (
    <>
      {
        gameState.player.isHost
        ?
        <div className="container text-center">
          <h2 className="mb-2">Settings</h2>
          <h4 className="mb-5">Total players: {gameState.allPlayers.length}</h4>
          <h4>Spies number</h4>
          <div className="d-flex justify-content-center align-items-center mb-4 mt-2">
            <button
              className={`btn mx-2 ${canDecreaseSpies ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                if (canDecreaseSpies) setSpiesNumber(spiesNumber - 1);
              }}
            >-</button>
            <span className="mx-2">{spiesNumber}</span>
            <button
              className={`btn mx-2 ${canIncreaseSpies ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                if (canIncreaseSpies) setSpiesNumber(spiesNumber + 1);
              }}
            >+</button>
          </div>
          <h4>Minutes for discussion</h4>
          <div className="d-flex justify-content-center align-items-center mb-4 mt-2">
            <button
              className={`btn mx-2 ${canDecreaseMinutes ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                if (canDecreaseMinutes) setDiscussionMinutes(discussionMinutes - 1);
              }}
            >-</button>
            <span className="mx-2">{discussionMinutes}</span>
            <button
              className={`btn mx-2 ${canIncreaseMinutes ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                if (canIncreaseMinutes) setDiscussionMinutes(discussionMinutes + 1);
              }}
            >+</button>
          </div>
          <button 
            className="btn btn-lg btn-primary mt-4"
            onClick={
            () => {
              socket.emit("action", {
                phase: "settings",
                type: "confirmSettings",
                data: {
                  settings: {
                    spiesNumber,
                    discussionMinutes
                  }
                }
              });
            }
          }>
            Start Game
          </button>
        </div>
        :
        <div className="container text-center">
          <h2>Waiting for host...</h2>
        </div>
      }
    </>
  );
}
