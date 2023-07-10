const set = ["Why did the bicycle fall into the swimming pool? Because it couldn’t find its towel.", "Why do ducks wear dog masks? To go quack undercover.", "Why did the cloud date the fog? Because it thought it was mist-erious.", "Why did the tree think it could fly? Because it bought a trunk-load of feathers.",
    "Why do elephants use computers? Because they can't resist the mouse.",
    "Why did the clock go to the beach? It wanted to be a sundial.",
    "Why did the rainbow break up with the crayon box? It wanted more space.",
    "Why did the chicken join a band? Because it had the drumsticks.",
    "Why did the book go to the gym? To develop better character.",
    "Why do onions wear socks? To keep their layers warm."]

// DOM Element Selection
const bringItBtn = document.getElementById("bringItBtn")
const selected = document.getElementById("selected")
const transBtn = document.getElementById("transBtn")
const draft = document.getElementById("draft")
const emoji = document.getElementById('emoji') // for styling
const markerBtn = document.getElementById('markerBtn')
let spongeArea = document.getElementById("spongeArea")
let newEmoji = null;  // Created a variable to hold the reference to the marking process

// Animation for Emoji Button
markerBtn.addEventListener('mouseover', function () {
    emoji.classList.add('tremble')
})
markerBtn.addEventListener('mouseout', function () {
    emoji.classList.remove('tremble')
})

// Display Joke
bringItBtn.addEventListener("click", () => {
    const random = Math.floor(Math.random() * set.length)
    selected.innerText = set[random]
})

// Transfer Joke to marker
transBtn.addEventListener("click", () => {
    draft.innerText = selected.innerText
})

// Change Emoji
markerBtn.addEventListener('click', () => {
    if (!newEmoji) {
        let newSpan = document.createElement('span')
        newSpan.id = "newEmoji"
        newSpan.innerText = '🔃'
        emoji.replaceWith(newSpan)

        // Change the cursor style within the drafting area
        let spongeArea = document.getElementById("spongeArea")
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
        if (selection.toString().length > 0) {
            let span = document.createElement('span')
            span.style.backgroundColor = '#de1e7eff' // the color of the marker
            span.className = 'highlight'
            let range = selection.getRangeAt(0)
            range.surroundContents(span)
            selection.removeAllRanges()
        }
    }
})