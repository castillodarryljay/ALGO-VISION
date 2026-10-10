import { TreeNodeData, TrieNodeData, HashTableEntry } from '../../types/dataStructures';

// BST / AVL Helpers
export function getHeight(node: TreeNodeData | null | undefined): number {
  if (!node) return 0;
  return node.height ?? 1;
}

export function getBalance(node: TreeNodeData | null | undefined): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

export function rightRotate(y: TreeNodeData): TreeNodeData {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

  return x;
}

export function leftRotate(x: TreeNodeData): TreeNodeData {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

  return y;
}

export function insertAVL(node: TreeNodeData | null | undefined, value: number, steps: string[]): TreeNodeData {
  if (!node) {
    steps.push(`Created new leaf node with value ${value}.`);
    return { id: `node_${value}_${Date.now()}_${Math.random()}`, value, height: 1 };
  }

  if (value < node.value) {
    steps.push(`Value ${value} < ${node.value}, descending to left subtree.`);
    node.left = insertAVL(node.left, value, steps);
  } else if (value > node.value) {
    steps.push(`Value ${value} > ${node.value}, descending to right subtree.`);
    node.right = insertAVL(node.right, value, steps);
  } else {
    steps.push(`Value ${value} already exists in tree. Duplicate ignored.`);
    return node;
  }

  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  const balance = getBalance(node);
  node.balanceFactor = balance;

  // LL Case
  if (balance > 1 && value < (node.left?.value ?? 0)) {
    steps.push(`Left-Left imbalance detected at node ${node.value} (Balance = ${balance}). Performing Right Rotation.`);
    return rightRotate(node);
  }

  // RR Case
  if (balance < -1 && value > (node.right?.value ?? 0)) {
    steps.push(`Right-Right imbalance detected at node ${node.value} (Balance = ${balance}). Performing Left Rotation.`);
    return leftRotate(node);
  }

  // LR Case
  if (balance > 1 && value > (node.left?.value ?? 0)) {
    steps.push(`Left-Right imbalance at node ${node.value}. Rotating left on left child, then right on parent.`);
    node.left = leftRotate(node.left!);
    return rightRotate(node);
  }

  // RL Case
  if (balance < -1 && value < (node.right?.value ?? 0)) {
    steps.push(`Right-Left imbalance at node ${node.value}. Rotating right on right child, then left on parent.`);
    node.right = rightRotate(node.right!);
    return leftRotate(node);
  }

  return node;
}

export function insertBST(node: TreeNodeData | null | undefined, value: number, steps: string[]): TreeNodeData {
  if (!node) {
    steps.push(`Placed new node ${value}.`);
    return { id: `node_${value}_${Date.now()}_${Math.random()}`, value };
  }
  if (value < node.value) {
    steps.push(`Compare ${value} < ${node.value}: go left.`);
    node.left = insertBST(node.left, value, steps);
  } else if (value > node.value) {
    steps.push(`Compare ${value} > ${node.value}: go right.`);
    node.right = insertBST(node.right, value, steps);
  } else {
    steps.push(`Value ${value} already present in BST.`);
  }
  return node;
}

export function createEmptyTrie(): TrieNodeData {
  return { char: '^', isEndOfWord: false, children: {} };
}

export function insertTrie(root: TrieNodeData, word: string): string[] {
  const steps: string[] = [];
  let curr = root;
  const clean = word.toLowerCase().trim();

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (!curr.children[ch]) {
      curr.children[ch] = { char: ch, isEndOfWord: false, children: {} };
      steps.push(`Created Trie node for '${ch}'.`);
    } else {
      steps.push(`Reused existing Trie prefix node for '${ch}'.`);
    }
    curr = curr.children[ch];
  }
  curr.isEndOfWord = true;
  steps.push(`Marked '${clean[clean.length - 1]}' as end of word for "${clean}".`);
  return steps;
}

export function searchTrie(root: TrieNodeData, word: string): { found: boolean; isPrefix: boolean; steps: string[] } {
  const steps: string[] = [];
  let curr = root;
  const clean = word.toLowerCase().trim();

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (!curr.children[ch]) {
      steps.push(`Character '${ch}' not found along path. Terminating search.`);
      return { found: false, isPrefix: false, steps };
    }
    steps.push(`Matched character '${ch}'. Moving deeper.`);
    curr = curr.children[ch];
  }

  if (curr.isEndOfWord) {
    steps.push(`Word "${clean}" is fully matched and marked as complete word!`);
    return { found: true, isPrefix: true, steps };
  } else {
    steps.push(`Prefix "${clean}" matched, but it is not marked as a complete word.`);
    return { found: false, isPrefix: true, steps };
  }
}
