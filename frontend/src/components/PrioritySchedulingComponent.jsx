import React, { useState, useEffect } from 'react';
import './FCFS.css'; // Reuse FCFS styling
import FCFSVisualization from './FCFSVisualization';
import axios from 'axios';

const PriorityScheduling = () => {
  const [numProcesses, setNumProcesses] = useState(3);
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: '', burstTime: '', priority: '' },
    { id: 'P2', arrivalTime: '', burstTime: '', priority: '' },
    { id: 'P3', arrivalTime: '', burstTime: '', priority: '' },
  ]);
  const [results, setResults] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);
  const [cpuUtilization, setCpuUtilization] = useState(0);

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = parseInt(value) || '';
    setProcesses(updated);
    simulatePriority(updated);
  };

  const changeProcessCount = (delta) => {
    const newCount = numProcesses + delta;
    if (newCount < 1) return;
    const updated = [...processes];
    while (updated.length < newCount) {
      updated.push({
        id: `P${updated.length + 1}`,
        arrivalTime: '',
        burstTime: '',
        priority: '',
      });
    }
    setProcesses(updated.slice(0, newCount));
    setNumProcesses(newCount);
    simulatePriority(updated);
  };

  const reset = () => {
    setNumProcesses(3);
    setProcesses([
      { id: 'P1', arrivalTime: '', burstTime: '', priority: '' },
      { id: 'P2', arrivalTime: '', burstTime: '', priority: '' },
      { id: 'P3', arrivalTime: '', burstTime: '', priority: '' },
    ]);
    setResults([]);
    setShowChart(false);
  };

  const runSimulation = async () => {
  const filled = processes.map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    priority: Number(p.priority),
  }));

  try {
    const res = await axios.post('http://localhost:5000/api/PriorityScheduling', {
      processes: filled,
    });
    console.log(res.data);
    setResults(res.data.results);
    setShowChart(true);
  } catch (err) {
    console.error(err);
    alert('Failed to simulate Priority Scheduling');
  }
};


  const simulatePriority = (procList) => {
    const procs = procList.map(p => ({
      ...p,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      priority: Number(p.priority),
    }));

    let time = 0;
    let completed = 0;
    const n = procs.length;
    const visited = Array(n).fill(false);
    const results = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalBurstTime = 0;

    while (completed < n) {
      let idx = -1;
      let minPriority = Infinity;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && procs[i].arrivalTime <= time) {
          if (procs[i].priority < minPriority || (procs[i].priority === minPriority && procs[i].arrivalTime < procs[idx]?.arrivalTime)) {
            minPriority = procs[i].priority;
            idx = i;
          }
        }
      }

      if (idx === -1) {
        time++;
        continue;
      }

      const p = procs[idx];
      const startTime = time;
      const completionTime = time + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
      totalBurstTime += p.burstTime;

      results.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      time = completionTime;
      visited[idx] = true;
      completed++;
    }

    const firstArrival = Math.min(...procs.map(p => p.arrivalTime));
    const lastCompletion = Math.max(...results.map(p => p.completionTime));

    setResults(results);
    setShowChart(true);
    setAvgWaitingTime(totalWaitingTime / n);
    setAvgTurnaroundTime(totalTurnaroundTime / n);
    setCpuUtilization((totalBurstTime / (lastCompletion - firstArrival)) * 100);
  };

  useEffect(() => {
    simulatePriority(processes);
  }, []);

  return (
    <div className="container">
      <h2>Priority Scheduling (Non-Preemptive)</h2>
      <p>Lower numeric value = higher priority</p>

      <table className="input-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={i}>
              <td>{p.id}</td>
              <td><input type="number" value={p.arrivalTime} onChange={(e) => updateProcess(i, 'arrivalTime', e.target.value)} /></td>
              <td><input type="number" value={p.burstTime} onChange={(e) => updateProcess(i, 'burstTime', e.target.value)} /></td>
              <td><input type="number" value={p.priority} onChange={(e) => updateProcess(i, 'priority', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="controls">
        <div>
          <p><strong>Algorithm:</strong> Non-preemptive Priority Scheduling</p>
        </div>
        <div className="num-processes">
          <p><strong>Number of Processes:</strong></p>
          <button onClick={() => changeProcessCount(-1)}>-</button>
          <span>{numProcesses}</span>
          <button onClick={() => changeProcessCount(1)}>+</button>
       </div>
        <div className="buttons">
          <button className="run-btn" onClick={runSimulation}>Run</button>
          <button className="reset-btn" onClick={reset}>Reset</button>
        </div>
      </div>

      {showChart && (
        <>
          <h3>Gantt Chart</h3>
          <div className="gantt-chart">
            {results.map((p, index) => (
              <div
                key={index}
                className="gantt-block"
                style={{ flex: p.burstTime, backgroundColor: `hsl(${index * 60}, 70%, 70%)` }}
              >
                {p.id}
              </div>
            ))}
          </div>
          <div className="gantt-timeline">
            {results.map((p, i) => (
              <span key={i}>{p.startTime}</span>
            ))}
            <span>{results[results.length - 1].completionTime}</span>
          </div>

          <h3>Output Table</h3>
          <table className="output-table">
            <thead>
              <tr>
                <th>Process</th>
                <th>Start Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p, i) => (
                <tr key={i}>
                  <td>{p.id}</td>
                  <td>{p.startTime}</td>
                  <td>{p.completionTime}</td>
                  <td>{p.turnaroundTime}</td>
                  <td>{p.waitingTime}</td>
                  <td>{p.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <FCFSVisualization
        processes={results}
        avgWaitingTime={avgWaitingTime}
        avgTurnaroundTime={avgTurnaroundTime}
        cpuUtilization={cpuUtilization}
      />
    </div>
  );
};

export default PriorityScheduling;
