import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatMemorySize } from '../utils/helpers';
import { SimulationStep, ChartData } from '../types';
import { useSimulationStore } from '../store/simulationStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MemoryVisualizer: React.FC = () => {
  const { 
    simulationResults, 
    currentAlgorithm, 
    currentStep, 
    totalMemorySize
  } = useSimulationStore();
  
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  
  // Get the current simulation step
  const currentSimulation = simulationResults[currentAlgorithm];
  const step: SimulationStep | null = 
    currentSimulation && currentSimulation.steps.length > 0 
      ? currentSimulation.steps[currentStep] 
      : null;
  
  useEffect(() => {
    if (!step) return;
    
    const { memoryState } = step;
    const sortedMemory = [...memoryState].sort((a, b) => a.startAddress - b.startAddress);
    
    // Generate labels and data for the chart
    const labels: string[] = [];
    const backgroundColors: string[] = [];
    const data: number[] = [];
    
    sortedMemory.forEach(block => {
      const blockSize = block.endAddress - block.startAddress;
      const label = block.allocated 
        ? `${formatMemorySize(blockSize)} (${block.processId})`
        : `${formatMemorySize(blockSize)} (Free)`;
      
      labels.push(label);
      data.push(blockSize);
      
      // Set color: if allocated, use process color, else use gray
      const color = block.allocated 
        ? (block.processId && step.completedProcesses.find(p => p.id === block.processId)?.color) || '#60A5FA'
        : '#E5E7EB';
      
      backgroundColors.push(color);
    });
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Memory Allocation',
          data,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }, [step, currentStep]);
  
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Memory Size (bytes)',
        },
        max: totalMemorySize,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Memory Blocks',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Size: ${formatMemorySize(context.raw)}`;
          },
          afterLabel: function(context: any) {
            const blockIndex = context.dataIndex;
            const block = step?.memoryState.sort((a, b) => a.startAddress - b.startAddress)[blockIndex];
            
            if (!block) return '';
            
            return [
              `Address: ${block.startAddress} - ${block.endAddress}`,
              `Status: ${block.allocated ? 'Allocated' : 'Free'}`
            ];
          }
        }
      }
    },
  };
  
  if (!step) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-80">
        <p className="text-gray-500 italic">Run a simulation to see memory visualization</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Memory Visualization</h2>
      
      <div className="mb-4">
        <p className="text-gray-700"><strong>Time:</strong> {step.time}</p>
        <p className="text-gray-700"><strong>Action:</strong> {step.currentAction}</p>
      </div>
      
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Waiting Processes</h3>
          {step.waitingProcesses.length === 0 ? (
            <p className="text-gray-500 italic">No waiting processes</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {step.waitingProcesses.map(process => (
                    <tr key={process.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: process.color }}
                          ></div>
                          {process.id}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{process.size}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{process.arrivalTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Running Processes</h3>
          {step.completedProcesses.filter(p => p.allocated).length === 0 ? (
            <p className="text-gray-500 italic">No running processes</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {step.completedProcesses
                    .filter(p => p.allocated)
                    .map(process => (
                      <tr key={process.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 mr-2 rounded-full" 
                              style={{ backgroundColor: process.color }}
                            ></div>
                            {process.id}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {process.startAddress} - {process.endAddress}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {process.arrivalTime + process.burstTime - step.time} units
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryVisualizer;