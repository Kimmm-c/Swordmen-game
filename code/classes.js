class Sprite {
    constructor({ position, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frame = frame
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 5            //hold the same frame 5 times
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image,
            this.currentFrame * (this.image.width / this.frame),
            0,
            this.image.width / this.frame,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.frame * this.scale,
            this.image.height * this.scale)           //canvas function to manipulate graphic
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.currentFrame < this.frame - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }

}

class Fighter extends Sprite {
    constructor({ position, velocity, color, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 }, sprites }) {
        super({
            position,
            imageSrc,
            scale,
            frame,
            offset
        })
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
        this.health = 100
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc

        }
    }

    // draw() {
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height) //fill rectangle representing a Sprite object

    //     //attack unit attached with the player
    //     if (this.isAttacking) {
    //         c.fillStyle = 'blue'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) { // +this.velocity.y because the stop point will be in the air so that we can use gravity
            this.velocity.y = 0
            this.position.y = 329.6
        } else {
            this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    attack() {
        this.isAttacking = true
        this.switchSprite('attack1')
        // setTimeout(() => {
        //     this.isAttacking = false
        // }, 100)
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack1.image
            && this.currentFrame < this.sprites.attack1.frame - 1)
            return
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    player.frame = player.sprites.idle.frame
                    this.currentFrame = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    player.image = player.sprites.run.image
                    player.frame = player.sprites.run.frame
                    this.currentFrame = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    player.image = player.sprites.jump.image
                    player.frame = player.sprites.jump.frame
                    this.currentFrame = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    player.image = player.sprites.fall.image
                    player.frame = player.sprites.fall.frame
                    this.currentFrame = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    player.image = player.sprites.attack1.image
                    player.frame = player.sprites.attack1.frame
                    this.currentFrame = 0
                }
                break;
            case 'attack2':
                if (this.image !== this.sprites.attack2.image) {
                    player.image = player.sprites.attack2.image
                    player.frame = player.sprites.attack2.frame
                    this.currentFrame = 0
                }
                break;

        }


    }
}