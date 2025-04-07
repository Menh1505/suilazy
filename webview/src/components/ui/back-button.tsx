import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="h-12 flex items-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-red-800"
      >
        Back
      </Button>
    </div>
  );
}
