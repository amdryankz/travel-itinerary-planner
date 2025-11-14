import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, PenTool, ArrowRight, ArrowLeft } from "lucide-react";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod === "ai") {
      navigate("/create-trip/ai");
    } else if (selectedMethod === "manual") {
      navigate("/create-trip/manual");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Buat Trip Baru
        </h1>
        <p className="text-lg text-gray-600">
          Pilih cara membuat trip yang sesuai dengan kebutuhanmu
        </p>
      </div>

      {/* Method Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* AI Generate Card */}
        <div
          onClick={() => handleMethodSelect("ai")}
          className={`cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 ${
            selectedMethod === "ai"
              ? "border-primary-600 ring-4 ring-primary-100"
              : "border-transparent hover:border-primary-200"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Generate dengan AI
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Biarkan AI membuat itinerary lengkap untukmu berdasarkan
            preferensimu
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                Rekomendasi destinasi otomatis
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                Aktivitas yang dipersonalisasi
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">Optimasi rute perjalanan</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">Estimasi budget otomatis</span>
            </li>
          </ul>

          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              🚀 Cepat & Mudah
            </span>
          </div>
        </div>

        {/* Manual Create Card */}
        <div
          onClick={() => handleMethodSelect("manual")}
          className={`cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 ${
            selectedMethod === "manual"
              ? "border-primary-600 ring-4 ring-primary-100"
              : "border-transparent hover:border-primary-200"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <PenTool className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Buat Manual
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Atur sendiri setiap detail perjalananmu sesuai keinginan
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">Kontrol penuh atas trip</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">Pilih aktivitas sesukamu</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">Atur jadwal sendiri</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">Kelola budget secara detail</span>
            </li>
          </ul>

          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              ✏️ Fleksibel & Custom
            </span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg "
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Lanjutkan</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Info */}
      {selectedMethod && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {selectedMethod === "ai"
              ? "Kamu akan diarahkan ke form AI generator untuk membuat trip otomatis"
              : "Kamu akan diarahkan ke form manual untuk membuat trip sendiri"}
          </p>
        </div>
      )}
    </div>
  );
}
