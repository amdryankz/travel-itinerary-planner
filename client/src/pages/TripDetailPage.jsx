import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import MapView from "../components/MapView";
import BudgetTracker from "../components/BudgetTracker";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import {
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Clock,
  Map as MapIcon,
  Receipt,
  Pencil,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import TripStatistics from "../components/TripStatistic";
import QuickActions from "../components/QuickActions";
import AIChatAssistant from "../components/AIChatAssistant";
import BudgetAnalysis from "../components/BudgetAnalysis";
import DistanceCalculator from "../components/DistanceCalculator";
import axios from "axios";
import url from "../constants/url";
import toast from "react-hot-toast";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseStats, setExpenseStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  async function fetchTripData() {
    try {
      setLoading(true);
      const { data: trips } = await axios.get(`${url}/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      const { data: activity } = await axios.get(
        `${url}/activities/trip/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      const { data: expense } = await axios.get(`${url}/expenses/trip/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      const { data: stat } = await axios.get(
        `${url}/expenses/trip/${id}/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      setTrip(trips.data);
      setActivities(activity.data);
      setExpenses(expense.data.expenses);
      setExpenseStats(stat.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTripData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    const data = axios.delete(`${url}/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    await toast.promise(data, {
      loading: t("common.loading"),
      success: t("tripDetail.tripSuccess"),
      error: (err) => {
        return err.response.data.message[0];
      },
    });
    navigate("/dashboard");
    setDeleting(false);
  };

  const handleExpenseSubmit = async (data) => {
    if (editingExpense) {
      const editPromise = axios.put(
        `${url}/expenses/${editingExpense.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      await toast.promise(editPromise, {
        loading: t("common.loading"),
        success: t("tripDetail.expenseUpdateSuccess"),
        error: (err) => {
          return err.response.data.message;
        },
      });
    } else {
      const createPromise = axios.post(`${url}/expenses/trip/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      await toast.promise(createPromise, {
        loading: t("common.loading"),
        success: t("tripDetail.expenseCreateSuccess"),
        error: (err) => {
          return err.response.data.message;
        },
      });
    }
    setShowExpenseForm(false);
    setEditingExpense(null);
    fetchTripData();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm(t("tripDetail.deleteExpenseConfirm"))) {
      const data = axios.delete(`${url}/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      await toast.promise(data, {
        loading: t("common.loading"),
        success: t("tripDetail.expenseSuccess"),
        error: (err) => {
          return err.response.data.message[0];
        },
      });

      // Refresh data setelah delete expense
      fetchTripData();
    }
  };

  const groupActivitiesByDay = () => {
    return activities.reduce((acc, activity) => {
      if (!acc[activity.day]) {
        acc[activity.day] = [];
      }
      acc[activity.day].push(activity);
      return acc;
    }, {});
  };

  const handleOptimizeRoute = async () => {
    const data = axios.post(
      `${url}/ai/optimize-route/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.token}` } }
    );

    await toast.promise(data, {
      loading: t("common.loading"),
      success: t("tripDetail.optimizeSuccess"),
      error: (err) => {
        return err.response.data.message;
      },
    });
  };

  if (loading) return <div></div>;
  if (!trip)
    return (
      <div>{language === "id" ? "Trip tidak ditemukan" : "Trip not found"}</div>
    );

  const duration =
    differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const activitiesByDay = groupActivitiesByDay();
  // const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  const tabs = [
    { id: "itinerary", label: t("tripDetail.itinerary"), icon: Calendar },
    { id: "map", label: t("tripDetail.map"), icon: MapIcon },
    { id: "budget", label: t("tripDetail.budgetTab"), icon: Receipt },
  ];

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm(t("tripDetail.deleteActivityConfirm"))) {
      const data = axios.delete(`${url}/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      await toast.promise(data, {
        loading: t("common.loading"),
        success: t("tripDetail.activitySuccess"),
        error: (err) => {
          return err.response.data.message[0];
        },
      });
      fetchTripData();
    }
  };

  return (
    <div>
      {/* Header with Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {trip.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>
                  {format(new Date(trip.startDate), "MMM d")} -{" "}
                  {format(new Date(trip.endDate), "MMM d, yyyy")} ({duration}{" "}
                  {t("tripDetail.days")})
                </span>
              </div>
              {trip.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign size={20} />
                  <span>
                    {t("tripDetail.budget")}: Rp {trip.budget.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/trips/${id}/edit`)}
            >
              <Edit size={20} />
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={20} />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap mt-4">
          <QuickActions onOptimizeRoute={handleOptimizeRoute} />
          <AIChatAssistant tripId={id} destination={trip.destination} />
          <DistanceCalculator activities={activities} />
        </div>
      </div>

      {/* Trip Statistics */}
      <div className="mb-6">
        <TripStatistics
          trip={trip}
          activities={activities}
          expenses={expenses}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="border-b">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("tripDetail.itinerary")}
              </h2>
              <Button onClick={() => navigate(`/trips/${id}/activities/new`)}>
                <Plus size={20} className="inline mr-2" />
                {t("tripDetail.addActivity")}
              </Button>
            </div>

            {activities.length === 0 ? (
              <Card className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("tripDetail.noActivities")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t("tripDetail.noActivitiesDesc")}
                </p>
                <Button onClick={() => navigate(`/trips/${id}/activities/new`)}>
                  {t("tripDetail.addFirstActivity")}
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.keys(activitiesByDay)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((day) => (
                    <Card key={day}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {t("tripDetail.day")} {day}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {activitiesByDay[day]
                          .sort((a, b) => a.order - b.order)
                          .map((activity) => (
                            <div
                              key={activity.id}
                              className="border-l-4 border-primary-500 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-r"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {activity.title}
                                  </h4>

                                  {activity.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                      {activity.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {activity.startTime && (
                                      <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>
                                          {activity.startTime} -{" "}
                                          {activity.endTime}
                                        </span>
                                      </div>
                                    )}

                                    {activity.duration && (
                                      <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{activity.duration} min</span>
                                      </div>
                                    )}

                                    {activity.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span className="max-w-xs truncate">
                                          {activity.location.address}
                                        </span>
                                      </div>
                                    )}

                                    {activity.cost && (
                                      <div className="flex items-center gap-1">
                                        <DollarSign size={16} />
                                        <span>
                                          Rp {activity.cost.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {activity.notes && (
                                    <p className="text-sm text-gray-500 mt-2 italic bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded">
                                      💡 {activity.notes}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                      activity.category === "sightseeing"
                                        ? "bg-blue-100 text-blue-800"
                                        : activity.category === "food"
                                        ? "bg-orange-100 text-orange-800"
                                        : activity.category === "transport"
                                        ? "bg-gray-100 text-gray-800"
                                        : activity.category === "hotel"
                                        ? "bg-purple-100 text-purple-800"
                                        : activity.category === "activity"
                                        ? "bg-green-100 text-green-800"
                                        : activity.category === "shopping"
                                        ? "bg-pink-100 text-pink-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {activity.category}
                                  </span>

                                  {/* Action Buttons */}
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/trips/${id}/activities/${activity.id}/edit`
                                      )
                                    }
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                    title="Edit activity"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteActivity(activity.id)
                                    }
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete activity"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === "map" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("tripDetail.mapView")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{t("tripDetail.mapViewDesc")}</p>
            </div>

            <Card>
              <MapView activities={activities} />
            </Card>

            {activities.filter((a) => a.location?.lat && a.location?.lng)
              .length === 0 && (
              <Card className="mt-4 text-center py-8">
                <MapIcon className="mx-auto text-gray-400 dark:text-gray-500 mb-2" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("tripDetail.noLocations")}
                </p>
                <Button onClick={() => navigate(`/trips/${id}/activities/new`)}>
                  {t("tripDetail.addActivityWithLocation")}
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === "budget" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("tripDetail.budgetExpenses")}
              </h2>
              <div className="flex gap-2">
                <BudgetAnalysis tripId={id} />
                <Button
                  onClick={() => {
                    setEditingExpense(null);
                    setShowExpenseForm(true);
                  }}
                >
                  <Plus size={20} className="inline mr-2" />
                  {t("tripDetail.addExpense")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Budget Tracker - Left Side */}
              <div className="lg:col-span-1">
                <BudgetTracker stats={expenseStats} />
              </div>

              {/* Expense List - Right Side */}
              <div className="lg:col-span-2">
                <ExpenseList
                  expenses={expenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Trip Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t("tripDetail.deleteTrip")}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{t("tripDetail.deleteTripConfirm")}</p>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠️ {t("tripDetail.deleteTripWarning")}
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
              <li>
                {activities.length}{" "}
                {language === "id" ? "aktivitas" : "activities"}
              </li>
              <li>
                {expenses.length}{" "}
                {language === "id" ? "pengeluaran" : "expenses"}
              </li>
              <li>{t("tripDetail.allTripData")}</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              className="flex-1"
            >
              {t("tripDetail.deleteTripButton")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false);
          setEditingExpense(null);
        }}
        onSubmit={handleExpenseSubmit}
        initialData={editingExpense}
        activities={activities}
      />
    </div>
  );
};

export default TripDetails;
