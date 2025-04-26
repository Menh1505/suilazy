import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function MoveHelp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/help")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-white-800/50 hover:bg-red-800"
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/move/new")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Move New
            </Button>

            <Button
              onClick={() => navigate("/move/build")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Move Build
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <Button
              onClick={() => navigate("/move/test")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            >
              Move Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
