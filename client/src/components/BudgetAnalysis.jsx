import { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import Modal from "./Modal";
import { TrendingUp, Sparkles } from "lucide-react";
import axios from "axios";
import url from "../constants/url";

const BudgetAnalysis = ({ tripId }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const cleanMarkdown = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, "").replace(/\*/g, "");
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/ai/analyze-budget/${tripId}`, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      setAnalysis(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Budget analysis failed:", error);
      alert("Failed to analyze budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleAnalyze} loading={loading}>
        <Sparkles size={20} className="mr-2" />
        AI Budget Analysis
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="AI Budget Analysis"
      >
        {analysis && (
          <div className="space-y-4">
            {/* Status */}
            <Card
              className={`${
                analysis.status === "over_budget"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp
                  className={
                    analysis.status === "over_budget"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                  size={32}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {analysis.status === "over_budget"
                      ? "Over Budget"
                      : "Within Budget"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rp {(analysis.totalSpent || 0).toLocaleString()} / Rp{" "}
                    {(analysis.totalBudget || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* AI Analysis */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
              <div className="text-gray-700 whitespace-pre-wrap">
                {cleanMarkdown(analysis.analysis) || "No analysis available"}
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BudgetAnalysis;
