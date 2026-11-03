(function () {
  const { SIZE, GOAL, isGoal, h2, adjacent, slide, randomState } = Puzzle;

  const $ = (id) => document.getElementById(id);
  const boardEl = $("board");
  const bannerEl = $("banner");
  const newBtn = $("newBtn");
  const solveBtn = $("solveBtn");
  const playBtn = $("playBtn");
  const stepBtn = $("stepBtn");
  const speedEl = $("speed");
  const solutionBox = $("solutionBox");
  const solutionList = $("solutionList");

  const ARROWS = { "-3": "↑", "3": "↓", "-1": "←", "1": "→" };
  const faDigits = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  let state;
  let moves;
  let solution = null; // { path, directions } for the current state, or null
  let step = 0; // how many solution steps have been applied
  let timer = null;
  const tileEls = new Map();

  function buildTiles() {
    boardEl.innerHTML = "";
    tileEls.clear();
    for (let v = 1; v < SIZE * SIZE; v++) {
      const el = document.createElement("div");
      el.className = "tile";
      const btn = document.createElement("button");
      btn.textContent = v;
      btn.addEventListener("click", () => onTileClick(v));
      el.appendChild(btn);
      boardEl.appendChild(el);
      tileEls.set(v, el);
    }
  }

  function setStat(id, value) {
    $(id).textContent = value === null ? "—" : faDigits(value);
  }

  function render() {
    state.forEach((v, i) => {
      if (v === 0) return;
      const el = tileEls.get(v);
      el.style.left = `calc(8px + ${i % SIZE} * (100% - 16px) / 3)`;
      el.style.top = `calc(8px + ${Math.floor(i / SIZE)} * (100% - 16px) / 3)`;
      el.classList.toggle("placed", GOAL[i] === v);
    });
    setStat("movesStat", moves);
    setStat("h2Stat", h2(state));

    const solved = isGoal(state);
    bannerEl.hidden = !solved;
    if (solved) bannerEl.textContent = `حل شد! 🎉 تعداد حرکات: ${faDigits(moves)}`;

    const hasPlan = solution !== null && step < solution.directions.length;
    playBtn.disabled = !hasPlan && timer === null;
    stepBtn.disabled = !hasPlan;
    solveBtn.disabled = solved;
    [...solutionList.children].forEach((li, i) => li.classList.toggle("done", i < step));
  }

  function stopPlaying() {
    clearInterval(timer);
    timer = null;
    playBtn.textContent = "پخش";
  }

  function clearSolution() {
    stopPlaying();
    solution = null;
    step = 0;
    solutionBox.hidden = true;
    solutionList.innerHTML = "";
    ["optStat", "expStat", "genStat", "timeStat"].forEach((id) => setStat(id, null));
  }

  function newGame() {
    clearSolution();
    state = randomState();
    moves = 0;
    render();
  }

  function onTileClick(value) {
    const index = state.indexOf(value);
    if (!adjacent(state.indexOf(0)).includes(index)) return;
    // Manual moves invalidate any computed plan.
    if (solution) clearSolution();
    state = slide(state, index);
    moves++;
    render();
  }

  function solveNow() {
    clearSolution();
    const result = AStar.solve(state);
    const directions = [];
    for (let i = 1; i < result.path.length; i++) {
      directions.push(result.path[i].indexOf(0) - result.path[i - 1].indexOf(0));
    }
    solution = { path: result.path, directions };
    step = 0;

    setStat("optStat", result.cost);
    setStat("expStat", result.expanded);
    setStat("genStat", result.generated);
    setStat("timeStat", result.ms);

    directions.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = ARROWS[d];
      solutionList.appendChild(li);
    });
    solutionBox.hidden = false;
    render();
  }

  function advance() {
    if (!solution || step >= solution.directions.length) {
      stopPlaying();
      render();
      return;
    }
    step++;
    moves++;
    state = solution.path[step];
    if (step >= solution.directions.length) stopPlaying();
    render();
  }

  function togglePlay() {
    if (timer !== null) {
      stopPlaying();
      render();
      return;
    }
    playBtn.textContent = "توقف";
    timer = setInterval(advance, Number(speedEl.value));
    advance();
  }

  speedEl.addEventListener("change", () => {
    if (timer === null) return;
    clearInterval(timer);
    timer = setInterval(advance, Number(speedEl.value));
  });
  newBtn.addEventListener("click", newGame);
  solveBtn.addEventListener("click", solveNow);
  playBtn.addEventListener("click", togglePlay);
  stepBtn.addEventListener("click", advance);

  buildTiles();
  newGame();
})();
