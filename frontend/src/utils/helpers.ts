import { Process, MemoryBlock } from '../types';

// Generate random hex color
export const generateRandomColor = (): string => {
  const colors = [
    '#4F46E5', // Indigo
    '#059669', // Emerald
    '#D97706', // Amber
    '#DB2777', // Pink
    '#7C3AED', // Violet
    '#2563EB', // Blue
    '#DC2626', // Red
    '#0891B2', // Cyan
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Calculate memory utilization
export const calculateMemoryUtilization = (
  memoryBlocks: MemoryBlock[],
  totalMemorySize: number
): number => {
  const allocatedMemory = memoryBlocks
    .filter(block => block.allocated)
    .reduce((sum, block) => sum + (block.endAddress - block.startAddress), 0);
  
  return (allocatedMemory / totalMemorySize) * 100;
};

// Calculate fragmentation
export const calculateFragmentation = (
  memoryBlocks: MemoryBlock[],
  totalMemorySize: number
): number => {
  const freeBlocks = memoryBlocks.filter(block => !block.allocated);
  
  if (freeBlocks.length === 0) return 0;
  
  const totalFreeMemory = freeBlocks.reduce(
    (sum, block) => sum + (block.endAddress - block.startAddress), 
    0
  );
  
  const largestFreeBlock = Math.max(
    ...freeBlocks.map(block => block.endAddress - block.startAddress)
  );
  
  // Internal fragmentation is approximated as total free memory minus largest free block
  const internalFragmentation = totalFreeMemory - largestFreeBlock;
  
  return (internalFragmentation / totalMemorySize) * 100;
};

// Format memory size for display
export const formatMemorySize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

// Generate initial memory blocks based on total size
export const generateInitialMemory = (totalSize: number, blockSize: number): MemoryBlock[] => {
  const blocks: MemoryBlock[] = [];
  let startAddress = 0;
  
  while (startAddress < totalSize) {
    const size = Math.min(blockSize, totalSize - startAddress);
    blocks.push({
      id: blocks.length,
      size,
      allocated: false,
      startAddress,
      endAddress: startAddress + size
    });
    startAddress += size;
  }
  
  return blocks;
};

// Find adjacent free blocks and merge them
export const mergeAdjacentFreeBlocks = (memoryBlocks: MemoryBlock[]): MemoryBlock[] => {
  const sortedBlocks = [...memoryBlocks].sort((a, b) => a.startAddress - b.startAddress);
  const mergedBlocks: MemoryBlock[] = [];
  
  let currentBlock: MemoryBlock | null = null;
  
  for (const block of sortedBlocks) {
    if (!currentBlock) {
      currentBlock = { ...block };
    } else if (!currentBlock.allocated && !block.allocated && 
               currentBlock.endAddress === block.startAddress) {
      // Merge adjacent free blocks
      currentBlock.endAddress = block.endAddress;
      currentBlock.size = currentBlock.endAddress - currentBlock.startAddress;
    } else {
      mergedBlocks.push(currentBlock);
      currentBlock = { ...block };
    }
  }
  
  if (currentBlock) {
    mergedBlocks.push(currentBlock);
  }
  
  // Reassign IDs
  return mergedBlocks.map((block, index) => ({ ...block, id: index }));
};

// Get memory block by address
export const getMemoryBlockByAddress = (
  memoryBlocks: MemoryBlock[],
  address: number
): MemoryBlock | undefined => {
  return memoryBlocks.find(
    block => address >= block.startAddress && address < block.endAddress
  );
};

// Clone memory blocks
export const cloneMemoryBlocks = (memoryBlocks: MemoryBlock[]): MemoryBlock[] => {
  return memoryBlocks.map(block => ({ ...block }));
};

// Clone processes
export const cloneProcesses = (processes: Process[]): Process[] => {
  return processes.map(process => ({ ...process }));
};