import { Link } from "react-router-dom";
import { LogOut, User, Map } from "lucide-react";

const Navbar = () => {
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
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
