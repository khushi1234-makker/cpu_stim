import React from 'react';
import { AlgorithmType } from '../types';

interface AlgorithmDescriptionProps {
  algorithm: AlgorithmType;
}

const algorithmInfo: Record<AlgorithmType, { title: string; description: string; advantages: string[]; disadvantages: string[] }> = {
  firstFit: {
    title: 'First-Fit Algorithm',
    description: 'The First-Fit algorithm allocates the first available memory block that is large enough to accommodate the process. It scans the memory from the beginning and chooses the first block that fits.',
    advantages: [
      'Simple to implement and understand',
      'Fast allocation time',
      'Reasonably efficient for general use cases'
    ],
    disadvantages: [
      'Can lead to fragmentation over time',
      'May not utilize memory optimally',
      'Always starts search from the beginning, which can be inefficient for large memory spaces'
    ]
  },
  bestFit: {
    title: 'Best-Fit Algorithm',
    description: 'The Best-Fit algorithm allocates the smallest available memory block that is large enough to accommodate the process. It searches the entire memory to find the closest match in size.',
    advantages: [
      'Minimizes wasted space in each allocation',
      'Often results in better memory utilization',
      'Reduces external fragmentation compared to First-Fit'
    ],
    disadvantages: [
      'Slower allocation time due to full memory search',
      'Creates small, unusable fragments that can lead to internal fragmentation',
      'May perform poorly with frequent allocations and deallocations'
    ]
  },
  worstFit: {
    title: 'Worst-Fit Algorithm',
    description: 'The Worst-Fit algorithm allocates the largest available memory block to the process. It searches the entire memory to find the block with maximum size difference.',
    advantages: [
      'Leaves larger remaining blocks that may be more useful for future allocations',
      'Can reduce the creation of very small, unusable fragments',
      'Works well when most processes are of similar size'
    ],
    disadvantages: [
      'Quickly exhausts large blocks of memory',
      'Generally results in poorer memory utilization over time',
      'Slower allocation time due to full memory search'
    ]
  },
  nextFit: {
    title: 'Next-Fit Algorithm',
    description: 'The Next-Fit algorithm is a variation of First-Fit that starts searching from the location of the last allocation rather than from the beginning. It continues the search in a circular manner.',
    advantages: [
      'More efficient than First-Fit for large memory spaces',
      'Distributes allocations more evenly across memory',
      'Reduces search time by not always starting from the beginning'
    ],
    disadvantages: [
      'Can lead to more fragmentation than First-Fit in some cases',
      'May skip over small blocks that could be useful',
      'Performance depends heavily on allocation/deallocation patterns'
    ]
  }
};

const AlgorithmDescription: React.FC<AlgorithmDescriptionProps> = ({ algorithm }) => {
  const info = algorithmInfo[algorithm];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">{info.title}</h2>
      <p className="text-gray-700 mb-4">{info.description}</p>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-indigo-600 mb-2">How it works:</h3>
        {algorithm === 'firstFit' && (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Start scanning memory blocks from the beginning</li>
            <li>Allocate the first block that is large enough to fit the process</li>
            <li>If the block is larger than needed, split it and create a new free block with the remaining space</li>
            <li>If no block is large enough, the process waits</li>
          </ol>
        )}
        
        {algorithm === 'bestFit' && (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Scan all memory blocks</li>
            <li>Find the smallest block that is large enough to fit the process</li>
            <li>Allocate this block to minimize wasted space</li>
            <li>If the block is larger than needed, split it and create a new free block with the remaining space</li>
            <li>If no block is large enough, the process waits</li>
          </ol>
        )}
        
        {algorithm === 'worstFit' && (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Scan all memory blocks</li>
            <li>Find the largest block available</li>
            <li>Allocate this block to maximize the size of the remaining fragment</li>
            <li>If the block is larger than needed, split it and create a new free block with the remaining space</li>
            <li>If no block is large enough, the process waits</li>
          </ol>
        )}
        
        {algorithm === 'nextFit' && (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Start scanning from where the last allocation ended (not from the beginning)</li>
            <li>Continue in a circular manner until a suitable block is found</li>
            <li>Allocate the first block that is large enough to fit the process</li>
            <li>If the block is larger than needed, split it and create a new free block with the remaining space</li>
            <li>If no block is large enough after a full scan, the process waits</li>
          </ol>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-2">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {info.advantages.map((advantage, index) => (
              <li key={index}>{advantage}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {info.disadvantages.map((disadvantage, index) => (
              <li key={index}>{disadvantage}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDescription;