import { SupportedLanguage, CodeImplementation } from '../types/algorithm';
import { ADDITIONAL_SORTING_CODE } from './sortingCode';
import { ADDITIONAL_SEARCHING_CODE } from './searchingCode';

export const CODE_REGISTRY: Record<string, Record<SupportedLanguage, CodeImplementation>> = {
  'bubble-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        bubble_start: 1,
        bubble_compare: 5,
        bubble_swap: 7,
        bubble_pass_done: 11,
        bubble_complete: 16,
      },
      code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap adjacent elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    // If no swaps occurred, array is already sorted
    if (!swapped) break;
  }
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        bubble_start: 1,
        bubble_compare: 5,
        bubble_swap: 7,
        bubble_pass_done: 10,
        bubble_complete: 12,
      },
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # Early exit if no swaps in this pass
        if not swapped:
            break
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        bubble_start: 2,
        bubble_compare: 6,
        bubble_swap: 8,
        bubble_pass_done: 13,
        bubble_complete: 17,
      },
      code: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        bubble_start: 2,
        bubble_compare: 5,
        bubble_swap: 6,
        bubble_pass_done: 10,
        bubble_complete: 13,
      },
      code: `#include <vector>
#include <algorithm>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        bubble_start: 3,
        bubble_compare: 6,
        bubble_swap: 8,
        bubble_pass_done: 13,
        bubble_complete: 16,
      },
      code: `#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        bubble_start: 3,
        bubble_compare: 7,
        bubble_swap: 9,
        bubble_pass_done: 14,
        bubble_complete: 18,
      },
      code: `using System;

public class Sorter {
    public static void BubbleSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    },
  },

  'merge-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        merge_start: 1,
        merge_base_case: 2,
        merge_split: 5,
        merge_combine: 12,
        merge_compare: 16,
        merge_append: 17,
        merge_copy_rem: 22,
        merge_write_back: 26,
        merge_done: 28,
        merge_complete: 30,
      },
      code: `function mergeSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return;

  // 1. Divide at midpoint
  const mid = Math.floor((low + high) / 2);

  // 2. Recursively divide both halves
  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);

  // 3. Conquer by merging
  merge(arr, low, mid, high);
}

function merge(arr, low, mid, high) {
  const temp = [];
  let i = low;
  let j = mid + 1;

  while (i <= mid && j <= high) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) temp.push(arr[i++]);
  while (j <= high) temp.push(arr[j++]);

  for (let k = 0; k < temp.length; k++) {
    arr[low + k] = temp[k];
  }
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        merge_start: 1,
        merge_base_case: 2,
        merge_split: 5,
        merge_combine: 9,
        merge_compare: 14,
        merge_append: 15,
        merge_copy_rem: 20,
        merge_write_back: 23,
        merge_done: 25,
        merge_complete: 27,
      },
      code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    },
    java: {
      language: 'java',
      lineMapping: {
        merge_start: 2,
        merge_base_case: 3,
        merge_split: 5,
        merge_combine: 12,
        merge_compare: 18,
        merge_append: 19,
        merge_copy_rem: 25,
        merge_write_back: 29,
        merge_done: 31,
        merge_complete: 33,
      },
      code: `public class MergeSort {
    public static void mergeSort(int[] arr, int low, int high) {
        if (low >= high) return;

        int mid = low + (high - low) / 2;
        mergeSort(arr, low, mid);
        mergeSort(arr, mid + 1, high);

        merge(arr, low, mid, high);
    }

    private static void merge(int[] arr, int low, int mid, int high) {
        int[] temp = new int[high - low + 1];
        int i = low, j = mid + 1, k = 0;

        while (i <= mid && j <= high) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        while (i <= mid) temp[k++] = arr[i++];
        while (j <= high) temp[k++] = arr[j++];

        for (int p = 0; p < temp.length; p++) {
            arr[low + p] = temp[p];
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        merge_start: 3,
        merge_base_case: 4,
        merge_split: 6,
        merge_combine: 12,
        merge_compare: 17,
        merge_append: 18,
        merge_copy_rem: 23,
        merge_write_back: 26,
        merge_done: 28,
        merge_complete: 30,
      },
      code: `#include <vector>

void merge(std::vector<int>& arr, int low, int mid, int high) {
    std::vector<int> temp;
    int i = low, j = mid + 1;

    while (i <= mid && j <= high) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }

    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= high) temp.push_back(arr[j++]);

    for (size_t k = 0; k < temp.size(); k++) {
        arr[low + k] = temp[k];
    }
}

void mergeSort(std::vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;
    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);
    merge(arr, low, mid, high);
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        merge_start: 3,
        merge_base_case: 4,
        merge_split: 6,
        merge_combine: 12,
        merge_compare: 18,
        merge_append: 19,
        merge_copy_rem: 24,
        merge_write_back: 28,
        merge_done: 30,
        merge_complete: 32,
      },
      code: `#include <stdlib.h>

void merge(int arr[], int low, int mid, int high) {
    int size = high - low + 1;
    int *temp = (int*)malloc(size * sizeof(int));
    int i = low, j = mid + 1, k = 0;

    while (i <= mid && j <= high) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= high) temp[k++] = arr[j++];

    for (int p = 0; p < size; p++) arr[low + p] = temp[p];
    free(temp);
}

void mergeSort(int arr[], int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;
    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);
    merge(arr, low, mid, high);
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        merge_start: 3,
        merge_base_case: 4,
        merge_split: 6,
        merge_combine: 12,
        merge_compare: 17,
        merge_append: 18,
        merge_copy_rem: 23,
        merge_write_back: 26,
        merge_done: 28,
        merge_complete: 30,
      },
      code: `public class MergeSorter {
    public static void MergeSort(int[] arr, int low, int high) {
        if (low >= high) return;
        int mid = low + (high - low) / 2;
        MergeSort(arr, low, mid);
        MergeSort(arr, mid + 1, high);
        Merge(arr, low, mid, high);
    }

    private static void Merge(int[] arr, int low, int mid, int high) {
        int[] temp = new int[high - low + 1];
        int i = low, j = mid + 1, k = 0;

        while (i <= mid && j <= high) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }

        while (i <= mid) temp[k++] = arr[i++];
        while (j <= high) temp[k++] = arr[j++];

        for (int p = 0; p < temp.Length; p++) {
            arr[low + p] = temp[p];
        }
    }
}`,
    },
  },

  'quick-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        quick_start: 1,
        quick_base_case: 2,
        quick_pivot_select: 8,
        quick_compare: 12,
        quick_swap_elements: 14,
        quick_pivot_place: 18,
        quick_complete: 24,
      },
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pIdx = partition(arr, low, high);
    quickSort(arr, low, pIdx - 1);
    quickSort(arr, pIdx + 1, high);
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        quick_start: 1,
        quick_base_case: 2,
        quick_pivot_select: 8,
        quick_compare: 11,
        quick_swap_elements: 13,
        quick_pivot_place: 16,
        quick_complete: 20,
      },
      code: `def quick_sort(arr, low, high):
    if low < high:
        p_idx = partition(arr, low, high)
        quick_sort(arr, low, p_idx - 1)
        quick_sort(arr, p_idx + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    },
    java: {
      language: 'java',
      lineMapping: {
        quick_start: 2,
        quick_base_case: 3,
        quick_pivot_select: 10,
        quick_compare: 13,
        quick_swap_elements: 15,
        quick_pivot_place: 20,
        quick_complete: 25,
      },
      code: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        quick_start: 3,
        quick_base_case: 4,
        quick_pivot_select: 10,
        quick_compare: 13,
        quick_swap_elements: 15,
        quick_pivot_place: 19,
        quick_complete: 23,
      },
      code: `#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        quick_start: 3,
        quick_base_case: 4,
        quick_pivot_select: 10,
        quick_compare: 14,
        quick_swap_elements: 16,
        quick_pivot_place: 21,
        quick_complete: 25,
      },
      code: `void swap(int* a, int* b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        quick_start: 2,
        quick_base_case: 3,
        quick_pivot_select: 9,
        quick_compare: 12,
        quick_swap_elements: 14,
        quick_pivot_place: 19,
        quick_complete: 23,
      },
      code: `public class QuickSorter {
    public static void QuickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = Partition(arr, low, high);
            QuickSort(arr, low, pi - 1);
            QuickSort(arr, pi + 1, high);
        }
    }

    private static int Partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                (arr[i], arr[j]) = (arr[j], arr[i]);
            }
        }
        (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
        return i + 1;
    }
}`,
    },
  },

  'binary-search': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        binary_start: 1,
        binary_calc_mid: 5,
        binary_found: 8,
        binary_shift_right: 10,
        binary_shift_left: 12,
        binary_not_found: 15,
      },
      code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid; // Target found
    } else if (arr[mid] < target) {
      low = mid + 1; // Discard left half
    } else {
      high = mid - 1; // Discard right half
    }
  }

  return -1; // Target not found
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        binary_start: 1,
        binary_calc_mid: 4,
        binary_found: 6,
        binary_shift_right: 8,
        binary_shift_left: 10,
        binary_not_found: 12,
      },
      code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    },
    java: {
      language: 'java',
      lineMapping: {
        binary_start: 2,
        binary_calc_mid: 6,
        binary_found: 8,
        binary_shift_right: 10,
        binary_shift_left: 12,
        binary_not_found: 15,
      },
      code: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        binary_start: 3,
        binary_calc_mid: 6,
        binary_found: 8,
        binary_shift_right: 10,
        binary_shift_left: 12,
        binary_not_found: 15,
      },
      code: `#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        binary_start: 2,
        binary_calc_mid: 5,
        binary_found: 7,
        binary_shift_right: 9,
        binary_shift_left: 11,
        binary_not_found: 14,
      },
      code: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        binary_start: 2,
        binary_calc_mid: 5,
        binary_found: 7,
        binary_shift_right: 9,
        binary_shift_left: 11,
        binary_not_found: 14,
      },
      code: `public class Searcher {
    public static int BinarySearch(int[] arr, int target) {
        int low = 0, high = arr.Length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
    },
  },
  ...ADDITIONAL_SORTING_CODE,
  ...ADDITIONAL_SEARCHING_CODE,
};

// Generic code lookup for any algorithm and language
export function getAlgorithmCode(algoId: string, lang: SupportedLanguage): CodeImplementation | null {
  if (CODE_REGISTRY[algoId] && CODE_REGISTRY[algoId][lang]) {
    return CODE_REGISTRY[algoId][lang];
  }
  return null;
}

