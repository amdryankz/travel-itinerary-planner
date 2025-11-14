import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Map } from "lucide-react";
import { useSelector } from "react-redux";
import { logout } from "../features/auth/authSlicer";
import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlicer";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useSelector((state) => state.auth?.user?.data);
  console.log(user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    toast.success("Berhasil Logout!");
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
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-trip"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Create Trip
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="text-gray-600" size={24} />
                    )}
                    <span className="text-gray-700">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
