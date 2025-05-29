import React from 'react';
import { useParams } from 'react-router-dom';
import FCFSComponent from '../components/FCFSComponent';
import SRTN from '../components/SRTNComponent';
import SJF from '../components/SJFComponent';
import PriorityScheduling from '../components/PrioritySchedulingComponent';
// import PagingComponent from '../components/PagingComponent';

const Simulator = () => {
  const { algorithm } = useParams();

  return (
    <div>
      {/* <h2>Simulating: {algorithm.toUpperCase()}</h2> */}
      {algorithm === 'fcfs' && <FCFSComponent />}
      {algorithm === 'srtn' && <SRTN />}
       {algorithm === 'sjf' && <SJF />}
       {algorithm === 'PriorityScheduling' && <PriorityScheduling />}

      {/* More conditions for other algorithms */}
    </div>
  );
};

export default Simulator;
