import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Map, Languages } from "lucide-react";
import { useSelector } from "react-redux";
import { logout } from "../features/auth/authSlicer";
import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlicer";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const Navbar = () => {
  const user = useSelector((state) => state.auth?.user?.data);
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation(language);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    toast.success(t("auth.logoutSuccess"));
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Map className="text-primary-600" size={32} />
              <span className="text-xl font-bold text-gray-900">
                TravelPlanner
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  {t("navbar.dashboard")}
                </Link>
                <Link
                  to="/create-trip"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  {t("navbar.createTrip")}
                </Link>

                {/* Language Selector */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 transition-all duration-200 border border-gray-200 hover:border-primary-300"
                  title={
                    language === "id"
                      ? "Switch to English"
                      : "Ganti ke Bahasa Indonesia"
                  }
                >
                  <Languages size={16} />
                  <span className="text-sm font-semibold">
                    {language === "id" ? "ID" : "EN"}
                  </span>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="text-primary-600" size={18} />
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    title={t("navbar.logout")}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Language Selector for non-logged in users */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 transition-all duration-200 border border-gray-200 hover:border-primary-300"
                  title={
                    language === "id"
                      ? "Switch to English"
                      : "Ganti ke Bahasa Indonesia"
                  }
                >
                  <Languages size={16} />
                  <span className="text-sm font-semibold">
                    {language === "id" ? "ID" : "EN"}
                  </span>
                </button>

                <Link to="/login" className="btn-primary px-6 py-2">
                  {t("navbar.login")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
