import React from 'react';

function SkyOsDashboard() {
  // Array containing your specific systems for easy mapping
  const systems = [
    { id: 1, name: 'DSCS1515A', status: 'Active', description: 'Primary industrial control unit.' },
    { id: 2, name: 'WIP032A', status: 'Monitoring', description: 'Work-in-progress tracking module.' },
    { id: 3, name: 'Production Tracking System', status: 'Live', description: 'Real-time sewing line analytics.' },
    { id: 4, name: 'Solar System', status: 'Optimal', description: 'Energy management and grid status.' },
    { id: 5, name: 'Custom System 1', status: 'Standby', description: 'Auxiliary module integration.' },
    { id: 6, name: 'Custom System 2', status: 'Offline', description: 'Secondary backup controller.' },
  ];

  return (
    <div className="bg-gray-950 p-8 font-sans text-gray-100">
      
      {/* Dashboard Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          SkyOS Command Center
        </h1>
        <p className="text-gray-400">
          Engineering Smart Industrial Futures | Real-time System Overview
        </p>
      </div>

      {/* Grid Layout: 3 columns on large screens, scaling down for smaller displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => (
          <div
            key={system.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl hover:border-blue-500/50 transition-colors duration-300 flex flex-col justify-between h-64"
          >
            {/* Card Header & Status */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-100">{system.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase ${
                    system.status === 'Active' || system.status === 'Live' || system.status === 'Optimal'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : system.status === 'Monitoring' || system.status === 'Standby'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {system.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{system.description}</p>
            </div>

            {/* Simulated Data/Load Visual */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase">System Load</span>
                <span className="text-sm font-medium text-gray-300">
                  {Math.floor(Math.random() * 40) + 20}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.floor(Math.random() * 40) + 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkyOsDashboard;