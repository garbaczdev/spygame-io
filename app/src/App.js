import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';


function App() {

  const [deviceId, setDeviceId] = useState(Cookies.get("deviceId"));

  useEffect(() => {
    if (!deviceId) {
      fetch('/api/device-id', {credentials: 'include'})
        .then(response => response.text())
        .then(data => setDeviceId(data));
    }
  }, []);

  return (
    <div className="App">
      {deviceId}
    </div>
  );
}

export default App;
