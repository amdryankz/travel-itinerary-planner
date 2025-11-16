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
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const ActivityForm = () => {
  const { tripId, activityId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!activityId);
  const { language } = useLanguage();
  const t = useTranslation(language);

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

    if (!formData.title.trim())
      newErrors.title =
        language === "id" ? "Judul wajib diisi" : "Title is required";
    if (!formData.day || formData.day < 1)
      newErrors.day =
        language === "id"
          ? "Hari yang valid wajib diisi"
          : "Valid day is required";
    if (!formData.category)
      newErrors.category =
        language === "id" ? "Kategori wajib diisi" : "Category is required";

    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime =
          language === "id"
            ? "Waktu selesai harus setelah waktu mulai"
            : "End time must be after start time";
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

        toast.success(t("activityForm.updateSuccess"));
      } else {
        await axios.post(`${url}/activities/trip/${tripId}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });

        toast.success(t("activityForm.addSuccess"));
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
          {activityId
            ? t("activityForm.editTitle")
            : t("activityForm.addTitle")}
        </h1>
        <p className="text-gray-600">{t("activityForm.subtitle")}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Day */}
            <Input
              label={t("activityForm.day")}
              name="day"
              type="number"
              min="1"
              value={formData.day}
              onChange={handleChange}
              error={errors.day}
              placeholder={t("activityForm.dayPlaceholder")}
            />

            {/* Title */}
            <Input
              label={t("activityForm.activityTitle")}
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder={t("activityForm.titlePlaceholder")}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("activityForm.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder={t("activityForm.descriptionPlaceholder")}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("activityForm.category")}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="sightseeing">
                  {t("activityForm.sightseeing")}
                </option>
                <option value="food">{t("activityForm.food")}</option>
                <option value="transport">{t("activityForm.transport")}</option>
                <option value="hotel">{t("activityForm.hotel")}</option>
                <option value="activity">
                  {t("activityForm.activityExp")}
                </option>
                <option value="shopping">{t("activityForm.shopping")}</option>
                <option value="other">{t("activityForm.other")}</option>
              </select>
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("activityForm.startTime")}
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
              />

              <Input
                label={t("activityForm.endTime")}
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
                label={t("activityForm.duration")}
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder={t("activityForm.durationPlaceholder")}
              />

              <Input
                label={t("activityForm.cost")}
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder={t("activityForm.costPlaceholder")}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("activityForm.location")}
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(location) => {
                  setFormData((prev) => ({
                    ...prev,
                    location,
                  }));
                }}
                placeholder={t("activityForm.locationPlaceholder")}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("activityForm.notes")}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="input"
                placeholder={t("activityForm.notesPlaceholder")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button type="submit" loading={loading} className="flex-1">
              <Save size={20} className="inline mr-2" />
              {activityId
                ? t("activityForm.updateButton")
                : t("activityForm.addButton")}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/${tripId}`)}
              disabled={loading}
            >
              <X size={20} className="inline mr-2" />
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ActivityForm;
