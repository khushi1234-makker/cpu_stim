import { Process, MemoryBlock, SimulationStep } from '../types';
import { mergeAdjacentFreeBlocks, cloneMemoryBlocks, cloneProcesses } from '../utils/helpers';

export const bestFitAlgorithm = (
  memoryBlocks: MemoryBlock[],
  processes: Process[],
  totalMemorySize: number
): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const waitingProcesses = cloneProcesses(processes).sort((a, b) => a.arrivalTime - b.arrivalTime);
  const completedProcesses: Process[] = [];
  let currentMemoryState = cloneMemoryBlocks(memoryBlocks);
  let currentTime = 0;
  
  // Add initial step
  steps.push({
    time: currentTime,
    memoryState: cloneMemoryBlocks(currentMemoryState),
    waitingProcesses: cloneProcesses(waitingProcesses),
    completedProcesses: [],
    currentAction: 'Initial memory state'
  });

  while (waitingProcesses.length > 0 || completedProcesses.some(p => p.allocated)) {
    // Get processes that have arrived by current time
    const arrivedProcesses = waitingProcesses.filter(p => p.arrivalTime <= currentTime && !p.allocated);
    
    // Try to allocate memory for each arrived process
    for (const process of arrivedProcesses) {
      // Best-fit: Find the smallest block that's big enough
      const freeBlocks = currentMemoryState.filter(block => !block.allocated && block.size >= process.size);
      
      if (freeBlocks.length > 0) {
        // Sort blocks by size to find the best fit (smallest block that fits)
        const bestFitBlock = freeBlocks.sort((a, b) => a.size - b.size)[0];
        const blockIndex = currentMemoryState.findIndex(block => block.id === bestFitBlock.id);
        
        if (blockIndex !== -1) {
          const block = currentMemoryState[blockIndex];
          const remainingSize = block.size - process.size;
          
          // Update the block
          block.allocated = true;
          block.processId = process.id;

          // If there's remaining space, create a new free block
          if (remainingSize > 0) {
            const newBlock: MemoryBlock = {
              id: currentMemoryState.length,
              size: remainingSize,
              allocated: false,
              startAddress: block.startAddress + process.size,
              endAddress: block.endAddress
            };
            
            // Update the original block
            block.size = process.size;
            block.endAddress = block.startAddress + process.size;
            
            // Add the new block
            currentMemoryState.push(newBlock);
          }
          
          // Update the process
          process.allocated = true;
          process.startAddress = block.startAddress;
          process.endAddress = block.endAddress;
          
          // Add step for allocation
          steps.push({
            time: currentTime,
            memoryState: cloneMemoryBlocks(currentMemoryState),
            waitingProcesses: cloneProcesses(waitingProcesses.filter(p => !p.allocated)),
            completedProcesses: cloneProcesses(completedProcesses),
            currentAction: `Allocated memory for Process ${process.id} at address ${block.startAddress} (Best Fit)`
          });
        }
      }
    }
    
    // Check for processes that have completed
    const allocatedProcesses = completedProcesses.filter(p => p.allocated);
    for (const process of allocatedProcesses) {
      if (process.arrivalTime + process.burstTime <= currentTime) {
        // Free memory
        currentMemoryState = currentMemoryState.map(block => {
          if (block.processId === process.id) {
            return {
              ...block,
              allocated: false,
              processId: undefined
            };
          }
          return block;
        });
        
        // Update process
        process.allocated = false;
        
        // Add step for deallocation
        steps.push({
          time: currentTime,
          memoryState: cloneMemoryBlocks(currentMemoryState),
          waitingProcesses: cloneProcesses(waitingProcesses.filter(p => !p.allocated)),
          completedProcesses: cloneProcesses(completedProcesses),
          currentAction: `Deallocated memory for Process ${process.id}`
        });
        
        // Merge adjacent free blocks
        currentMemoryState = mergeAdjacentFreeBlocks(currentMemoryState);
      }
    }
    
    // Move allocated processes from waiting to completed
    const newlyAllocated = waitingProcesses.filter(p => p.allocated);
    completedProcesses.push(...newlyAllocated);
    waitingProcesses.splice(0, waitingProcesses.length, ...waitingProcesses.filter(p => !p.allocated));
    
    currentTime++;
    
    // Add step for time increment if any process is still active
    if (waitingProcesses.length > 0 || completedProcesses.some(p => p.allocated)) {
      steps.push({
        time: currentTime,
        memoryState: cloneMemoryBlocks(currentMemoryState),
        waitingProcesses: cloneProcesses(waitingProcesses),
        completedProcesses: cloneProcesses(completedProcesses),
        currentAction: `Time increment to ${currentTime}`
      });
    }
  }
  
  return steps;
};