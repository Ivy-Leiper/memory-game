const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = []
const ids = []

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let i = 0; i < colorArray.length; i++) {
    const color = colorArray[i];
    let num = 0;
    // create a new div
    const newDiv = document.createElement("div");
    
    if(colorArray.indexOf(color) < i)
      num = 1

    // give it an id
    newDiv.setAttribute("id", color + num)

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

  }
}

const toggled = []
let score = 0;
let bestScore = JSON.parse(localStorage.getItem("bestScore")) || 0
const correct = [];
let waiting = false;
//timeout should only be called when color is removed from toggled -> card will stay colored until 2 new cards are clicked and should fix toggling correct cards 
function handleCardClick(event) {

  const id = event.target.getAttribute("id");
  const color = id.substring(0, id.length - 1);

  if(!correct.includes(color) && !waiting && id != toggled[0]){
    score++;
    updateScore();
    event.target.classList.add(color)
    toggled.push(id);

    if(toggled.length == 2 && (toggled[0].substring(0, id.length - 1) === toggled[1].substring(0, id.length - 1)) && toggled[0] != toggled[1]){
      const first = document.getElementById(toggled[0]);
      const second = document.getElementById(toggled[1]);
      first.classList.add(toggled[0].substring(0, id.length - 1), "completed")
      second.classList.add(toggled[1].substring(0, id.length - 1), "completed")
      correct.push(toggled[0].substring(0, id.length - 1))
      toggled.splice(0, toggled.length)
      if(correct.length == (shuffledColors.length / 2)){
        win();
      }
    }
    else if(toggled.length >= 2){
      waiting = true;
      setTimeout(function() {
        if(toggled.length >= 2){
          const first = document.getElementById(toggled[0]);
          const second = document.getElementById(toggled[1]);
          first.classList.remove(toggled[0].substring(0, toggled[0].length - 1))
          second.classList.remove(toggled[1].substring(0, toggled[1].length - 1))
          toggled.splice(0,2)
          waiting = false;
        }
      }, 1000)
    }
  }
}
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click",function(){
  reset();
  startBtn.innerText = "Retry!"
})

function updateScore(){
  const scoreEl = document.getElementById("score");
  scoreEl.innerText = `Score: ${score}`;
}
function updateBestScore(){
  const bestScoreEl = document.getElementById("bestScore");
  bestScoreEl.innerText = `Best Score: ${bestScore}`;
  localStorage.setItem("bestScore", bestScore)
}
function win(){
  if(score < bestScore || bestScore == 0){
    bestScore = score;
    updateBestScore();
  }
  //add replay modal, add event handler to createDivsForColors(shuffle(COLORS)); on click of button
  //add start button, calls createDivsForColors(shuffle(COLORS));, reset score and text changes to restart
}
function reset(){
  score = 0;
  updateScore();
  correct.length = 0;
  toggled.length = 0;
  waiting = false;
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS)
  createDivsForColors(shuffledColors);
}
// when the DOM loads
updateBestScore();
