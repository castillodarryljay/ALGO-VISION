import { SupportedLanguage, CodeImplementation } from '../types/algorithm';

export const ADDITIONAL_SEARCHING_CODE: Record<string, Record<SupportedLanguage, CodeImplementation>> = {
  'linear-search': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        linear_start: 1,
        linear_compare: 3,
        linear_found: 4,
        linear_not_found: 7,
      },
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Target found
    }
  }
  return -1; // Target absent
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        linear_start: 1,
        linear_compare: 2,
        linear_found: 3,
        linear_not_found: 4,
      },
      code: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1`,
    },
    java: {
      language: 'java',
      lineMapping: {
        linear_start: 2,
        linear_compare: 3,
        linear_found: 4,
        linear_not_found: 7,
      },
      code: `public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        linear_start: 3,
        linear_compare: 4,
        linear_found: 5,
        linear_not_found: 8,
      },
      code: `#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1;
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        linear_start: 1,
        linear_compare: 2,
        linear_found: 3,
        linear_not_found: 6,
      },
      code: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        linear_start: 2,
        linear_compare: 3,
        linear_found: 4,
        linear_not_found: 7,
      },
      code: `public class LinearSearcher {
    public static int Search(int[] arr, int target) {
        for (int i = 0; i < arr.Length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
    },
  },

  'jump-search': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        jump_start: 1,
        jump_step: 6,
        jump_linear_scan: 11,
        jump_found: 13,
        jump_not_found: 17,
      },
      code: `function jumpSearch(arr, target) {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }

  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }

  if (arr[prev] === target) return prev;
  return -1;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        jump_start: 2,
        jump_step: 7,
        jump_linear_scan: 12,
        jump_found: 14,
        jump_not_found: 17,
      },
      code: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    if arr[prev] == target:
        return prev
    return -1`,
    },
    java: {
      language: 'java',
      lineMapping: {
        jump_start: 2,
        jump_step: 7,
        jump_linear_scan: 13,
        jump_found: 18,
        jump_not_found: 19,
      },
      code: `public class JumpSearch {
    public static int jumpSearch(int[] arr, int target) {
        int n = arr.length;
        int step = (int)Math.floor(Math.sqrt(n));
        int prev = 0;

        while (arr[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int)Math.floor(Math.sqrt(n));
            if (prev >= n) return -1;
        }

        while (arr[prev] < target) {
            prev++;
            if (prev == Math.min(step, n)) return -1;
        }

        if (arr[prev] == target) return prev;
        return -1;
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        jump_start: 4,
        jump_step: 8,
        jump_linear_scan: 14,
        jump_found: 19,
        jump_not_found: 20,
      },
      code: `#include <vector>
#include <cmath>
#include <algorithm>

int jumpSearch(const std::vector<int>& arr, int target) {
    int n = arr.size();
    int step = std::sqrt(n);
    int prev = 0;

    while (arr[std::min(step, n) - 1] < target) {
        prev = step;
        step += std::sqrt(n);
        if (prev >= n) return -1;
    }

    while (arr[prev] < target) {
        prev++;
        if (prev == std::min(step, n)) return -1;
    }

    if (arr[prev] == target) return prev;
    return -1;
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        jump_start: 3,
        jump_step: 7,
        jump_linear_scan: 13,
        jump_found: 18,
        jump_not_found: 19,
      },
      code: `#include <math.h>

int jumpSearch(int arr[], int n, int target) {
    int step = sqrt(n);
    int prev = 0;

    while (arr[(step < n ? step : n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }

    while (arr[prev] < target) {
        prev++;
        if (prev == (step < n ? step : n)) return -1;
    }

    if (arr[prev] == target) return prev;
    return -1;
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        jump_start: 3,
        jump_step: 8,
        jump_linear_scan: 14,
        jump_found: 19,
        jump_not_found: 20,
      },
      code: `using System;

public class JumpSearcher {
    public static int JumpSearch(int[] arr, int target) {
        int n = arr.Length;
        int step = (int)Math.Floor(Math.Sqrt(n));
        int prev = 0;

        while (arr[Math.Min(step, n) - 1] < target) {
            prev = step;
            step += (int)Math.Floor(Math.Sqrt(n));
            if (prev >= n) return -1;
        }

        while (arr[prev] < target) {
            prev++;
            if (prev == Math.Min(step, n)) return -1;
        }

        if (arr[prev] == target) return prev;
        return -1;
    }
}`,
    },
  },

  'interpolation-search': {
    javascript: {
      language: 'javascript',
      lineMapping: {
        interp_start: 1,
        interp_probe: 6,
        interp_found: 8,
        interp_not_found: 15,
      },
      code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) return arr[low] === target ? low : -1;
    // Estimate probe position
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    },
    python: {
      language: 'python',
      lineMapping: {
        interp_start: 1,
        interp_probe: 6,
        interp_found: 8,
        interp_not_found: 13,
      },
      code: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1
        pos = low + int(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
    },
    java: {
      language: 'java',
      lineMapping: {
        interp_start: 2,
        interp_probe: 6,
        interp_found: 8,
        interp_not_found: 14,
      },
      code: `public class InterpolationSearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            if (low == high) return arr[low] == target ? low : -1;
            int pos = low + (((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
            if (arr[pos] == target) return pos;
            if (arr[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
}`,
    },
    cpp: {
      language: 'cpp',
      lineMapping: {
        interp_start: 3,
        interp_probe: 6,
        interp_found: 8,
        interp_not_found: 14,
      },
      code: `#include <vector>

int interpolationSearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) return arr[low] == target ? low : -1;
        int pos = low + (((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    },
    c: {
      language: 'c',
      lineMapping: {
        interp_start: 1,
        interp_probe: 4,
        interp_found: 6,
        interp_not_found: 12,
      },
      code: `int interpolationSearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) return arr[low] == target ? low : -1;
        int pos = low + (((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    },
    csharp: {
      language: 'csharp',
      lineMapping: {
        interp_start: 2,
        interp_probe: 6,
        interp_found: 8,
        interp_not_found: 14,
      },
      code: `public class InterpolationSearcher {
    public static int Search(int[] arr, int target) {
        int low = 0, high = arr.Length - 1;
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            if (low == high) return arr[low] == target ? low : -1;
            int pos = low + (((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
            if (arr[pos] == target) return pos;
            if (arr[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
}`,
    },
  },
};
