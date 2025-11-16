import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { Navigation2 } from "lucide-react";
import axios from "axios";
import url from "../constants/url";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const DistanceCalculator = ({ activities }) => {
  const [showModal, setShowModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [distances, setDistances] = useState([]);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const calculateDistances = async () => {
    try {
      setCalculating(true);
      const activitiesWithLocation = activities.filter(
        (a) => a.location?.lat && a.location?.lng
      );

      const distancePromises = [];
      for (let i = 0; i < activitiesWithLocation.length - 1; i++) {
        const origin = activitiesWithLocation[i];
        const destination = activitiesWithLocation[i + 1];

        distancePromises.push(
          axios
            .post(
              `${url}/ai/distance`,
              {
                origin: `${origin.location.lat},${origin.location.lng}`,
                destination: `${destination.location.lat},${destination.location.lng}`,
              },
              { headers: { Authorization: `Bearer ${localStorage.token}` } }
            )
            .then((result) => ({
              from: origin.title,
              to: destination.title,
              ...result.data.data,
            }))
        );
      }

      const results = await Promise.all(distancePromises);

      setDistances(results);
      setShowModal(true);
    } catch (error) {
      console.error("Distance calculation failed:", error);
      alert(t("components.distanceCalc.failed"));
    } finally {
      setCalculating(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={calculateDistances}
        loading={calculating}
      >
        <Navigation2 size={16} className="mr-2" />
        {t("components.distanceCalc.button")}
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t("components.distanceCalc.title")}
      >
        <div className="space-y-3">
          {distances.map((dist, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {dist.from}
                  </p>
                  <div className="flex items-center gap-2 my-1">
                    <Navigation2 size={14} className="text-primary-600" />
                    <div className="flex-1 border-t border-dashed border-gray-300"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{dist.to}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">
                    {t("components.distanceCalc.distance")}:
                  </span>{" "}
                  {dist.distance || "N/A"}
                </div>
                <div>
                  <span className="font-medium">
                    {t("components.distanceCalc.duration")}:
                  </span>{" "}
                  {dist.duration || "N/A"}
                </div>
              </div>
            </div>
          ))}

          {distances.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {t("components.distanceCalc.noDistances")}
            </p>
          )}

          {/* Total */}
          {distances.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900">
                  {t("components.distanceCalc.totalDistance")}:
                </span>
                <span className="font-semibold text-primary-600">
                  {distances
                    .reduce((sum, d) => {
                      if (!d.distance || typeof d.distance !== "string") {
                        return sum;
                      }
                      const km = parseFloat(d.distance.replace(/[^\d.]/g, ""));
                      return sum + (isNaN(km) ? 0 : km);
                    }, 0)
                    .toFixed(1)}{" "}
                  km
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DistanceCalculator;
