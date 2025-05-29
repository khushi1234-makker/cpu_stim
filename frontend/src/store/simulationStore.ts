import { create } from 'zustand';
import { Process, MemoryBlock, SimulationStep, SimulationResult, AlgorithmType } from '../types';
import { generateRandomColor, generateInitialMemory } from '../utils/helpers';
import { firstFitAlgorithm } from '../algorithms/firstFit';
import { bestFitAlgorithm } from '../algorithms/bestFit';
import { worstFitAlgorithm } from '../algorithms/worstFit';
import { nextFitAlgorithm } from '../algorithms/nextFit';

interface SimulationState {
  totalMemorySize: number;
  blockSize: number;
  memoryBlocks: MemoryBlock[];
  processes: Process[];
  currentAlgorithm: AlgorithmType;
  simulationResults: Record<AlgorithmType, SimulationResult | null>;
  currentStep: number;
  isSimulating: boolean;
  simulationSpeed: number;
  
  // Actions
  setTotalMemorySize: (size: number) => void;
  setBlockSize: (size: number) => void;
  initializeMemory: () => void;
  addProcess: (process: Omit<Process, 'id' | 'color' | 'allocated'>) => void;
  removeProcess: (id: string) => void;
  updateProcess: (id: string, updates: Partial<Process>) => void;
  setCurrentAlgorithm: (algorithm: AlgorithmType) => void;
  startSimulation: () => void;
  resetSimulation: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setSimulationSpeed: (speed: number) => void;
  clearProcesses: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  totalMemorySize: 1024, // Default: 1KB
  blockSize: 64, // Default: 64 bytes
  memoryBlocks: [],
  processes: [],
  currentAlgorithm: 'firstFit',
  simulationResults: {
    firstFit: null,
    bestFit: null,
    worstFit: null,
    nextFit: null,
  },
  currentStep: 0,
  isSimulating: false,
  simulationSpeed: 1000, // milliseconds
  
  setTotalMemorySize: (size) => set({ totalMemorySize: size }),
  
  setBlockSize: (size) => set({ blockSize: size }),
  
  initializeMemory: () => {
    const { totalMemorySize, blockSize } = get();
    const memoryBlocks = generateInitialMemory(totalMemorySize, blockSize);
    set({ memoryBlocks });
  },
  
  addProcess: (process) => {
    const processes = [...get().processes];
    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      color: generateRandomColor(),
      allocated: false,
      ...process,
    };
    set({ processes: [...processes, newProcess] });
  },
  
  removeProcess: (id) => {
    const processes = get().processes.filter(p => p.id !== id);
    set({ processes });
  },
  
  updateProcess: (id, updates) => {
    const processes = get().processes.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    set({ processes });
  },
  
  setCurrentAlgorithm: (algorithm) => {
    set({ currentAlgorithm: algorithm, currentStep: 0 });
  },
  
  startSimulation: () => {
    const { memoryBlocks, processes, totalMemorySize, currentAlgorithm } = get();
    let simulationSteps: SimulationStep[] = [];
    
    // Run the selected algorithm
    switch (currentAlgorithm) {
      case 'firstFit':
        simulationSteps = firstFitAlgorithm(memoryBlocks, processes, totalMemorySize);
        break;
      case 'bestFit':
        simulationSteps = bestFitAlgorithm(memoryBlocks, processes, totalMemorySize);
        break;
      case 'worstFit':
        simulationSteps = worstFitAlgorithm(memoryBlocks, processes, totalMemorySize);
        break;
      case 'nextFit':
        simulationSteps = nextFitAlgorithm(memoryBlocks, processes, totalMemorySize);
        break;
    }
    
    // Calculate metrics
    const lastStep = simulationSteps[simulationSteps.length - 1];
    const avgWaitTime = 0; // Placeholder, would need more detailed tracking
    const memUtil = 0; // Placeholder, would need calculation
    const frag = 0; // Placeholder, would need calculation
    
    // Update the results for the current algorithm
    const simulationResults = { ...get().simulationResults };
    simulationResults[currentAlgorithm] = {
      algorithm: currentAlgorithm,
      steps: simulationSteps,
      averageWaitTime: avgWaitTime,
      memoryUtilization: memUtil,
      fragmentation: frag,
    };
    
    set({ 
      simulationResults,
      isSimulating: true,
      currentStep: 0 
    });
  },
  
  resetSimulation: () => {
    set({ 
      isSimulating: false,
      currentStep: 0,
      simulationResults: {
        firstFit: null,
        bestFit: null,
        worstFit: null,
        nextFit: null,
      }
    });
  },
  
  nextStep: () => {
    const { currentStep, simulationResults, currentAlgorithm } = get();
    const result = simulationResults[currentAlgorithm];
    
    if (result && currentStep < result.steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  setSimulationSpeed: (speed) => {
    set({ simulationSpeed: speed });
  },
  
  clearProcesses: () => {
    set({ 
      processes: [],
      simulationResults: {
        firstFit: null,
        bestFit: null,
        worstFit: null,
        nextFit: null,
      },
      isSimulating: false,
      currentStep: 0
    });
  }
}));

// Initialize memory blocks when the store is created
useSimulationStore.getState().initializeMemory();