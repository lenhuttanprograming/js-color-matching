import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffleColorList(fullColorList) {
  if (!Array.isArray(fullColorList) || fullColorList.length === 0) return []

  for (let i = fullColorList.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    const temp = fullColorList[j]
    fullColorList[j] = fullColorList[i]
    fullColorList[i] = temp
  }

  return fullColorList
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  let colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]

  return shuffleColorList(fullColorList)
}

export function showReplayButton() {
  const playAgain = getPlayAgainButton()
  if (!playAgain) return

  playAgain.classList.add('show')
}

export function hideReplayButton() {
  const playAgain = getPlayAgainButton()
  if (!playAgain) return

  playAgain.classList.remove('show')
}

export function setTimerText(text) {
  const timer = getTimerElement()
  if (!timer) return

  timer.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()
    let currentSecond = seconds
    intervalId = setInterval(() => {
      if (onChange) onChange(currentSecond)
      currentSecond--
      if (currentSecond < 0) {
        clear()

        if (onFinish) onFinish()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}
