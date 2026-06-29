import type { AndonView } from "./andon_sidebar";
import AndonHomeDashboard from "./andon_home_dashboard";
import AndonDowntimeDashboard from "./andon_downtime_dashboard";
import AndonFactoryWiseDashboard from "./andon_factory_wise_dashboard";
import AndonDetailsDashboard from "./andon_details_dashboard";

export default function Andon({ activeView }: { activeView: AndonView }) {
  if (activeView === "downtime")     return <AndonDowntimeDashboard />;
  if (activeView === "factory-wise") return <AndonFactoryWiseDashboard />;
  if (activeView === "details")      return <AndonDetailsDashboard />;
  return <AndonHomeDashboard />;
}
