import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.module.css';
import { Button, Grid, Box, Item, getLinearProgressUtilityClass } from '@mui/material';
import { bind } from 'leaflet';

const Map = () => {
  const [isRiding, setIsRiding] = useState(false);

  const scooters = [
    {
      id: 1,
      name: 'first',
      position: [50.450001, 30.523333],
    },
    {
      id: 2,
      name: 'second',
      position: [50.4501, 30.524],
    },
  ];

  const getInfo = (scooter) => {
    console.log(scooter);
  };

  return (
        <MapContainer
            center={[50.450001, 30.523333]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '85vh' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {scooters.map((scooter) => (
                <Marker position={scooter.position} key={scooter.id} 
                    eventHandlers={{
                        click: () => getInfo(scooter),
                  }}>
                {/* <Popup>
                    <Button onClick={() => getInfo(scooter)}>Start ride</Button>
                </Popup> */}
                </Marker>
            ))}
        </MapContainer>
  );
};

export default Map;
