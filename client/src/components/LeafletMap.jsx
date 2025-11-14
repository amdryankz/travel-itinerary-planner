import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const LeafletMap = forwardRef(function LeafletMap(
  { center, zoom = 13, activities = [], onMarkerClick },
  ref
) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

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

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  // Expose methods to parent component
  useImperativeHandle(
    ref,
    () => ({
      openPopupForActivity: (activityId) => {
        const marker = markersRef.current.find(
          (m) => m.activityId === activityId
        );
        if (marker && mapInstanceRef.current) {
          // Pan to marker smoothly and open popup
          const latlng = marker.getLatLng();
          mapInstanceRef.current.panTo(latlng, {
            animate: true,
            duration: 0.5,
          });

          // Use a small delay to ensure pan is complete before opening popup
          setTimeout(() => {
            // Close any other popups before opening the new one
            markersRef.current.forEach((m) => m.closePopup());
            marker.openPopup();
          }, 300);
        }
      },
    }),
    []
  );

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Clear existing markers and polylines
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    polylinesRef.current.forEach((polyline) => polyline.remove());
    polylinesRef.current = [];

    if (mapInstanceRef.current && activities.length > 0) {
      const bounds = [];
      const allCoordinates = [];

      // Sort activities by day and order
      const sortedActivities = [...activities]
        .filter(
          (activity) =>
            activity.location &&
            typeof activity.location === "object" &&
            activity.location.lat &&
            activity.location.lng
        )
        .sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return (a.order || 0) - (b.order || 0);
        });

      // Add markers and collect coordinates for each activity
      sortedActivities.forEach((activity) => {
        const { lat, lng } = activity.location;
        bounds.push([lat, lng]);
        allCoordinates.push([lat, lng]);

        const icon = createCustomIcon(getCategoryColor(activity.category));

        const marker = L.marker([lat, lng], { icon }).addTo(
          mapInstanceRef.current
        );

        // Store activity reference in marker
        marker.activityId = activity.id;

        // Create popup content with more details
        const locationText =
          typeof activity.location === "string"
            ? activity.location
            : activity.location.address || "Lihat di peta";

        const popupContent = `
          <div style="min-width: 250px; max-width: 300px;">
            <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <div style="
                background-color: ${getCategoryColor(activity.category)};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                flex-shrink: 0;
              ">
              </div>
              <div style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #111827; font-size: 15px;">
                  ${activity.title}
                </h4>
                <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
                  <span style="
                    display: inline-block;
                    padding: 2px 8px;
                    background-color: ${getCategoryColor(activity.category)}20;
                    color: ${getCategoryColor(activity.category)};
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 11px;
                  ">
                    ${activity.category}
                  </span>
                  <span style="font-size: 11px; color: #6B7280;">Hari ${
                    activity.day
                  }</span>
                </div>
              </div>
            </div>
            
            ${
              activity.description
                ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: #374151; line-height: 1.4;">${activity.description}</p>`
                : ""
            }
            
            <div style="background-color: #F9FAFB; padding: 8px; border-radius: 6px; margin-top: 8px;">
              ${
                activity.startTime && activity.endTime
                  ? `<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                      <span style="font-size: 14px;">⏰</span>
                      <span style="font-size: 12px; color: #374151;">
                        ${activity.startTime} - ${activity.endTime}
                        ${
                          activity.duration
                            ? ` (${activity.duration} menit)`
                            : ""
                        }
                      </span>
                    </div>`
                  : ""
              }
              
              ${
                activity.cost
                  ? `<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                      <span style="font-size: 14px;">💰</span>
                      <span style="font-size: 12px; color: #374151; font-weight: 500;">
                        ${new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(activity.cost)}
                      </span>
                    </div>`
                  : ""
              }
              
              <div style="display: flex; align-items: start; gap: 6px;">
                <span style="font-size: 14px;">📍</span>
                <span style="font-size: 11px; color: #6B7280; line-height: 1.4;">
                  ${locationText}
                </span>
              </div>
            </div>
            
            ${
              activity.notes
                ? `<div style="
                    margin-top: 8px;
                    padding: 8px;
                    background-color: #FEF3C7;
                    border-left: 3px solid #F59E0B;
                    border-radius: 4px;
                  ">
                    <div style="display: flex; align-items: start; gap: 6px;">
                      <span style="font-size: 14px;">💡</span>
                      <span style="font-size: 12px; color: #92400E; line-height: 1.4;">
                        ${activity.notes}
                      </span>
                    </div>
                  </div>`
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup",
        });

        // Add click event
        if (onMarkerClick) {
          marker.on("click", () => {
            onMarkerClick(activity);
          });
        }

        markersRef.current.push(marker);
      });

      // Draw polylines connecting activities in order
      if (allCoordinates.length > 1) {
        // Group by day for different colored lines
        const activitiesByDay = sortedActivities.reduce((acc, activity) => {
          if (!acc[activity.day]) {
            acc[activity.day] = [];
          }
          acc[activity.day].push(activity);
          return acc;
        }, {});

        // Draw polyline for each day
        Object.entries(activitiesByDay).forEach(([, dayActivities]) => {
          if (dayActivities.length > 1) {
            const dayCoordinates = dayActivities.map((activity) => [
              activity.location.lat,
              activity.location.lng,
            ]);

            // Create polyline with dashed pattern and arrows
            const polyline = L.polyline(dayCoordinates, {
              color: "#3B82F6",
              weight: 3,
              opacity: 0.7,
              dashArray: "10, 10",
              lineJoin: "round",
            }).addTo(mapInstanceRef.current);

            polylinesRef.current.push(polyline);
          }
        });

        // Also draw a connecting line between days (if multiple days)
        const dayKeys = Object.keys(activitiesByDay).sort((a, b) => a - b);
        if (dayKeys.length > 1) {
          for (let i = 0; i < dayKeys.length - 1; i++) {
            const currentDay = activitiesByDay[dayKeys[i]];
            const nextDay = activitiesByDay[dayKeys[i + 1]];

            if (currentDay.length > 0 && nextDay.length > 0) {
              const lastActivityCurrentDay = currentDay[currentDay.length - 1];
              const firstActivityNextDay = nextDay[0];

              // Dotted line between days
              const betweenDaysLine = L.polyline(
                [
                  [
                    lastActivityCurrentDay.location.lat,
                    lastActivityCurrentDay.location.lng,
                  ],
                  [
                    firstActivityNextDay.location.lat,
                    firstActivityNextDay.location.lng,
                  ],
                ],
                {
                  color: "#9CA3AF",
                  weight: 2,
                  opacity: 0.5,
                  dashArray: "5, 10",
                  lineJoin: "round",
                }
              ).addTo(mapInstanceRef.current);

              polylinesRef.current.push(betweenDaysLine);
            }
          }
        }
      }

      // Fit map to show all markers
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    }
  }, [activities, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "0",
        position: "relative",
        zIndex: 0,
      }}
    />
  );
});

export default LeafletMap;
