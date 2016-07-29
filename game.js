//canvas 
var canvas = document.getElementById("gameCanvas"); 
var ctx = canvas.getContext("2d");

//messages
var win_msg = document.getElementById("win_msg");
var lose_msg = document.getElementById("lose_msg");
var reset = document.getElementById("reset");

//score
var startingScore = 0;
var score;

//lives
var lives = 3;
var continueAnimating = false;

//user controls
var rightPressed = false;
var leftPressed = false;

//character
var charWidth = 40;
var charHeight = 75;
var charSpeed = 10;
var character = {
    x: 0,
    y: canvas.height - charHeight,
    width: charWidth,
    height: charHeight,
    charSpeed: charSpeed
}

//falling objects
var dropWidth = 15;
var dropHeight = 14;
var totalDrops = 20;
var drops = [];
for (var i = 0; i < totalDrops; i++) {
    addDrop();
}

function addDrop() {
    var drop = {
        width: dropWidth,
        height: dropHeight,
    }
    resetDrop(drop);
    drops.push(drop);
}

//move the objects to a random position near top of canvas assign random speed
function resetDrop(drop) {
    drop.x = Math.random() * (canvas.width - dropWidth);
    drop.y = 15 + Math.random() * 30;
    drop.speed = 3 + Math.random() * 0.5;
}

//listen for key presses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//listen for mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        character.x = relativeX - charWidth/2;
    }
}

function show(element) { 
    element.style.display = "block";
}

function hide(element) { 
    element.style.display = "none";
}

function isColliding(a, b) {
   return !(b.x > a.x + a.width ||  b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
}

function drawChar() {
    var charImg = new Image();
    charImg.src = "pics/girl23.png";
    ctx.drawImage(charImg, character.x, character.y);
}

function drawFalls() {
    for (var i = 0; i < drops.length; i++) {
        var drop = drops[i];
        var dropImg = new Image();
        dropImg.src = "pics/fire.png";
        ctx.drawImage(dropImg, drop.x, drop.y);
    }
}

function drawLives() {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //clear the canvas
    drawChar();    //draw the char
    drawFalls();    //draw all objects
    drawLives();    //draw the lives
    hide(start);
    //moving character within canvas boundaries
    if(rightPressed && character.x < canvas.width-character.width) {
        character.x += 7;
    } 
    if(leftPressed && character.x > 0) {
        character.x -= 7;
    }
}

function animate() {
    //request another animation frame
    if(continueAnimating) {
        requestAnimationFrame(animate);
    }

    for (var i = 0; i < drops.length; i++) { //test for collision
        var drop = drops[i];
        var dropTotal = drop + 10;
    
        drop.y += drop.speed; //advance the objects

        if (drop.y > canvas.height) { //if the object is below the canvas
            resetDrop(drop);
        }

        if (isColliding(drop, character)) {
            lives--;
            resetDrop(drop);  //main game
        } else if(!lives) {
            clearInterval(timer);
            continueAnimating = false;
            show(lose_msg);
            show(reset);
        }
    }
    draw(); //redraw everything
}

var timer;
function countDown() {
    timer = counter;
    character.x = 0;
    var counter = 20;
       if (!timer) {
        timer = setInterval(function() {
            counter--;
            if (counter >= 0) {
                span = document.getElementById('clock');
                span.innerHTML = 'Timer: ' + counter;
            } 
            if (counter === 0){
                show(win_msg);
                clearInterval(timer);
                continueAnimating = false;
                show(reset);
                hide(start);
            }
        }, 1000);
    }
}

var timer = true;
document.getElementById('start').addEventListener('click', function(){
    character.x = 0;
    for (var i = 0; i < drops.length; i++){
        resetDrop(drops[i]);
    } if (!continueAnimating){
        continueAnimating = true;
        animate();
        countDown();
    } 
});

document.getElementById('reset').addEventListener('click', function(){
    document.location.reload(); //reload the game
}, false);