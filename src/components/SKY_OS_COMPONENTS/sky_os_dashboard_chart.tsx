import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SkyOsDashboardChart() {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  const productionData = {
    daily: [
      { time: '08:00', output: 120, target: 150 },
      { time: '10:00', output: 180, target: 150 },
      { time: '12:00', output: 210, target: 200 },
      { time: '14:00', output: 190, target: 200 },
      { time: '16:00', output: 250, target: 250 },
    ],
    monthly: [
      { time: 'Week 1', output: 4200, target: 4000 },
      { time: 'Week 2', output: 4500, target: 4000 },
      { time: 'Week 3', output: 3900, target: 4000 },
      { time: 'Week 4', output: 4800, target: 4500 },
    ],
    yearly: [
      { time: 'Q1', output: 52000, target: 50000 },
      { time: 'Q2', output: 54000, target: 50000 },
      { time: 'Q3', output: 51000, target: 55000 },
      { time: 'Q4', output: 61000, target: 60000 },
    ],
  };

  const systemLoadData = {
    daily: [
      { name: 'DSCS1515A', load: 85 },
      { name: 'WIP032A', load: 60 },
      { name: 'Prod. Track', load: 92 },
      { name: 'Solar', load: 45 },
      { name: 'Custom 1', load: 20 },
      { name: 'Custom 2', load: 10 },
    ],
    monthly: [
      { name: 'DSCS1515A', load: 78 },
      { name: 'WIP032A', load: 65 },
      { name: 'Prod. Track', load: 88 },
      { name: 'Solar', load: 55 },
      { name: 'Custom 1', load: 25 },
      { name: 'Custom 2', load: 15 },
    ],
    yearly: [
      { name: 'DSCS1515A', load: 75 },
      { name: 'WIP032A', load: 70 },
      { name: 'Prod. Track', load: 85 },
      { name: 'Solar', load: 60 },
      { name: 'Custom 1', load: 30 },
      { name: 'Custom 2', load: 20 },
    ],
  };

  const energyData = {
    daily: [
      { name: 'Solar Power', value: 60 },
      { name: 'Grid Power', value: 40 },
    ],
    monthly: [
      { name: 'Solar Power', value: 75 },
      { name: 'Grid Power', value: 25 },
    ],
    yearly: [
      { name: 'Solar Power', value: 68 },
      { name: 'Grid Power', value: 32 },
    ],
  };

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#64748b',
  ];

  const getButtonClass = (filter: 'daily' | 'monthly' | 'yearly') => {
    const baseClass =
      'px-6 py-2 rounded-md font-semibold transition-all duration-200 border ';

    return timeframe === filter
      ? `${baseClass} bg-blue-600/20 text-blue-400 border-blue-500`
      : `${baseClass} bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white`;
  };

  return (
    <div className="bg-gray-950 p-8 text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            SkyOS Analytics Engine
          </h1>
          <p className="text-gray-400">
            Interactive Data Visualization & System Diagnostics
          </p>
        </div>

        <div className="flex gap-3 bg-gray-900 p-2 rounded-lg border border-gray-800">
          <button
            onClick={() => setTimeframe('daily')}
            className={getButtonClass('daily')}
          >
            Daily
          </button>

          <button
            onClick={() => setTimeframe('monthly')}
            className={getButtonClass('monthly')}
          >
            Monthly
          </button>

          <button
            onClick={() => setTimeframe('yearly')}
            className={getButtonClass('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Charts Here */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">
            Production Output vs Target
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData[timeframe]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="output"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Average System Load (%)
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systemLoadData[timeframe]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="load">
                  {systemLoadData[timeframe].map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Power Source Distribution
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyData[timeframe]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                >
                  {energyData[timeframe].map((entry, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? '#10b981' : '#4b5563'}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkyOsDashboardChart;