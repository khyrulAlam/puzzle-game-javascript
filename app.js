var _ = require("lodash");

const possLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let __resultState = [];
let __stateFlatten = [];
let __puzzle = document.querySelector(".puzzle");

function randomPuzzle() {
  for (i = 0; i < 3; i++) {
    __resultState[i] = [];
    for (j = 0; j < 3; j++) {
      __resultState[i][j] = possLetter.charAt(Math.floor(Math.random() * 36));
    }
  }
  isRandomG();
}

function isRandomG() {
  if (_.isEqual(_.flatten(__resultState), _.uniq(_.flatten(__resultState)))) {
    __stateFlatten = _.flattenDeep(__resultState);
    console.log("result 🔥 ", __resultState);
    console.log("result 🕵️‍♀️ ", __stateFlatten);
    createDom();
  } else {
    randomPuzzle();
  }
}

randomPuzzle();

function createDom() {
  let __count = 1;
  let shuffleResult = _.shuffle(__stateFlatten);
  _.forEach(__resultState, (arrRow, rowKey) => {
    _.forEach(arrRow, (arrCol, colKey) => {
      let state = shuffleResult[__count - 1];
      let element = document.createElement("div");
      element.classList.add("plz");
      element.setAttribute("rowCol", rowKey + "-" + colKey);
      element.setAttribute("initial", state);
      element.innerHTML = _.indexOf(__stateFlatten, state) + 1;
      __puzzle.appendChild(element);
      __count++;
    });
  });
  __plz = document.querySelectorAll(".plz");
  let whereIsPointer = document.querySelector(
    `[initial="${_.last(__stateFlatten)}"]`
  );
  whereIsPointer.classList.add("pointer");
  whereIsPointer.innerHTML = "";
}
