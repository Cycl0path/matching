const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}


const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}


const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++
        if(state.totalFlips % 2 == 0){
            selectors.moves.innerText = `${state.totalFlips / 2} moves`
            selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }}, 1000)
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    //'🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'
    const emojis = ['https://upload.wikimedia.org/wikipedia/en/4/4b/BYU_Logo_1969-1998.png', 
                    'data:image/png;base64,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',
                    'https://i.pinimg.com/750x/e0/a7/24/e0a724bd7fae15bb4d3208b3bf27ebb4.jpg',
                    'https://i.pinimg.com/736x/e0/5e/8a/e05e8ae1d096df8189d8626814a89f22--byu-sports-body-poses.jpg',
                    'https://i5.walmartimages.com/asr/62635c26-bc50-4ae0-8263-65596b4d59d6.fd5d5e77be0b997142e0b0445b3c60db.jpeg',
                    'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102011/y_cougar_motensen.ai_.png?itok=fC8WngZD',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOkkeiDBoNfAZzmZ-jrsfiCbRI4rZkNJfJ1g&usqp=CAU',
                    'https://res.cloudinary.com/teepublic/image/private/s--21DHkwPl--/c_crop,x_10,y_10/c_fit,w_932/c_crop,g_north_west,h_1260,w_1260,x_-132,y_-174/co_rgb:36538b,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1260,w_1260/fl_layer_apply,g_north_west,x_-132,y_-174/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1260,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1134,w_1134/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1638401200/production/designs/26000118_0.jpg',
                    ]
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img class='rando' src=${item} width='85'>${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }
        // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        console.log('Winner')
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    in <span class="highlight">${state.totalTime}</span> seconds!
                    
                    Refresh the page if you want to play again!
                </span>
            `
    
            clearInterval(state.loop)
        }, 1000)
    }
}


const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()



