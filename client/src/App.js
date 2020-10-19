import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

import { listLogEntries } from './API';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
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
      mapStyle= 'mapbox://styles/soteloalarco/ckgg0fi5c097219qlp58r4muj'
      ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {
        logEntries.map(entry => (
          <>
            <Marker 
              key={entry._id}
              latitude={entry.latitude} 
              longitude={entry.longitude} 
              >
              
              <div
                onClick={()=> setShowPopup({
                  ...showPopup,
                  [entry._id]: true,
                })}
              >
                <img 
                  src="https://i.imgur.com/y0G5YTX.png" 
                  alt="marker" 
                  className="marker"
                  style= {{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                />
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude} 
                  longitude={entry.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => this.setState({showPopup: false})}
                  anchor="top" >
                  <div>You are here</div>
                </Popup>) : null
            }
          </>
        ))
      }

    </ReactMapGL>
  );
}

export default App;