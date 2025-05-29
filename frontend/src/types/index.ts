export interface Process {
  id: string;
  size: number;
  arrivalTime: number;
  burstTime: number;
  allocated: boolean;
  color: string;
  startAddress?: number;
  endAddress?: number;
}

export interface MemoryBlock {
  id: number;
  size: number;
  allocated: boolean;
  processId?: string;
  startAddress: number;
  endAddress: number;
}

export interface SimulationStep {
  time: number;
  memoryState: MemoryBlock[];
  waitingProcesses: Process[];
  completedProcesses: Process[];
  currentAction: string;
}

export interface SimulationResult {
  algorithm: string;
  steps: SimulationStep[];
  averageWaitTime: number;
  memoryUtilization: number;
  fragmentation: number;
}

export type AlgorithmType = 'firstFit' | 'bestFit' | 'worstFit' | 'nextFit';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: any[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}