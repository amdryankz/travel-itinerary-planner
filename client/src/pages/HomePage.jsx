import { Link } from "react-router-dom";
import { Map, Sparkles, Calendar, DollarSign } from "lucide-react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";
import Footer from "../components/Footer";

const Home = () => {
  const isAuthenticated = localStorage.token;
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                  <h1 className="text-5xl font-bold mb-6">
                    {t("home.heroTitle")}
                  </h1>
                  <p className="text-xl mb-8 text-primary-100">
                    {t("home.heroSubtitle")}
                  </p>
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    {isAuthenticated
                      ? t("home.goToDashboard")
                      : t("home.getStarted")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold text-center mb-12">
                {t("home.features")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("home.aiPowered")}
                  </h3>
                  <p className="text-gray-600">{t("home.aiPoweredDesc")}</p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("home.smartRoutes")}
                  </h3>
                  <p className="text-gray-600">{t("home.smartRoutesDesc")}</p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("home.easyPlanning")}
                  </h3>
                  <p className="text-gray-600">{t("home.easyPlanningDesc")}</p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("home.budgetTracking")}
                  </h3>
                  <p className="text-gray-600">
                    {t("home.budgetTrackingDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
