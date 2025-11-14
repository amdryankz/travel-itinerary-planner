import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Plus, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import SearchFilter from "../components/SearchFilter";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../constants/url";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state) => state.auth?.user?.data);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTrips() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/trips`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      setTrips(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.includes(searchTerm) || trip.destination.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your trips and plan new adventures
        </p>
      </div>

      <SearchFilter
        onSearch={setSearchTerm}
        onFilter={setStatusFilter}
        filters={[
          { value: "draft", label: "📝 Draft" },
          { value: "confirmed", label: "✅ Confirmed" },
          { value: "completed", label: "🎉 Completed" },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
            </div>
            <MapPin className="text-primary-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {trips.filter((t) => t.status === "confirmed").length}
              </p>
            </div>
            <Calendar className="text-green-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {trips.filter((t) => t.status === "completed").length}
              </p>
            </div>
            <Calendar className="text-gray-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
        <Link to="/create-trip">
          <Button>
            <Plus size={20} className="inline mr-2" />
            Create New Trip
          </Button>
        </Link>
      </div>

      {/* Trips List */}

      {trips.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No trips yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start planning your first adventure!
          </p>
          <Link to="/create-trip">
            <Button>Create Your First Trip</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Link key={trip.id} to={`/${trip.id}`}>
              <Card hover>
                {trip.coverImage && (
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-48 object-cover rounded-t-lg -m-6 mb-4"
                  />
                )}

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {trip.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      trip.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : trip.status === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin size={16} />
                  <span>{trip.destination}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Calendar size={16} />
                  <span>
                    {format(new Date(trip.startDate), "MMM d")} -{" "}
                    {format(new Date(trip.endDate), "MMM d, yyyy")}
                  </span>
                </div>

                {trip.budget && (
                  <div className="text-sm text-gray-600">
                    Budget: Rp {trip.budget.toLocaleString()}
                  </div>
                )}

                {trip.activities && trip.activities.length > 0 && (
                  <div className="mt-3 text-sm text-gray-500">
                    {trip.activities.length} activities planned
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
