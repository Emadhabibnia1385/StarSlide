(function (global) {
  const SIZE = 3;
  const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  const isGoal = (state) => state.every((v, i) => v === GOAL[i]);

  // h2: sum of Manhattan distances of every tile from its goal cell.
  function h2(state) {
    let total = 0;
    for (let i = 0; i < state.length; i++) {
      const v = state[i];
      if (v === 0) continue;
      const goal = v - 1;
      total += Math.abs(Math.floor(i / SIZE) - Math.floor(goal / SIZE));
      total += Math.abs((i % SIZE) - (goal % SIZE));
    }
    return total;
  }

  // Indexes of the cells orthogonally adjacent to `index`.
  function adjacent(index) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const result = [];
    if (row > 0) result.push(index - SIZE);
    if (row < SIZE - 1) result.push(index + SIZE);
    if (col > 0) result.push(index - 1);
    if (col < SIZE - 1) result.push(index + 1);
    return result;
  }

  // Slides the tile at `tileIndex` into the blank cell; returns a new state.
  function slide(state, tileIndex) {
    const next = state.slice();
    const blank = state.indexOf(0);
    next[blank] = next[tileIndex];
    next[tileIndex] = 0;
    return next;
  }

  // On an odd-width board a state is solvable iff its inversion count is even.
  function isSolvable(state) {
    const tiles = state.filter((v) => v !== 0);
    let inversions = 0;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  }

  function randomState() {
    const state = GOAL.slice();
    do {
      for (let i = state.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state[i], state[j]] = [state[j], state[i]];
      }
    } while (!isSolvable(state) || isGoal(state));
    return state;
  }

  const api = { SIZE, GOAL, isGoal, h2, adjacent, slide, isSolvable, randomState };
  if (typeof module !== "undefined") module.exports = api;
  else global.Puzzle = api;
})(this);
