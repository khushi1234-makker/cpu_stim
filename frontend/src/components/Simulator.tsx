import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import AlgorithmDescription from './AlgorithmDescription';
import MemoryVisualizer from './MemoryVisualizer';
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from 'lucide-react';

const Simulator: React.FC = () => {
  const { 
    currentAlgorithm, 
    setCurrentAlgorithm, 
    startSimulation, 
    resetSimulation,
    nextStep,
    previousStep,
    currentStep,
    simulationResults,
    simulationSpeed,
    setSimulationSpeed,
    processes
  } = useSimulationStore();
  
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  const currentSimulation = simulationResults[currentAlgorithm];
  const totalSteps = currentSimulation ? currentSimulation.steps.length : 0;
  const disableSimulation = processes.length === 0;
  
  // Handle auto-play simulation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isAutoPlaying && currentSimulation) {
      if (currentStep < totalSteps - 1) {
        timer = setTimeout(() => {
          nextStep();
        }, simulationSpeed);
      } else {
        setIsAutoPlaying(false);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoPlaying, currentStep, totalSteps, nextStep, simulationSpeed, currentSimulation]);
  
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentAlgorithm(e.target.value as any);
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSimulationSpeed(2000 - value); // Invert value so higher = faster
  };
  
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    } else {
      if (currentStep === totalSteps - 1) {
        // If at the end, restart
        resetSimulation();
        startSimulation();
      }
      setIsAutoPlaying(true);
    }
  };
  
  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Memory Management Simulator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="algorithm" className="block text-gray-700 mb-2">
              Select Algorithm:
            </label>
            <select
              id="algorithm"
              value={currentAlgorithm}
              onChange={handleAlgorithmChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="firstFit">First-Fit</option>
              <option value="bestFit">Best-Fit</option>
              <option value="worstFit">Worst-Fit</option>
              <option value="nextFit">Next-Fit</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="speed" className="block text-gray-700 mb-2">
              Simulation Speed: {(2000 - simulationSpeed) / 20}x
            </label>
            <input
              id="speed"
              type="range"
              min="0"
              max="1900"
              step="100"
              value={2000 - simulationSpeed}
              onChange={handleSpeedChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              resetSimulation();
              startSimulation();
            }}
            disabled={disableSimulation}
            className={`px-4 py-2 rounded-md transition-colors ${
              disableSimulation
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Run Simulation
          </button>
          
          <button
            onClick={resetSimulation}
            disabled={!currentSimulation}
            className={`px-4 py-2 rounded-md transition-colors ${
              !currentSimulation
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <RefreshCw size={18} className="inline mr-1" />
            Reset
          </button>
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={previousStep}
              disabled={currentStep === 0 || !currentSimulation}
              className={`px-3 py-2 transition-colors ${
                currentStep === 0 || !currentSimulation
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <SkipBack size={18} />
            </button>
            
            <button
              onClick={toggleAutoPlay}
              disabled={!currentSimulation}
              className={`px-3 py-2 transition-colors ${
                !currentSimulation
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isAutoPlaying
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1 || !currentSimulation}
              className={`px-3 py-2 transition-colors ${
                currentStep === totalSteps - 1 || !currentSimulation
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <SkipForward size={18} />
            </button>
          </div>
          
          {currentSimulation && (
            <div className="ml-auto text-gray-700">
              Step: {currentStep + 1} / {totalSteps}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlgorithmDescription algorithm={currentAlgorithm} />
        <MemoryVisualizer />
      </div>
    </div>
  );
};

export default Simulator;