"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { Waypoint } from "@/types";

// Fix Leaflet default marker icons using data URIs
const defaultIconUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==";

const DefaultIcon = L.icon({
  iconUrl: defaultIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom numbered marker icons
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: #2D5A3D;
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

interface OpenStreetMapProps {
  center?: [number, number];
  zoom?: number;
  waypoints?: Waypoint[];
  onMapClick?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  showRoute?: boolean;
  height?: string;
}

function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

export function OpenStreetMap({
  center = [48.8566, 2.3522],
  zoom = 12,
  waypoints = [],
  onMapClick,
  readOnly = false,
  showRoute = true,
  height = "500px",
}: OpenStreetMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!readOnly && onMapClick) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  };

  const routePositions: [number, number][] = showRoute
    ? waypoints.map((wp) => [wp.lat, wp.lng])
    : [];

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="bg-muted rounded-lg flex items-center justify-center"
      >
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} />
        
        {!readOnly && <MapClickHandler onClick={handleMapClick} />}
        
        {waypoints.map((waypoint, index) => (
          <Marker
            key={waypoint.id}
            position={[waypoint.lat, waypoint.lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              <div className="text-sm">
                {waypoint.clientName ? (
                  <>
                    <strong>{waypoint.clientName}</strong>
                    <br />
                    {waypoint.address}
                  </>
                ) : (
                  `Point ${index + 1}`
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {showRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color="#2D5A3D"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}

function MapClickHandler({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) {
  const map = useMap();
  
  useEffect(() => {
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [map, onClick]);
  
  return null;
}
