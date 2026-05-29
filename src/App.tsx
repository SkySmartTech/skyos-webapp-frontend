import Sidebar from "./components/ui/layout/Sidebar";
import Topbar from "./components/ui/layout/Topbar";


function App() {
  return (
    <div className="flex">
      <Sidebar></Sidebar>
      
      {/* Main Content */}
      <div className="flex-1">
        
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="p-5">
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>
        </div>

      </div>
    </div>
  );
}

export default App;