import { Link } from "react-router-dom";
import { Map, Sparkles, Calendar, DollarSign } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                Plan Your Perfect Trip with AI
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Biarkan AI membuat itinerary personal untuk petualanganmu
                selanjutnya
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to={"/login"}
                  className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to={"/register"}
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Main Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Buat itinerary lengkap secara instan dengan AI
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Routes</h3>
              <p className="text-gray-600">
                Optimalkan rute perjalananmu dengan integrasi Google Maps
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Planning</h3>
              <p className="text-gray-600">
                Kelola semua trip dan aktivitasmu di satu tempat
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Tracking</h3>
              <p className="text-gray-600">
                Pantau pengeluaranmu dan pastikan tetap sesuai budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
