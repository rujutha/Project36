//Create variables here
var gameState;
var changeState, readState;
var bedroom, garden, washroom;
var dog,happyDog, sadDog;
//var food;
var database;
var foodS;
var dogImage;
var feed,addFood;
var fedTime,lastFed;
var foodObj;

function preload()
{
  //load images here
  dogImage=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");

  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");

  sadDog=loadImage("images/deadDog.png");

}

function setup() {
  database=firebase.database();
	createCanvas(900,900);
dog=createSprite(250,250,1,1);
dog.addImage(dogImage);
  dog.scale=0.3;
 foodS=database.ref('Food');
foodS.on("value",readStock);

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});







  foodObj=new Food();

  
   feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

   addFood=createButton("Add Food");
  addFood.position(800,95);
  
  addFood.mousePressed(addFoods);
}


function draw() {  
background(46,139,87);
  
  //add styles here
  //image (dogImage);
  
//foodObj.display();

if(foodS!==undefined){


  fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});



if(gameState!=="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  //dog=createSprite(450,450,1,1);
  
  //dog.addImage(sadDog);
}


currentTime=hour();
if( currentTime===(lastFed)){
  update("Happy");
  foodObj.happy();
}
if( currentTime===(lastFed+1)){
  update("Playing");
  foodObj.garden();
} if(currentTime===(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
} if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}if(currentTime>(lastFed+4)){
  update("Hungry");
  foodObj.hungry();
  foodObj.display();
  //dog.addImage(sadDog);
}




fill(255,0,0);
textSize(20);
if(lastFed>=12){
  text("last feed : "+lastFed+" pm",350,30);
}else if(lastFed===0){
  text("last feed : 12 am",350,30);
}else{
  text("last feed : "+lastFed+" am",350,30);
}}








  drawSprites();
textSize(20);
fill ("black");
//text("NOTE: press UP_ARROW key to feed the dog",50,50);
text("food remaining:  "+foodS,150,100);

}

function readStock(data){
  foodS=data.val();

  
}



function writeStock(x){

if(x<=0){
  x=0;
}else{x=x-1;}

  database.ref('/').update({
      Food:x
      
  })


}

function feedDog(){
  if(foodS>=1){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodS-1);
  
  database.ref('/').update({
  Food: foodS-1,
  FeedTime:hour() 
  })
}
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


function update(state){
  database.ref('/').update({
    gameState:state
  });
}

