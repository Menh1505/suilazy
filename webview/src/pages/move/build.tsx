import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { SuiCommand } from "../../utils/utils";
import { BackButton } from "../../components/ui/back-button";

export default function MoveBuild() {
  const handleBuild = () => {
    window.vscode.postMessage({ command: SuiCommand.MOVE_BUILD });
  };

  return (
    <Card className="w-full min-h-screen border-gray-800 bg-gray-900/50">
      <CardContent className="p-4">
        <BackButton />
        <Button 
          onClick={handleBuild}
          variant="outline"
          className="h-16 w-full border-gray-700 bg-gray-800/50 hover:bg-gray-800"
        >
          Build Project
        </Button>
      </CardContent>
    </Card>
  );
}
