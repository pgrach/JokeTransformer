const set = ["Why did the bicycle fall into the swimming pool? Because it couldn’t find its towel.", "Why do ducks wear dog masks? To go quack undercover.", "Why did the cloud date the fog? Because it thought it was mist-erious.", "Why did the tree think it could fly? Because it bought a trunk-load of feathers.",
    "Why do elephants use computers? Because they can't resist the mouse.",
    "Why did the clock go to the beach? It wanted to be a sundial.",
    "Why did the rainbow break up with the crayon box? It wanted more space.",
    "Why did the chicken join a band? Because it had the drumsticks.",
    "Why did the book go to the gym? To develop better character.",
    "Why do onions wear socks? To keep their layers warm."]

const bringItBtn = document.getElementById("bringItBtn")
const selected = document.getElementById("selected")
const transBtn = document.getElementById("transBtn")
const draft = document.getElementById("draft")
const emoji = document.getElementById('emoji') // for styling
const markerBtn = document.getElementById('markerBtn')

// dedicated for styling of emoji button
markerBtn.addEventListener('mouseover', function () {
    emoji.style.animation = 'tremble 0.5s infinite'
})
markerBtn.addEventListener('mouseout', function () {
    emoji.style.animation = ''
})

bringItBtn.addEventListener("click", () => {
    // Generate a new random number each time the button is clicked
    const random = Math.floor(Math.random() * set.length)

    // Replace the old joke with a new one
    selected.innerText = set[random]
})

transBtn.addEventListener("click", () => {
    draft.innerText = selected.innerText
})

markerBtn.addEventListener('click', function () {
    let style = document.createElement('style')
    style.innerHTML = `
    * {
        cursor: url('cursor.cur'), auto;
    }`;
    document.head.appendChild(style)

    // Set marker mode active
    markerMode = true
})

// Initiate marker mode
let markerMode = false

// Listen to mouseup event to perform text highlighting
document.addEventListener('mouseup', function () {
    if (!markerMode) {
        alert("Please take the sponge first!")
        return
    }
    let selection = window.getSelection()
    if (selection.toString().length > 0) {
        let span = document.createElement('span')
        span.style.backgroundColor = 'yellow' // the color of the marker
        span.className = 'highlight'
        let range = selection.getRangeAt(0)
        range.surroundContents(span)
        selection.removeAllRanges()
    }
})