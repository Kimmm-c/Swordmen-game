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
    offset: { x: 215, y: 157 },
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
            frame: 6
        },
        attack2: {
            imageSrc: './img/samuraiMack/Attack2.png',
            frame: 6
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            frame: 2
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            frame: 6
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            frame: 2
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take hit - white silhouette.png',
            frame: 4
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y: 50
        },
        width: 220,
        height: 50

    }
})

const enemy = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'red',
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    frame: 4,
    offset: { x: 215, y: 170 },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frame: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frame: 8
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            frame: 4
        },
        attack2: {
            imageSrc: './img/kenji/Attack2.png',
            frame: 6
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            frame: 2
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            frame: 7
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            frame: 2
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            frame: 3
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 50,
        },
        width: 200,
        height: 50

    }

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


    //left player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //right player movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // check if player 1 jumps
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }

    //player 1 landing
    if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // player 2 jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }

    //player 2 landing
    if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // check if player 1 successfully strikes
    if (detectCollision(player, enemy) && player.isAttacking && player.currentFrame === 4) {
        enemy.takeHit()
        document.querySelector('#player2Health').style.width = enemy.health + "%"
        console.log('you hit the enemy')
        player.isAttacking = false;
    }

    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false;
    }


    // check if player 2 successfully strikes
    if (detectCollision(enemy, player) && enemy.isAttacking && enemy.currentFrame === 2) {
        player.takeHit()
        document.querySelector('#player1Health').style.width = player.health + "%"
        console.log('enemy hit you')
        enemy.isAttacking = false;
    }

    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false;
    }

    // end game if a player's health <= 0
    if (player.health <= 0 || enemy.health <= 0) {
        checkHealth(player, enemy, timerID)
    }
}

animate()

window.addEventListener('keydown', (e) => {         //function fired when a key on the keyboard is pressed
    if (!player.dead) {
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

            //left player attacks
            case ' ':
                player.attack()
                break;
        }
    }
    if (!enemy.dead) {
        switch (e.key) {
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
            //right player attacks
            case 'l':
                enemy.attack()
                break;
        }
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