import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

import { listLogEntries } from './API';

import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 19.390519,
    longitude: -99.4238064,
    zoom: 5
  });

  const getEntries = async() => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  // this function will run once when the component is mounting for fetching the markers
  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] =event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle= 'mapbox://styles/soteloalarco/ckgg0fi5c097219qlp58r4muj'
      ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker 
              latitude={entry.latitude} 
              longitude={entry.longitude} 
              >
              
              <div
                onClick={()=> setShowPopup({
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
                  dynamicPosition = {true}
                  sortByDepth = {true}
                  onClose={() => setShowPopup({})}
                  anchor="top" >
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>{entry.comments}</p>
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    {entry.image && <img src={entry.image} alt={entry.title}/>}
                  </div>
                </Popup>) : null
            }
          </React.Fragment>
        ))
      }

      {
        addEntryLocation ? (
          <>
            <Marker 
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
              >
              
              <div>
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
            <Popup
                  latitude={addEntryLocation.latitude} 
                  longitude={addEntryLocation.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition = {true}
                  sortByDepth = {true}
                  onClose={() => setAddEntryLocation(null)}
                  anchor="top" >
                  <div className="popup">
                    <LogEntryForm onClose={()=> {
                      setAddEntryLocation(null);
                      getEntries();
                    }} location={addEntryLocation}/>
                  </div>
            </Popup>
          </>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;