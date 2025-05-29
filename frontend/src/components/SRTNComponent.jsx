
import axios from 'axios';
import './FCFS.css'; // Create this CSS for styling
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:5000'); // Backend server URL
import FCFSVisualization from './FCFSVisualization';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';


const SRTN = () => {
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);
const [cpuUtilization, setCpuUtilization] = useState(0);
  // const COLORS = ['#FF6B6B', '#003f5c', '#845EC2', '#FF9671', '#FFC75F', '#F9F871'];
const runFCFS = () => {
  
  
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalBurstTime = 0;

  const updatedProcesses = sortedProcesses.map((process) => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    const completionTime = currentTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalBurstTime += process.burstTime;

    currentTime = completionTime;

    return {
      ...process,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    };
  });

  const firstArrival = Math.min(...updatedProcesses.map(p => p.arrivalTime));
  const lastCompletion = Math.max(...updatedProcesses.map(p => p.completionTime));

  const avgWaitingTime = totalWaitingTime / updatedProcesses.length;
  const avgTurnaroundTime = totalTurnaroundTime / updatedProcesses.length;
  const cpuUtilization = (totalBurstTime / (lastCompletion - firstArrival)) * 100;

  setProcesses(updatedProcesses); // update state with new process data
  setAvgWaitingTime(avgWaitingTime);
  setAvgTurnaroundTime(avgTurnaroundTime);
  setCpuUtilization(cpuUtilization);
};

  const [numProcesses, setNumProcesses] = useState(3);
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: '', burstTime: '' },
    { id: 'P2', arrivalTime: '', burstTime: '' },
    { id: 'P3', arrivalTime: '', burstTime: '' },
  ]);
  const [results, setResults] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = parseInt(value) || '';
    setProcesses(updated);
    //  simulateFCFS(updated);

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
      });
    }
    setProcesses(updated.slice(0, newCount));
    setNumProcesses(newCount);
    // simulateFCFS(trimmed);
  };
  const runSimulation = async () => {
    const filled = processes.map(p => ({
      ...p,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
    }));
    try {
      const res = await axios.post('http://localhost:5000/api/srtn', {
        processes: filled,
      });
      console.log(res.data);
      setResults(res.data.results);
      setShowChart(true);
    } catch (err) {
      alert('Failed to simulate FCFS');
    }
  };

  const reset = () => {
    setNumProcesses(3);
    setProcesses([
      { id: 'P1', arrivalTime: '', burstTime: '' },
      { id: 'P2', arrivalTime: '', burstTime: '' },
      { id: 'P3', arrivalTime: '', burstTime: '' },
    ]);
    setResults([]);
    setShowChart(false);
    //  simulateFCFS(trimmed);
  };

  useEffect(() => {
  socket.on('fcfsResults', (data) => {
    setResults(data);
    setShowChart(true);
    // simulateFCFS(trimmed);
  });

  return () => socket.off('fcfsResults');
}, []);




  return (
    <div className="container">
      <h2>SRTN Scheduling</h2>
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
          <p>FCFS will execute processes in order of their arrival time.</p>
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
        
    </div>
  );
};

export default SRTN;
