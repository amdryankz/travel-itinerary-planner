import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Button from "./Button";
import { MapPin, Search, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import url from "../constants/url";

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({
  value,
  onChange,
  placeholder = "Search location...",
}) => {
  const [searchQuery, setSearchQuery] = useState(value?.address || "");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(value || null);

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setMapPosition([value.lat, value.lng]);
      setSelectedLocation(value);
    }
  }, [value]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const response = await axios.post(
        `${url}/ai/search-places`,
        {
          query: searchQuery,
          location: {
            lat: -6.2088, // Default Jakarta
            lng: 106.8456,
          },
        },
        { headers: { Authorization: `Bearer ${localStorage.token}` } }
      );

      setSuggestions(response.data);
      setShowMap(true);
    } catch (error) {
      console.error("Search failed:", error);

      // Fallback to geocoding
      try {
        const geoResponse = await axios.post(
          `${url}/ai/geocode`,
          {
            query: searchQuery,
          },
          { headers: { Authorization: `Bearer ${localStorage.token}` } }
        );
        setSelectedLocation(geoResponse.data);
        setMapPosition([geoResponse.data.lat, geoResponse.data.lng]);
        setShowMap(true);
        onChange?.(geoResponse.data);
      } catch (geoError) {
        console.log(geoError);
        alert("Location not found. Please try a different search.");
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSuggestion = (place) => {
    const location = {
      address: place.address,
      lat: place.location.lat,
      lng: place.location.lng,
    };

    setSelectedLocation(location);
    setMapPosition([place.location.lat, place.location.lng]);
    setSearchQuery(place.name);
    setSuggestions([]);
    onChange?.(location);
  };

  const handleMapClick = async (position) => {
    setMapPosition(position);

    // Reverse geocode to get address
    try {
      // For now, just use coordinates
      const location = {
        address: `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
        lat: position[0],
        lng: position[1],
      };

      setSelectedLocation(location);
      onChange?.(location);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={placeholder}
          />
        </div>

        <Button
          type="button"
          onClick={handleSearch}
          loading={searching}
          disabled={!searchQuery.trim()}
        >
          <MapPin size={20} />
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowMap(!showMap)}
        >
          <Navigation size={20} />
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(place)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">{place.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{place.address}</div>
              {place.rating && (
                <div className="text-xs text-yellow-600 mt-1">
                  ⭐ {place.rating} {place.types?.join(", ")}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="text-green-600 dark:text-green-400 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                Location confirmed
              </p>
              <p className="text-xs text-green-700">
                {selectedLocation.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="h-64">
            <MapContainer
              center={mapPosition || [-6.2088, 106.8456]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LocationMarker
                position={mapPosition}
                setPosition={handleMapClick}
              />
            </MapContainer>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-600">
            Click on the map to select a location
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
