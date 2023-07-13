async function getJoke() {
  const response = await fetch('https://v2.jokeapi.dev/joke/Any');
  const data = await response.json();

  if (data.joke) { // Single line joke
    return data.joke;
  } else { // Two part joke
    return data.setup + " " + data.delivery;
  }
}

async function getNewJoke() {
  return getJoke().then(joke => {
    selected.innerText = joke;
  });
}

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

//Toggle functionality
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Hide elements on load
const form = document.querySelector('form')
form.style.display = 'none'
transBtn.style.display = 'none'
logBtn.style.display = 'none'
spongeArea.style.display = 'none'
gif.style.display = 'none'
sorry.style.display = 'none'


// Display a random joke from API
bringItBtn.addEventListener('click', () => {
  bringItBtn.innerText = "Try another one"
  getNewJoke().then(() => {
    form.style.display = 'block'
    transBtn.style.display = 'block'
  });
});

// Show spongeArea on transBtn click
transBtn.addEventListener('click', () => {
  spongeArea.style.display = 'block';
});

// Animation for Emoji Button
markerBtn.addEventListener('mouseover', function () {
  emoji.classList.add('tremble')
})
markerBtn.addEventListener('mouseout', function () {
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
})

// Text Highlighting
draft.addEventListener('mouseup', function () {
  if (newEmoji) {
    let selection = window.getSelection()

    if (!selection.rangeCount) return  // Ensure there is a selection

    if (selection.toString().length > 0) {
      let span = document.createElement('span')
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
      inputForm.placeholder = 'what do you want replace it with...'

      // Clone the span and remove the 'highlight' class
      let clonedSpan = span.cloneNode(true)
      clonedSpan.classList.remove('highlight')

      logBtn.style.display = 'block'


      highlighted.appendChild(clonedSpan) // Append the cloned span to the new element
      highlighted.appendChild(inputForm) // Append the input form to the new element
      spongeArea.appendChild(highlighted) // Append the new element to spongeArea
    }
  }
})

logBtn.addEventListener('click', () => {
  sorry.style.display = 'block'
  gif.style.display = 'block'


  let initialJoke = draft.innerText
  console.log(`Prompt: Here is a silly joke: "${initialJoke}". Can you rewrite it to make it funnier while being close to the original and replacing:`)

  let highlights = spongeArea.querySelectorAll('div')
  highlights.forEach(highlight => {
    let original = highlight.children[0].innerText;
    let replacement = highlight.children[1].value;

    console.log(`${original} with ${replacement}`);
  });

});

