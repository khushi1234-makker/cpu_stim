// backend/routes/sjf.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
   const processes = req.body.processes;

  const n = processes.length;
  let currentTime = 0, completed = 0;
  const isCompleted = Array(n).fill(false);
  const results = [];
  let totalWT = 0, totalTAT = 0, totalBT = 0;

  while (completed < n) {
    let idx = -1;
    let minBT = Infinity;

    for (let i = 0; i < n; i++) {
      if (
        processes[i].arrivalTime <= currentTime &&
        !isCompleted[i] &&
        processes[i].burstTime < minBT
      ) {
        minBT = processes[i].burstTime;
        idx = i;
      }
    }

    if (idx !== -1) {
      const p = processes[idx];
      const startTime = currentTime;
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;

      totalWT += waitingTime;
      totalTAT += turnaroundTime;
      totalBT += p.burstTime;

      results.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      isCompleted[idx] = true;
      completed++;
      currentTime = completionTime;
    } else {
      currentTime++;
    }
  }

  const firstArrival = Math.min(...processes.map(p => p.arrivalTime));
  const lastCompletion = Math.max(...results.map(p => p.completionTime));

  const avgWaitingTime = totalWT / n;
  const avgTurnaroundTime = totalTAT / n;
  const cpuUtilization = (totalBT / (lastCompletion - firstArrival)) * 100;

  res.json({
    results,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization
  });
});
module.exports = router;
