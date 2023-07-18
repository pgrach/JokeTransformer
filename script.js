// DOM Element Selection
const toggle = document.getElementById('dark-mode');
const bringItBtn = document.getElementById("bringItBtn")
const selected = document.getElementById("selected")
const transBtn = document.getElementById("transBtn")
const draft = document.getElementById("draft")
const emoji = document.getElementById("emoji") // for styling
const markerBtn = document.getElementById("markerBtn")
let spongeArea = document.getElementById("spongeArea")
let newEmoji = null;  // Created a variable to hold the reference to the marking process
const logBtn = document.getElementById("logBtn")
const gif = document.getElementById("gif")
const sorry = document.getElementById("sorry")

//Sections
let section1 = document.querySelector(".section1")
let section2 = document.querySelector(".section2")
let section3 = document.querySelector(".section3")
let section4 = document.querySelector(".section4")
let section5 = document.querySelector(".section5")

// Hide elements on load, except the section1
section2.style.display = 'none'
section3.style.display = 'none'
section4.style.display = 'none'
section5.style.display = 'none'


//Toggle functionality
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
})

// API Call to get the joke
const getJoke = async () => {
  const response = await fetch('https://v2.jokeapi.dev/joke/Any') // API call
  const data = await response.json() // Converting response to JSON
  return data.joke ? data.joke : `${data.setup} ${data.delivery}` // Returning the joke or a combination of setup and delivery if joke is not present
}

// Display a random joke from API
bringItBtn.addEventListener('click', async () => {
  bringItBtn.innerText = "Try another one" // Changing the button text
  const joke = await getJoke()
  section2.style.display = 'block' // Making section2 visible
  selected.innerText = joke // Displaying the fetched joke

  // Hide section3, section4, and section5
  section3.style.display = 'none'
  section4.style.display = 'none'
  section5.style.display = 'none'

  // Remove all highlighted text from spongeArea
  let highlightedElements = spongeArea.querySelectorAll('div')  // assuming 'div' is what you use for highlighted text
  for (let element of highlightedElements) {
    spongeArea.removeChild(element)
  }

})

// Show spongeArea on transBtn click
transBtn.addEventListener('click', () => {
  section3.style.display = 'block' // Making section3 visible
})

// Animation for Emoji Button
markerBtn.addEventListener('mouseover', () => {
  emoji.classList.add('tremble')
})
markerBtn.addEventListener('mouseout', () => {
  emoji.classList.remove('tremble')
})

// Transfer Joke to marker
transBtn.addEventListener("click", () => {
  draft.innerText = selected.innerText
})

// Change Emoji
markerBtn.addEventListener('click', () => {
  // Remove all highlighted text from spongeArea
  let highlightedElements = spongeArea.querySelectorAll('div')  // assuming 'div' is what you use for highlighted text
  for (let element of highlightedElements) {
    spongeArea.removeChild(element)
  }

  if (!newEmoji) {
    let newSpan = document.createElement('span')
    newSpan.id = "newEmoji"
    newSpan.innerText = '🔃'
    emoji.replaceWith(newSpan)

    // Change the cursor style within the drafting area
    let style = document.createElement('style')
    style.innerHTML = `
        #spongeArea {
            cursor: url('cursor.cur'), auto;
        }`
    document.head.appendChild(style)

    // Save the reference to the new emoji element
    newEmoji = newSpan
  }

  // Save the original joke to draft whether new emoji is created or not
  draft.innerText = selected.innerText

  // Hide section4 and section5
  section4.style.display = 'none'
  section5.style.display = 'none'
})

// Text Highlighting
draft.addEventListener('mouseup', () => {
  if (newEmoji) {
    let selection = window.getSelection()

    if (!selection.rangeCount) return  // Ensure there is a selection

    if (selection.toString().length > 0) {
      let span = document.createElement('span')
      span.className = 'highlighted-text';  // To adjust CSS style
      span.style.backgroundColor = 'rgba(255, 255, 0, 0.438)' // the color of the marker
      span.className = 'highlight'
      let range = selection.getRangeAt(0)
      range.surroundContents(span)
      selection.removeAllRanges()
      let spongeArea = document.getElementById("spongeArea")
      let highlighted = document.createElement('div') // Create a div

      // Create an input form
      let inputForm = document.createElement('input')
      inputForm.type = 'text'
      inputForm.className = 'input-form'  // To adjust CSS style
      inputForm.placeholder = 'you want to replace it with...'

      // event listener that will display the  button (section4) when the user types into the input
      inputForm.addEventListener('input', () => {
        if (inputForm.value.length > 0) {
          section4.style.display = 'block' // Make section4 visible if there is any input
        } else {
          section4.style.display = 'none' // Hide section4 if there is no input
        }
      })

      // Clone the span and remove the 'highlight' class
      let clonedSpan = span.cloneNode(true)
      clonedSpan.classList.remove('highlight')
      clonedSpan.style.display = 'inline-block';  // Add this line
      clonedSpan.style.width = '200px';  // Add this line, adjust the width as per your requirements

      highlighted.appendChild(clonedSpan) // Append the cloned span to the new element
      highlighted.appendChild(inputForm) // Append the input form to the new element
      spongeArea.appendChild(highlighted) // Append the new element to spongeArea
    }
  }
})

// OPEN AI API 

logBtn.addEventListener('click', async () => {
  section5.style.display = 'block' // Make section5 visible
  let initialJoke = draft.innerText

  let highlights = spongeArea.querySelectorAll('div')

  // Build the prompt from the console.logs
  let prompt = `Here is a joke: "${initialJoke}". Can you rewrite it while still being funny, close to the original and replacing:\n`

  highlights.forEach(highlight => {
    let original = highlight.children[0].innerText
    let replacement = highlight.children[1].value
    prompt += `${original} with ${replacement}\n`
  })

  console.log(prompt) // console log

  const response = await fetch("./api/getOpenAIResponse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({prompt }),
    })

  const dataAPI = await response.json()
  console.log(response)

  document.getElementById("chatOutput").innerHTML += `<p>${dataAPI.choices[0].message.content}</p>`
})