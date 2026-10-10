import { SupportedLanguage, CodeImplementation } from '../types/algorithm';

export const ADDITIONAL_SORTING_CODE: Record<string, Record<SupportedLanguage, CodeImplementation>> = {
  'selection-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        select_start: 1,
        select_find_min: 4,
        select_compare: 6,
        select_swap: 11,
        select_mark_sorted: 15,
        select_complete: 17,
      },
      code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        select_start: 1,
        select_find_min: 3,
        select_compare: 5,
        select_swap: 8,
        select_mark_sorted: 10,
        select_complete: 11,
      },
      code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        select_start: 2,
        select_find_min: 4,
        select_compare: 6,
        select_swap: 11,
        select_mark_sorted: 16,
        select_complete: 18,
      },
      code: `public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        select_start: 3,
        select_find_min: 5,
        select_compare: 7,
        select_swap: 11,
        select_mark_sorted: 14,
        select_complete: 16,
      },
      code: `#include <vector>
#include <algorithm>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        select_start: 2,
        select_find_min: 4,
        select_compare: 6,
        select_swap: 11,
        select_mark_sorted: 16,
        select_complete: 18,
      },
      code: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        select_start: 2,
        select_find_min: 4,
        select_compare: 6,
        select_swap: 11,
        select_mark_sorted: 14,
        select_complete: 16,
      },
      code: `public class SelectionSorter {
    public static void SelectionSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);
            }
        }
    }
}`,
    },
  },

  'insertion-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        insert_start: 1,
        insert_pick_key: 3,
        insert_compare: 6,
        insert_shift: 7,
        insert_place: 11,
        insert_complete: 14,
      },
      code: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        insert_start: 1,
        insert_pick_key: 3,
        insert_compare: 5,
        insert_shift: 6,
        insert_place: 8,
        insert_complete: 9,
      },
      code: `def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        insert_start: 2,
        insert_pick_key: 4,
        insert_compare: 6,
        insert_shift: 7,
        insert_place: 10,
        insert_complete: 13,
      },
      code: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        insert_start: 2,
        insert_pick_key: 4,
        insert_compare: 6,
        insert_shift: 7,
        insert_place: 10,
        insert_complete: 13,
      },
      code: `#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        insert_start: 2,
        insert_pick_key: 3,
        insert_compare: 5,
        insert_shift: 6,
        insert_place: 9,
        insert_complete: 12,
      },
      code: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        insert_start: 2,
        insert_pick_key: 4,
        insert_compare: 6,
        insert_shift: 7,
        insert_place: 10,
        insert_complete: 13,
      },
      code: `public class InsertionSorter {
    public static void InsertionSort(int[] arr) {
        int n = arr.Length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    },
  },

  'heap-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        heap_start: 1,
        heap_built: 4,
        heap_extract: 9,
        heap_heapify: 18,
        heap_complete: 13,
      },
      code: `function heapSort(arr) {
  const n = arr.length;
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        heap_start: 1,
        heap_built: 4,
        heap_extract: 8,
        heap_heapify: 17,
        heap_complete: 11,
      },
      code: `def heap_sort(arr):
    n = len(arr)
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    },
    java: {
      language: 'java',
      lineMapping: {
        heap_start: 2,
        heap_built: 4,
        heap_extract: 9,
        heap_heapify: 20,
        heap_complete: 14,
      },
      code: `public class HeapSort {
    public static void heapSort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
            heapify(arr, n, largest);
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        heap_start: 3,
        heap_built: 5,
        heap_extract: 10,
        heap_heapify: 19,
        heap_complete: 14,
      },
      code: `#include <vector>
#include <algorithm>

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        heap_start: 3,
        heap_built: 5,
        heap_extract: 10,
        heap_heapify: 18,
        heap_complete: 14,
      },
      code: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        heap_start: 2,
        heap_built: 4,
        heap_extract: 8,
        heap_heapify: 17,
        heap_complete: 12,
      },
      code: `public class HeapSorter {
    public static void HeapSort(int[] arr) {
        int n = arr.Length;
        for (int i = n / 2 - 1; i >= 0; i--) Heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            (arr[0], arr[i]) = (arr[i], arr[0]);
            Heapify(arr, i, 0);
        }
    }

    private static void Heapify(int[] arr, int n, int i) {
        int largest = i;
        int l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            (arr[i], arr[largest]) = (arr[largest], arr[i]);
            Heapify(arr, n, largest);
        }
    }
}`,
    },
  },

  'counting-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        counting_start: 1,
        counting_init_freq: 5,
        counting_tally: 7,
        counting_place: 15,
        counting_complete: 20,
      },
      code: `function countingSort(arr) {
  if (arr.length <= 1) return arr;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  for (const num of arr) count[num - min]++;
  for (let i = 1; i < range; i++) count[i] += count[i - 1];

  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        counting_start: 1,
        counting_init_freq: 5,
        counting_tally: 6,
        counting_place: 12,
        counting_complete: 15,
      },
      code: `def counting_sort(arr):
    if len(arr) <= 1: return arr
    min_val, max_val = min(arr), max(arr)
    count = [0] * (max_val - min_val + 1)
    for x in arr:
        count[x - min_val] += 1
    for i in range(1, len(count)):
        count[i] += count[i - 1]
    output = [0] * len(arr)
    for x in reversed(arr):
        output[count[x - min_val] - 1] = x
        count[x - min_val] -= 1
    return output`,
    },
    java: {
      language: 'java',
      lineMapping: {
        counting_start: 2,
        counting_init_freq: 7,
        counting_tally: 9,
        counting_place: 16,
        counting_complete: 21,
      },
      code: `public class CountingSort {
    public static void countingSort(int[] arr) {
        if (arr.length <= 1) return;
        int min = arr[0], max = arr[0];
        for (int v : arr) { if (v < min) min = v; if (v > max) max = v; }
        int range = max - min + 1;
        int[] count = new int[range];
        for (int v : arr) count[v - min]++;
        for (int i = 1; i < range; i++) count[i] += count[i - 1];
        int[] out = new int[arr.length];
        for (int i = arr.length - 1; i >= 0; i--) {
            out[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }
        System.arraycopy(out, 0, arr, 0, arr.length);
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        counting_start: 3,
        counting_init_freq: 7,
        counting_tally: 9,
        counting_place: 16,
        counting_complete: 21,
      },
      code: `#include <vector>
#include <algorithm>

void countingSort(std::vector<int>& arr) {
    if (arr.size() <= 1) return;
    auto [minIt, maxIt] = std::minmax_element(arr.begin(), arr.end());
    int min = *minIt, max = *maxIt;
    std::vector<int> count(max - min + 1, 0);
    for (int x : arr) count[x - min]++;
    for (size_t i = 1; i < count.size(); i++) count[i] += count[i - 1];
    std::vector<int> out(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        out[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    arr = out;
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        counting_start: 3,
        counting_init_freq: 9,
        counting_tally: 11,
        counting_place: 17,
        counting_complete: 23,
      },
      code: `#include <stdlib.h>

void countingSort(int arr[], int n) {
    if (n <= 1) return;
    int min = arr[0], max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }
    int range = max - min + 1;
    int *count = (int*)calloc(range, sizeof(int));
    for (int i = 0; i < n; i++) count[arr[i] - min]++;
    for (int i = 1; i < range; i++) count[i] += count[i - 1];
    int *out = (int*)malloc(n * sizeof(int));
    for (int i = n - 1; i >= 0; i--) {
        out[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (int i = 0; i < n; i++) arr[i] = out[i];
    free(count); free(out);
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        counting_start: 3,
        counting_init_freq: 7,
        counting_tally: 9,
        counting_place: 15,
        counting_complete: 20,
      },
      code: `using System.Linq;

public class CountingSorter {
    public static void CountingSort(int[] arr) {
        if (arr.Length <= 1) return;
        int min = arr.Min(), max = arr.Max();
        int[] count = new int[max - min + 1];
        foreach (int x in arr) count[x - min]++;
        for (int i = 1; i < count.Length; i++) count[i] += count[i - 1];
        int[] outArr = new int[arr.Length];
        for (int i = arr.Length - 1; i >= 0; i--) {
            outArr[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }
        for (int i = 0; i < arr.Length; i++) arr[i] = outArr[i];
    }
}`,
    },
  },

  'radix-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        radix_start: 1,
        radix_bucket: 7,
        radix_collect: 17,
        radix_complete: 21,
      },
      code: `function radixSort(arr) {
  if (arr.length <= 1) return arr;
  let max = Math.max(...arr.map(Math.abs));
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}

function countingSortByDigit(arr, exp) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  for (let i = 0; i < arr.length; i++) {
    const digit = Math.floor(Math.abs(arr[i]) / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(Math.abs(arr[i]) / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        radix_start: 1,
        radix_bucket: 6,
        radix_collect: 16,
        radix_complete: 19,
      },
      code: `def radix_sort(arr):
    if not arr: return arr
    max_val = max(abs(x) for x in arr)
    exp = 1
    while max_val // exp > 0:
        count = [0] * 10
        output = [0] * len(arr)
        for x in arr:
            count[(abs(x) // exp) % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for x in reversed(arr):
            digit = (abs(x) // exp) % 10
            output[count[digit] - 1] = x
            count[digit] -= 1
        arr[:] = output
        exp *= 10
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        radix_start: 2,
        radix_bucket: 9,
        radix_collect: 19,
        radix_complete: 24,
      },
      code: `public class RadixSort {
    public static void radixSort(int[] arr) {
        if (arr.length <= 1) return;
        int max = 0;
        for (int v : arr) if (Math.abs(v) > max) max = Math.abs(v);
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countSort(arr, exp);
        }
    }

    private static void countSort(int[] arr, int exp) {
        int[] output = new int[arr.length];
        int[] count = new int[10];
        for (int v : arr) count[(Math.abs(v) / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = arr.length - 1; i >= 0; i--) {
            int digit = (Math.abs(arr[i]) / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        System.arraycopy(output, 0, arr, 0, arr.length);
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        radix_start: 3,
        radix_bucket: 10,
        radix_collect: 19,
        radix_complete: 24,
      },
      code: `#include <vector>
#include <cmath>

void countSort(std::vector<int>& arr, int exp) {
    std::vector<int> output(arr.size());
    int count[10] = {0};
    for (int x : arr) count[(std::abs(x) / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = arr.size() - 1; i >= 0; i--) {
        int digit = (std::abs(arr[i]) / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    arr = output;
}

void radixSort(std::vector<int>& arr) {
    if (arr.size() <= 1) return;
    int max = 0;
    for (int x : arr) if (std::abs(x) > max) max = std::abs(x);
    for (int exp = 1; max / exp > 0; exp *= 10) countSort(arr, exp);
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        radix_start: 3,
        radix_bucket: 10,
        radix_collect: 20,
        radix_complete: 26,
      },
      code: `#include <stdlib.h>
#include <math.h>

void countSort(int arr[], int n, int exp) {
    int *output = (int*)malloc(n * sizeof(int));
    int count[10] = {0};
    for (int i = 0; i < n; i++) count[(abs(arr[i]) / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int digit = (abs(arr[i]) / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
    free(output);
}

void radixSort(int arr[], int n) {
    if (n <= 1) return;
    int max = 0;
    for (int i = 0; i < n; i++) if (abs(arr[i]) > max) max = abs(arr[i]);
    for (int exp = 1; max / exp > 0; exp *= 10) countSort(arr, n, exp);
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        radix_start: 2,
        radix_bucket: 9,
        radix_collect: 18,
        radix_complete: 23,
      },
      code: `public class RadixSorter {
    public static void RadixSort(int[] arr) {
        if (arr.Length <= 1) return;
        int max = 0;
        foreach (int v in arr) if (System.Math.Abs(v) > max) max = System.Math.Abs(v);
        for (int exp = 1; max / exp > 0; exp *= 10) {
            CountSort(arr, exp);
        }
    }

    private static void CountSort(int[] arr, int exp) {
        int[] output = new int[arr.Length];
        int[] count = new int[10];
        foreach (int v in arr) count[(System.Math.Abs(v) / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = arr.Length - 1; i >= 0; i--) {
            int digit = (System.Math.Abs(arr[i]) / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        for (int i = 0; i < arr.Length; i++) arr[i] = output[i];
    }
}`,
    },
  },

  'shell-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        shell_start: 1,
        shell_gap_step: 3,
        shell_compare: 7,
        shell_shift: 8,
        shell_place: 11,
        shell_complete: 15,
      },
      code: `function shellSort(arr) {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        shell_start: 1,
        shell_gap_step: 3,
        shell_compare: 8,
        shell_shift: 9,
        shell_place: 11,
        shell_complete: 14,
      },
      code: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        shell_start: 2,
        shell_gap_step: 4,
        shell_compare: 8,
        shell_shift: 9,
        shell_place: 12,
        shell_complete: 16,
      },
      code: `public class ShellSort {
    public static void shellSort(int[] arr) {
        int n = arr.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = temp;
            }
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        shell_start: 2,
        shell_gap_step: 4,
        shell_compare: 8,
        shell_shift: 9,
        shell_place: 12,
        shell_complete: 16,
      },
      code: `#include <vector>

void shellSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        shell_start: 1,
        shell_gap_step: 2,
        shell_compare: 6,
        shell_shift: 7,
        shell_place: 10,
        shell_complete: 13,
      },
      code: `void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        shell_start: 2,
        shell_gap_step: 4,
        shell_compare: 8,
        shell_shift: 9,
        shell_place: 12,
        shell_complete: 16,
      },
      code: `public class ShellSorter {
    public static void ShellSort(int[] arr) {
        int n = arr.Length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = temp;
            }
        }
    }
}`,
    },
  },

  'bucket-sort': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        bucket_start: 1,
        bucket_allocate: 5,
        bucket_insert: 8,
        bucket_gather: 15,
        bucket_complete: 20,
      },
      code: `function bucketSort(arr, bucketCount = 5) {
  if (arr.length <= 1) return arr;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = (max - min) || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  for (const num of arr) {
    let idx = Math.floor(((num - min) / range) * (bucketCount - 1));
    buckets[idx].push(num);
  }

  let k = 0;
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
    for (const val of bucket) {
      arr[k++] = val;
    }
  }
  return arr;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        bucket_start: 1,
        bucket_allocate: 5,
        bucket_insert: 7,
        bucket_gather: 12,
        bucket_complete: 15,
      },
      code: `def bucket_sort(arr, bucket_count=5):
    if len(arr) <= 1: return arr
    min_v, max_v = min(arr), max(arr)
    rng = max(1, max_v - min_v)
    buckets = [[] for _ in range(bucket_count)]
    for x in arr:
        idx = min(bucket_count - 1, int(((x - min_v) / rng) * (bucket_count - 1)))
        buckets[idx].append(x)
    result = []
    for b in buckets:
        result.extend(sorted(b))
    arr[:] = result
    return arr`,
    },
    java: {
      language: 'java',
      lineMapping: {
        bucket_start: 3,
        bucket_allocate: 7,
        bucket_insert: 10,
        bucket_gather: 17,
        bucket_complete: 23,
      },
      code: `import java.util.*;

public class BucketSort {
    public static void bucketSort(int[] arr, int bucketCount) {
        if (arr.length <= 1) return;
        int min = arr[0], max = arr[0];
        for (int v : arr) { if (v < min) min = v; if (v > max) max = v; }
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i < bucketCount; i++) buckets.add(new ArrayList<>());
        double range = Math.max(1, max - min);
        for (int v : arr) {
            int idx = (int)(((v - min) / range) * (bucketCount - 1));
            buckets.get(idx).add(v);
        }
        int k = 0;
        for (List<Integer> b : buckets) {
            Collections.sort(b);
            for (int v : b) arr[k++] = v;
        }
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        bucket_start: 3,
        bucket_allocate: 7,
        bucket_insert: 10,
        bucket_gather: 17,
        bucket_complete: 23,
      },
      code: `#include <vector>
#include <algorithm>

void bucketSort(std::vector<int>& arr, int bucketCount = 5) {
    if (arr.size() <= 1) return;
    auto [minIt, maxIt] = std::minmax_element(arr.begin(), arr.end());
    int min = *minIt, max = *maxIt;
    std::vector<std::vector<int>> buckets(bucketCount);
    double range = std::max(1, max - min);
    for (int x : arr) {
        int idx = (int)(((x - min) / range) * (bucketCount - 1));
        buckets[idx].push_back(x);
    }
    int k = 0;
    for (auto& b : buckets) {
        std::sort(b.begin(), b.end());
        for (int val : b) arr[k++] = val;
    }
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        bucket_start: 2,
        bucket_allocate: 5,
        bucket_insert: 7,
        bucket_gather: 14,
        bucket_complete: 18,
      },
      code: `// Lightweight bucket sort for bounded positive integers
void bucketSort(int arr[], int n) {
    if (n <= 1) return;
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];
    int *bucket = (int*)calloc(max + 1, sizeof(int));
    for (int i = 0; i < n; i++) bucket[arr[i]]++;
    int k = 0;
    for (int i = 0; i <= max; i++) {
        while (bucket[i] > 0) {
            arr[k++] = i;
            bucket[i]--;
        }
    }
    free(bucket);
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        bucket_start: 3,
        bucket_allocate: 7,
        bucket_insert: 10,
        bucket_gather: 17,
        bucket_complete: 23,
      },
      code: `using System.Collections.Generic;
using System.Linq;

public class BucketSorter {
    public static void BucketSort(int[] arr, int bucketCount = 5) {
        if (arr.Length <= 1) return;
        int min = arr.Min(), max = arr.Max();
        List<List<int>> buckets = new List<List<int>>();
        for (int i = 0; i < bucketCount; i++) buckets.Add(new List<int>());
        double range = System.Math.Max(1, max - min);
        foreach (int v in arr) {
            int idx = (int)(((v - min) / range) * (bucketCount - 1));
            buckets[idx].Add(v);
        }
        int k = 0;
        foreach (var b in buckets) {
            b.Sort();
            foreach (int v in b) arr[k++] = v;
        }
    }
}`,
    },
  },
};
