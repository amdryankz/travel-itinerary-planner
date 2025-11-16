import Card from "./Card";
import { Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const TripStatistics = ({ trip, activities, expenses }) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const duration =
    differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const totalSpent = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalDuration =
    activities?.reduce((sum, a) => sum + (a.duration || 0), 0) || 0;
  // const locationsWithCoords =
  //   activities?.filter((a) => a.location?.lat && a.location?.lng).length || 0;

  const stats = [
    {
      icon: Calendar,
      label: t("components.tripStats.duration"),
      value: `${duration} ${t("components.tripStats.days")}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: MapPin,
      label: t("components.tripStats.activities"),
      value: activities.length,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: DollarSign,
      label: t("components.tripStats.totalSpent"),
      value: `Rp ${totalSpent.toLocaleString()}`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Clock,
      label: t("components.tripStats.totalTime"),
      value: `${totalDuration / 60} ${t("components.tripStats.hours")}`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="text-center">
            <div
              className={`${stat.bg} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}
            >
              <Icon className={stat.color} size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default TripStatistics;
