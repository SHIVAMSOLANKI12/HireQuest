import Link from "next/link";
import {
  Clock,
  Gamepad2,
  HelpCircle,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AssessmentCard = ({ assessment }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg">
            {assessment.title}
          </CardTitle>

          <Badge
            variant={
              assessment.status === "Published"
                ? "default"
                : "secondary"
            }
          >
            {assessment.status}
          </Badge>
        </div>

        {assessment.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {assessment.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {assessment.duration} min
          </div>

          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            {assessment.gameIds?.length ?? 0} games
          </div>

          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            {assessment.questionIds?.length ?? 0} questions
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {assessment.candidateCount ?? 0} candidates
          </div>
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Passing score{" "}
              <span className="font-medium text-foreground">
                {assessment.passingScore}%
              </span>
            </p>

            <Link href={`/assessments/${assessment.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentCard;
