import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Leaflet custom marker icon (Jobsy purple)
delete L.Icon.Default.prototype._getIconUrl;

const customPinIcon = new L.DivIcon({
  className: 'custom-leaflet-pin',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#6366f1" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); margin-left: -20px; margin-top: -40px;">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  iconSize: [0, 0], // Handled by SVG styling
  iconAnchor: [0, 0], 
  popupAnchor: [0, -40] 
});

L.Marker.prototype.options.icon = customPinIcon;

export function MapView({ lat, lng, zoom = 15, popupText }) {
  if (!lat || !lng) return null;

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[lat, lng]}>
          {popupText && <Popup>{popupText}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}

function LocationMarker({ lat, lng, onChange }) {
  const map = useMapEvents({
    click(e) {
      if (onChange) {
        onChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

export function MapPicker({ lat, lng, onChange }) {
  const defaultCenter = lat && lng ? [lat, lng] : [39.92077, 32.85411]; // Default to Ankara, Turkey

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer center={defaultCenter} zoom={lat && lng ? 15 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
