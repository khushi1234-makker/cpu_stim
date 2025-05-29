const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const processes = req.body.processes;

  const procList = processes.map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    priority: Number(p.priority),
  }));

  const n = procList.length;
  let time = 0;
  let completed = 0;
  const isCompleted = new Array(n).fill(false);
  const results = [];

  while (completed < n) {
    let idx = -1;
    let highestPriority = Infinity;

    for (let i = 0; i < n; i++) {
      if (
        procList[i].arrivalTime <= time &&
        !isCompleted[i] &&
        procList[i].priority < highestPriority
      ) {
        highestPriority = procList[i].priority;
        idx = i;
      }
    }

    if (idx === -1) {
      time++;
    } else {
      const p = procList[idx];
      const startTime = time;
      const completionTime = time + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;

      results.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      time = completionTime;
      isCompleted[idx] = true;
      completed++;
    }
  }

  res.json({ results });
});

module.exports = router;
