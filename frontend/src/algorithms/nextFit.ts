import { Process, MemoryBlock, SimulationStep } from '../types';
import { mergeAdjacentFreeBlocks, cloneMemoryBlocks, cloneProcesses } from '../utils/helpers';

export const nextFitAlgorithm = (
  memoryBlocks: MemoryBlock[],
  processes: Process[],
  totalMemorySize: number
): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const waitingProcesses = cloneProcesses(processes).sort((a, b) => a.arrivalTime - b.arrivalTime);
  const completedProcesses: Process[] = [];
  let currentMemoryState = cloneMemoryBlocks(memoryBlocks);
  let currentTime = 0;
  let lastAllocatedIndex = 0; // To keep track of the last allocated block
  
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
      // Next-fit: Start searching from the last allocated block
      let allocated = false;
      const sortedBlocks = [...currentMemoryState].sort((a, b) => a.startAddress - b.startAddress);
      
      // Start from the last allocated block and wrap around
      for (let i = 0; i < sortedBlocks.length; i++) {
        const index = (lastAllocatedIndex + i) % sortedBlocks.length;
        const block = sortedBlocks[index];
        
        if (!block.allocated && block.size >= process.size) {
          // Update the last allocated index
          lastAllocatedIndex = index;
          
          // Allocate memory to the process
          const remainingSize = block.size - process.size;
          const originalBlock = currentMemoryState.find(b => b.id === block.id);
          
          if (originalBlock) {
            // Update the block
            originalBlock.allocated = true;
            originalBlock.processId = process.id;

            // If there's remaining space, create a new free block
            if (remainingSize > 0) {
              const newBlock: MemoryBlock = {
                id: currentMemoryState.length,
                size: remainingSize,
                allocated: false,
                startAddress: originalBlock.startAddress + process.size,
                endAddress: originalBlock.endAddress
              };
              
              // Update the original block
              originalBlock.size = process.size;
              originalBlock.endAddress = originalBlock.startAddress + process.size;
              
              // Add the new block
              currentMemoryState.push(newBlock);
            }
            
            // Update the process
            process.allocated = true;
            process.startAddress = originalBlock.startAddress;
            process.endAddress = originalBlock.endAddress;
            
            // Add step for allocation
            steps.push({
              time: currentTime,
              memoryState: cloneMemoryBlocks(currentMemoryState),
              waitingProcesses: cloneProcesses(waitingProcesses.filter(p => !p.allocated)),
              completedProcesses: cloneProcesses(completedProcesses),
              currentAction: `Allocated memory for Process ${process.id} at address ${originalBlock.startAddress} (Next Fit)`
            });
            
            allocated = true;
            break;
          }
        }
      }
      
      if (!allocated) {
        // No suitable block found, process remains waiting
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