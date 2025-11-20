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
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

export default function Dashboard() {
  const user = useSelector((state) => state.auth?.user?.data);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusDisplay = {
    draft: language === "id" ? "📝 Draf" : "📝 Draft",
    confirmed: language === "id" ? "✅ Sudah Fix" : "✅ Confirmed",
    completed: language === "id" ? "🎉 Selesai" : "🎉 Completed",
  };

  const statusCardDisplay = {
    draft: t("dashboardPage.statusDraft"),
    confirmed: t("dashboardPage.statusConfirmed"),
    completed: t("dashboardPage.statusCompleted"),
  };

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
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("dashboardPage.greeting")}, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t("dashboardPage.subtitle")}</p>
      </div>

      <SearchFilter
        onSearch={setSearchTerm}
        onFilter={setStatusFilter}
        filters={[
          { value: "draft", label: statusDisplay.draft },
          { value: "confirmed", label: statusDisplay.confirmed },
          { value: "completed", label: statusDisplay.completed },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("dashboardPage.totalTrips")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{trips.length}</p>
            </div>
            <MapPin className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("dashboardPage.upcoming")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trips.filter((t) => t.status === "confirmed").length}
              </p>
            </div>
            <Calendar className="text-green-600 dark:text-green-400" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("dashboardPage.completed")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trips.filter((t) => t.status === "completed").length}
              </p>
            </div>
            <Calendar className="text-gray-600 dark:text-gray-400" size={32} />
          </div>
        </Card>
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("dashboardPage.yourTrips")}
        </h2>
        <Link to="/create-trip">
          <Button>
            <Plus size={20} className="inline mr-2" />
            {t("dashboardPage.createNewTrip")}
          </Button>
        </Link>
      </div>

      {/* Daftar Trip */}

      {trips.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("dashboardPage.noTrips")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("dashboardPage.noTripsDesc")}</p>
          <Link to="/create-trip">
            <Button>{t("dashboardPage.createFirstTrip")}</Button>
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                    {statusCardDisplay[trip.status] || trip.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin size={16} />
                  <span>{trip.destination}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                  <Calendar size={16} />
                  <span>
                    {format(new Date(trip.startDate), "MMM d")} -{" "}
                    {format(new Date(trip.endDate), "MMM d, yyyy")}
                  </span>
                </div>

                {trip.budget && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboardPage.budget")}: Rp{" "}
                    {trip.budget.toLocaleString()}
                  </div>
                )}

                {trip.activities && trip.activities.length > 0 && (
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {language === "id"
                      ? `Ada ${trip.activities.length} kegiatan`
                      : `${trip.activities.length} activities`}
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
