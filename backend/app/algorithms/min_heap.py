from typing import Any, List, Optional
from dataclasses import dataclass, field

@dataclass(order=True)
class HeapItem:
    priority: float
    data: Any = field(compare=False)


class CustomMinHeap:
    """
    Array-backed binary Min-Heap implementation.
    Smallest priority item sits at the root (index 0).
    Operations:
    - insert(priority, data): O(log N)
    - peek(): O(1)
    - extract_min(): O(log N)
    """

    def __init__(self):
        self.heap: List[HeapItem] = []

    def insert(self, priority: float, data: Any):
        """Insert a new item with given priority score."""
        item = HeapItem(priority=priority, data=data)
        self.heap.append(item)
        self._sift_up(len(self.heap) - 1)

    def peek(self) -> Optional[HeapItem]:
        """Return the minimum item without removing it. Returns None if empty."""
        if not self.heap:
            return None
        return self.heap[0]

    def extract_min(self) -> Optional[HeapItem]:
        """Remove and return the minimum priority item. Returns None if empty."""
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()

        root = self.heap[0]
        # Move last element to root and sift down
        self.heap[0] = self.heap.pop()
        self._sift_down(0)
        return root

    def _sift_up(self, index: int):
        parent_index = (index - 1) // 2
        while index > 0 and self.heap[index].priority < self.heap[parent_index].priority:
            self.heap[index], self.heap[parent_index] = self.heap[parent_index], self.heap[index]
            index = parent_index
            parent_index = (index - 1) // 2

    def _sift_down(self, index: int):
        size = len(self.heap)
        while True:
            left_child = 2 * index + 1
            right_child = 2 * index + 2
            smallest = index

            if left_child < size and self.heap[left_child].priority < self.heap[smallest].priority:
                smallest = left_child

            if right_child < size and self.heap[right_child].priority < self.heap[smallest].priority:
                smallest = right_child

            if smallest != index:
                self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
                index = smallest
            else:
                break

    def is_empty(self) -> bool:
        return len(self.heap) == 0

    def __len__(self) -> int:
        return len(self.heap)
