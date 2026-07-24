import StatsCard from "./StatsCard";
import { dashboardStats } from "../data/dashboard-data";

const StatsGrid = () => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
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
