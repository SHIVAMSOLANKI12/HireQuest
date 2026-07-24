import { Card, CardContent } from "@/components/ui/card";

const GameStatCard = ({
  title,
  value,
  icon: Icon,
}) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStatCard;
