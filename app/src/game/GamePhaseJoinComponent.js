import { useState } from 'react';

import QRCode from 'qrcode.react';


export function GamePhaseJoinComponent({socket, gameState}) {
  const [nameInputValue, setNameInputValue] = useState("");

  const canStart = gameState.allPlayers.filter(
    player => player.name.length > 0
  ).length >= 4;

  const [canCreateUser, reason] = (() => {
    const name = nameInputValue;
    if (name.trim().length === 0) return [false, ""];
    if (name.trim().length > 20) return [false, "Name too long"];
    if (
      gameState.allPlayers.map(
        player => player.name.toLowerCase()
      ).includes(name.toLowerCase())
    ) return [false, "This name is taken by another player"];
    return [true, ""];
  })();

  return (
    <>
    {
      gameState.phase.state.nameRequired
      ?
      <div className="container text-center">
        <h1 className="m-5">New Player</h1>
        {
          canCreateUser
          ?
          <></>
          :
          <label style={{ color: 'red', marginBottom: "10px" }}>{reason}</label>
        }
        <input 
          type="text" 
          className="form-control mb-3"
          placeholder="Name"
          value={nameInputValue} 
          onChange={(event) => setNameInputValue(event.target.value)}
        />
        <button 
          className={`btn btn-lg ${canCreateUser ? "btn-primary" : "btn-secondary"}`}
          onClick={
          () => {
            if (!canCreateUser) return;
            socket.emit("action", {
              phase: "join",
              type: "provideName",
              data: {
                name: nameInputValue
              }
            });
          }
        }>
          Create player
        </button>
      </div>
      :
      <div className="row flex-column">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <QRCode value={window.location.href} size={256} />
        </div>
        <button 
          className="btn btn-primary btn-lg mt-5"
          style={{ width: 'auto' }} 
          onClick={
          () => navigator.clipboard.writeText(window.location.href)
        }>
          Copy Link
        </button>
        <h1 className="m-5">Players</h1>
        {
          gameState.allPlayers.filter(
            player => player.name.length > 0
          ).map(
            (player, index) => 
            <div 
              key={index}
              className="border p-3 mb-1"
              style={{ width: '80vw' }}
            >
              {
                player.name
                + (player.isCurrentPlayer ? " (You) " : "")
                + (player.isHost ? " (Host) " : "")
              }
            </div>
          )
        }
        {
          gameState.player.isHost
          ?
          <button 
            className={`btn btn-lg ${canStart ? "btn-primary" : "btn-secondary"}`}
            style={{
              position: 'fixed',
              bottom: "10px",
              left: "0",
              zIndex: 50,
              overflow: 'hidden',
            }}
            onClick={
            () => {
              if (!canStart) return;
              socket.emit("action", {
                phase: "join",
                type: "startGame",
                data: {}
              });
            }
          }> Start Game </button>
          :
          <></>
        }
      </div>
    }
    </>
  ); 
}
