// Checks A* + h2 against ground truth: a BFS from the goal gives the true
// optimal distance of every reachable state. Run with: node tests/verify.js
const Puzzle = require("../js/puzzle.js");
const { solve } = require("../js/astar.js");

const SAMPLES = 300;

const distance = new Map([[Puzzle.GOAL.join(""), 0]]);
let frontier = [Puzzle.GOAL];
let deepest = 0;
while (frontier.length) {
  deepest = distance.get(frontier[0].join(""));
  const next = [];
  for (const state of frontier) {
    const d = distance.get(state.join(""));
    for (const tile of Puzzle.adjacent(state.indexOf(0))) {
      const moved = Puzzle.slide(state, tile);
      const key = moved.join("");
      if (!distance.has(key)) {
        distance.set(key, d + 1);
        next.push(moved);
      }
    }
  }
  frontier = next;
}
console.log(`reachable states (BFS): ${distance.size}`);
console.log(`deepest state: ${deepest} moves`);

let mismatches = 0;
let maxExpanded = 0;
let maxMs = 0;
for (let i = 0; i < SAMPLES; i++) {
  const start = Puzzle.randomState();
  const result = solve(start);
  const valid =
    result.cost === distance.get(start.join("")) &&
    result.path.length === result.cost + 1 &&
    Puzzle.isGoal(result.path[result.path.length - 1]);
  if (!valid) mismatches++;
  maxExpanded = Math.max(maxExpanded, result.expanded);
  maxMs = Math.max(maxMs, result.ms);
}

console.log(`random starts solved: ${SAMPLES}`);
console.log(`non-optimal or invalid results: ${mismatches}`);
console.log(`max nodes expanded: ${maxExpanded}, max time: ${maxMs} ms`);
process.exit(mismatches === 0 ? 0 : 1);
