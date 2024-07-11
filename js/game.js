const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // ctx = context (contexto)

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span") // pegando o span de dentro do "final-score"
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')

const audio = new Audio('sounds/coin.mp3')

const size = 30
    

const initalPosition = {x: 270, y: 240}

let snake = [
    { x: 270, y: 240 },
]

const addScore = () => {
    score.innerHTML = +score.innerHTML + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = (min, max) => {
    const number = randomNumber(0, canvas.width - size) // para a comida não ficar fora do grid, se retira o tamanho do bloco do tamanho do canvas
    return Math.round(number / 30) * 30// esse calculo dá muitos números "quebrados" por isso esta em ".round"
}

const food = {
    x: randomPosition(0, 570),
    y: randomPosition(0, 570),
    color: 'red'
}

let direction, loopId // loopId fica aqui para poder se chamada mais tarde antes da declaração do que ela faz, para que o loop anterior possa ser limpo antes de executar ele novamente

const drawFood = () => {

    const { x, y, color } = food //food carrega com si, sua cor, e cordenadas, então não se tem a necessidade de puxar "food" e o atributo definido

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(food.x, food.y, size, size) // tamanho x e y da comida/ variavel imutavel (const) de nome food, e o tamanho definido como padrão para o jogo
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = '#0e420b'

    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = '#238d1d' // colore o ultimo elemento, que é a cabeça da cobra
        }

        ctx.fillRect(position.x, position.y, size, size) // posição x, posição y (vertical e horizontal, "size, size" = tamanho declarado na variável fixa de nome size)
    })
}

const moveSnake = () => {
    if (!direction) return // se não tiver indo para lado nenhum, não executa o comando de colocar e tirar blocos abaixo

    const head = snake[snake.length - 1]


    if (direction == 'right') {
        snake.push({ x: head.x + size, y: head.y }) //adiciona um bloco como primeiro na direção que a cobra está andando 
    }
    if (direction == 'left') {
        snake.push({ x: head.x - size, y: head.y }) //adiciona um bloco como primeiro na direção que a cobra está andando 
    }
    if (direction == 'up') {
        snake.push({ x: head.x, y: head.y - size }) //adiciona um bloco como primeiro na direção que a cobra está andando 
    }
    if (direction == 'down') {
        snake.push({ x: head.x, y: head.y + size }) //adiciona um bloco como primeiro na direção que a cobra está andando 
    }

    snake.shift() //remove o ultimo elemento da array 
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#19191'

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }

}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        addScore()
        snake.push(head) // verifica se a posição da cabeça da cobra é a mesma da comida e adicona mais um bloco no corpo da cobra (no mesmo esquema já visto antes: adiciona um bloco a frente, e exclui o ultimo de trás para a cobra se movimentar)
        audio.play() // se a cobra passar por cima, reproduz o audio

        food.x = randomPosition(),
            food.y = randomPosition()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition
            y = randomPosition // quando a cobra está grande de mais, a comida gera em baixo do corpo dela as vezes, esse while faz com que, se o corpo da cobra estiver passando por cima do local onde seria gerada a comida, ela rode o loop ate achar um lugar onde o corpo da cobra não esteja passando por cima
        }
        food.x = x
        food.y = y
    }

}

const checkCrash = () => {
    const head = snake[snake.length - 1] 
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2 // verifica a partir de pescoço(um bloco após a cabeça da cobra)


    const wallCrash =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y // se a cobra colidir com ela mesma em qualaquer ponto de sua extensão/cauda, tambem é resetado o jogo
    })

    if (wallCrash || selfCollision ) {
        gameOver() // se a posição de algum ponto do corpo passar de 570 o navegador vai exibir essa mensagem
    }
}

const gameOver = () => {
    direction = undefined

    menu.style. display = 'flex'
    finalScore.innerHTML = score.innerHTML

}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600) //limpa o quadrado movido para frente para que um novo possa ser adicionado
    drawGrid() // desenha as grades
    drawFood() // posiciona a comida
    moveSnake() // move a cobra ou se ainda não teve movimento posiciona ela no local default
    drawSnake() //executa/cria um pixel/bloco da cobra
    checkEat() // verifica se a cobra comeu o objeto
    checkCrash() // se você bater na parede voce perde por conta dessa função
    loopId = setTimeout(() => {
        gameLoop()
    }, 220) // ms
}

gameLoop() //executa o jogo 

document.addEventListener('keydown', ({ key }) => { // possibilita o console pegar informações de qual tecla está sendo pressionada no seu teclado
    if (key == 'ArrowRight' && direction != 'left') {
        direction = 'right'
    }

    if (key == 'ArrowLeft' && direction != 'right') {
        direction = 'left'
    }

    if (key == 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }

    if (key == 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }

    // "&& direction != 'alguma direção' " é usado para que a cobra não possa mudar de posição de um lado posto a outro
})

buttonPlay.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = 'none'

    snake = [initalPosition]
})