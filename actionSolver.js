function getRRActions(GRID_M, GRID_N) {
  function getCoordsByCellNum(cellNum, nColumns) { // 0 indexed
    var r = cellNum % nColumns;
    return [(cellNum - r) / nColumns, r];
  };

  // setup
  var M = [], maxStateVars = GRID_M * GRID_N, maxCellToggles = GRID_M * GRID_N;
  var cToggleCoords = [], svarCoords = [], verticalAdjacency, horizontalAdjacency;
  for (var cToggle = 0; cToggle < maxCellToggles; cToggle++) {
    M[cToggle] = [];
    cToggleCoords = getCoordsByCellNum(cToggle, GRID_N);
    for (var svar = 0; svar < maxStateVars; svar++) {
      if (cToggle == svar) {
        M[cToggle][svar] = 1;
      } else {
        svarCoords = getCoordsByCellNum(svar, GRID_N);
        verticalAdjacency = Math.abs(svarCoords[0] - cToggleCoords[0]);
        horizontalAdjacency = Math.abs(svarCoords[1] - cToggleCoords[1]);
        M[cToggle][svar] = ((verticalAdjacency == 1) && !horizontalAdjacency) || (!verticalAdjacency && (horizontalAdjacency == 1));
      }

      M[cToggle][svar] += 0;
    }
  }

  // row reduce
  var f = 0;
  for (var n = 0; n < maxStateVars; n++) {
    for (var m = f; m < maxCellToggles; m++) {
      if (M[m][n]) {
        if (m != f) [M[f], M[m]] = [[...M[m]], [...M[f]]];
        for (var row = 0; row < maxCellToggles; row++) {
          if (row == f) continue;
          if (M[row][n]) M[row] = M[row].map((v, i) => v ^ M[f][i]);
        }
        f++;
        break;
      }
    }
  }

  // remove dud actions
  M = M.filter(v => v.some(v => v));

  // convert rows to state var maps
  M = M.map(v => v.map((v, i) => ({ [i]: v })).filter((v, i) => v[i]).reduce((r, v) => ({ ...r, ...v }), {}));

  return M;
}

function getGridDescription(GRID_M, GRID_N) {
  var M = getRRActions(GRID_M, GRID_N);
  var nStateVars = GRID_M * GRID_N - M.length;

  var ret = `${GRID_M} x ${GRID_N}: `;
  if (nStateVars) {
    ret += `${nStateVars} state vars`;
  } else {
    ret += `solved`;
  }

  return ret;
}
