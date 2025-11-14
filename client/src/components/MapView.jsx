import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons by category
const createCustomIcon = (category) => {
  const colors = {
    sightseeing: "#3B82F6",
    food: "#F59E0B",
    transport: "#6B7280",
    hotel: "#8B5CF6",
    activity: "#10B981",
    shopping: "#EC4899",
    other: "#64748B",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${
      colors[category] || colors.other
    }; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const MapView = ({ activities, center, zoom = 13 }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin size={48} className="mx-auto mb-2" />
          <p>No locations to display</p>
        </div>
      </div>
    );
  }

  // Filter activities with valid locations
  const activitiesWithLocation = activities.filter(
    (activity) =>
      activity.location && activity.location.lat && activity.location.lng
  );

  if (activitiesWithLocation.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin size={48} className="mx-auto mb-2" />
          <p>No locations available for map display</p>
        </div>
      </div>
    );
  }

  // Calculate center if not provided
  const mapCenter = center || [
    activitiesWithLocation[0].location.lat,
    activitiesWithLocation[0].location.lng,
  ];

  // Create polyline coordinates (route)
  const routeCoordinates = activitiesWithLocation.map((activity) => [
    activity.location.lat,
    activity.location.lng,
  ]);

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route line */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3B82F6"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Markers */}
        {activitiesWithLocation.map((activity, index) => (
          <Marker
            key={activity.id}
            position={[activity.location.lat, activity.location.lng]}
            icon={createCustomIcon(activity.category)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <div className="text-xs text-gray-500">
                  <p>📍 {activity.location.address}</p>
                  {activity.startTime && (
                    <p>
                      🕐 {activity.startTime} - {activity.endTime}
                    </p>
                  )}
                  {activity.cost && <p>💰 ${activity.cost}</p>}
                  <p className="mt-1">
                    <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs">
                      Day {activity.day} - #{index + 1}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
