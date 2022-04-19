var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var moneda;
var monedaImg;

var coin;
var coinImg;

var muralla;

var score = 0;
var life = 3;
var bullets = 70;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("electro.png")
  heart2Img = loadImage("electro2.png")
  heart3Img = loadImage("electro3.png")

  shooterImg = loadImage("pyro-hilichurl.png")
  shooter_shooting = loadImage("pyro-hilichurl.png")

  zombieImg = loadImage("lawachurl-brazohelado.png")

  monedaImg = loadImage("coin.png")
  coinImg = loadImage("gem.png")

  bgImg = loadImage("nakumi.jpg")

  lose = loadSound("lose.mp3")
  winning = loadSound("win.mp3")
  explosionSound = loadSound("explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  // Agregando una imagen de fondo
  bg = createSprite(displayWidth/2,displayHeight/2,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

// Creando el sprite del jugador
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   // Creando sprites para representar la vida restante
   heart1 = createSprite(displayWidth-100,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-150,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-200,40,20,20)
    heart3.visible = false
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   
    muralla = createSprite(displayWidth-1850,480,20,20);
    muralla.debug = true
    muralla.setCollider("rectangle",0,0,20,1000);
    muralla.visible=false;
    
    // Creando grupos para zombis y balas
    bulletGroup = new Group()
    zombieGroup = new Group()
    monedaGroup = new Group()
    coinGroup = new Group()


}

function draw() {
  background(0); 


if(gameState === "fight"){

  // Mostrar la imagen apropiada segun la vida restante 
  if(life===3){
    heart3.visible = true
    heart1.visible = true
    heart2.visible = true
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = true
    heart3.visible = false
  }     
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  // Ir al estado de juego (gameState) "lost" cuando quedan 0 vidas
  if(life===0){
    gameState = "lost"
    
  }


  // Ir al estado "won" si la puntuación es 100
  if(score==100){
    gameState = "won"
    winning.play();
  }

  // Moviendo al jugador arriba y abajo. Haciendo el juego móvil y compatible con entrada táctil
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}
if(keyDown("RIGHT_ARROW")||touches.length>0){
  player.x = player.x+30
}
if(keyDown("LEFT_ARROW")||touches.length>0){
 player.x = player.x-30
}

// Liberar las balas y cambiar la imagen del tirador a la posición de disparo cuando la barra espaciadora es presionada
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
  explosionSound.play();
}

// Eñ jugador regresa a la posición original una vez que se deja de presionar la barra espaciadora
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

// Ir al estado de juego "bullet" cuando el jugador se queda sin balas
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

// Destruir al zombi cuando una bala lo toca e incrementar la puntuación
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}

if(monedaGroup.isTouching(bulletGroup)){
  for(var i=0;i<monedaGroup.length;i++){     
      
   if(monedaGroup[i].isTouching(bulletGroup)){
        monedaGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+5
        } 
  
  }
}

if(coinGroup.isTouching(bulletGroup)){
  for(var i=0;i<coinGroup.length;i++){     
      
   if(coinGroup[i].isTouching(bulletGroup)){
        coinGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+9
        } 
  
  }
}

// Reducir la vida y destruir al zombi cuando el jugador lo toca
if(zombieGroup.isTouching(player)){
 
   lose.play();
 

 for(var i=0;i<zombieGroup.length;i++){     
      
  if(zombieGroup[i].isTouching(player)){
       zombieGroup[i].destroy()
      
      life=life-1
       } 
 
 }
}

if(zombieGroup.isTouching(muralla)){
 
  lose.play();


for(var i=0;i<zombieGroup.length;i++){     
     
 if(zombieGroup[i].isTouching(muralla)){
      zombieGroup[i].destroy()
     
     life=life-1
      } 

}
}

// Llamar la función para generar zombis
enemy();
recompensa();
gem();
}




drawSprites();

// Mostrar la puntuación, las vidas y balas restantes 
textSize(20)
fill("white")
text("Balas = " + bullets,displayWidth-200,displayHeight/2-250)
text("Puntuación = " + score,displayWidth-200,displayHeight/2-220)
//text("Vidas = " + life,displayWidth-200,displayHeight/2-280)

// Destruir al zombi y al jugador y mostrar el mensaje en el estado de juego "lost"
if(gameState == "lost"){
  
  /*textSize(100)
  fill("red")
  text("Perdiste",displayWidth/2,displayHeight/2)*/
  gameOver();
  zombieGroup.destroyEach();
  monedaGroup.destroyEach();
  coinGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi y al jugador y mostrar el mensaje del estado de juego "won"
else if(gameState == "won"){
 
  /*textSize(100)
  fill("yellow")
  text("Ganaste",displayWidth/2,displayHeight/2)*/
  gameWon();
  zombieGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi, jugador y balas y mostrar el mensaje en el estado de juego "bullet"
else if(gameState == "bullet"){
 
  /*textSize(50)
  fill("yellow")
  text("¡Te quedaste sin balas!",displayWidth/2,displayHeight/2)*/
  gameBullets();
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


// Creando la función para generar zombis
function enemy(){
  if(frameCount%80===0){

    // Dando posiciones "x" e "y" aleatorias cuando aparecen los zombis
    zombie = createSprite(random(1000,1500),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.55
    zombie.velocityX = -3
    zombie.debug= true
    zombie.setCollider("rectangle",0,0,100,100)
   
    zombie.lifetime = 500
   zombieGroup.add(zombie)
  }
}
function recompensa(){
  if(frameCount%115===0){

    // Dando posiciones "x" e "y" aleatorias cuando aparecen los zombis
    moneda = createSprite(random(1000,1500),random(100,500),40,40)

    moneda.addImage(monedaImg)
    moneda.scale = 0.35
    moneda.velocityX = -3
    moneda.debug= true
    moneda.setCollider("rectangle",0,0,100,100)
   
    moneda.lifetime = 300
    monedaGroup.add(moneda)
  }
}

function gem(){
  if(frameCount%175===0){

    // Dando posiciones "x" e "y" aleatorias cuando aparecen los zombis
    coin = createSprite(random(1000,1500),random(100,500),40,40)

    coin.addImage(coinImg)
    coin.scale = 0.10
    coin.velocityX = -3
    coin.debug= true
    coin.setCollider("rectangle",0,0,100,100)
   
    coin.lifetime = 300 
    coinGroup.add(coin)
  }
}

function gameOver() 
{
  swal({
    title: `Fin del juego`,
    text: "Perdiste!!",
    imageUrl:"https://c.tenor.com/D6IwAVg5qM4AAAAC/forme.gif",
    imageSize: "100x100",
    confirmButtonText: "Gracias por jugar"
}); }

function gameWon(){
  swal({
    title: "Ganaste!!!",
    imageUrl:"https://c.tenor.com/MfhZ1AT2th0AAAAC/peepo-dance-happy.gif",
    imageSize: "100x100",
    confirmButtonText:"Gracias por jugar"

  })
}

function gameBullets(){
  swal({
    title: "Perdiste!!",
    text: "Se te acabaron las balas :(",
    imageUrl:"https://c.tenor.com/D6IwAVg5qM4AAAAC/forme.gif",
    imageSize: "100x100",
    confirmButtonText:"Gracias por jugar"

  })
}
