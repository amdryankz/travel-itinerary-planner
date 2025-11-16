import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, PenTool, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);
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
          {t("createTrip.title")}
        </h1>
        <p className="text-lg text-gray-600">{t("createTrip.subtitle")}</p>
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
            {t("createTrip.aiGenerate")}
          </h3>

          <p className="text-gray-600 text-center mb-6">
            {t("createTrip.aiGenerateDesc")}
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.autoDestination")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.personalizedActivities")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.routeOptimization")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.autoBudget")}
              </span>
            </li>
          </ul>

          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              🚀 {t("createTrip.quickEasy")}
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
            {t("createTrip.manualCreate")}
          </h3>

          <p className="text-gray-600 text-center mb-6">
            {t("createTrip.manualCreateDesc")}
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.fullControl")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.chooseActivities")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.customSchedule")}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">
                {t("createTrip.detailBudget")}
              </span>
            </li>
          </ul>

          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              ✏️ {t("createTrip.flexibleCustom")}
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
          <span>{t("common.back")}</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{t("createTrip.continue")}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Info */}
      {selectedMethod && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {selectedMethod === "ai"
              ? t("createTrip.aiGeneratorInfo")
              : t("createTrip.manualInfo")}
          </p>
        </div>
      )}
    </div>
  );
}
