import React, { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { PlusCircle, RefreshCw, Trash2 } from 'lucide-react';

const InputForm: React.FC = () => {
  const {
    totalMemorySize,
    blockSize,
    processes,
    setTotalMemorySize,
    setBlockSize,
    initializeMemory,
    addProcess,
    removeProcess,
    clearProcesses
  } = useSimulationStore();
  
  const [newProcess, setNewProcess] = useState({
    size: 64,
    arrivalTime: 0,
    burstTime: 5
  });
  
  const handleTotalMemorySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setTotalMemorySize(value);
      initializeMemory();
    }
  };
  
  const handleBlockSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setBlockSize(value);
      initializeMemory();
    }
  };
  
  const handleProcessInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewProcess({
      ...newProcess,
      [name]: parseInt(value)
    });
  };
  
  const handleAddProcess = () => {
    if (newProcess.size > 0 && newProcess.burstTime > 0) {
      addProcess(newProcess);
      // Reset form
      setNewProcess({
        size: 64,
        arrivalTime: 0,
        burstTime: 5
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Memory & Process Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">Memory Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="totalMemorySize" className="block text-gray-700 mb-1">
                Total Memory Size (bytes):
              </label>
              <input
                id="totalMemorySize"
                type="number"
                min="64"
                value={totalMemorySize}
                onChange={handleTotalMemorySizeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="blockSize" className="block text-gray-700 mb-1">
                Memory Block Size (bytes):
              </label>
              <input
                id="blockSize"
                type="number"
                min="16"
                value={blockSize}
                onChange={handleBlockSizeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={initializeMemory}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <RefreshCw size={18} className="mr-2" />
              Reinitialize Memory
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">Add New Process</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="size" className="block text-gray-700 mb-1">
                Process Size (bytes):
              </label>
              <input
                id="size"
                name="size"
                type="number"
                min="1"
                value={newProcess.size}
                onChange={handleProcessInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="arrivalTime" className="block text-gray-700 mb-1">
                Arrival Time (time units):
              </label>
              <input
                id="arrivalTime"
                name="arrivalTime"
                type="number"
                min="0"
                value={newProcess.arrivalTime}
                onChange={handleProcessInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="burstTime" className="block text-gray-700 mb-1">
                Burst Time (time units):
              </label>
              <input
                id="burstTime"
                name="burstTime"
                type="number"
                min="1"
                value={newProcess.burstTime}
                onChange={handleProcessInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={handleAddProcess}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Process
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-indigo-600">Process Queue</h3>
          {processes.length > 0 && (
            <button
              onClick={clearProcesses}
              className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Clear All
            </button>
          )}
        </div>
        
        {processes.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">No processes added yet</p>
        ) : (
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size (bytes)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrival Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Burst Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processes.map((process) => (
                  <tr key={process.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 mr-2 rounded-full" 
                          style={{ backgroundColor: process.color }}
                        ></div>
                        {process.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {process.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {process.arrivalTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {process.burstTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removeProcess(process.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputForm;