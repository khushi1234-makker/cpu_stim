// routes/srtnRoute.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const processes = req.body.processes.map(p => ({ ...p }));
  const n = processes.length;
  let time = 0;
  let completed = 0;
  const isCompleted = Array(n).fill(false);
  const remainingTime = processes.map(p => p.burstTime);
  const results = [];

  while (completed !== n) {
    let idx = -1;
    let min = Infinity;

    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= time && !isCompleted[i]) {
        if (remainingTime[i] < min && remainingTime[i] > 0) {
          min = remainingTime[i];
          idx = i;
        }
      }
    }

    if (idx === -1) {
      time++;
      continue;
    }

    if (!processes[idx].startTime) processes[idx].startTime = time;

    remainingTime[idx]--;
    time++;

    if (remainingTime[idx] === 0) {
      isCompleted[idx] = true;
      completed++;

      const completionTime = time;
      const turnaroundTime = completionTime - processes[idx].arrivalTime;
      const waitingTime = turnaroundTime - processes[idx].burstTime;

      results.push({
        ...processes[idx],
        completionTime,
        turnaroundTime,
        waitingTime,
        startTime: processes[idx].startTime
      });
    }
  }

  results.sort((a, b) => a.startTime - b.startTime);
  res.json({ results });
});

module.exports = router;
