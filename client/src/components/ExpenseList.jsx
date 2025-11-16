import { useState } from "react";
import { Trash2, Edit, Calendar, Tag } from "lucide-react";
import Card from "./Card";
import { format } from "date-fns";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("all");
  const { language } = useLanguage();
  const t = useTranslation(language);

  const categoryIcons = {
    accommodation: "🏨",
    food: "🍽️",
    transportation: "🚗",
    activities: "🎯",
    shopping: "🛍️",
    other: "📦",
  };

  const filteredExpenses =
    filter === "all"
      ? expenses
      : expenses.filter((exp) => exp.category === filter);

  const categories = [
    "all",
    "accommodation",
    "food",
    "transportation",
    "activities",
    "shopping",
    "other",
  ];

  if (expenses.length === 0) {
    return (
      <Card className="text-center py-12">
        <Tag className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t("components.expenseList.noExpenses")}
        </h3>
        <p className="text-gray-600">
          {t("components.expenseList.startTracking")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat === "all"
              ? t("components.expenseList.all")
              : `${categoryIcons[cat]} ${t(
                  `components.expenseList.categories.${cat}`
                )}`}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">
                    {categoryIcons[expense.category]}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {expense.description ||
                        expense.category.charAt(0).toUpperCase() +
                          expense.category.slice(1)}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {t(
                          `components.expenseList.categories.${expense.category}`
                        )}
                      </span>
                      {expense.activity && (
                        <span className="text-xs text-primary-600">
                          {t(`components.expenseList.day`)}{" "}
                          {expense.activity.day}: {expense.activity.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    Rp {expense.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-500">No expenses in this category</p>
        </Card>
      )}
    </div>
  );
};

export default ExpenseList;
