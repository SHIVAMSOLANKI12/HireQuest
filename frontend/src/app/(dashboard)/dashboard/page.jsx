import {
  DashboardHeader,
  StatsGrid,
} from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <StatsGrid />
    </div>
  );
}
