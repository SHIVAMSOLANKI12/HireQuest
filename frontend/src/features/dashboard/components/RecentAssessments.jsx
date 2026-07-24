import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRecentAssessments from "../hooks/useRecentAssessments";

const statusClasses = {
  Active: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
};

const RecentAssessments = () => {
  const { data: assessments, isLoading } = useRecentAssessments();

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {assessments?.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <h3 className="font-semibold">
                  {assessment.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {assessment.candidates} Candidates • {assessment.createdAt}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusClasses[assessment.status]
                }`}
              >
                {assessment.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAssessments;
