const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576 //set canvas size

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({ position, velocity, color, offset }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height) //fill rectangle representing a Sprite object

        //attack unit attached with the player
        if (this.isAttacking) {
            c.fillStyle = 'blue'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) { // +this.velocity.y because the stop point will be in the air so that we can use gravity
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    attack() {
        this.isAttacking = true
        // setTimeout(() => {
        //     this.isAttacking = false
        // }, 100)
    }
}

const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    color: 'orange',
    offset: {x: 0, y: 0}
})

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'red',
    offset: {x: -50, y: 0}
})

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowUp: { pressed: false }
}

function detectCollision(player1, player2) {
    return (
        player1.attackBox.width + player1.attackBox.position.x >= player2.position.x
        && player1.attackBox.position.x <= player2.position.x + player2.width
        && player1.attackBox.position.y + player1.attackBox.height >= player2.position.y
        && player1.attackBox.position.y <= player2.position.y + player2.height
    )
}
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'                           //remake the new background for every frame
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //left player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //right player movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // check if player 1 successfully strikes
    if (detectCollision(player, enemy) && player.isAttacking) {
        console.log('you hit the enemy')
    }
    player.isAttacking = false;

    // check if player 2 successfully strikes
    if (detectCollision(enemy, player) && enemy.isAttacking) {
        console.log('enemy hit you')
    }
    enemy.isAttacking = false;

}

animate()

window.addEventListener('keydown', (e) => {         //function fired when a key on the keyboard is pressed
    switch (e.key) {
        //left player moves
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -20
            break;

        //right player moves
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;

        //left player attacks
        case ' ':
            player.attack()
            break;

        //right player attacks
        case 'l':
            enemy.attack()
            break;
    }
})

window.addEventListener('keyup', (e) => {         //function fired when we let go of the key
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 'ArrowUp':
            keys.w.pressed = false
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break;
    }
})