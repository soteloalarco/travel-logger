import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';

import { listLogEntries } from './API';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 19.390519,
    longitude: -99.4238064,
    zoom: 5
  });

  // this function will run once when the component is mounting for fetching the markers
  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
      console.log(logEntries);
    })();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle= 'mapbox://styles/soteloalarco/ckgfu81286ioh19pgv8isi8w0'
      ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {
        logEntries.map(entry => (
          <Marker 
          key={entry._id}
          latitude={entry.latitude} 
          longitude={entry.longitude} 
          offsetLeft={-20} 
          offsetTop={-10}>
          <div>{entry.title}</div>
          </Marker>
        ))
      }
    </ReactMapGL>
  );
}

export default App;