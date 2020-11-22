function Tr(GRID_M, setupFunc, completeFunc, max = 100000) {
  // setup
  var M = [];
  for (var n = 0; n < 3; n++) M.push(Array(GRID_M).fill(0));
  M[0] = setupFunc(M[0]);

  // shift
  for (var i = 1; i < max; i++) {
    for (var m = 0; m < GRID_M; m++) {
      if (!M[0][m]) continue;

      // "toggle" to the right
      [0, 1, 2].forEach(v => M[v][m] = 1 - M[v][m]); // three in the centre
      if (M[1][m - 1] !== undefined) M[1][m - 1] = 1 - M[1][m - 1]; // top
      if (M[1][m + 1] !== undefined) M[1][m + 1] = 1 - M[1][m + 1]; // bottom
    }

    M = M.slice(1); // remove empty first row

    if (completeFunc([...M[0]], [...M[1]])) return i;

    M.push(Array(GRID_M).fill(0)); // add empty row to end
  }

  return -1;
}

function Tr_1(GRID_M, max = undefined) {
  return Tr(
    GRID_M,
    r => {
      r[0] = 1;
      return r;
    },
    (r0, r1) => {
      if (!r0[0])                     return false;
      if (r0.slice(1).some(v => v))   return false;
      if (r1.some(v => v))            return false;
      return true;
    },
    max
  );
}

function Tr_f(GRID_M, max = undefined) {
  return Tr(
    GRID_M,
    r => r.fill(1),
    (r0, r1) => {
      if (r0.some(v => !v)) return false;
      if (r1.some(v => v)) return false;
      return true;
    },
    max
  );
}
