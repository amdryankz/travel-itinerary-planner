import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import url from "../constants/url";

export default function AIGenerateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    departureLocation: "",
    startDate: "",
    endDate: "",
    budget: "",
    participants: "",
    preferences: "",
    travelStyle: "balanced",
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

    const generateTripPromise = (async () => {
      // Step 1: Generate itinerary using AI
      const { data: aiResponse } = await axios.post(
        `${url}/ai/generate-itinerary`,
        {
          destination: formData.destination,
          departureLocation: formData.departureLocation,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? Number(formData.budget) : 0,
          preferences: {
            travelStyle: formData.travelStyle,
            interests: formData.preferences,
            participants: formData.participants
              ? Number(formData.participants)
              : 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const itinerary = aiResponse.data;

      // Step 2: Create trip
      const { data: tripResponse } = await axios.post(
        `${url}/trips`,
        {
          title: `Trip to ${formData.destination}`,
          destination: formData.destination,
          departureLocation: formData.departureLocation,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? Number(formData.budget) : 0,
          status: "draft",
          preferences: {
            travelStyle: formData.travelStyle,
            interests: formData.preferences,
            participants: formData.participants
              ? Number(formData.participants)
              : 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const tripId = tripResponse.data.id;

      // Step 3: Transform and bulk create activities with geocoding
      const activities = [];

      for (const dayPlan of itinerary.itinerary) {
        for (let index = 0; index < dayPlan.activities.length; index++) {
          const activity = dayPlan.activities[index];

          // Prepare location object
          let locationObj = null;

          if (activity.location && typeof activity.location === "string") {
            // Try to geocode the location
            try {
              const { data: geoData } = await axios.post(
                `${url}/ai/geocode`,
                { address: activity.location },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              locationObj = {
                lat: geoData.data.lat,
                lng: geoData.data.lng,
                address: geoData.data.address || activity.location,
              };
            } catch {
              // If geocoding fails, store as string in address field only
              locationObj = {
                address: activity.location,
              };
            }
          } else if (
            activity.location &&
            typeof activity.location === "object" &&
            activity.location.lat &&
            activity.location.lng
          ) {
            // Already has coordinates
            locationObj = {
              lat: activity.location.lat,
              lng: activity.location.lng,
              address: activity.location.address || activity.title,
            };
          }

          activities.push({
            day: dayPlan.day,
            title: activity.title,
            description: activity.description || "",
            location: locationObj,
            startTime: activity.startTime || null,
            endTime: activity.endTime || null,
            duration: activity.duration || null,
            category: activity.category || "other",
            cost: activity.estimatedCost || 0,
            notes: activity.tips || "",
            order: index,
          });
        }
      }

      // Bulk create activities
      await axios.post(
        `${url}/activities/trip/${tripId}/bulk`,
        { activities },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Navigate to trip details
      navigate(`/${tripId}`);
      return tripResponse;
    })();

    toast
      .promise(generateTripPromise, {
        loading: "AI sedang membuat itinerary untukmu... ✨",
        success: "Trip berhasil dibuat dengan AI! 🎉",
        error: (err) =>
          err.response?.data?.message ||
          "Gagal generate trip. Silakan coba lagi.",
      })
      .finally(() => setLoading(false));
  };

  const travelStyles = [
    {
      id: "relaxed",
      name: "Santai",
      description: "Lebih banyak waktu luang dan istirahat",
      emoji: "🏖️",
    },
    {
      id: "balanced",
      name: "Seimbang",
      description: "Kombinasi aktivitas dan istirahat",
      emoji: "⚖️",
    },
    {
      id: "adventure",
      name: "Petualangan",
      description: "Penuh aktivitas dan eksplorasi",
      emoji: "🏃",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <Sparkles className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generate Trip dengan AI
        </h1>
        <p className="text-gray-600">
          Beri tahu kami preferensimu, dan AI akan membuat itinerary sempurna
          untukmu
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Departure Location */}
          <div>
            <label
              htmlFor="departureLocation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Keberangkatan *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="departureLocation"
                name="departureLocation"
                required
                value={formData.departureLocation}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., Jakarta, Indonesia"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Destinasi *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="destination"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., Tokyo, Paris, Bali"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Mulai *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Selesai *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
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

          {/* Budget and Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Budget (Rupiah)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="5000000"
                  min="0"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                AI akan menyesuaikan rekomendasi dengan budget
              </p>
            </div>

            <div>
              <label
                htmlFor="participants"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Jumlah Orang
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gaya Perjalanan *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {travelStyles.map((style) => (
                <label
                  key={style.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.travelStyle === style.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="travelStyle"
                    value={style.id}
                    checked={formData.travelStyle === style.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {style.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {style.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label
              htmlFor="preferences"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferensi & Minat (Opsional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <Heart className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                rows="4"
                className="input pl-10"
                placeholder="e.g., Suka kuliner, fotografi, museum, pantai, hiking..."
              ></textarea>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Ceritakan aktivitas yang kamu suka agar AI bisa membuat
              rekomendasi yang lebih personal
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
              <div className="text-sm text-primary-900">
                <p className="font-medium mb-1">AI akan membuat:</p>
                <ul className="space-y-1 text-primary-800">
                  <li>• Itinerary harian lengkap dengan aktivitas</li>
                  <li>• Rekomendasi tempat wisata & kuliner</li>
                  <li>• Estimasi waktu & budget per aktivitas</li>
                  <li>• Rute perjalanan yang optimal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/create-trip")}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Trip</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
