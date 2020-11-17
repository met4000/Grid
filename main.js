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

var TableElemType = {
  FILLED:   { name: "filled", getInverse: {}, getBlocked: {} },
  EMPTY:    { name: "empty", getInverse: {}, getBlocked: {} },
  BLOCKED:  { name: "blocked", getInverse: {}, getBlocked: {} },
};
const Classname = Object.freeze({
  HIGHLIGHTED: "highlighted",
  LARGECELLS: "large",
});

TableElemType.FILLED.getInverse  = TableElemType.EMPTY;
TableElemType.EMPTY.getInverse   = TableElemType.FILLED;
TableElemType.BLOCKED.getInverse = TableElemType.BLOCKED;
TableElemType.FILLED.getBlocked  = TableElemType.BLOCKED;
TableElemType.EMPTY.getBlocked   = TableElemType.BLOCKED;
TableElemType.BLOCKED.getBlocked = TableElemType.EMPTY;

var rowInput  = document.getElementById("rowInput");
var colInput  = document.getElementById("colInput");
var table     = document.getElementById("table");

var _table = [], _classlist = [];
var _r = () => _table.length, _c = () => (_table[0] || []).length;
var TableElem = function (type = TableElemType.EMPTY) { return { type: type, classes: [] }; };

var changeTableSize = function (r, c) {
  while (_r() < r) _table.push(new Array(_c()).fill().map(TableElem));
  while (_r() > r) _table.pop();

  while (_c() < c) _table.forEach(r => r.push(new TableElem()));
  while (_c() > c) _table.forEach(r => r.pop());
};

var updateDisplayTable = function () {
  table.innerHTML = _table.map((r, _r) => `<tr>${r.map((v, _c) => `<td class="${[v.type.name, ..._classlist, ...v.classes].join(" ")}" id="[${[_r,_c]}]"></td>`).join("")}</tr>`).join("");

  Array(...table.getElementsByTagName("td")).forEach(v => {
    v.onclick = (...args) => clickevent(getClickTypeFromEvent(...args), ...args);
    v.onauxclick = (...args) => clickevent(getClickTypeFromEvent(...args), ...args);
    v.oncontextmenu = () => false;

    v.ondblclick = (...args) => toggleHighlight(...args);
  });
};

var getCoordsFromElement = function (el) { return JSON.parse(el.id); };

var toggleClass = function (classname, r = undefined, c = undefined) {
  var table;

  if (r !== undefined && c !== undefined) {
    if (!(0 <= r && r < _table.length)) return;
    if (!(0 <= c && c < _table[r].length)) return;

    table = _table[r][c].classes;
  } else {
    table = _classlist;
  }

  var i = table.indexOf(classname);
  if (i > -1) {
    table.splice(i, 1);
  } else {
    table.push(classname);
  }
};

var toggleHighlight = function (e) {
  var [r, c] = getCoordsFromElement(e.srcElement);
  toggleClass(Classname.HIGHLIGHTED, r, c);
  updateDisplayTable();
};

var toggleLargeCells = function () {
  toggleClass(Classname.LARGECELLS);
  updateDisplayTable();
};

var clickevent = function (clickType, e) {
  var coords = getCoordsFromElement(e.srcElement);
  
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
  if (!(0 <= r && r < _table.length)) return;
  if (!(0 <= c && c < _table[r].length)) return;

  _table[r][c].type = _table[r][c].type.getInverse;
};

var localChange = function (r, c) {
  [
                [r-1, c  ],
    [  r, c-1], [  r, c  ], [  r, c+1],
                [r+1, c  ],
  ].forEach(v => singleChange(...v));
};

var block = function (r, c) {
  if (!(0 <= r && r < _table.length)) return;
  if (!(0 <= c && c < _table[r].length)) return;

  _table[r][c].type = _table[r][c].type.getBlocked;
};

var sizeUpdate = function () {
  changeTableSize(rowInput.value, colInput.value);
  updateDisplayTable();
};


window.onkeypress = function (e) {
  if (e.code == "KeyR") wipeTable();
};

var wipeTable = function () {
  _table.forEach(r => r.forEach((_, i, a) => a[i] = new TableElem()));
  updateDisplayTable();
};

// html setup
[rowInput, colInput].forEach(v => v.addEventListener("change", sizeUpdate));
sizeUpdate();
updateDisplayTable();
