import { useState } from "react";
import Button from "./Button";
import { Sparkles } from "lucide-react";

const QuickActions = ({ onOptimizeRoute }) => {
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      await onOptimizeRoute();
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleOptimize} loading={optimizing}>
        <Sparkles size={16} className="mr-2" />
        Optimize Route
      </Button>
    </>
  );
};

export default QuickActions;
