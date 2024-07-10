import { useState, useEffect } from 'react';


export function GamePhaseSettingsComponent({socket, gameState}) {

  const [settings, setSettings] = useState(gameState.phase.state.settings);

  const [spiesNumber, setSpiesNumber] = useState(gameState.phase.state.settings.spiesNumber);
  const [discussionSeconds, setDiscussionSeconds] = useState(gameState.phase.state.settings.discussionSeconds);

  useEffect(() => {
    const newSettings = gameState.phase.state.settings;
    if (
      newSettings["spiesNumber"] != settings["spiesNumber"]
      || newSettings["discussionSeconds"] != settings["discussionSeconds"]
    ) {
      setSettings(newSettings);
      setSpiesNumber(newSettings["spiesNumber"]);
      setDiscussionSeconds(newSettings["discussionSeconds"]);
    }
  }, [gameState]);

  return (
    <>
      <h2>Settings</h2>
      <input 
        type="text" 
        className="form-control mb-3"
        value={spiesNumber} 
        onChange={(event) => setSpiesNumber(event.target.value)}
      />
      <input 
        type="text" 
        className="form-control mb-3"
        value={discussionSeconds} 
        onChange={(event) => setDiscussionSeconds(event.target.value)}
      />
      <button 
        className={`btn btn-lg "btn-primary"`}
        onClick={
        () => {
          socket.emit("action", {
            phase: "settings",
            type: "confirmSettings",
            data: {
              settings: {
                spiesNumber,
                discussionSeconds
              }
            }
          });
        }
      }>
        Create player
      </button>
    </>
  );
}
