var game;
var background;
var character;
var missiles;
var num_missiles = 999;
var currentMissile = 0;
var delay = .5;
var timer;
var elapsedTime;
var eMissiles;
var num_eMissiles = 999;
var currentEMissile = 0;
var delay2 = .5;
var gameTimer;
var gameElapsedTime;
var maxTime = 30;
var r = Math.random();
var death;
var output;

function Character(){
    tCharacter = new Sprite(game, "rpg_sprite_walk.png", 192, 128);
    tCharacter.loadAnimation(192, 128, 24, 32);
    tCharacter.generateAnimationCycles();
    tCharacter.renameCycles(new Array("down", "up", "left", "right"));
    tCharacter.setAnimationSpeed(500);

    tCharacter.setSpeed(0);
    tCharacter.setPosition(50, 150);
    tCharacter.direction = 180;
    tCharacter.health = 10;
    tCharacter.pauseAnimation();
    tCharacter.setCurrentCycle("down");

    tCharacter.checkKeys = function(){
        elapsedTime = timer.getElapsedTime();
        if (keysDown[K_A]){
            this.changeXby(-2);
            this.direction = 270;
            this.setMoveAngle(270);
            this.setCurrentCycle("left");
        }
        if (keysDown[K_D]){
            this.changeXby(2);
            this.direction = 90;
            this.setMoveAngle(90);
            this.setCurrentCycle("right");
        }                
        if (keysDown[K_W]){
            this.changeYby(-2);
            this.direction = 0;
            this.setMoveAngle(0);
            this.setCurrentCycle("up");
        }                
        if (keysDown[K_S]){
            this.changeYby(2);
            this.direction = 180;
            this.setMoveAngle(180);
            this.setCurrentCycle("down");
        }                
        
        if (keysDown[K_SPACE]){ /* Talk to people, attack stuff, inspect stuff */
            this.setSpeed(0);
            this.pauseAnimation();
            if (elapsedTime > delay){
                currentMissile++;
                if (currentMissile > num_missiles){
                    currentMissile = 0;
                }
                missiles[currentMissile].fire();
                timer.reset();
            }
        }
    }

    tCharacter.checkBounds = function(){
        if (this.x < 12){
            this.setPosition(12, this.y);
            this.setSpeed(0);
        }
        if (this.x > 788){
            this.setPosition(788, this.y);
            this.setSpeed(0);
        }
        if (this.y < 12){
            this.setPosition(this.x, 12);
            this.setSpeed(0);
        }
        if (this.y > 588){
            this.setPosition(this.x, 588);
            this.setSpeed(0);
        }
    }

    return tCharacter;
}

function Enemy () {
    tEnemy= new Sprite(game,"enemy.jpeg",27,56);
    tEnemy.setPosition(650,450);
    tEnemy.health = 15;
    tEnemy.horVert = Math.random();
    console.log(tEnemy.horVert);
    if (tEnemy.horVert < 0.5){
        tEnemy.setDX(-5);
        tEnemy.setDY(0);
        tEnemy.direction = 270;
    }
    else{
        tEnemy.setDX(0);
        tEnemy.setDY(-5);
        tEnemy.direction = 0;
    }

    tEnemy.checkFiring = function(){
        elapsedTime = timer.getElapsedTime();
        if (keysDown[K_Q]){
            if (elapsedTime > delay){
                currentEMissile++;
            }
            if (currentEMissile > num_eMissiles){
                currentEMissile = 0;
            }
            eMissiles[currentEMissile].fire();
            timer.reset();
        }
    }

    tEnemy.checkBounds = function(){
        if (this.x < 50){
            this.setPosition(50, this.y);
            this.setDX(0);
            this.setDY(-5);
        }
        if (this.x > 700){
            this.setPosition(700, this.y);
            this.setDX(0);
            this.setDY(5);
        }
        if (this.y < 50){
            this.setPosition(this.x, 50);
            this.setDX(5);
            this.setDY(0);
        }
        if (this.y > 460){
            this.setPosition(this.x, 460);
            this.setDX(-5);
            this.setDY(0);
        }
    }

    tEnemy.checkCollisions = function(){
        if (this.distanceTo(character) <= 10){
            character.health -= 2;
            console.log(character.health);
            if (character.health <= 0){
                character.hide();
                game.stop();
                death = new GameButton("You have died; game over.");
                death.setPosition(20, 600);
                death.setSize(600, 100);
            }
        }
    }
    return tEnemy;
}

function Missile(){
    tMissile = new Sprite(game, "missile.png", 30, 20);
    tMissile.hide();
    
    tMissile.fire = function(){
        this.show();
        this.setSpeed(15);
        this.setBoundAction(DIE);
        this.setPosition(character.x, character.y);
        this.setAngle(character.direction);
        this.setSpeed(15);
    } // end fire

    tMissile.checkCollisions = function(){
        if (this.distanceTo(enemy) <= 10){
            this.hide();
            enemy.health -= 5;
            console.log(enemy.health);
            if (enemy.health <= 0){
                enemy.hide();
            }
        }
    }
    
    return tMissile;
} // end missile def

function makeMissiles(){
    missiles = new Array(num_missiles);
    for (i = 0; i < num_missiles; i++){
        missiles[i] = new Missile();
    }
}

function updateMissiles(){
    for (i = 0; i < num_missiles; i++){
        missiles[i].checkCollisions();
        missiles[i].update();
    }
}

function Emissile(){
    tEmissile = new Sprite(game, "missile.png", 30, 20);
    tEmissile.hide();
    
    tEmissile.fire = function(){
        this.show();
        this.setSpeed(15);
        this.setBoundAction(DIE);
        this.setPosition(enemy.x, enemy.y);
        this.setAngle(enemy.direction);
        this.setSpeed(15);
    } // end fire

    tEmissile.checkCollisions = function(){
        if (this.distanceTo(character) <= 10){
            this.hide();
            character.health -= 3;
            console.log(character.health);
            if (character.health <= 0){
                character.hide();
                game.stop();
                death = new GameButton("You have died; game over.");
                death.setPosition(20, 600);
                death.setSize(600, 100);
            }
        }
    }
    
    return tEmissile;
} // end missile def

function makeEMissiles(){
    eMissiles = new Array(num_eMissiles);
    for (i = 0; i < num_eMissiles; i++){
        eMissiles[i] = new Emissile();
    }
}

function updateEMissiles(){
    for (i = 0; i < num_eMissiles; i++){
        eMissiles[i].checkCollisions();
        eMissiles[i].update();
    }
}

function checkGameTime(){
    gameElapsedTime = gameTimer.getElapsedTime();
    if (gameElapsedTime > maxTime){
        game.stop();
        death = new GameButton("Sorry; you have failed your mission to kill the enemy on time. Please refresh and try again.");
        death.setPosition(20, 600);
        death.setSize(600, 100);
    }
}

function checkButtons(){
    if (death.isClicked()){
        document.location.href="";
    }
}

function init(){
    game = new Scene();
    timer = new Timer();
    //timer2 = new Timer();
    gameTimer = new Timer();
    character = new Character();
    enemy = new Enemy();
    background = new Sprite(game, "background2.jpg", 800, 600);
    background.setSpeed(0,0);
    background.setPosition(400, 300);
    makeMissiles();
    makeEMissiles();
    output = document.getElementById("output");
    gameTimer.reset();
    
    game.start();
} // end init

function update(){
    game.clear();
    checkGameTime();
    output.innerHTML = gameElapsedTime;
    background.update();
    character.checkKeys();
    character.checkBounds();
    character.update();
    //enemy.checkFiring();
    enemy.checkBounds();
    enemy.checkCollisions();
    enemy.update();
    updateMissiles();
    checkButtons();
    //updateEMissiles();
} // end update
