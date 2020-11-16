var rowInput  = document.getElementById("rowInput");
var colInput  = document.getElementById("colInput");
var table     = document.getElementById("table");

var _table = [];
var _r = () => _table.length, _c = () => (_table[0] || []).length;

var changeTableSize = function (r, c) {
  while (_r() < r) _table.push(new Array(_c()).fill(false));
  while (_r() > r) _table.pop();

  while (_c() < c) _table.forEach(r => r.push(false));
  while (_c() > c) _table.forEach(r => r.pop());
};

var updateDisplayTable = function () {
  table.innerHTML = _table.map((r, _r) => `<tr>${r.map((v, _c) => `<td${v ? ` class="selected"` : ``} id="[${[_r,_c]}]"></td>`).join("")}</tr>`).join("");
  Array(...table.getElementsByTagName("td")).forEach(v => {
    v.onclick = (...args) => clickevent(false, ...args);
    v.oncontextmenu = (...args) => clickevent(true, ...args);
  });
};

var clickevent = function (right, e) {
  var coords = JSON.parse(e.srcElement.id);
  
  if (right) singleChange(...coords);
  else localChange(...coords);
  
  updateDisplayTable();
  if (right) return false;
};

var singleChange = function (r, c) {
  if (0 <= r && r < _table.length) if (0 <= c && c < _table[r].length) _table[r][c] = !_table[r][c];
};

var localChange = function (r, c) {
  [
                [r-1, c  ],
    [  r, c-1], [  r, c  ], [  r, c+1],
                [r+1, c  ],
  ].forEach(v => singleChange(...v));
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
