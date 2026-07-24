import { StatsGrid } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold">
          Welcome back, Rohit 👋
        </h2>

        <p className="mt-2 text-muted-foreground">
          Here's an overview of your hiring platform today.
        </p>
      </section>

      <StatsGrid />
    </div>
  );
}
