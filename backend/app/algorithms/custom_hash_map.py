from typing import Any, Optional, List, Tuple

class HashNode:
    def __init__(self, key: str, value: Any):
        self.key: str = key
        self.value: Any = value
        self.next: Optional['HashNode'] = None


class CustomHashMap:
    """
    Custom Hash Map implementation using separate chaining for collision resolution.
    Features:
    - Polynomial rolling hash function.
    - Dynamic resizing with prime-based bucket growth.
    - Average O(1) insertion, retrieval, and deletion.
    """
    INITIAL_CAPACITY = 17
    LOAD_FACTOR_THRESHOLD = 0.75

    def __init__(self, initial_capacity: int = INITIAL_CAPACITY):
        self.capacity = initial_capacity
        self.buckets: List[Optional[HashNode]] = [None] * self.capacity
        self.size = 0

    def _hash(self, key: str) -> int:
        """Polynomial rolling hash function: h = (sum(c * 31^i)) mod capacity"""
        p = 31
        m = 10**9 + 9
        hash_val = 0
        p_pow = 1
        for char in str(key):
            hash_val = (hash_val + ord(char) * p_pow) % m
            p_pow = (p_pow * p) % m
        return hash_val % self.capacity

    def put(self, key: str, value: Any):
        """Insert or update key-value pair."""
        key_str = str(key)
        index = self._hash(key_str)
        head = self.buckets[index]

        # Check if key already exists, update if found
        curr = head
        while curr is not None:
            if curr.key == key_str:
                curr.value = value
                return
            curr = curr.next

        # Insert new node at head of chain
        new_node = HashNode(key_str, value)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.size += 1

        # Check load factor and resize if needed
        if (self.size / self.capacity) > self.LOAD_FACTOR_THRESHOLD:
            self._resize()

    def get(self, key: str, default: Any = None) -> Any:
        """Lookup value by key. Returns default if not found."""
        key_str = str(key)
        index = self._hash(key_str)
        curr = self.buckets[index]
        while curr is not None:
            if curr.key == key_str:
                return curr.value
            curr = curr.next
        return default

    def contains(self, key: str) -> bool:
        """Check if key exists in hash map."""
        return self.get(key) is not None

    def delete(self, key: str) -> bool:
        """Delete key from hash map. Returns True if found and deleted, False otherwise."""
        key_str = str(key)
        index = self._hash(key_str)
        curr = self.buckets[index]
        prev = None

        while curr is not None:
            if curr.key == key_str:
                if prev is None:
                    self.buckets[index] = curr.next
                else:
                    prev.next = curr.next
                self.size -= 1
                return True
            prev = curr
            curr = curr.next
        return False

    def _resize(self):
        """Double capacity and rehash all entries."""
        old_buckets = self.buckets
        self.capacity = self.capacity * 2 + 1
        self.buckets = [None] * self.capacity
        self.size = 0

        for head in old_buckets:
            curr = head
            while curr is not None:
                self.put(curr.key, curr.value)
                curr = curr.next

    def keys(self) -> List[str]:
        all_keys = []
        for head in self.buckets:
            curr = head
            while curr is not None:
                all_keys.append(curr.key)
                curr = curr.next
        return all_keys

    def values(self) -> List[Any]:
        all_vals = []
        for head in self.buckets:
            curr = head
            while curr is not None:
                all_vals.append(curr.value)
                curr = curr.next
        return all_vals

    def items(self) -> List[Tuple[str, Any]]:
        all_items = []
        for head in self.buckets:
            curr = head
            while curr is not None:
                all_items.append((curr.key, curr.value))
                curr = curr.next
        return all_items

    def __len__(self) -> int:
        return self.size

    def __getitem__(self, key: str) -> Any:
        val = self.get(key)
        if val is None:
            raise KeyError(key)
        return val

    def __setitem__(self, key: str, value: Any):
        self.put(key, value)
