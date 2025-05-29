const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const processes = req.body.processes;

  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let time = 0;
  const results = [];

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const startTime = Math.max(time, p.arrivalTime);
    const completionTime = startTime + p.burstTime;
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
  }

  res.json({ results });
});

module.exports = router;
