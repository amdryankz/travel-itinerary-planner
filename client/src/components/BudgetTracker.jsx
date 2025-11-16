import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import Card from "./Card";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const BudgetTracker = ({ stats }) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  if (!stats) return null;

  const percentageUsed = parseFloat(stats.percentageUsed) || 0;
  const isOverBudget = stats.remaining < 0;

  const getProgressColor = () => {
    if (percentageUsed < 70) return "bg-green-500";
    if (percentageUsed < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("components.budgetTracker.title")}
          </h3>
          {isOverBudget && (
            <span className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle size={16} />
              {t("components.budgetTracker.overBudget")}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {t("components.budgetTracker.budget")}
            </span>
            <span className="text-xl font-bold text-gray-900">
              Rp {stats.budget.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {t("components.budgetTracker.spent")}
            </span>
            <span
              className={`text-xl font-bold ${
                isOverBudget ? "text-red-600" : "text-gray-900"
              }`}
            >
              Rp {stats.total.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {t("components.budgetTracker.remaining")}
            </span>
            <span
              className={`text-xl font-bold ${
                isOverBudget ? "text-red-600" : "text-green-600"
              }`}
            >
              Rp {Math.abs(stats.remaining).toLocaleString()}
              {isOverBudget && ` (${t("components.budgetTracker.deficit")})`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t("components.budgetTracker.budgetUsage")}</span>
              <span>{percentageUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getProgressColor()} transition-all duration-300`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>

          {/* Average per day */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                {t("components.budgetTracker.averagePerDay")}
              </span>
              <span className="font-semibold text-gray-900">
                Rp {parseFloat(stats.averagePerDay || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("components.budgetTracker.spendingByCategory")}
        </h3>

        <div className="space-y-3">
          {Object.entries(stats.byCategory || {}).map(([category, amount]) => {
            const percentage =
              stats.total > 0 ? ((amount / stats.total) * 100).toFixed(1) : 0;

            const categoryIcons = {
              accommodation: "🏨",
              food: "🍽️",
              transportation: "🚗",
              activities: "🎯",
              shopping: "🛍️",
              other: "📦",
            };

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 capitalize">
                    {categoryIcons[category]}{" "}
                    {t(`components.expenseList.categories.${category}`)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Rp {amount.toLocaleString()} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(stats.byCategory || {}).length === 0 && (
          <p className="text-gray-500 text-center py-4">
            {" "}
            {t("components.budgetTracker.noExpenses")}
          </p>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <DollarSign className="mx-auto text-primary-600 mb-2" size={32} />
          <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
          <p className="text-sm text-gray-600">
            {t("components.budgetTracker.totalExpenses")}
          </p>
        </Card>

        <Card className="text-center">
          {isOverBudget ? (
            <TrendingDown className="mx-auto text-red-600 mb-2" size={32} />
          ) : (
            <TrendingUp className="mx-auto text-green-600 mb-2" size={32} />
          )}
          <p
            className={`text-2xl font-bold ${
              isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            {percentageUsed.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-600">
            {t("components.budgetTracker.budgetUsed")}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default BudgetTracker;
