import StatsCard from "./StatsCard";
import useDashboardStats from "../hooks/useDashboardStats";

const StatsGrid = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return null;

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats?.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </section>
  );
};

export default StatsGrid;
