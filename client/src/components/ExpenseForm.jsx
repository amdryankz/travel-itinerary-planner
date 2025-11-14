import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Modal from "./Modal";
import { DollarSign } from "lucide-react";

const ExpenseForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  activities = [],
}) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || "",
    category: initialData?.category || "other",
    description: initialData?.description || "",
    date: initialData?.date
      ? initialData.date.split("T")[0]
      : new Date().toISOString().split("T")[0],
    activityId: initialData?.activityId || "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "accommodation", label: "🏨 Accommodation" },
    { value: "food", label: "🍽️ Food & Dining" },
    { value: "transportation", label: "🚗 Transportation" },
    { value: "activities", label: "🎯 Activities" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "other", label: "📦 Other" },
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
      title={initialData ? "Edit Expense" : "Add Expense"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount (USD)"
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
            Category
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
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What was this expense for?"
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {activities.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link to Activity (Optional)
            </label>
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleChange}
              className="input"
            >
              <option value="">Not linked to any activity</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  Day {activity.day}: {activity.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={loading} className="flex-1">
            <DollarSign size={20} className="inline mr-2" />
            {initialData ? "Update Expense" : "Add Expense"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
