var _ = require("lodash");

let __puzzle = document.querySelector(".puzzle");
const possLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let __resultState = [];
let __stateFlatten = [];
let __rowSize = 3;
let __columnSize = 3;

// create puzzle array
const randomPuzzle = () => {
  for (i = 0; i < __rowSize; i++) {
    __resultState[i] = [];
    for (j = 0; j < __columnSize; j++) {
      __resultState[i][j] = possLetter.charAt(Math.floor(Math.random() * 36));
    }
  }
  isRandomG();
};

//algorithm  👨‍💻
findPointer = (r, c) => {
  let result = {
    left: {},
    right: {},
    top: {},
    bottom: {}
  };

  // 🚣
  r + 1 <= __rowSize - 1
    ? (result.bottom = r + 1 + "-" + c)
    : (result.bottom = null);
  r - 1 >= 0 ? (result.top = r - 1 + "-" + c) : (result.top = null);

  //  🗃
  c + 1 <= __columnSize - 1
    ? (result.right = r + "-" + (c + 1))
    : (result.right = null);
  c - 1 >= 0 ? (result.left = r + "-" + (c - 1)) : (result.left = null);

  return result;
};

// bg color 🖌
const randomBgColor = () => {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor;
};

// create dom element box
const createDom = () => {
  let __count = 1;
  let shuffleResult = _.shuffle(__stateFlatten);
  _.forEach(__resultState, (arrRow, rowKey) => {
    _.forEach(arrRow, (arrCol, colKey) => {
      let state = shuffleResult[__count - 1];
      let element = document.createElement("div");
      element.classList.add("plz");
      element.style.backgroundColor = randomBgColor();
      element.setAttribute("rowCol", rowKey + "-" + colKey);
      element.setAttribute("initial", state);
      element.innerHTML = _.indexOf(__stateFlatten, state) + 1 + " 🐉";
      __puzzle.appendChild(element);
      __count++;
    });
  });
  __plz = document.querySelectorAll(".plz");
  let whereIsPointer = document.querySelector(
    `[initial="${_.last(__stateFlatten)}"]`
  );
  whereIsPointer.classList.add("pointer");
  whereIsPointer.style.backgroundColor = "transparent";
  whereIsPointer.innerHTML = "";
  startPuzzling();
};

const startPuzzling = () => {
  __pointer = document.querySelector(".pointer");
  let attr = __pointer.getAttribute("rowCol");
  let row = Number(attr.split("-")[0]);
  let col = Number(attr.split("-")[1]);

  setDirection(row, col);
  startMoveEvent();
};

const startMoveEvent = () => {
  __plz.forEach(_which =>
    _which.addEventListener("click", e => {
      let direction = e.target.getAttribute("moveDirection");
      let attr = e.target.getAttribute("rowCol");
      let row = Number(attr.split("-")[0]);
      let col = Number(attr.split("-")[1]);
      if (!direction) return null;
      moveTo(direction, e.target);
      setNewIndex(direction, e.target);
      removePrevDirection();
      setDirection(row, col);
      isGameOver();
    })
  );
};

//  TODO
// 👉 if margin or padding then is function calculate not working
//  👉 need boundary calculate properly
// 🐍
const moveTo = (where, who) => {
  let el = who;
  switch (where) {
    case "left":
      el.style.left =
        el.getBoundingClientRect().left +
        el.getBoundingClientRect().width +
        "px";
      __pointer.style.left =
        __pointer.getBoundingClientRect().left -
        __pointer.getBoundingClientRect().width +
        "px";
      break;
    case "right":
      el.style.left =
        el.getBoundingClientRect().left -
        el.getBoundingClientRect().width +
        "px";
      __pointer.style.left =
        __pointer.getBoundingClientRect().left +
        __pointer.getBoundingClientRect().width +
        "px";
      break;
    case "top":
      el.style.top =
        el.getBoundingClientRect().top +
        el.getBoundingClientRect().height +
        "px";
      __pointer.style.top =
        __pointer.getBoundingClientRect().top -
        __pointer.getBoundingClientRect().height +
        "px";
      break;
    case "bottom":
      el.style.top =
        el.getBoundingClientRect().top -
        el.getBoundingClientRect().height +
        "px";
      __pointer.style.top =
        __pointer.getBoundingClientRect().top +
        __pointer.getBoundingClientRect().height +
        "px";
      break;
  }
};

const setNewIndex = (where, who) => {
  let el = who;

  let attr = el.getAttribute("rowCol");
  var moveRow = Number(attr.split("-")[0]);
  var moveCol = Number(attr.split("-")[1]);

  let PointerAttr = __pointer.getAttribute("rowCol");
  var pointerRow = Number(PointerAttr.split("-")[0]);
  var pointerCol = Number(PointerAttr.split("-")[1]);

  switch (where) {
    case "left":
      el.setAttribute("rowCol", moveRow + "-" + (moveCol + 1));
      __pointer.setAttribute("rowCol", pointerRow + "-" + (pointerCol - 1));
      break;
    case "right":
      el.setAttribute("rowCol", moveRow + "-" + (moveCol - 1));
      __pointer.setAttribute("rowCol", pointerRow + "-" + (pointerCol + 1));
      break;
    case "top":
      el.setAttribute("rowCol", moveRow + 1 + "-" + moveCol);
      __pointer.setAttribute("rowCol", pointerRow - 1 + "-" + pointerCol);
      break;
    case "bottom":
      el.setAttribute("rowCol", moveRow - 1 + "-" + moveCol);
      __pointer.setAttribute("rowCol", pointerRow + 1 + "-" + pointerCol);
      break;
  }
};

const removePrevDirection = () => {
  __plz.forEach(_which => _which.removeAttribute("moveDirection"));
};

const setDirection = (row, col) => {
  let dObj = findPointer(row, col);
  //   console.log(dObj);
  if (dObj.left) {
    setDirectionAttr(dObj.left, "left");
  }
  if (dObj.right) {
    setDirectionAttr(dObj.right, "right");
  }
  if (dObj.top) {
    setDirectionAttr(dObj.top, "top");
  }
  if (dObj.bottom) {
    setDirectionAttr(dObj.bottom, "bottom");
  }
};
const setDirectionAttr = (attr, moveMark) => {
  let el = document.querySelector(`[rowCol="${attr}"]`);
  el.setAttribute("moveDirection", moveMark);
};

// check is random array has duplicate key
const isRandomG = () => {
  if (_.isEqual(_.flatten(__resultState), _.uniq(_.flatten(__resultState)))) {
    __stateFlatten = _.flattenDeep(__resultState);
    // console.log("result 🔥 ", __resultState);
    // console.log("result 🕵️‍♀️ ", __stateFlatten);
    createDom();
  } else {
    randomPuzzle();
  }
};

const isGameOver = () => {
  let whatIsGameStatus = [];
  for (i = 0; i < __rowSize; i++) {
    __resultState[i] = [];
    for (j = 0; j < __columnSize; j++) {
      let el = document.querySelector(`[rowCol="${i}-${j}"]`);
      let pointer = el.getAttribute("initial");
      whatIsGameStatus.push(pointer);
    }
  }
  if (_.isEqual(whatIsGameStatus, __stateFlatten)) {
    setTimeout(() => {
      let isPlayAgain = confirm("You Made it !! 😃 . want to play again?");
      if (isPlayAgain) {
        randomPuzzle();
      } else {
        return null;
      }
    }, 300);
  }
  //   console.log(whatIsGameStatus);
};
randomPuzzle();
