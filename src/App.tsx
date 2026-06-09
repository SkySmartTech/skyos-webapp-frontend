import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Topbar from "./components/COMMON/Topbar";
import SkyOs from "./pages/SKY_OS_PAGES/sky_os";
import ProductionTrackingPage from "./pages/SPM-1693/production_tracking_page";
import AndonPage from "./pages/DSCS1515A(Anadon)/andonpage";
import WipDashboardPage from "./pages/BSM-1740(Wip)/wip_dashboard";
import { useLocation, useNavigate } from "react-router-dom";

export type ActiveModule =
  | "home"
  | "production"
  | "dcsc"
  | "wip"
  | "custom"
  | "andon";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialModule: ActiveModule = location.pathname.startsWith("/andon")
    ? "andon"
    : location.pathname.startsWith("/wip")
      ? "wip"
      : "home";
  const [activeModule, setActiveModule] = useState<ActiveModule>(initialModule);
  const [topbarVisible, setTopbarVisible] = useState(true);

  useEffect(() => {
    if (location.pathname.startsWith("/andon")) {
      setActiveModule("andon");
      return;
    }

    if (location.pathname.startsWith("/wip")) {
      setActiveModule("wip");
      return;
    }

    if (location.pathname.startsWith("/production")) {
      setActiveModule("production");
    }
  }, [location.pathname]);

  const showAndonHome =
    location.pathname === "/andon/home-dashboard" || activeModule === "andon";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 dark:bg-gray-950 transition-colors duration-300">
      {topbarVisible ? (
        <div className="shrink-0 z-50 relative shadow-sm">
          <Topbar
            activeModule={activeModule}
            onDashboardClick={() => {
              setActiveModule("home");
              navigate("/");
            }}
            onProductionTrackingClick={() => {
              setActiveModule("production");
              navigate("/");
            }}
            onAndonClick={() => {
              setActiveModule("andon");
              navigate("/andon/home-dashboard");
            }}
            onWipClick={() => {
              setActiveModule("wip");
              navigate("/wip");
            }}
            onCustomClick={() => {
              setActiveModule("custom");
              navigate("/");
            }}
            productionActive={activeModule === "production"}
            showSidebar={true}
            onToggleSidebar={() => {}}
            onCloseTopbar={() => setTopbarVisible(false)}
          />
        </div>
      ) : (
        <div className="shrink-0 z-50 bg-gray-900 border-b border-gray-800">
          <button
            onClick={() => setTopbarVisible(true)}
            className="flex items-center gap-2 px-5 py-1.5 text-gray-400 hover:text-white text-xs transition-colors hover:bg-gray-800 w-full"
          >
            <ChevronDown size={14} />
            Show navigation
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {location.pathname.startsWith("/wip") || activeModule === "wip" ? (
          <WipDashboardPage />
        ) : showAndonHome ? (
          <AndonPage />
        ) : activeModule === "production" ? (
          <ProductionTrackingPage />
        ) : activeModule === "dcsc" ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            DCSC1515A — Coming Soon
          </div>
        ) : activeModule === "custom" ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            Custom System — Coming Soon
          </div>
        ) : (
          <SkyOs />
        )}
      </div>
    </div>
  );
}

export default App;
