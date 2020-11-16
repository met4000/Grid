const ClickType = Object.freeze({
  LEFT:   { name: "left" },
  MIDDLE: { name: "middle" },
  RIGHT:  { name: "right" },
});
var getClickTypeFromEvent = function (e) {
  if      (e.button == 0) return ClickType.LEFT;
  else if (e.button == 1) return ClickType.MIDDLE;
  else if (e.button == 2) return ClickType.RIGHT;
  
  return undefined;
};

var rowInput  = document.getElementById("rowInput");
var colInput  = document.getElementById("colInput");
var table     = document.getElementById("table");

var TableElemType = {
  FILLED:   { name: "filled", getInverse: {}, getBlocked: {} },
  EMPTY:    { name: "empty", getInverse: {}, getBlocked: {} },
  BLOCKED:  { name: "blocked", getInverse: {}, getBlocked: {} },
};
TableElemType.FILLED.getInverse  = TableElemType.EMPTY;
TableElemType.EMPTY.getInverse   = TableElemType.FILLED;
TableElemType.BLOCKED.getInverse = TableElemType.BLOCKED;
TableElemType.FILLED.getBlocked  = TableElemType.BLOCKED;
TableElemType.EMPTY.getBlocked   = TableElemType.BLOCKED;
TableElemType.BLOCKED.getBlocked = TableElemType.EMPTY;
var _table = [];
var _r = () => _table.length, _c = () => (_table[0] || []).length;

var changeTableSize = function (r, c) {
  while (_r() < r) _table.push(new Array(_c()).fill(TableElemType.EMPTY));
  while (_r() > r) _table.pop();

  while (_c() < c) _table.forEach(r => r.push(TableElemType.EMPTY));
  while (_c() > c) _table.forEach(r => r.pop());
};

var updateDisplayTable = function () {
  table.innerHTML = _table.map((r, _r) => `<tr>${r.map((v, _c) => `<td class="${v.name}" id="[${[_r,_c]}]"></td>`).join("")}</tr>`).join("");
  Array(...table.getElementsByTagName("td")).forEach(v => {
    v.onclick = (...args) => clickevent(getClickTypeFromEvent(...args), ...args);
    v.onauxclick = (...args) => clickevent(getClickTypeFromEvent(...args), ...args);
    v.oncontextmenu = () => false;
  });
};

var clickevent = function (clickType, e) {
  var coords = JSON.parse(e.srcElement.id);
  
  switch (clickType) {
    case ClickType.LEFT:
      localChange(...coords);
      break;

    case ClickType.MIDDLE:
      block(...coords);
      break;

    case ClickType.RIGHT:
      singleChange(...coords);
      break;
  }

  updateDisplayTable();
  if (clickType == ClickType.RIGHT) return false;
};

var singleChange = function (r, c) {
  if (0 <= r && r < _table.length) {
    if (0 <= c && c < _table[r].length) {
      _table[r][c] = _table[r][c].getInverse;
    }
  }
};

var localChange = function (r, c) {
  [
                [r-1, c  ],
    [  r, c-1], [  r, c  ], [  r, c+1],
                [r+1, c  ],
  ].forEach(v => singleChange(...v));
};

var block = function (r, c) {
  if (0 <= r && r < _table.length) {
    if (0 <= c && c < _table[r].length) {
      _table[r][c] = _table[r][c].getBlocked;
    }
  }
};

var sizeUpdate = function () {
  changeTableSize(rowInput.value, colInput.value);
  updateDisplayTable();
};


window.onkeypress = function (e) {
  if (e.code == "KeyR") wipeTable();
};

var wipeTable = function () {
  _table.forEach(r => r.forEach((_, i, a) => a[i] = false));
  updateDisplayTable();
};

// html setup
[rowInput, colInput].forEach(v => v.addEventListener("change", sizeUpdate));
sizeUpdate();
updateDisplayTable();
