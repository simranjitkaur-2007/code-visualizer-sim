// Algorithm library with Python code, Mermaid flowcharts, and metadata
export const algorithms = {
  sorting: [
    {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'sorting',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      pythonCode: `def bubble_sort(arr):
    """Bubble Sort algorithm with step-by-step visualization"""
    n = len(arr)
    
    # Outer loop: number of passes
    for i in range(n - 1):
        swapped = False
        
        # Inner loop: compare adjacent elements
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if they are in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred, array is sorted
        if not swapped:
            break
    
    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
result = bubble_sort(arr)
print(f"Sorted array: {result}")`,
      mermaidFlowchart: `flowchart TD
    Start([Bubble Sort]) --> Input["Set N = Length of Array"]
    Input --> InitLoop{for i in range n - 1}
    InitLoop --> SwapFlag["swapped = False"]
    SwapFlag --> InnerLoop{for j in range 0 to n-i-1}
    InnerLoop --> Compare{"Array[j] > Array[j+1]?"}
    Compare -->|Yes| Swap["Swap Array[j] and Array[j+1]"]
    Swap --> SetSwap["swapped = True"]
    Compare -->|No| SetSwap
    SetSwap --> IncrementJ["Increment j j++"]
    IncrementJ --> CheckJ{"j < N-i-1?"}
    CheckJ -->|Yes| InnerLoop
    CheckJ -->|No| CheckSwap{"swapped == False?"}
    CheckSwap -->|Yes| Break["Break - Array Sorted"]
    CheckSwap -->|No| IncrementI["Increment i i++"]
    IncrementI --> CheckI{"i < N-1?"}
    CheckI -->|Yes| InitLoop
    CheckI -->|No| End([Ordered Array])
    Break --> End
    InitLoop -->|No| End`,
      executionSteps: [
        { line: 12, action: 'Initialize', message: 'Get array length: n = 7' },
        { line: 15, action: 'Outer Loop Start', message: 'Outer loop: i = 0 (first pass)' },
        { line: 16, action: 'Reset Flag', message: 'Set swapped = False' },
        { line: 19, action: 'Inner Loop Start', message: 'Inner loop: j = 0, comparing arr[0] and arr[1]' },
        { line: 21, action: 'Compare', message: 'Comparing: 64 > 34? Yes, swap needed' },
        { line: 23, action: 'Swap', message: 'Swapped: [34, 64, 25, 12, 22, 11, 90]' },
        { line: 24, action: 'Set Flag', message: 'Set swapped = True' },
        { line: 19, action: 'Next Iteration', message: 'j = 1, comparing arr[1] and arr[2]' },
        { line: 21, action: 'Compare', message: 'Comparing: 64 > 25? Yes, swap needed' },
        { line: 23, action: 'Swap', message: 'Swapped: [34, 25, 64, 12, 22, 11, 90]' },
        { line: 27, action: 'Check Flag', message: 'swapped = True, continue' },
        { line: 15, action: 'Outer Loop Next', message: 'i = 1 (second pass)' },
        { line: 19, action: 'Inner Loop Start', message: 'Inner loop: j = 0' },
        { line: 27, action: 'Final Check', message: 'No swaps in this pass, array is sorted!' },
        { line: 28, action: 'Break', message: 'Break from loop - sorting complete' },
        { line: 30, action: 'Return', message: 'Return sorted array: [11, 12, 22, 25, 34, 64, 90]' },
      ]
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      category: 'sorting',
      description: 'An efficient sorting algorithm that uses divide-and-conquer to sort elements.',
      complexity: { time: 'O(n log n) average', space: 'O(log n)' },
      pythonCode: `def quick_sort(arr, low, high):
    """Quick Sort algorithm using divide and conquer"""
    if low < high:
        # Partition the array and get pivot index
        pivot_idx = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)

def partition(arr, low, high):
    """Partition function: places pivot in correct position"""
    # Choose rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element (indicates right position of pivot)
    i = low - 1
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example usage
arr = [10, 7, 8, 9, 1, 5]
quick_sort(arr, 0, len(arr) - 1)
print(f"Sorted array: {arr}")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Check{"low < high?"}
    Check -->|No| End([Return])
    Check -->|Yes| Partition["Partition array around pivot"]
    Partition --> SortLeft["QuickSort left subarray"]
    SortLeft --> SortRight["QuickSort right subarray"]
    SortRight --> End`,
      executionSteps: [
        { line: 2, action: 'Base Case', message: 'Check if subarray has more than one element' },
        { line: 4, action: 'Partition', message: 'Partition array and get pivot index' },
        { line: 6, action: 'Recurse Left', message: 'Sort left subarray recursively' },
        { line: 7, action: 'Recurse Right', message: 'Sort right subarray recursively' },
      ]
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: 'sorting',
      description: 'A stable, divide-and-conquer sorting algorithm that divides the array into halves and merges them back in sorted order.',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      pythonCode: `def merge_sort(arr):
    """Merge Sort algorithm"""
    if len(arr) <= 1:
        return arr
    
    # Divide array into two halves
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)
    
    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays"""
    result = []
    i = j = 0
    
    # Compare elements and merge
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
arr = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(arr)
print(f"Sorted array: {sorted_arr}")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Check{"len(arr) <= 1?"}
    Check -->|Yes| Return([Return arr])
    Check -->|No| Divide["Divide array into left and right"]
    Divide --> SortLeft["MergeSort left"]
    Divide --> SortRight["MergeSort right"]
    SortLeft --> Merge["Merge sorted halves"]
    SortRight --> Merge
    Merge --> End([Return merged array])`,
      executionSteps: [
        { line: 2, action: 'Base Case', message: 'Check if array has one or zero elements' },
        { line: 5, action: 'Divide', message: 'Split array into two halves' },
        { line: 8, action: 'Recurse Left', message: 'Sort left half recursively' },
        { line: 9, action: 'Recurse Right', message: 'Sort right half recursively' },
        { line: 12, action: 'Merge', message: 'Merge sorted halves' },
      ]
    }
  ],
  searching: [
    {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'searching',
      description: 'An efficient search algorithm that finds the position of a target value within a sorted array.',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      pythonCode: `def binary_search(arr, target):
    """Binary Search algorithm (requires sorted array)"""
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Calculate middle index
        mid = (left + right) // 2
        
        # Check if target is at middle
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Target not found
    return -1

# Example usage
arr = [2, 5, 8, 12, 16, 23, 38, 45, 67, 77]
target = 23
result = binary_search(arr, target)
print(f"Element found at index: {result}" if result != -1 else "Element not found")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Init["left = 0, right = n-1"]
    Init --> Loop{"left <= right?"}
    Loop -->|No| NotFound([Return -1])
    Loop -->|Yes| CalcMid["mid = (left + right) // 2"]
    CalcMid --> Check{"arr[mid] == target?"}
    Check -->|Yes| Found([Return mid])
    Check -->|No| Compare{"arr[mid] < target?"}
    Compare -->|Yes| UpdateLeft["left = mid + 1"]
    Compare -->|No| UpdateRight["right = mid - 1"]
    UpdateLeft --> Loop
    UpdateRight --> Loop`,
      executionSteps: [
        { line: 3, action: 'Initialize', message: 'Set left and right boundaries' },
        { line: 5, action: 'Loop Check', message: 'Check if search space is valid' },
        { line: 7, action: 'Calculate Mid', message: 'Find middle index' },
        { line: 10, action: 'Check Match', message: 'Compare middle element with target' },
        { line: 13, action: 'Update Left', message: 'Search in right half' },
        { line: 16, action: 'Update Right', message: 'Search in left half' },
      ]
    },
    {
      id: 'linear-search',
      name: 'Linear Search',
      category: 'searching',
      description: 'A simple search algorithm that sequentially checks each element until it finds the target.',
      complexity: { time: 'O(n)', space: 'O(1)' },
      pythonCode: `def linear_search(arr, target):
    """Linear Search algorithm"""
    # Traverse through array elements
    for i in range(len(arr)):
        # Check if current element matches target
        if arr[i] == target:
            return i  # Return index if found
    
    # Target not found
    return -1

# Example usage
arr = [10, 20, 30, 40, 50, 60]
target = 40
result = linear_search(arr, target)
print(f"Element found at index: {result}" if result != -1 else "Element not found")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Init["i = 0"]
    Init --> Loop{"i < len(arr)?"}
    Loop -->|No| NotFound([Return -1])
    Loop -->|Yes| Check{"arr[i] == target?"}
    Check -->|Yes| Found([Return i])
    Check -->|No| Inc["i++"]
    Inc --> Loop`,
      executionSteps: [
        { line: 3, action: 'Loop Start', message: 'Start iterating through array' },
        { line: 5, action: 'Compare', message: 'Check if current element matches target' },
        { line: 6, action: 'Found', message: 'Return index if match found' },
        { line: 4, action: 'Increment', message: 'Move to next element' },
      ]
    }
  ],
  graph: [
    {
      id: 'bfs',
      name: 'BFS',
      category: 'graph',
      description: 'Breadth-First Search traverses a graph level by level using a queue.',
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      pythonCode: `from collections import deque

def bfs(graph, start):
    """Breadth-First Search algorithm"""
    # Queue for BFS
    queue = deque([start])
    
    # Set to keep track of visited nodes
    visited = {start}
    
    # List to store traversal order
    result = []
    
    while queue:
        # Dequeue a vertex from queue
        node = queue.popleft()
        result.append(node)
        
        # Get all adjacent vertices
        for neighbor in graph.get(node, []):
            # If neighbor hasn't been visited, mark and enqueue it
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
result = bfs(graph, 'A')
print(f"BFS traversal: {' -> '.join(result)}")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Init["Create queue, add start node<br/>Mark start as visited"]
    Init --> Loop{"Queue empty?"}
    Loop -->|Yes| End([Return result])
    Loop -->|No| Dequeue["Dequeue node from queue"]
    Dequeue --> Add["Add node to result"]
    Add --> Check["For each neighbor"]
    Check --> Visited{"Neighbor visited?"}
    Visited -->|No| Mark["Mark as visited"]
    Mark --> Enqueue["Enqueue neighbor"]
    Enqueue --> Check
    Visited -->|Yes| Check
    Check -->|Done| Loop`,
      executionSteps: [
        { line: 5, action: 'Initialize', message: 'Create queue and visited set' },
        { line: 11, action: 'Loop', message: 'Process nodes until queue is empty' },
        { line: 13, action: 'Dequeue', message: 'Remove node from queue' },
        { line: 17, action: 'Check Neighbors', message: 'Visit all unvisited neighbors' },
        { line: 19, action: 'Enqueue', message: 'Add unvisited neighbors to queue' },
      ]
    },
    {
      id: 'dfs',
      name: 'DFS',
      category: 'graph',
      description: 'Depth-First Search traverses a graph by going as deep as possible before backtracking.',
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      pythonCode: `def dfs(graph, start, visited=None, result=None):
    """Depth-First Search algorithm (recursive)"""
    if visited is None:
        visited = set()
    if result is None:
        result = []
    
    # Mark current node as visited
    visited.add(start)
    result.append(start)
    
    # Recur for all adjacent vertices
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited, result)
    
    return result

# Iterative DFS
def dfs_iterative(graph, start):
    """Depth-First Search algorithm (iterative)"""
    stack = [start]
    visited = set()
    result = []
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack (reverse order for same traversal)
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
result = dfs(graph, 'A')
print(f"DFS traversal: {' -> '.join(result)}")`,
      mermaidFlowchart: `flowchart TD
    Start([Start]) --> Init["Create stack, add start node"]
    Init --> Loop{"Stack empty?"}
    Loop -->|Yes| End([Return result])
    Loop -->|No| Pop["Pop node from stack"]
    Pop --> Check{"Node visited?"}
    Check -->|Yes| Loop
    Check -->|No| Mark["Mark as visited"]
    Mark --> Add["Add to result"]
    Add --> Push["Push unvisited neighbors"]
    Push --> Loop`,
      executionSteps: [
        { line: 2, action: 'Initialize', message: 'Create stack and visited set' },
        { line: 8, action: 'Loop', message: 'Process nodes until stack is empty' },
        { line: 10, action: 'Pop', message: 'Remove node from stack' },
        { line: 14, action: 'Mark Visited', message: 'Mark current node as visited' },
        { line: 18, action: 'Push Neighbors', message: 'Add unvisited neighbors to stack' },
      ]
    }
  ]
};

// Helper function to get algorithm by ID
export const getAlgorithmById = (id) => {
  for (const category in algorithms) {
    const algo = algorithms[category].find(a => a.id === id);
    if (algo) return algo;
  }
  return null;
};

// Helper function to get all algorithms
export const getAllAlgorithms = () => {
  const all = [];
  for (const category in algorithms) {
    all.push(...algorithms[category]);
  }
  return all;
};

