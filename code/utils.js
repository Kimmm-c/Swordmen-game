function detectCollision(player1, player2) {
    return (
        player1.attackBox.width + player1.attackBox.position.x >= player2.position.x
        && player1.attackBox.position.x <= player2.position.x + player2.width
        && player1.attackBox.position.y + player1.attackBox.height >= player2.position.y
        && player1.attackBox.position.y <= player2.position.y + player2.height
    )
}

let timer = 60
let timerID
function decreaseTimer() {
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
        timerID = setTimeout(decreaseTimer, 1000)
    } else {
        checkHealth(player, enemy, timerID)
    }
}

function checkHealth(player, enemy, timerid) {
    clearTimeout(timerid)
    if (player.health > enemy.health) {
        document.querySelector('#tie').innerHTML = 'Player 1 wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#tie').innerHTML = 'Player 2 wins'
    } else {
        document.querySelector('#tie').innerHTML = 'Tie'
    }
    document.querySelector('#tie').style.display = 'flex'
}