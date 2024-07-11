import { useState, useEffect } from 'react';

import { FaRegHourglassHalf } from "react-icons/fa6";


export function GamePhaseDiscussionComponent({socket, gameState}) {
  const [timeRemaining, setTimeRemaining] = useState(() => 
    new Date(gameState.phase.state.finishTime) - new Date()
  );

  useEffect(() => {
    setTimeRemaining(new Date(gameState.phase.state.finishTime) - new Date());

    const interval = setInterval(() => {
      setTimeRemaining(new Date(gameState.phase.state.finishTime) - new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.phase.state.finishTime]);


  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 flex-column"
      style={{padding: "50px", maxWidth: "100vw"}}
    >
      <FaRegHourglassHalf style={{ fontSize: '150px', marginBottom: "20px" }}/>
      <h1 style={{ fontSize: '60px' }}>{minutes}:{seconds.toString().padStart(2, '0')}</h1>
      {
        gameState.player.isHost
        ?
        <>
          <button 
            className="btn btn-lg btn-primary mt-4"
            onClick={
            () => {
              socket.emit("action", {
                phase: "discussion",
                type: "addMinute",
                data: {}
              });
            }
          }>
            Add Minute
          </button>
          <button 
            className="btn btn-lg btn-primary mt-4"
            onClick={
            () => {
              socket.emit("action", {
                phase: "discussion",
                type: "finishDiscussion",
                data: {}
              });
            }
          }>
            Finish Discussion
          </button>
        </>
        :
        <></>
      }
    </div>
  );
}
