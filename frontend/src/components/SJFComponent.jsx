import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './FCFS.css'; // Reuse existing styles
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
const SJF = () => {
  const [numProcesses, setNumProcesses] = useState(3);
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: '', burstTime: '' },
    { id: 'P2', arrivalTime: '', burstTime: '' },
    { id: 'P3', arrivalTime: '', burstTime: '' },
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
    simulateSJF(updated);
  };

  const changeProcessCount = (delta) => {
    const newCount = numProcesses + delta;
    if (newCount < 1) return;
    const updated = [...processes];
    while (updated.length < newCount) {
      updated.push({ id: `P${updated.length + 1}`, arrivalTime: '', burstTime: '' });
    }
    setProcesses(updated.slice(0, newCount));
    simulateSJF(updated.slice(0, newCount));
    setNumProcesses(newCount);
  };

  const reset = () => {
    setProcesses([
      { id: 'P1', arrivalTime: '', burstTime: '' },
      { id: 'P2', arrivalTime: '', burstTime: '' },
      { id: 'P3', arrivalTime: '', burstTime: '' },
    ]);
    setNumProcesses(3);
    setResults([]);
    setShowChart(false);
    setAvgWaitingTime(0);
    setAvgTurnaroundTime(0);
    setCpuUtilization(0);
  };

  const runSimulation = async () => {
  const filled = processes.map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  try {
    const res = await axios.post('http://localhost:5000/api/sjf', {
      processes: filled,
    });

    const {
      results,
      avgWaitingTime,
      avgTurnaroundTime,
      cpuUtilization
    } = res.data;

    setResults(results);
    setAvgWaitingTime(avgWaitingTime);
    setAvgTurnaroundTime(avgTurnaroundTime);
    setCpuUtilization(cpuUtilization);
    setShowChart(true);
    console.log(avgTurnaroundTime,avgWaitingTime)
  } catch (err) {
    console.error(err);
    alert('Failed to simulate sjf');
  }
};

const simulateSJF = (processList) => {
  const processes = [...processList].map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  const n = processes.length;
  let currentTime = 0;
  const completed = [];
  const results = [];

  while (completed.length < n) {
    const readyQueue = processes
      .filter(p => p.arrivalTime <= currentTime && !completed.includes(p.id))
      .sort((a, b) => a.burstTime - b.burstTime);

    if (readyQueue.length === 0) {
      currentTime++;
      continue;
    }

    const current = readyQueue[0];
    const startTime = currentTime;
    const completionTime = currentTime + current.burstTime;
    const turnaroundTime = completionTime - current.arrivalTime;
    const waitingTime = turnaroundTime - current.burstTime;

    results.push({
      ...current,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });

    currentTime = completionTime;
    completed.push(current.id);
  }

  setResults(results);
  setShowChart(true);
};

    useEffect(() => {
    socket.on('sjfResults', (data) => {
      setResults(data);
      setShowChart(true);
      // simulateFCFS(trimmed);
    });
  
    return () => socket.off('sjfResults');
  }, []);

  return (
    <div className="container">
      <h2>SJF Scheduling</h2>
      <p>Type values into the table and the chart on the bottom will show how this runs</p>

      <table className="input-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={i}>
              <td>{p.id}</td>
              <td><input type="number" value={p.arrivalTime} onChange={(e) => updateProcess(i, 'arrivalTime', e.target.value)} /></td>
              <td><input type="number" value={p.burstTime} onChange={(e) => updateProcess(i, 'burstTime', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="controls">
        <div>
          <p><strong>Algorithm:</strong></p>
          <p>SJF is a non-preemptive CPU scheduling algorithm that selects the process with the shortest burst time</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

          <h3>Performance Metrics</h3>
          <p>Average Waiting Time: {avgWaitingTime}</p>
          <p>Average Turnaround Time: {avgTurnaroundTime}</p>
          <p>CPU Utilization: {cpuUtilization}%</p>
        
      
    </div>
  );
};

export default SJF;
