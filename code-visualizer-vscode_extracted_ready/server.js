import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Algorithm data with full details
const algorithms = [
  { 
    id: '1', 
    name: 'Bubble Sort', 
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: { time: 'O(n²)', space: 'O(1)' }
  },
  { 
    id: '2', 
    name: 'Quick Sort', 
    category: 'sorting',
    description: 'An efficient sorting algorithm that uses divide-and-conquer to sort elements.',
    complexity: { time: 'O(n log n) average', space: 'O(log n)' }
  },
  { 
    id: '3', 
    name: 'Merge Sort', 
    category: 'sorting',
    description: 'A stable, divide-and-conquer sorting algorithm that divides the array into halves and merges them back in sorted order.',
    complexity: { time: 'O(n log n)', space: 'O(n)' }
  },
  { 
    id: '4', 
    name: 'Binary Search', 
    category: 'searching',
    description: 'An efficient search algorithm that finds the position of a target value within a sorted array.',
    complexity: { time: 'O(log n)', space: 'O(1)' }
  },
  { 
    id: '5', 
    name: 'Linear Search', 
    category: 'searching',
    description: 'A simple search algorithm that sequentially checks each element until it finds the target.',
    complexity: { time: 'O(n)', space: 'O(1)' }
  },
  { 
    id: '6', 
    name: 'Dijkstra\'s Algorithm', 
    category: 'graph',
    description: 'An algorithm for finding the shortest paths between nodes in a weighted graph.',
    complexity: { time: 'O(V²)', space: 'O(V)' }
  },
  { 
    id: '7', 
    name: 'BFS', 
    category: 'graph',
    description: 'Breadth-First Search traverses a graph level by level using a queue.',
    complexity: { time: 'O(V + E)', space: 'O(V)' }
  },
  { 
    id: '8', 
    name: 'DFS', 
    category: 'graph',
    description: 'Depth-First Search traverses a graph by going as deep as possible before backtracking.',
    complexity: { time: 'O(V + E)', space: 'O(V)' }
  },
  {
    id: '9',
    name: 'Two Sum',
    category: 'array',
    description: 'Find two numbers in an array that add up to a target value.',
    complexity: { time: 'O(n)', space: 'O(n)' }
  }
];

app.get('/api/algorithms', (req, res) => {
  res.json(algorithms);
});

// Get algorithm by name (must come before /:id route)
app.get('/api/algorithms/name/:name', (req, res) => {
  const { name } = req.params;
  const decodedName = decodeURIComponent(name);
  const algorithm = algorithms.find(algo => 
    algo.name.toLowerCase() === decodedName.toLowerCase()
  );
  
  if (algorithm) {
    res.json(algorithm);
  } else {
    res.status(404).json({ error: 'Algorithm not found' });
  }
});

app.get('/api/algorithms/:id', (req, res) => {
  const { id } = req.params;
  const algorithm = algorithms.find(algo => algo.id === id);
  
  if (algorithm) {
    res.json(algorithm);
  } else {
    res.status(404).json({ error: 'Algorithm not found' });
  }
});

// Helper function to parse input
const parseInput = (input) => {
  // If already an array, return it
  if (Array.isArray(input)) {
    return input;
  }
  
  // If it's a number, return array with that number
  if (typeof input === 'number') {
    return [input];
  }
  
  // If it's a string, try to parse it
  if (typeof input === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [parsed];
    } catch (e) {
      // If not JSON, try splitting by comma
      const parts = input.split(',').map(item => {
        const trimmed = item.trim();
        const num = Number(trimmed);
        return isNaN(num) ? trimmed : num;
      });
      return parts.length > 0 ? parts : [input];
    }
  }
  
  return [input];
};

// Generate flowchart data for algorithms
const generateFlowchart = (algorithmName) => {
  const algoName = algorithmName.toLowerCase();
  
  if (algoName.includes('bubble sort') || algoName.includes('bubblesort')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'input', label: 'Read Array', type: 'process', position: { x: 300, y: 130 } },
        { id: 'outer', label: 'i = 0 to n-2', type: 'process', position: { x: 300, y: 210 } },
        { id: 'inner', label: 'j = 0 to n-i-2', type: 'process', position: { x: 300, y: 290 } },
        { id: 'compare', label: 'arr[j] > arr[j+1]?', type: 'decision', position: { x: 300, y: 370 } },
        { id: 'swap', label: 'Swap arr[j] & arr[j+1]', type: 'process', position: { x: 150, y: 450 } },
        { id: 'continue', label: 'Continue', type: 'process', position: { x: 450, y: 450 } },
        { id: 'next', label: 'Next iteration', type: 'process', position: { x: 300, y: 530 } },
        { id: 'end', label: 'End (Sorted)', type: 'end', position: { x: 300, y: 610 } }
      ],
      edges: [
        { from: 'start', to: 'input' },
        { from: 'input', to: 'outer' },
        { from: 'outer', to: 'inner' },
        { from: 'inner', to: 'compare' },
        { from: 'compare', to: 'swap', label: 'Yes' },
        { from: 'compare', to: 'continue', label: 'No' },
        { from: 'swap', to: 'continue' },
        { from: 'continue', to: 'next' },
        { from: 'next', to: 'compare' },
        { from: 'outer', to: 'end' }
      ]
    };
  } else if (algoName.includes('binary search') || algoName.includes('binarysearch')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'left=0, right=n-1', type: 'process', position: { x: 300, y: 130 } },
        { id: 'loop', label: 'left <= right?', type: 'decision', position: { x: 300, y: 210 } },
        { id: 'mid', label: 'mid = (left+right)/2', type: 'process', position: { x: 300, y: 290 } },
        { id: 'check', label: 'arr[mid] == target?', type: 'decision', position: { x: 300, y: 370 } },
        { id: 'found', label: 'Found at mid', type: 'process', position: { x: 150, y: 450 } },
        { id: 'greater', label: 'target > arr[mid]', type: 'process', position: { x: 450, y: 450 } },
        { id: 'smaller', label: 'target < arr[mid]', type: 'process', position: { x: 300, y: 530 } },
        { id: 'update', label: 'Update left/right', type: 'process', position: { x: 300, y: 610 } },
        { id: 'notfound', label: 'Not Found', type: 'process', position: { x: 150, y: 690 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 770 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'loop' },
        { from: 'loop', to: 'mid', label: 'Yes' },
        { from: 'loop', to: 'notfound', label: 'No' },
        { from: 'mid', to: 'check' },
        { from: 'check', to: 'found', label: 'Yes' },
        { from: 'check', to: 'greater', label: 'target > arr[mid]' },
        { from: 'check', to: 'smaller', label: 'target < arr[mid]' },
        { from: 'greater', to: 'update' },
        { from: 'smaller', to: 'update' },
        { from: 'update', to: 'loop' },
        { from: 'found', to: 'end' },
        { from: 'notfound', to: 'end' }
      ]
    };
  } else if (algoName.includes('quick sort') || algoName.includes('quicksort')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'base', label: 'Is array length <= 1?', type: 'decision', position: { x: 300, y: 130 } },
        { id: 'pivot', label: 'Choose pivot', type: 'process', position: { x: 300, y: 210 } },
        { id: 'partition', label: 'Partition array', type: 'process', position: { x: 300, y: 290 } },
        { id: 'recurse1', label: 'QuickSort left', type: 'process', position: { x: 150, y: 370 } },
        { id: 'recurse2', label: 'QuickSort right', type: 'process', position: { x: 450, y: 370 } },
        { id: 'end', label: 'End (Sorted)', type: 'end', position: { x: 300, y: 450 } }
      ],
      edges: [
        { from: 'start', to: 'base' },
        { from: 'base', to: 'end', label: 'Yes' },
        { from: 'base', to: 'pivot', label: 'No' },
        { from: 'pivot', to: 'partition' },
        { from: 'partition', to: 'recurse1' },
        { from: 'recurse1', to: 'recurse2' },
        { from: 'recurse2', to: 'end' }
      ]
    };
  } else if (algoName.includes('merge sort') || algoName.includes('mergesort')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'base', label: 'Is array length <= 1?', type: 'decision', position: { x: 300, y: 130 } },
        { id: 'mid', label: 'mid = n/2', type: 'process', position: { x: 300, y: 210 } },
        { id: 'left', label: 'MergeSort left half', type: 'process', position: { x: 150, y: 290 } },
        { id: 'right', label: 'MergeSort right half', type: 'process', position: { x: 450, y: 290 } },
        { id: 'merge', label: 'Merge both halves', type: 'process', position: { x: 300, y: 370 } },
        { id: 'end', label: 'End (Sorted)', type: 'end', position: { x: 300, y: 450 } }
      ],
      edges: [
        { from: 'start', to: 'base' },
        { from: 'base', to: 'end', label: 'Yes' },
        { from: 'base', to: 'mid', label: 'No' },
        { from: 'mid', to: 'left' },
        { from: 'left', to: 'right' },
        { from: 'right', to: 'merge' },
        { from: 'merge', to: 'end' }
      ]
    };
  } else if (algoName.includes('linear search') || algoName.includes('linearsearch')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'i = 0', type: 'process', position: { x: 300, y: 130 } },
        { id: 'loop', label: 'i < n?', type: 'decision', position: { x: 300, y: 210 } },
        { id: 'check', label: 'arr[i] == target?', type: 'decision', position: { x: 300, y: 290 } },
        { id: 'found', label: 'Found at i', type: 'process', position: { x: 150, y: 370 } },
        { id: 'increment', label: 'i++', type: 'process', position: { x: 450, y: 370 } },
        { id: 'notfound', label: 'Not Found', type: 'process', position: { x: 300, y: 450 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 530 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'loop' },
        { from: 'loop', to: 'check', label: 'Yes' },
        { from: 'loop', to: 'notfound', label: 'No' },
        { from: 'check', to: 'found', label: 'Yes' },
        { from: 'check', to: 'increment', label: 'No' },
        { from: 'increment', to: 'loop' },
        { from: 'found', to: 'end' },
        { from: 'notfound', to: 'end' }
      ]
    };
  } else if (algoName.includes('dijkstra') || algoName.includes("dijkstra's")) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'Initialize distances', type: 'process', position: { x: 300, y: 130 } },
        { id: 'select', label: 'Select unvisited node', type: 'process', position: { x: 300, y: 210 } },
        { id: 'check', label: 'Any unvisited?', type: 'decision', position: { x: 300, y: 290 } },
        { id: 'update', label: 'Update distances', type: 'process', position: { x: 300, y: 370 } },
        { id: 'mark', label: 'Mark as visited', type: 'process', position: { x: 300, y: 450 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 530 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'select' },
        { from: 'select', to: 'check' },
        { from: 'check', to: 'update', label: 'Yes' },
        { from: 'check', to: 'end', label: 'No' },
        { from: 'update', to: 'mark' },
        { from: 'mark', to: 'select' }
      ]
    };
  } else if (algoName.includes('bfs') || algoName.toLowerCase() === 'bfs') {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'Create queue, add start', type: 'process', position: { x: 300, y: 130 } },
        { id: 'loop', label: 'Queue empty?', type: 'decision', position: { x: 300, y: 210 } },
        { id: 'dequeue', label: 'Dequeue node', type: 'process', position: { x: 300, y: 290 } },
        { id: 'visit', label: 'Visit neighbors', type: 'process', position: { x: 300, y: 370 } },
        { id: 'enqueue', label: 'Enqueue unvisited', type: 'process', position: { x: 300, y: 450 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 530 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'loop' },
        { from: 'loop', to: 'dequeue', label: 'No' },
        { from: 'loop', to: 'end', label: 'Yes' },
        { from: 'dequeue', to: 'visit' },
        { from: 'visit', to: 'enqueue' },
        { from: 'enqueue', to: 'loop' }
      ]
    };
  } else if (algoName.includes('dfs') || algoName.toLowerCase() === 'dfs') {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'Create stack, add start', type: 'process', position: { x: 300, y: 130 } },
        { id: 'loop', label: 'Stack empty?', type: 'decision', position: { x: 300, y: 210 } },
        { id: 'pop', label: 'Pop node', type: 'process', position: { x: 300, y: 290 } },
        { id: 'visit', label: 'Visit neighbors', type: 'process', position: { x: 300, y: 370 } },
        { id: 'push', label: 'Push unvisited', type: 'process', position: { x: 300, y: 450 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 530 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'loop' },
        { from: 'loop', to: 'pop', label: 'No' },
        { from: 'loop', to: 'end', label: 'Yes' },
        { from: 'pop', to: 'visit' },
        { from: 'visit', to: 'push' },
        { from: 'push', to: 'loop' }
      ]
    };
  } else if (algoName.includes('two sum') || algoName.includes('twosum')) {
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'init', label: 'Create hash map', type: 'process', position: { x: 300, y: 130 } },
        { id: 'loop', label: 'For each num in array', type: 'process', position: { x: 300, y: 210 } },
        { id: 'check', label: 'complement in map?', type: 'decision', position: { x: 300, y: 290 } },
        { id: 'found', label: 'Return indices', type: 'process', position: { x: 150, y: 370 } },
        { id: 'add', label: 'Add num to map', type: 'process', position: { x: 450, y: 370 } },
        { id: 'continue', label: 'Continue loop', type: 'process', position: { x: 300, y: 450 } },
        { id: 'notfound', label: 'Not found', type: 'process', position: { x: 300, y: 530 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 610 } }
      ],
      edges: [
        { from: 'start', to: 'init' },
        { from: 'init', to: 'loop' },
        { from: 'loop', to: 'check' },
        { from: 'check', to: 'found', label: 'Yes' },
        { from: 'check', to: 'add', label: 'No' },
        { from: 'add', to: 'continue' },
        { from: 'continue', to: 'loop' },
        { from: 'found', to: 'end' },
        { from: 'loop', to: 'notfound' },
        { from: 'notfound', to: 'end' }
      ]
    };
  } else {
    // Generic flowchart for any algorithm
    return {
      nodes: [
        { id: 'start', label: 'Start', type: 'start', position: { x: 300, y: 50 } },
        { id: 'process', label: 'Process Input', type: 'process', position: { x: 300, y: 130 } },
        { id: 'algorithm', label: algorithmName, type: 'process', position: { x: 300, y: 210 } },
        { id: 'result', label: 'Return Result', type: 'process', position: { x: 300, y: 290 } },
        { id: 'end', label: 'End', type: 'end', position: { x: 300, y: 370 } }
      ],
      edges: [
        { from: 'start', to: 'process' },
        { from: 'process', to: 'algorithm' },
        { from: 'algorithm', to: 'result' },
        { from: 'result', to: 'end' }
      ]
    };
  }
};

// Simulate algorithm execution steps
const simulateAlgorithm = (algorithmName, input) => {
  const algoName = algorithmName.toLowerCase();
  const steps = [];
  
  if (algoName.includes('bubble sort') || algoName.includes('bubblesort')) {
    const arr = Array.isArray(input) ? [...input] : parseInput(input);
    const n = arr.length;
    
    steps.push({ step: 0, action: 'Start Bubble Sort', array: [...arr], message: `Input array: [${arr.join(', ')}]` });
    
    for (let i = 0; i < n - 1; i++) {
      steps.push({ step: i + 1, action: `Outer loop iteration ${i + 1}`, array: [...arr], message: `Checking positions 0 to ${n - i - 1}` });
      
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ 
          step: steps.length, 
          action: `Compare ${arr[j]} and ${arr[j + 1]}`, 
          array: [...arr], 
          indices: [j, j + 1],
          message: `Comparing elements at indices ${j} and ${j + 1}` 
        });
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({ 
            step: steps.length, 
            action: `Swap ${arr[j]} and ${arr[j + 1]}`, 
            array: [...arr], 
            indices: [j, j + 1],
            swapped: true,
            message: `Swapped! New order: [${arr.join(', ')}]` 
          });
        }
      }
    }
    
    steps.push({ step: steps.length, action: 'Complete', array: [...arr], message: `Final sorted array: [${arr.join(', ')}]` });
    
  } else if (algoName.includes('binary search') || algoName.includes('binarysearch')) {
    const arr = Array.isArray(input) ? input : [5, 2, 8, 1, 9, 3];
    const target = typeof input === 'number' ? input : arr[0];
    const sorted = [...arr].sort((a, b) => a - b);
    
    steps.push({ step: 0, action: 'Start Binary Search', array: sorted, target, message: `Searching for ${target} in sorted array [${sorted.join(', ')}]` });
    
    let left = 0, right = sorted.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ 
        step: steps.length, 
        action: `Check middle element at index ${mid}`, 
        array: sorted, 
        indices: [left, mid, right],
        message: `Checking middle element: ${sorted[mid]}` 
      });
      
      if (sorted[mid] === target) {
        steps.push({ 
          step: steps.length, 
          action: 'Found!', 
          array: sorted, 
          foundIndex: mid,
          message: `Found ${target} at index ${mid}!` 
        });
        return steps;
      } else if (sorted[mid] < target) {
        left = mid + 1;
        steps.push({ 
          step: steps.length, 
          action: 'Target is greater', 
          array: sorted, 
          message: `${target} > ${sorted[mid]}, search right half` 
        });
      } else {
        right = mid - 1;
        steps.push({ 
          step: steps.length, 
          action: 'Target is smaller', 
          array: sorted, 
          message: `${target} < ${sorted[mid]}, search left half` 
        });
      }
    }
    
    steps.push({ step: steps.length, action: 'Not Found', message: `${target} not found in array` });
    
  } else {
    // Generic algorithm steps
    const arr = Array.isArray(input) ? input : parseInput(input);
    steps.push({ step: 0, action: 'Start', array: Array.isArray(arr) ? arr : [arr], message: `Processing algorithm: ${algorithmName}` });
    steps.push({ step: 1, action: 'Processing', message: `Algorithm ${algorithmName} is executing...` });
    steps.push({ step: 2, action: 'Complete', array: Array.isArray(arr) ? arr : [arr], message: `Algorithm ${algorithmName} completed` });
  }
  
  return steps;
};

// Code execution endpoint with visualization
app.post('/api/visualize', (req, res) => {
  const { algorithm, input } = req.body;
  
  if (!algorithm) {
    return res.status(400).json({ error: 'Algorithm name is required' });
  }
  
  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }
  
  try {
    const steps = simulateAlgorithm(algorithm, input);
    const flowchart = generateFlowchart(algorithm);
    
    res.json({
      success: true,
      message: 'Visualization data generated',
      data: {
        algorithm,
        input,
        steps,
        stepCount: steps.length,
        flowchart
      }
    });
  } catch (error) {
    console.error('Visualization error:', error);
    res.status(500).json({ 
      error: 'Failed to generate visualization',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

