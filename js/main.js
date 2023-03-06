import { GAME_STATUS, GAME_TIME } from './constants.js'
import {
  getColorElementList,
  getColorList,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  getRandomColorPairs,
  setTimerText,
  showReplayButton,
  hideReplayButton,
  createTimer,
} from './utils.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleOnChange,
  onFinish: handleOnFinish,
})
let isTimeOver = false
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleOnChange(second) {
  const textContent = `0${second}s`.slice(-3)
  setTimerText(textContent)
}

function handleOnFinish() {
  gameState = GAME_STATUS.FINISHED
  showReplayButton()
  setTimerText('YOU LOOSE!!!')
  isTimeOver = true
}

function handleColorClick(colorElement) {
  const isBlocked = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameState)
  const isClicked = colorElement.classList.contains('active')
  if (!colorElement || isClicked || isBlocked) return

  colorElement.classList.add('active')
  selections.push(colorElement)

  if (selections.length < 2) return

  const first = selections[0].dataset.color
  const second = selections[1].dataset.color
  let isMatch = first === second ? true : false

  if (isMatch) {
    const inActiveList = getInActiveColorList().length
    const isWin = inActiveList === 0
    const backgroundColor = document.querySelector('section.color-background')
    backgroundColor.style.backgroundColor = selections[0].dataset.color

    if (isWin) {
      //show playAgain
      showReplayButton()
      setTimerText('YOU WIN')
      timer.clear()
      gameState = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }

  gameState = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    //reset selections
    selections = []

    //blocking game
    gameState = isTimeOver === false ? GAME_STATUS.PLAYING : GAME_STATUS.FINISHED
  }, 500)
}

function resetGame() {
  // IMPORTANT: reset global variables
  gameState = GAME_STATUS.PLAYING
  selections = []

  // reset DOM element
  //hide replay button
  //hide timerText
  //delete active class
  const liElement = getColorElementList()
  for (const li of liElement) {
    li.classList.remove('active')
  }
  hideReplayButton()
  setTimerText('')

  //init board game
  initGameBoard()

  startTimer()
}

// function showTimer() {
//   let i = 3
//   idInterval = setInterval(() => {
//     setTimerText(`00 : ${i.toString().padStart(2, 0)}`)
//     i--
//     if (i < 0) {
//       setTimerText('TIME OUT')
//       showReplayButton()
//       gameState = GAME_STATUS.BLOCKING
//       clearInterval(idInterval)
//     }
//   }, 1000)
// }

function attachReplayButtonClick() {
  const replayButton = getPlayAgainButton()
  if (!replayButton) return

  replayButton.addEventListener('click', resetGame)
}

function initEventClick() {
  const gameBoard = getColorList()

  gameBoard.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return

    handleColorClick(event.target)
  })
}

function initGameBoard() {
  const colorElementList = getColorElementList()
  if (!colorElementList) return

  const colorList = getRandomColorPairs(8)

  colorElementList.forEach((colorElement, index) => {
    colorElement.dataset.color = colorList[index]
    const overlayColorElement = colorElement.querySelector('div.overlay')
    overlayColorElement.style.backgroundColor = colorList[index]
  })
}

function startTimer() {
  timer.start()
}

;(() => {
  initGameBoard()
  initEventClick()
  attachReplayButtonClick()
  startTimer()
})()
