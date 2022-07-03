import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@mui/material';
import L from 'leaflet';
import Scooter from '../assets/scooterIcon.png';
import Bike from '../assets/bikeIcon.png';

const Map = ({rentals, setSelectedRental }) => {
  
  const ScooterIcon = new L.Icon({
    iconUrl: Scooter,
    iconSize: [40, 40],
  });

  const BikeIcon = new L.Icon({
    iconUrl: Bike,
    iconSize: [40, 40],
  });

  /**
   * Function to define icon we need by rental type
   * @param {type} rental scooter/bike 
   * @returns {object} icon
   */
  const whichIcon = (rental) => {
    if (rental.type === 'scooter') {
      return ScooterIcon;
    }
    return BikeIcon;
  }

  return (
    <Card style={{ height: '100%', width: '100%'}}>
      <MapContainer
        center={[50.450001, 30.523333]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '85vh' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {rentals.map((rental) => (
            <Marker
              icon={whichIcon(rental)}
              position={rental.location} 
              key={rental._id} 
              eventHandlers={{
                click: () => setSelectedRental(rental)
              }}
            />
        ))}
      </MapContainer>
    </Card>
  );
};

export default Map;
