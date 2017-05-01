var pacman = {};
var ghostOne = {};
var ghostTwo = {};
var ghostThree = {};
var board;
var score;
var pac_color;
var start_time;
var time_remaining;
var interval;
var ghostInterval;
var bonusInterval;
var timerInterval;
var direction = 4;
var numOfGhosts;
var ghostOneImage;
var ghostTwoImage;
var ghostThreeImage;
var lives;
var rows = 10;
var cols = 15;
var ghostsArray;
var bonusEaten = false;
var bonusImg;
var bonus = {};
var audio;
var color5ball;
var color15ball;
var color25ball;
var level;
var canvas;
var context;
var MAX_SCORE;

//Start();

function Start() {

    resetGame();

    // $("#gameSettings").hide();
    $("#gameContent").show();

    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");

    //set the var from setting;
    numOfGhosts = document.getElementById("numOfMonsters").value;
    time_remaining = document.getElementById("gameTime").value;
    var food_remainTotal = document.getElementById("ballNum").value;
    color5ball = document.getElementById("color5ball").value;
    color15ball = document.getElementById("color15ball").value;
    color25ball = document.getElementById("color25ball").value;
    level = document.getElementById("difficultyLevel").value;
    audio = new Audio('images\\dontstopme.mp3');
    playAudio();
    lives = 3;
    board = [];
    score = 0;
    pac_color = "yellow";
    var cnt = 151;
    var food5pt = Math.floor(0.6 * food_remainTotal);
    var food15pt = Math.floor(0.3 * food_remainTotal);
    var food25pt = Math.floor(0.1 * food_remainTotal);
    MAX_SCORE = food5pt * 5 + food15pt * 15 + food25pt * 25;

    var pacman_remain = 1;
    start_time = new Date();
    bonusImg = new Image();
    bonusImg.src = "images/pizza.png";
    ghostOneImage = new Image();
    ghostOneImage.src = "images/ghost1.png";
    if (numOfGhosts > 1) {
        ghostTwoImage = new Image();
        ghostTwoImage.src = "images/ghost2.png";
    }
    if (numOfGhosts > 2) {
        ghostThreeImage = new Image();
        ghostThreeImage.src = "images/ghost3.png";
    }

    //create cols
    for (var i = 0; i < cols; i++) {
        board[i] = [];
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < rows; j++) {
            if ((i == 3 && j == 3) || (i == 3 && j == 4) || (i == 3 && j == 5) || (i == 6 && j == 1) || (i == 6 && j == 2) || (i == 8 && j == 5) || (i == 8 && j == 6) || (i == 13 && j == 1) || (i == 13 && j == 0)
                || (i == 2 && j == 5) || (i == 1 && j == 5) || (i == 0 && j == 5) || (i == 9 && j == 6) || (i == 10 && j == 6)) {
                board[i][j] = 4;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= food_remainTotal / cnt) {
                    food_remainTotal--;
                    if (food5pt > 0) {
                        board[i][j] = 5;
                        food5pt--;
                    }
                    else if (food15pt > 0) {
                        board[i][j] = 15;
                        food15pt--;
                    }
                    else if (food25pt > 0) {
                        board[i][j] = 25;
                        food25pt--;
                    }

                } else if (randomNum < (pacman_remain + food_remainTotal) / cnt) {
                    pacman.i = i;
                    pacman.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }

        //put bonus in place
        bonus.i = cols - 1;
        bonus.j = 0;
        //put ghosts in corners
        ghostOne.i = 0;
        ghostOne.j = 0;
        if (numOfGhosts > 1) {
            ghostTwo.i = cols - 1;
            ghostTwo.j = rows - 1;
        }
        if (numOfGhosts > 2) {
            ghostThree.i = 0;
            ghostThree.j = rows - 1;
        }
        ghostsArray = new Array(ghostOne, ghostTwo, ghostThree);
    }
    while (food_remainTotal > 0) {
        var emptyCell = findRandomEmptyCell(board);
        if (food5pt > 0) {
            board[emptyCell[0]][emptyCell[1]] = 5;
            food5pt--;
        }
        else if (food15pt > 0) {
            board[emptyCell[0]][emptyCell[1]] = 15;
            food15pt--;
        }
        else if (food25pt > 0) {
            board[emptyCell[0]][emptyCell[1]] = 25;
            food25pt--;
        }
        food_remainTotal--;
    }

    //set lives to 3
    $("#lives").prepend('<img id="life_1" src="images/emoji.png" style="width: 30px"/>');
    $("#lives").prepend('<img id="life_2" src="images/emoji.png" style="width: 30px"/>');
    $("#lives").prepend('<img id="life_3" src="images/emoji.png" style="width: 30px"/>');

    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval = setInterval(UpdatePosition, 100);
    ghostInterval = setInterval(moveGhosts, level);
    bonusInterval = setInterval(moveBonus, 350);
    timerInterval = setInterval(timer, 1000);

}

function timer() {
    time_remaining = time_remaining - 1;
    if (time_remaining <= 0) {
        window.clearInterval(timerInterval);
        if(score<150){
            endGame("You Lost!");
        }
        else {
            endGame("We have a Winner!!!");
        }
    }

}

function Draw(x) {
    canvas.width = canvas.width; //clean board
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    lblScore.value = score;
    lblTime.value = time_remaining;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var center = {};
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            //pacman
            if (board[i][j] === 2) {
                ChangePacmanDir(direction, center);
            }

            //ball
            else if (board[i][j] === 5 || board[i][j] === 15 || board[i][j] === 25) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                var colorBall;
                if (board[i][j] === 5)
                    colorBall = color5ball;
                if (board[i][j] === 15)
                    colorBall = color15ball;
                if (board[i][j] === 25)
                    colorBall = color25ball;
                context.fillStyle = colorBall; //color
                context.fill();
                context.font = '8pt Calibri';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText(board[i][j], center.x, center.y);

            }

            //obstacle
            else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "darkBlue"; //color
                context.fill();
            }
        }
    }
    //draw bonus
    if (bonusEaten == false) {
        context.drawImage(bonusImg, bonus.i * 60 + 3, bonus.j * 60 + 3, 45, 45);
    }
    //draw ghosts
    context.drawImage(ghostOneImage, ghostOne.i * 60 + 3, ghostOne.j * 60 + 3, 45, 45);
    if (numOfGhosts > 1)
        context.drawImage(ghostTwoImage, ghostTwo.i * 60 + 3, ghostTwo.j * 60 + 3, 45, 45);
    if (numOfGhosts > 2)
        context.drawImage(ghostThreeImage, ghostThree.i * 60 + 3, ghostThree.j * 60 + 3, 45, 45);
}

function UpdatePosition() {
    board[pacman.i][pacman.j] = 0;
    x = GetKeyPressed();
    if (x !== -1) {
        direction = x;
    }
    //check up
    if (x === 1) {
        if (pacman.j > 0 && board[pacman.i][pacman.j - 1] !== 4) {
            pacman.j--;
        }
    }
    //check down
    if (x === 2) {
        if (pacman.j < rows - 1 && board[pacman.i][pacman.j + 1] !== 4) {
            pacman.j++;
        }
    }
    //check left
    if (x === 3) {
        if (pacman.i > 0 && board[pacman.i - 1][pacman.j] !== 4) {
            pacman.i--;
        }
    }
    //check right
    if (x === 4) {
        if (pacman.i < cols - 1 && board[pacman.i + 1][pacman.j] !== 4) {
            pacman.i++;
        }
    }

    //eat a ball
    if (board[pacman.i][pacman.j] === 5 || board[pacman.i][pacman.j] === 15 || board[pacman.i][pacman.j] === 25) {
        score = score + board[pacman.i][pacman.j];
    }

    //eat bonus
    if (bonus.i === pacman.i && bonus.j === pacman.j && bonusEaten === false) {
        bonusEaten = true;
        score = score + 50;
    }
    //meet ghost
    if (pacman.i === ghostOne.i && pacman.j === ghostOne.j || (numOfGhosts > 1 && pacman.i === ghostTwo.i && pacman.j === ghostTwo.j) || (numOfGhosts == 3 && pacman.i === ghostThree.i && pacman.j === ghostThree.j)) {
        hitGhost();
    }
    else {
        board[pacman.i][pacman.j] = 2;
        if (score >= MAX_SCORE) {
            endGame("We have a Winner!!!");
        }
        else {
            Draw(direction);
        }
    }
}

function endGame(message) {
    resetAllToNormal();
    removeImages();
    window.alert(message);
}

function resetGame() {
    resetAllToNormal();
    removeImages();
}

function resetAllToNormal() {
    if(audio != null) {
        audio.pause();
        audio.currentTime = 0;
    }

    bonusEaten = false;
    window.clearInterval(interval);
    window.clearInterval(ghostInterval);
    window.clearInterval(bonusInterval);
    window.clearInterval(timerInterval);
}

function removeImages() {
    $("#life_1").remove();
    $("#life_2").remove();
    $("#life_3").remove();
}

function moveBonus() {
    var optionsToMove = [];
    var moves = 0;
    var chosenDir;
    if (bonus.i - 1 >= 0 && board[bonus.i - 1][bonus.j] != 4) {
        optionsToMove.push("left");
        moves++;
    }
    if (bonus.i + 1 < cols && board[bonus.i + 1][bonus.j] != 4) {
        moves++;
        optionsToMove.push("right");
    }
    if (bonus.j + 1 < rows && board[bonus.i][bonus.j + 1] != 4) {
        moves++;
        optionsToMove.push("down");
    }
    if (bonus.j - 1 >= 0 && board[bonus.i][bonus.j - 1] != 4) {
        moves++;
        optionsToMove.push("up");
    }
    chosenDir = Math.floor(Math.random() * moves);
    switch (optionsToMove[chosenDir]) {
        case "left":
            bonus.i -= 1;
            break;
        case "right":
            bonus.i += 1;
            break;
        case "down":
            bonus.j += 1;
            break;
        case "up":
            bonus.j -= 1;
            break;
    }

}

function moveGhosts() {
    var distances = [];
    for (var ghostIndex = 0; ghostIndex < numOfGhosts; ghostIndex++) {
        //check left
        if (ghostsArray[ghostIndex].i - 1 < 0 || board[ghostsArray[ghostIndex].i - 1][ghostsArray[ghostIndex].j] === 4) {
            distances[0] = Number.MAX_VALUE;
        }
        else {
            distances[0] = Math.abs((ghostsArray[ghostIndex].i) - 1 - pacman.i) + Math.abs(ghostsArray[ghostIndex].j - pacman.j);
        }

        //check right
        if (ghostsArray[ghostIndex].i + 1 >= cols || board[ghostsArray[ghostIndex].i + 1][ghostsArray[ghostIndex].j] === 4) {
            distances[1] = Number.MAX_VALUE;
        }
        else {
            distances[1] = Math.abs((ghostsArray[ghostIndex].i) + 1 - pacman.i) + Math.abs(ghostsArray[ghostIndex].j - pacman.j);
        }

        //check down
        if (ghostsArray[ghostIndex].j + 1 >= rows || board[ghostsArray[ghostIndex].i][ghostsArray[ghostIndex].j + 1] === 4) {
            distances[2] = Number.MAX_VALUE;
        }
        else {
            distances[2] = Math.abs(ghostsArray[ghostIndex].i - pacman.i) + Math.abs((ghostsArray[ghostIndex].j) + 1 - pacman.j);
        }

        //check left
        if (ghostsArray[ghostIndex].j - 1 < 0 || board[ghostsArray[ghostIndex].i][ghostsArray[ghostIndex].j - 1] === 4) {
            distances[3] = Number.MAX_VALUE;
        }
        else {
            distances[3] = Math.abs(ghostsArray[ghostIndex].i - pacman.i) + Math.abs((ghostsArray[ghostIndex].j) - 1 - pacman.j);
        }

        //find min distance
        var min = Number.MAX_VALUE;
        var minIndexDirection;
        for (var index = 0; index <= 3; index++) {
            if (distances[index] < min) {
                min = distances[index];
                minIndexDirection = index;
            }
        }

        //change ghost location according to min distance to pacman
        switch (minIndexDirection) {
            case 0:
                ghostsArray[ghostIndex].i -= 1;
                break;
            case 1:
                ghostsArray[ghostIndex].i += 1;
                break;
            case 2:
                ghostsArray[ghostIndex].j += 1;
                break;
            case 3:
                ghostsArray[ghostIndex].j -= 1;
                break;
        }
    }


}

function ChangePacmanDir(x, center) {
    var shapeAdjust1, shapeAdjust2;
    var eyeAdjust1, eyeAdjust2;

    //pressed right
    if (x === 4) {
        shapeAdjust1 = 0.15;
        shapeAdjust2 = 1.85;
        eyeAdjust1 = 5;
        eyeAdjust2 = -15;
    }

    //pressed left
    if (x === 3) {
        shapeAdjust1 = 1.15;
        shapeAdjust2 = 0.85;
        eyeAdjust1 = 5;
        eyeAdjust2 = -15;
    }

    //pressed down
    if (x === 2) {
        shapeAdjust1 = 0.7;
        shapeAdjust2 = 0.3;
        eyeAdjust1 = 10;
        eyeAdjust2 = -10;

    }

    //pressed up
    if (x === 1) {
        shapeAdjust1 = 1.7;
        shapeAdjust2 = 1.3;
        eyeAdjust1 = 16;
        eyeAdjust2 = -5;

    }

    context.beginPath();
    context.arc(center.x, center.y, 30, Math.PI * shapeAdjust1, shapeAdjust2 * Math.PI); // half circle
    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(center.x + eyeAdjust1, center.y + eyeAdjust2, 5, 0, 2 * Math.PI); // circle
    context.fillStyle = "black"; //color
    context.fill();
}

function hitGhost() {
    audio.pause();
    var lifeLostSound = new Audio('images\\lostLife.mp3');
    lifeLostSound.play();
    playAudio();
    var emptyCell = findRandomEmptyCell(board);
    pacman.i = emptyCell[0];
    pacman.j = emptyCell[1];
    //Draw(direction);
    lives--;
    if (lives == 0) {
        $("#life_3").remove();
        endGame("You Lost!");
    }
    if (lives == 2) {
        $("#life_1").remove();
    }
    if (lives == 1) {
        $("#life_2").remove();
    }
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    //up
    if (keysDown[38]) {
        return 1;
    }
    //down
    if (keysDown[40]) {
        return 2;
    }
    //left
    if (keysDown[37]) {
        return 3;
    }
    //right
    if (keysDown[39]) {
        return 4;
    }

    return -1;
}

function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * (cols - 1)) + 1);
    var j = Math.floor((Math.random() * (rows - 1)) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * (cols - 1)) + 1);
        j = Math.floor((Math.random() * (rows - 1)) + 1);
    }
    return [i, j];
}

function playAudio() {
    if (audio!=null) {
        // audio.play();
    }
}

//disable scroll through arrow keys
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
