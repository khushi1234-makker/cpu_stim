// FCFSVisualization.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './fcfs.css'; // or a separate chart.css if you prefer


const COLORS = ['#FF6B6B', '#003f5c', '#845EC2', '#FF9671', '#FFC75F', '#F9F871'];

const FCFSVisualization = ({ processes, avgWaitingTime, avgTurnaroundTime, cpuUtilization }) => {
  if (!processes || processes.length === 0) return null;

  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const totalTime = Math.max(...processes.map(p => p.completionTime || 0));
  const idleTime = totalTime - totalBurstTime;

  const cpuUtilData = [
    { name: 'Idle', value: idleTime },
    { name: 'Active', value: totalBurstTime },
  ];

  const burstDistribution = processes.map((p, index) => ({
    name: `P${p.pid}`,
    value: p.burstTime,
  }));

  return (
    <>
     <h2>visualisation</h2>
    <div className="chart-container">
     
      <div className="pie-wrapper">
        <PieChart width={250} height={250}>
          <Pie
            data={cpuUtilData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            dataKey="value"
          >
            {cpuUtilData.map((entry, index) => (
              <Cell key={`cell-cpu-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>CPU Utilization</p>
      </div>

      <div className="pie-wrapper">
        <PieChart width={250} height={250}>
          <Pie
            data={burstDistribution}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            dataKey="value"
          >
            {burstDistribution.map((entry, index) => (
              <Cell key={`cell-p-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Burst Time Distribution</p>
      </div>
    </div>
    </>
  );
};

export default FCFSVisualization;
