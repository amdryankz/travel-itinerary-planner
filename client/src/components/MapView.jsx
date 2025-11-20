import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Info } from "lucide-react";
import LeafletMap from "./LeafletMap";

export default function MapView({ trip, activities = [] }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -6.2088, lng: 106.8456 }); // Jakarta default
  const mapRef = useRef(null);

  useEffect(() => {
    // Set map center based on first activity with coordinates or default
    if (activities.length > 0) {
      const firstActivityWithCoords = activities.find(
        (activity) =>
          activity.location &&
          typeof activity.location === "object" &&
          activity.location.lat &&
          activity.location.lng
      );

      if (firstActivityWithCoords) {
        setMapCenter({
          lat: firstActivityWithCoords.location.lat,
          lng: firstActivityWithCoords.location.lng,
        });
      }
    }
  }, [activities]);

  const getCategoryColor = (category) => {
    const colors = {
      sightseeing: "#3B82F6",
      food: "#F97316",
      transport: "#8B5CF6",
      hotel: "#10B981",
      activity: "#EC4899",
      shopping: "#EAB308",
      other: "#6B7280",
    };
    return colors[category] || colors.other;
  };

  const groupActivitiesByDay = () => {
    return activities.reduce((acc, activity) => {
      if (!acc[activity.day]) {
        acc[activity.day] = [];
      }
      acc[activity.day].push(activity);
      return acc;
    }, {});
  };

  const handleActivityClick = useCallback((activity) => {
    setSelectedActivity(activity);
    if (mapRef.current) {
      mapRef.current.openPopupForActivity(activity.id);
    }
  }, []);

  const activitiesByDay = groupActivitiesByDay();

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Map Header */}
        <div className="bg-linear-to-r bg-primary-600  px-6 py-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">Peta Perjalanan</h3>
              <p className="text-primary-100 text-sm">
                {trip?.destination || "Destinasi"}
              </p>
            </div>
          </div>
        </div>

        {/* Leaflet Map */}
        <LeafletMap
          ref={mapRef}
          center={mapCenter}
          zoom={13}
          activities={activities}
          onMarkerClick={handleActivityClick}
        />

        {/* Map Legend */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Info size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-200">Legenda:</span>
              </div>
              {Object.entries({
                sightseeing: "Wisata",
                food: "Kuliner",
                transport: "Transport",
                hotel: "Hotel",
                activity: "Aktivitas",
                shopping: "Belanja",
                other: "Lainnya",
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(key) }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activities List by Day */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Lokasi Aktivitas per Hari
        </h3>

        {Object.entries(activitiesByDay).map(([day, dayActivities]) => (
          <div key={day} className="mb-6 last:mb-0">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Hari {day}
            </h4>
            <div className="space-y-3">
              {dayActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedActivity?.id === activity.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{
                      backgroundColor: getCategoryColor(activity.category),
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </h5>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getCategoryColor(
                            activity.category
                          )}20`,
                          color: getCategoryColor(activity.category),
                        }}
                      >
                        {activity.category}
                      </span>
                    </div>
                    {typeof activity.location === "string" &&
                    activity.location ? (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} />
                        <span className="truncate">{activity.location}</span>
                      </div>
                    ) : activity.location?.lat && activity.location?.lng ? (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} />
                        <span>
                          {activity.location.lat.toFixed(6)},{" "}
                          {activity.location.lng.toFixed(6)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        Lokasi tidak tersedia
                      </p>
                    )}
                    {activity.startTime && activity.endTime && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.startTime} - {activity.endTime}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p>Belum ada aktivitas untuk ditampilkan di peta</p>
          </div>
        )}
      </div>
    </div>
  );
}
