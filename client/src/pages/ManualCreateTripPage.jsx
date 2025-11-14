import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, FileText, PenTool } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import url from "../constants/url";

export default function ManualCreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        navigate(`/trip/${data.data.id}`);
        return data;
      });

    toast
      .promise(createTripPromise, {
        loading: "Membuat trip...",
        success: "Trip berhasil dibuat! 🎉",
        error: (err) =>
          err.response?.data?.message ||
          "Gagal membuat trip. Silakan coba lagi.",
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <PenTool className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Buat Trip Manual
        </h1>
        <p className="text-gray-600">
          Isi detail perjalananmu dan atur semuanya sesuai keinginan
        </p>
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
              onClick={() => navigate("/create-trip")}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Membuat..." : "Buat Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
