const gameBoard = document.getElementById("gameBoard")
const racket = document.getElementById("racket")
const ball = document.getElementById("ball")

var fail = false;

var gameLevel = [
    { x: 100, y: 100},
    { x: 400, y: 100},
    { x: 150, y: 200},
    { x: 300, y: 200},
]

gameLevel.forEach(createBrick)

var racketObj = {
    X: racket.offsetLeft,
    Y: racket.offsetTop,
    L: racket.clientWidth,
    dX: 10,
}

var ballObj = {
    X: ball.offsetLeft,
    Y: ball.offsetTop,
    L: ball.offsetHeight,
    R: 20,
    dX: 3,
    dY: -3,
}

function onArrowKeyDown(ev) {
    console.dir(ev)
    if (ev.code == "ArrowRight" && (racketObj.X + racketObj.L + racketObj.dX < gameBoard.clientWidth)) {
        racketObj.X += racketObj.dX
    }

    if ((ev.code == "ArrowLeft") && (racketObj.X > racketObj.dX)) {
        racketObj.X -= racketObj.dX
    }

    racket.style.left = racketObj.X + "px"
}

document.addEventListener("keydown", onArrowKeyDown)

function moveBall() {
    if(ballObj.dX < 0 && ballObj.X <= 0) {
        ballObj.dX *= -1
    }

    if(ballObj.dY < 0 && ballObj.Y <= 0) {
        ballObj.dY *= -1
    }

    if(ballObj.dX > 0 && ballObj.X + ballObj.L >= gameBoard.clientWidth) {
        ballObj.dX *= -1
    }

    if(ballObj.dY > 0 && ballObj.Y + ballObj.L >= gameBoard.clientHeight) {
        fail = true;
    }
	
	if (ballObj.Y + ballObj.L >= racketObj.Y
      && ballObj.X + ballObj.R >= racketObj.X
      && ballObj.X + ballObj.R <= racketObj.X + racket.clientWidth
   ) {
      ballObj.dY *= -1
   }

    var bricks = Array.from(document.getElementsByClassName("brick"));
    bricks.forEach(checkCollapse)

    ballObj.X += ballObj.dX;
    ballObj.Y += ballObj.dY;

    ball.style.left = ballObj.X + "px"
    ball.style.top = ballObj.Y + "px"

    if(!fail && bricks.length > 0) {
        window.requestAnimationFrame(moveBall)
    }
    else {
        //alert("Game Over")
        if(confirm(`${fail ? "Game Over" : "You won"}!\nClick \"OK\" to restart`)){
            window.location.reload();  
        }
    }
}

window.requestAnimationFrame(moveBall)

function createBrick(brick) {
    var el = document.createElement("div")
    el.classList.add("brick")
    el.style.top = brick.y + "px"
    el.style.left = brick.x + "px"

    gameBoard.appendChild(el)
}

function checkCollapse(brick) {
    const x = brick.offsetLeft;
    const y = brick.offsetTop;
    const lr = x + brick.offsetWidth - ballObj.X;
    const ll = ballObj.X + ballObj.L - x;
    const lt = ballObj.Y + ballObj.L - y;
    const ld = y + brick.offsetHeight - ballObj.Y;
    if (lr>0 && ll>0 && lt>0 && ld>0) {
        gameBoard.removeChild(brick);
        if(((Math.abs(lr) < Math.abs(ll)) && (Math.abs(lr) < Math.abs(lt)) && (Math.abs(lr) < Math.abs(ld))) || ((Math.abs(ll) < Math.abs(lr)) && (Math.abs(ll) < Math.abs(lt)) && (Math.abs(ll) < Math.abs(ld)))) {
            ballObj.dX *= -1
        }
        else if(((Math.abs(lt) < Math.abs(lr)) && (Math.abs(lt) < Math.abs(ll)) && (Math.abs(lt) < Math.abs(ld))) || ((Math.abs(ld) < Math.abs(lr)) && (Math.abs(ld) < Math.abs(ll)) && (Math.abs(ld) < Math.abs(lt)))) {
            ballObj.dY *= -1
        }
    }
}