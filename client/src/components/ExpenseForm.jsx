import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import Modal from "./Modal";
import { DollarSign } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const ExpenseForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  activities = [],
}) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    amount: "",
    category: "other",
    description: "",
    date: new Date().toISOString().split("T")[0],
    activityId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || "",
        category: initialData.category || "other",
        description: initialData.description || "",
        date: initialData.date
          ? initialData.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        activityId: initialData.activityId || "",
      });
    } else {
      setFormData({
        amount: "",
        category: "other",
        description: "",
        date: new Date().toISOString().split("T")[0],
        activityId: "",
      });
    }
  }, [initialData]);

  const categories = [
    {
      value: "accommodation",
      label: `🏨 ${t("components.expenseForm.categories.accommodation")}`,
    },
    {
      value: "food",
      label: `🍽️ ${t("components.expenseForm.categories.food")}`,
    },
    {
      value: "transportation",
      label: `🚗 ${t("components.expenseForm.categories.transportation")}`,
    },
    {
      value: "activities",
      label: `🎯 ${t("components.expenseForm.categories.activities")}`,
    },
    {
      value: "shopping",
      label: `🛍️ ${t("components.expenseForm.categories.shopping")}`,
    },
    {
      value: "other",
      label: `📦 ${t("components.expenseForm.categories.other")}`,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        activityId: formData.activityId || null,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        initialData
          ? t("components.expenseForm.editTitle")
          : t("components.expenseForm.addTitle")
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("components.expenseForm.amount")}
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("components.expenseForm.category")}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t("components.expenseForm.description")}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("components.expenseForm.descriptionPlaceholder")}
        />

        <Input
          label={t("components.expenseForm.date")}
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {activities.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("components.expenseForm.linkToActivity")}
            </label>
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleChange}
              className="input"
            >
              <option value="">{t("components.expenseForm.noActivity")}</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {t("components.expenseForm.day")} {activity.day}:{" "}
                  {activity.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={loading} className="flex-1">
            <DollarSign size={20} className="inline mr-2" />
            {initialData
              ? t("components.expenseForm.updateButton")
              : t("components.expenseForm.addButton")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {t("components.expenseForm.cancel")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
