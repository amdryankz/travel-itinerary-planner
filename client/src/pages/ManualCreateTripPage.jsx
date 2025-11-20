import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, FileText, PenTool } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import url from "../constants/url";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

export default function ManualCreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    departureLocation: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createTripPromise = axios
      .post(
        `${url}/trips`,
        {
          title: formData.title,
          destination: formData.destination,
          departureLocation: formData.departureLocation || "Indonesia",
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? Number(formData.budget) : 0,
          status: "draft",
          preferences: formData.description
            ? { description: formData.description }
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(({ data }) => {
        navigate(`/${data.data.id}`);
        return data;
      });

    toast
      .promise(createTripPromise, {
        loading: t("manualCreate.creatingToast"),
        success: t("manualCreate.successToast"),
        error: (err) =>
          err.response?.data?.message || t("manualCreate.errorToast"),
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <PenTool className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("manualCreate.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t("manualCreate.subtitle")}</p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("manualCreate.tripTitleLabel")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input pl-10"
                placeholder={t("manualCreate.tripTitlePlaceholder")}
              />
            </div>
          </div>

          {/* Departure Location */}
          <div>
            <label
              htmlFor="departureLocation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("manualCreate.departureLabel")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                id="departureLocation"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleChange}
                className="input pl-10"
                placeholder={t("manualCreate.departurePlaceholder")}
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("manualCreate.destinationLabel")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                id="destination"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="input pl-10"
                placeholder={t("manualCreate.destinationPlaceholder")}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                {t("manualCreate.startDateLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                {t("manualCreate.endDateLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input pl-10"
                  min={formData.startDate}
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("manualCreate.budgetLabel")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input pl-10"
                placeholder={t("manualCreate.budgetPlaceholder")}
                min="0"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("manualCreate.budgetHint")}
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("manualCreate.descriptionLabel")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder={t("manualCreate.descriptionPlaceholder")}
            ></textarea>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/create-trip")}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              {t("manualCreate.backButton")}
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading
                ? t("manualCreate.creating")
                : t("manualCreate.createButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
