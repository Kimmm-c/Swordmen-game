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
    constructor({ position, velocity, color, imageSrc, scale = 1, frame = 1, offset = { x: 0, y: 0 } }) {
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