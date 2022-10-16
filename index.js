const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576 //set canvas size

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 160
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    frame: 6
})

const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    color: 'orange',
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    frame: 8,
    offset: {x: 215, y: 157},
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            frame: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            frame: 8
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            frame: 8
        },
        attack2: {
            imageSrc: './img/samuraiMack/Attack2.png',
            frame: 8
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            frame: 8
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            frame: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            frame: 2
        }
    }
})

const enemy = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'red',
    offset: { x: -50, y: 0 },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    frame: 4,
    offset: {x: 215, y: 170}
})

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowUp: { pressed: false }
}

decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'                           //remake the new background for every frame
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    player.switchSprite('idle')
    //left player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }

    //right player movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // check if player jumps
    if (player.velocity.y < 0) {
        player.image = player.sprites.jump.image
        player.frame = player.sprites.jump.frame
    }
    // check if player 1 successfully strikes
    if (detectCollision(player, enemy) && player.isAttacking) {
        enemy.health -= 20
        document.querySelector('#player2Health').style.width = enemy.health + "%"
        console.log('you hit the enemy')
    }
    player.isAttacking = false;

    // check if player 2 successfully strikes
    if (detectCollision(enemy, player) && enemy.isAttacking) {
        player.health -= 20
        document.querySelector('#player1Health').style.width = player.health + "%"
        console.log('enemy hit you')
    }
    enemy.isAttacking = false;

    // end game if a player's health <= 0
    if (player.health <= 0 || enemy.health <= 0) {
        checkHealth(player, enemy, timerID)
    }
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