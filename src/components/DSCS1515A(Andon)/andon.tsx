import { useLocation } from "react-router-dom";
import AndonHomeDashboard from "./andon_home_dashboard";
import AndonDowntimeDashboard from "./andon_downtime_dashboard";
import AndonFactoryWiseDashboard from "./andon_factory_wise_dashboard";

export default function Andon() {
  const location = useLocation();

  if (location.pathname === "/andon/downtime-dashboard") {
    return <AndonDowntimeDashboard />;
  }

  if (location.pathname === "/andon/factory-wise") {
    return <AndonFactoryWiseDashboard />;
  }

  return <AndonHomeDashboard />;
}
