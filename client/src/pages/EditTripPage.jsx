import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  PenTool,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import url from "../constants/url";

export default function EditTripPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    departureLocation: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  // Fetch existing trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setFetching(true);
        const { data } = await axios.get(`${url}/trips/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const trip = data.data;
        setFormData({
          title: trip.title || "",
          destination: trip.destination || "",
          departureLocation: trip.departureLocation || "",
          startDate: trip.startDate ? trip.startDate.split("T")[0] : "",
          endDate: trip.endDate ? trip.endDate.split("T")[0] : "",
          budget: trip.budget || "",
          description: trip.preferences?.description || "",
        });
      } catch (err) {
        console.error("Failed to fetch trip:", err);
        toast.error("Gagal memuat data trip");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateTripPromise = axios
      .put(
        `${url}/trips/${id}`,
        {
          title: formData.title,
          destination: formData.destination,
          departureLocation: formData.departureLocation || "Indonesia",
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? Number(formData.budget) : 0,
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
        navigate(`/trip/${id}`);
        return data;
      });

    toast
      .promise(updateTripPromise, {
        loading: "Memperbarui trip...",
        success: "Trip berhasil diperbarui! ✅",
        error: (err) =>
          err.response?.data?.message?.[0] ||
          "Gagal memperbarui trip. Silakan coba lagi.",
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Detail Trip</span>
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <PenTool className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Trip</h1>
          <p className="text-gray-600">
            Perbarui detail perjalananmu sesuai kebutuhan
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Judul Trip *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., Winter Adventure in Japan"
              />
            </div>
          </div>

          {/* Departure Location */}
          <div>
            <label
              htmlFor="departureLocation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lokasi Keberangkatan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="departureLocation"
                name="departureLocation"
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
                placeholder="e.g., Tokyo, Japan"
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

          {/* Budget */}
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
              Masukkan budget dalam Rupiah (Rp)
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="Ceritakan tentang trip ini..."
            ></textarea>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/trip/${id}`)}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips:</strong> Perubahan pada tanggal trip mungkin
          mempengaruhi aktivitas yang sudah dijadwalkan. Pastikan untuk
          memeriksa itinerary setelah menyimpan perubahan.
        </p>
      </div>
    </div>
  );
}
