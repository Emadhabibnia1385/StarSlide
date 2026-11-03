(function (global) {
  const Puzzle = typeof module !== "undefined" ? require("./puzzle.js") : global.Puzzle;

  // Binary min-heap ordered by f, ties broken in favour of the lower h.
  class MinHeap {
    constructor() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    less(a, b) {
      return a.f < b.f || (a.f === b.f && a.h < b.h);
    }
    push(node) {
      const items = this.items;
      let i = items.push(node) - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (!this.less(items[i], items[parent])) break;
        [items[i], items[parent]] = [items[parent], items[i]];
        i = parent;
      }
    }
    pop() {
      const items = this.items;
      const top = items[0];
      const last = items.pop();
      if (items.length > 0) {
        items[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1;
          const r = l + 1;
          let smallest = i;
          if (l < items.length && this.less(items[l], items[smallest])) smallest = l;
          if (r < items.length && this.less(items[r], items[smallest])) smallest = r;
          if (smallest === i) break;
          [items[i], items[smallest]] = [items[smallest], items[i]];
          i = smallest;
        }
      }
      return top;
    }
  }

  // A* search with the h2 (Manhattan distance) heuristic.
  // Returns the optimal path as a list of states (start .. goal) plus search stats.
  function solve(start) {
    const t0 = Date.now();
    const startKey = start.join("");
    const startH = Puzzle.h2(start);
    const open = new MinHeap();
    const bestG = new Map([[startKey, 0]]);
    const closed = new Set();
    let expanded = 0;
    let generated = 1;

    open.push({ state: start, key: startKey, g: 0, h: startH, f: startH, parent: null });

    while (open.size > 0) {
      const node = open.pop();
      if (closed.has(node.key)) continue;
      closed.add(node.key);
      expanded++;

      if (Puzzle.isGoal(node.state)) {
        const path = [];
        for (let n = node; n; n = n.parent) path.unshift(n.state);
        return { path, cost: node.g, expanded, generated, ms: Date.now() - t0 };
      }

      const blank = node.state.indexOf(0);
      for (const tileIndex of Puzzle.adjacent(blank)) {
        const next = Puzzle.slide(node.state, tileIndex);
        const key = next.join("");
        const g = node.g + 1;
        if (closed.has(key) || g >= (bestG.get(key) ?? Infinity)) continue;
        bestG.set(key, g);
        const h = Puzzle.h2(next);
        open.push({ state: next, key, g, h, f: g + h, parent: node });
        generated++;
      }
    }
    return null;
  }

  const api = { solve };
  if (typeof module !== "undefined") module.exports = api;
  else global.AStar = api;
})(this);
