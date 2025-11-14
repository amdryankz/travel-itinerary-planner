import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { Save, X } from "lucide-react";
import LocationPicker from "../components/LocationPicker";
import url from "../constants/url";
import axios from "axios";
import toast from "react-hot-toast";

const ActivityForm = () => {
  const { tripId, activityId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!activityId);

  const [formData, setFormData] = useState({
    day: 1,
    title: "",
    description: "",
    location: {
      address: "",
      lat: null,
      lng: null,
    },
    startTime: "",
    endTime: "",
    duration: "",
    category: "sightseeing",
    cost: "",
    notes: "",
    order: 0,
  });

  const [errors, setErrors] = useState({});

  const fetchActivity = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get(`${url}/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      const activity = response.data.data;

      setFormData({
        day: activity.day,
        title: activity.title,
        description: activity.description || "",
        location: activity.location || { address: "", lat: null, lng: null },
        startTime: activity.startTime || "",
        endTime: activity.endTime || "",
        duration: activity.duration || "",
        category: activity.category || "sightseeing",
        cost: activity.cost || "",
        notes: activity.notes || "",
        order: activity.order || 0,
      });
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      navigate(`/trips/${tripId}`);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.day || formData.day < 1)
      newErrors.day = "Valid day is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        location: formData.location.address ? formData.location : null,
      };

      if (activityId) {
        await axios.put(`${url}/activities/${activityId}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });

        toast.success("Berhasil update activity");
      } else {
        await axios.post(`${url}/activities/trip/${tripId}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });

        toast.success("Berhasil nambah activity");
      }

      navigate(`/${tripId}`);
    } catch (error) {
      console.error("Failed to save activity:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activityId ? "Edit Activity" : "Add New Activity"}
        </h1>
        <p className="text-gray-600">Fill in the details for your activity</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Day */}
            <Input
              label="Day"
              name="day"
              type="number"
              min="1"
              value={formData.day}
              onChange={handleChange}
              error={errors.day}
              placeholder="e.g., 1"
            />

            {/* Title */}
            <Input
              label="Activity Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Visit Uluwatu Temple"
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder="Brief description of the activity"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="sightseeing">🏛️ Sightseeing</option>
                <option value="food">🍽️ Food & Dining</option>
                <option value="transport">🚗 Transportation</option>
                <option value="hotel">🏨 Accommodation</option>
                <option value="activity">🎯 Activity/Experience</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
              />

              <Input
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                error={errors.endTime}
              />
            </div>

            {/* Duration & Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 120"
              />

              <Input
                label="Estimated Cost (USD)"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g., 50.00"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(location) => {
                  setFormData((prev) => ({
                    ...prev,
                    location,
                  }));
                }}
                placeholder="Search for a location..."
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes / Tips
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="input"
                placeholder="Any special notes or tips for this activity"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button type="submit" loading={loading} className="flex-1">
              <Save size={20} className="inline mr-2" />
              {activityId ? "Update Activity" : "Add Activity"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/${tripId}`)}
              disabled={loading}
            >
              <X size={20} className="inline mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ActivityForm;
