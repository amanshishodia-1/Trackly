import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0F1115]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Global Search */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#1F2328] bg-[#0F1115]">
          <GlobalSearch />
          <div className="flex items-center gap-4">
            {/* Can add notifications, user menu here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
