<div align="center">

# StarSlide ⭐

**An 8-puzzle (3×3 sliding tiles) solved with A\* search and the h2 heuristic**

<p>
  <a href="https://starslide.emadhabibnia.ir"><img src="https://img.shields.io/badge/demo-starslide.emadhabibnia.ir-34d399?style=flat-square&labelColor=0f1220" alt="Live demo"></a>
  <img src="https://img.shields.io/badge/JavaScript-vanilla-fbbf24?style=flat-square&labelColor=0f1220" alt="JavaScript">
  <img src="https://img.shields.io/badge/dependencies-0-8b5cf6?style=flat-square&labelColor=0f1220" alt="No dependencies">
  <img src="https://img.shields.io/badge/solutions-optimal-22d3ee?style=flat-square&labelColor=0f1220" alt="Optimal solutions">
</p>

<p>
  <b>English</b> &nbsp;·&nbsp; <a href="./README.fa.md">فارسی</a>
</p>

<p>
  <a href="https://starslide.emadhabibnia.ir">🎮 Live demo</a> &nbsp;·&nbsp;
  <a href="#how-it-works">How it works</a> &nbsp;·&nbsp;
  <a href="#test-results">Test results</a> &nbsp;·&nbsp;
  <a href="#run-it">Run it</a>
</p>

<br>

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/02-astar-solution.png" width="220" alt="The optimal move sequence found by A*"></td>
    <td align="center"><img src="docs/screenshots/03-playing.png" width="220" alt="Playing back the solution"></td>
    <td align="center"><img src="docs/screenshots/04-solved.png" width="220" alt="The puzzle solved"></td>
  </tr>
  <tr>
    <td align="center"><sub>Optimal path with A*</sub></td>
    <td align="center"><sub>Playing it back</sub></td>
    <td align="center"><sub>Solved</sub></td>
  </tr>
</table>

</div>

## The problem

The game starts from a **random** state. Slide tiles into the blank cell until you reach the goal. StarSlide finds the **best (shortest) sequence of moves** from the start to the goal with **A\*** and the **h2** heuristic, then shows it and plays it back.

<div align="center">

```
1 2 3
4 5 6
7 8 _
```

<sub>goal state</sub>

</div>

## Features

- Random start state that is **always solvable** (checked by counting inversions)
- Play by hand by clicking tiles, with the live **h2** value of the current state
- Solve with A\* and see the optimal move sequence (direction the blank moves)
- Auto-play or step through the solution, at an adjustable speed
- Search stats: optimal length, nodes expanded and generated, solve time
- Vanilla JavaScript: no dependencies, no server, one static page

## How it works

<div align="center">

**f(n) = g(n) + h2(n)**

</div>

- `g(n)`: number of moves from the start to node n
- `h2(n)`: sum of the Manhattan distances of every tile from its goal cell

**Why the answer is optimal.** One move slides one tile by one cell, so h2 changes by at most 1 per move. That makes h2:

- **admissible**: it never overestimates the real remaining cost
- **consistent**: `h(n) ≤ 1 + h(n′)` for every neighbour n′

With a consistent heuristic, the first time the goal leaves the open list its path is the shortest one, and no node ever has to be reopened.

```text
open  ← min-heap ordered by f = g + h2 (ties: lower h2 first)
push start with g = 0
while open is not empty:
    n ← pop the node with the lowest f
    if n is in closed: continue
    add n to closed
    if n is the goal: return the path via parent links
    for each state s reached by sliding one tile into the blank:
        g' ← g(n) + 1
        if s is in closed or g' ≥ best g known for s: skip
        push s with f = g' + h2(s)
```

The priority queue is a **min-heap**. Duplicate states are dropped with the `closed` set and the best `g` seen for each state.

## Test results

The solver is checked against an independent reference: a BFS from the goal gives the true distance of **all 181,440 reachable states**, and A\*'s path length is compared with it for 300 random starts.

```text
$ node tests/verify.js
reachable states (BFS): 181440
deepest state: 31 moves
random starts solved: 300
non-optimal or invalid results: 0
max nodes expanded: 5563, max time: 3 ms
```

All 300 solutions were exactly as short as possible. The hardest 8-puzzle states need 31 moves, and even those solve in a few milliseconds.

## Project structure

| File | What it does |
| --- | --- |
| `index.html` | The page |
| `css/style.css` | Look and feel |
| `js/puzzle.js` | Puzzle model: states, h2, moves, solvability |
| `js/astar.js` | A\* and the min-heap |
| `js/confetti.js` | Victory animation |
| `js/app.js` | User interface |
| `tests/verify.js` | Checks A\* is optimal against BFS |
| `docs/screenshots/` | Screenshots |

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Run the verification:

```bash
node tests/verify.js
```

## Deploy

StarSlide is a static site, so any web server works (nginx, GitHub Pages, and so on). Live version: **https://starslide.emadhabibnia.ir**
