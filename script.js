const boxWidth = 600;  //600    
const boxHeight = 600;  //600
const elementsX = 30;       //50
const elementsY = 30;   //50
const elementWidth = Math.floor(boxWidth / elementsX);
const elementHeight = Math.floor(boxHeight / elementsY);
const boxXelements = Math.floor(boxWidth / elementWidth);
const boxYelements = Math.floor(boxHeight / elementHeight);
const boxEnemyCount = 5;
const boxFriendCount = 50;
const backGroundColor = "red";
var cvs = document.createElement('canvas');

cvs.id = "gameCanvas";
cvs.width = boxWidth;
cvs.height = boxHeight;
cvs.style.border = "1px solid";
cvs.style.display = "block";  
cvs.style.margin = "0 auto"; // cvs.style.margin = "0 auto";
//cvs.style.margin = "-21px 0px 0px -21px";
cvs.style.background = backGroundColor;
cvs.style.padding = "0px";
var body = document.getElementById("gameBox");
body.appendChild(cvs);

const ctx = cvs.getContext("2d");

          
const friendImg = new Image();
friendImg.src = "friend.png";
const enemyImg = new Image();
enemyImg.src = "enemy.png";

const snakeheadImg = new Image();
snakeheadImg.src = "snake2.png";

let snake = [];

snake[0] = {
    x : elementWidth*(boxXelements/2),
    y : elementHeight*(boxYelements/2)
};

function getNewElement(){
    return{
        x : Math.floor(Math.random()*boxXelements)* elementWidth,
        y : Math.floor(Math.random()*boxYelements)*elementHeight
    };
}
// create the friend
let friends= [];
for(let i = 0; i < boxFriendCount; i++){
    friends.push( getNewElement());
}

// create the enemy

let enemy = getNewElement();

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas
const enemies=3;
function draw(recursive=false,isFriend=null){
// old head position
let snakeX = snake[0].x;    
let snakeY = snake[0].y;
    
    ctx.fillStyle = backGroundColor;
    ctx.fillRect(0, 0, boxWidth, boxHeight);

    for( let i = 0; i < snake.length ; i++){
        
        if (i == 0) {
            ctx.drawImage(snakeheadImg, snake[i].x,snake[i].y,elementWidth,elementHeight);
        } 
         else {
           //ctx.fillStyle = ( i == 0 )? snakeheadImg.src : "black";
            ctx.fillStyle = "black";
            ctx.fillRect(snake[i].x,snake[i].y,elementWidth,elementHeight);
            
            ctx.strokeStyle = "red";
            ctx.strokeRect(snake[i].x,snake[i].y,elementWidth,elementHeight);
         }
        
    }

    for( let i = 0; i < friends.length ; i++){
        ctx.drawImage(friendImg, friends[i].x, friends[i].y,elementWidth,elementHeight);
    }

    ctx.drawImage(enemyImg, enemy.x, enemy.y,elementWidth,elementHeight);    
    

    // which direction
    if( d == "LEFT") snakeX -= elementWidth;
    if( d == "UP") snakeY -= elementHeight;
    if( d == "RIGHT") snakeX += elementWidth;
    if( d == "DOWN") snakeY += elementHeight;     
    if( d == "A") snakeX -= elementWidth;
    if( d == "W") snakeY -= elementHeight;
    if( d == "D") snakeX += elementWidth;
    if( d == "S") snakeY += elementHeight;
    let foundfriend = false;
    let foundenemy= false;
    // if the snake eats the friend
    if( collision({x:snakeX,y:snakeY},friends)){

        score=score+1;
        //friends.push(friend);
        let friend = getNewElement();
        friends.push(friend);
        foundfriend=true;

        // we don't remove the tail
    }
    // if the snake eats the enemy
    else if(snakeX == enemy.x && snakeY == enemy.y){ // Check Enemies vector for current position
        score=score-1;

        enemy =getNewElement();
        
        foundenemy=true;
        snake.pop(); 
        snake.pop(); 

        // we don't remove the tail
    }else{ 
        if(!recursive && isFriend == null){
            snake.pop(); 
    }   else if(recursive && !isFriend){
            snake.pop(); 

        }
    }

    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over


    if(snakeX <= -1 || snakeX >= boxWidth|| snakeY <=-1 || snakeY >= boxHeight ){
        //f(snakeX <= 0 || snakeX >= boxWidth|| snakeY <= 0|| snakeY >= boxHeight || collision(newHead,snake)){
        
         clearInterval(game);
        return;
    }
    
    snake.unshift(newHead);
    
    if(foundfriend){
           draw(true,true);
    }else if(foundenemy){
            draw(true,false);
    }   
            
    // Create grid
     
   /*
   
   for (i = 0; i < boxWidth; i += elementWidth) {
        ctx.moveTo(0, i);
        ctx.lineTo(boxWidth, i);
        ctx.stroke();
    }
    for (i = 0; i <boxHeight; i += elementHeight) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i,boxHeight);
        ctx.stroke();
    }
    
    */
}

// call draw function every 100 ms

let game = setInterval(draw,100);