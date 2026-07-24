import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
