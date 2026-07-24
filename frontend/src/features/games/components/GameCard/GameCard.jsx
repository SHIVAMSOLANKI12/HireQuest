import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/common";

const GameCard = ({ game }) => {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{game.title}</h3>
            <p className="text-sm text-muted-foreground">
              {game.category}
            </p>
          </div>

          <StatusBadge status={game.status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Difficulty
            </span>

            <span>{game.difficulty}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Duration
            </span>

            <span>{game.duration} min</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Used In
            </span>

            <span>{game.usedIn} Assessments</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>

        <Button className="flex-1">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
