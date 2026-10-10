import { LearningLesson } from '../types/learning';

export const LEARNING_LESSONS: LearningLesson[] = [
  {
    id: 'lesson-bubble-sort',
    algorithmId: 'bubble-sort',
    title: 'Bubble Sort Fundamentals',
    category: 'Sorting',
    difficulty: 'Beginner',
    overview: 'Bubble Sort is the foundational comparison sort taught to understand looping invariants, adjacent pair comparisons, and swap mechanisms.',
    coreIdea: 'In each pass, compare adjacent items (arr[j] and arr[j+1]). If the left item is greater than the right item, swap them. By the end of pass k, the k-th largest element is guaranteed to have "bubbled" up to its final position at the end of the array.',
    stepByStepExplanation: [
      '1. Start at the beginning of the list with indices 0 and 1.',
      '2. Compare elements: if arr[j] > arr[j+1], swap them.',
      '3. Move forward one position and repeat comparison until the end of the unsorted segment.',
      '4. At the end of the pass, the largest remaining element is locked in place.',
      '5. Optimization: If an entire pass completes without a single swap, break early because the list is already sorted.'
    ],
    complexityAnalysis: {
      time: 'Best: O(n) with early break; Average & Worst: O(n²)',
      space: 'O(1) auxiliary space (in-place)',
      intuition: 'Requires (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons in the worst case (reverse order).',
    },
    advantages: [
      'Simple to understand and implement.',
      'In-place with zero auxiliary heap memory required.',
      'Stable sort: preserves relative order of duplicate elements.',
      'Detects already sorted arrays in O(n) time with swap flag.'
    ],
    limitations: [
      'O(n²) time complexity makes it unusable for large real-world datasets.',
      'Performs an excessive number of write operations compared to Selection Sort.'
    ],
    commonMistakes: [
      'Forgetting the early termination boolean flag, causing already sorted arrays to run in O(n²) time.',
      'Running inner loop bounds up to n-1 instead of n-i-1, repeating redundant comparisons on already sorted elements.'
    ],
    relatedAlgorithms: ['Insertion Sort', 'Selection Sort', 'Cocktail Shaker Sort'],
    questions: [
      {
        id: 'q1',
        question: 'What is the best-case time complexity of an optimized Bubble Sort when the input is already sorted?',
        options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctIndex: 1,
        explanation: 'With a boolean swapped flag, if no swaps occur during the very first pass, the algorithm terminates immediately after examining all n elements in O(n) time.'
      },
      {
        id: 'q2',
        question: 'Is Bubble Sort an in-place and stable sorting algorithm?',
        options: ['Neither', 'In-place but unstable', 'Not in-place but stable', 'Both in-place and stable'],
        correctIndex: 3,
        explanation: 'Bubble Sort only requires O(1) auxiliary memory (a temporary swap variable), and it never swaps elements with identical values (using strict >), making it both in-place and stable.'
      }
    ]
  },
  {
    id: 'lesson-merge-sort',
    algorithmId: 'merge-sort',
    title: 'Divide & Conquer: Merge Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    overview: 'Merge Sort is a classic Divide and Conquer algorithm that guarantees deterministic O(n log n) runtime across all inputs.',
    coreIdea: 'Recursively halve the problem size until you reach single-element subarrays (which are inherently sorted), then merge two sorted halves into one sorted whole using two pointers.',
    stepByStepExplanation: [
      '1. Divide: Compute midpoint mid = floor((low + high) / 2).',
      '2. Conquer: Recursively call mergeSort on left half [low..mid] and right half [mid+1..high].',
      '3. Base Case: When low >= high, the subarray has 1 or 0 elements and is already sorted.',
      '4. Combine: Merge the two sorted arrays by comparing front elements and copying into an auxiliary array.',
      '5. Copy Back: Transfer merged elements from the auxiliary array back into the original array.'
    ],
    complexityAnalysis: {
      time: 'Best, Average, Worst: Θ(n log n)',
      space: 'O(n) auxiliary space for merging buffer + O(log n) call stack frames',
      intuition: 'The recursion tree has depth log₂(n), and at every level of the tree, merging all segments takes total linear O(n) time.',
    },
    advantages: [
      'Guaranteed O(n log n) worst-case performance (unlike Quick Sort worst-case O(n²)).',
      'Stable sort: retains initial sequence order for equivalent values.',
      'Excels at sorting linked lists without needing extra random-access array memory.',
      'Well suited for external sorting when data exceeds RAM capacity.'
    ],
    limitations: [
      'Requires O(n) auxiliary memory for arrays, which is costly in memory-constrained systems.',
      'Higher constant factors than Quick Sort for typical cache-friendly in-memory workloads.'
    ],
    commonMistakes: [
      'Using mid = (low + high) / 2 without guarding against 32-bit integer overflow in languages like Java or C++ (prefer low + (high - low) / 2).',
      'Forgetting to copy remaining elements from either the left or right subarray after the main merge loop finishes.'
    ],
    relatedAlgorithms: ['Quick Sort', 'TimSort', 'External Merge Sort'],
    questions: [
      {
        id: 'q1',
        question: 'What is the auxiliary space complexity of standard array Merge Sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Standard array merge sort requires an auxiliary array of size n to hold the merged elements before writing them back.'
      },
      {
        id: 'q2',
        question: 'Under which input condition does Merge Sort exhibit its worst-case time complexity?',
        options: ['Reverse sorted input', 'Random input', 'All inputs (always Θ(n log n))', 'Input with many duplicates'],
        correctIndex: 2,
        explanation: 'Merge Sort splits the input array strictly in half and merges all elements regardless of initial arrangement, always taking Θ(n log n) time.'
      }
    ]
  },
  {
    id: 'lesson-quick-sort',
    algorithmId: 'quick-sort',
    title: 'Partitioning: Quick Sort',
    category: 'Sorting',
    difficulty: 'Advanced',
    overview: 'Quick Sort is one of the most widely used general-purpose sorting algorithms in production standard libraries due to its exceptional cache locality and in-place efficiency.',
    coreIdea: 'Pick an element as pivot, partition the remaining elements so elements less than or equal to pivot are to its left and elements greater are to its right, then recursively sort the partitions.',
    stepByStepExplanation: [
      '1. Choose a pivot element (e.g. Lomuto uses the last element).',
      '2. Scan from left to right, maintaining pointer i representing the boundary of elements <= pivot.',
      '3. When an element <= pivot is found, increment i and swap arr[i] with arr[j].',
      '4. At the end, swap arr[i+1] with the pivot to position the pivot in its final sorted index.',
      '5. Recursively apply Quick Sort to the left and right partitions.'
    ],
    complexityAnalysis: {
      time: 'Best & Average: O(n log n); Worst: O(n²)',
      space: 'O(log n) call stack frames (in-place array mutation)',
      intuition: 'If partitions are balanced, depth is log n. If pivot is consistently the minimum or maximum (e.g. sorted array with end pivot), depth degrades to n.',
    },
    advantages: [
      'Extremely fast in practice with tiny constant factors.',
      'Sorts in-place with O(log n) auxiliary stack space.',
      'High cache efficiency because it traverses contiguous memory.'
    ],
    limitations: [
      'Unstable sort: may alter relative positions of duplicate keys.',
      'Degrades to O(n²) if pivot selection produces unbalanced partitions (mitigated by randomized pivot or Median-of-3).'
    ],
    commonMistakes: [
      'Always choosing the first or last element as pivot without randomizing, leading to O(n²) runtime on already-sorted arrays.',
      'Stack overflow vulnerability if tail-call optimization or sorting the smaller partition first is omitted.'
    ],
    relatedAlgorithms: ['Merge Sort', 'Heap Sort', 'Dual-Pivot Quick Sort', 'IntroSort'],
    questions: [
      {
        id: 'q1',
        question: 'What causes standard Lomuto Quick Sort with last-element pivot to degrade to O(n²)?',
        options: ['Array has negative numbers', 'Array is already sorted or reverse sorted', 'Array has power-of-two size', 'Array elements are floating point numbers'],
        correctIndex: 1,
        explanation: 'When the array is already sorted, choosing the last element yields extreme partition sizes (n-1 and 0), creating an n-level deep recursion tree and O(n²) comparisons.'
      }
    ]
  },
  {
    id: 'lesson-binary-search',
    algorithmId: 'binary-search',
    title: 'Logarithmic Search: Binary Search',
    category: 'Searching',
    difficulty: 'Beginner',
    overview: 'Binary Search is an essential search algorithm that finds the position of a target value within a sorted array in logarithmic time.',
    coreIdea: 'Compare target with middle element. If equal, search succeeds. If target is smaller, eliminate right half. If target is larger, eliminate left half. Halves search space each iteration.',
    stepByStepExplanation: [
      '1. Initialize low = 0 and high = length - 1.',
      '2. While low <= high, compute mid = low + floor((high - low) / 2).',
      '3. If arr[mid] == target, return mid.',
      '4. If arr[mid] < target, set low = mid + 1.',
      '5. If arr[mid] > target, set high = mid - 1.',
      '6. If low exceeds high, target does not exist; return -1.'
    ],
    complexityAnalysis: {
      time: 'Best: O(1); Average & Worst: O(log n)',
      space: 'O(1) iterative space',
      intuition: 'Each comparison cuts the search interval in half. N -> N/2 -> N/4 -> ... -> 1 takes log₂(n) steps.',
    },
    advantages: [
      'Logarithmic time: searches 1,000,000 items in ~20 comparisons.',
      'Extremely compact code and zero auxiliary memory.'
    ],
    limitations: [
      'Mandatory prerequisite: input MUST be sorted beforehand.',
      'Requires random access (arrays). Inefficient on standard linked lists without skip lists.'
    ],
    commonMistakes: [
      'Writing while (low < high) instead of while (low <= high), missing the target when low equals high.',
      'Using mid = (low + high) / 2 in 32-bit typed languages, leading to integer overflow bugs.'
    ],
    relatedAlgorithms: ['Ternary Search', 'Interpolation Search', 'Exponential Search'],
    questions: [
      {
        id: 'q1',
        question: 'For an array of 1,024 elements, what is the maximum number of comparisons Binary Search will make?',
        options: ['10', '11', '512', '1024'],
        correctIndex: 1,
        explanation: 'log₂(1024) = 10. With boundary checks and integer division, at most 11 comparisons are performed in the worst case.'
      }
    ]
  }
];
