var can;
var canvasHeight,canvasWidth;
var cells=[];
var cellsCols=17, cellsRows=29;
var hexSide;
var xSnake=[],ySnake=[],lSnake,dirSnake;
var sp,cur,acc=0.01;
var xFood,yFood;
var state=0;
var someSortOfFuckingVariable=0;
var bite,bonk;
var m1,m2,m2to3,m3;
var m1l,m2l;

function preload(){
  m1=loadSound('sounds/1.mp3');
  m2=loadSound('sounds/2.mp3');
  m2to3=loadSound('sounds/2-3.mp3');
  m3=loadSound('sounds/3.mp3');
  bite=loadSound('sounds/bite.mp3');
  bonk=loadSound('sounds/bonk.mp3');
}

function setup(){
  canvasWidth=window.innerWidth;
  canvasHeight=canvasWidth/1.926;
  if(canvasHeight>window.innerHeight){
    canvasHeight=window.innerHeight;
    canvasWidth=canvasHeight*1.926;  
  }
  can=createCanvas(canvasWidth,canvasHeight);
  can.position((window.innerWidth-canvasWidth)/2,(window.innerHeight-canvasHeight)/2);
  hexSide=width/50;
  resetGame();
}
//////////////////////////////////////////////////////////////////////////////////////////
function draw() {
  background(140,240,65);
  switch(state){
    case 0:
      showStart();
      break;
    case 1:
      actualGame();
      break;
    case 2:
      gameOver();
      break;
    default:
      background(0);
  }
  soundManagement();
}
/////////////////////////////////////////////////////////////////////////////////////////////
function hexDraw(x,y,l,i,j){
  if(cells[i][j]!=0){
    fill(255,240,100);
    stroke(250,230,80);
    strokeWeight(l/10);
    hexahexa(x,y,l);
    switch(cells[i][j]){
      case 10:
        fill(70,55,230);
        stroke(30,20,100);
        strokeWeight(l/20);
        hexahexa(x,y,l*0.9);
        noFill();
        stroke(30,0,0);
        strokeWeight(l/10);
        translate(x,y);
        rotate(dirSnake*(PI/3));
        line(l*(-0.4),l*(-0.5),l*0.4,l*(-0.5));
        line(l*0.3,l*0.2,l*0.3,l*(-0.2));
        line(l*(-0.3),l*0.2,l*(-0.3),l*(-0.2));
        rotate(-1*dirSnake*(PI/3));
        translate(-x,-y);
        break;
      case 11:
        fill(70,55,230);
        stroke(30,20,100);
        strokeWeight(l/20);
        hexahexa(x,y,l*0.8);
        strokeWeight(l/6);
        stroke(255,70,0);
        noFill();
        hexahexa(x,y,l*0.4);
        break;
      case 2:
        stroke(40,20,0);
        strokeWeight(l/10);
        line(x,y,x-l*0.1,y-l*0.6);
        fill(255,0,0);
        stroke(200,0,0);        
        hexahexa(x,y+l*0.1,l*0.5);
        fill(255,255,200);
        noStroke();
        beginShape();
          vertex(x-l*0.2,y-l*0.25);
          vertex(x-l*0.2,y);
          vertex(x-l*0.35,y+l*0.1);
        endShape();
        fill(0,255,0);
        stroke(0,200,0);
        strokeWeight(l/10);
        hexahexa(x+l*0.2,y-l*0.4,l*0.2);
        break;
    }
  }
}
//////////////////////////////////////////////////////////////
function hexahexa(x,y,l){
  beginShape();
    vertex(x-l,y);
    vertex(x-l/2,y-l*sqrt(3/4));
    vertex(x+l/2,y-l*sqrt(3/4));
    vertex(x+l,y);
    vertex(x+l/2,y+l*sqrt(3/4));
    vertex(x-l/2,y+l*sqrt(3/4));
    vertex(x-l,y);
  endShape();
}
//////////////////////////////////////////////////////////////
function moveSnakeHead(){
  switch(dirSnake){
    case 0:
      ySnake[0]-=2;
      break;
    case 1:
      if (ySnake[0]%2){
        ySnake[0]--;
        xSnake[0]++;
      }
      else{
        ySnake[0]--;
      }
      break;
    case 2:
      if (ySnake[0]%2){
        ySnake[0]++;
        xSnake[0]++;
      }
      else{
        ySnake[0]++;
      }
       break;
    case 3:
      ySnake[0]+=2; 
      break;
    case 4:
      if (ySnake[0]%2){
        ySnake[0]++;
      }
      else{
        ySnake[0]++;
        xSnake[0]--;
      }
       break;
    case 5:
      if (ySnake[0]%2){
        ySnake[0]--;
      }
      else{
        ySnake[0]--;
        xSnake[0]--;
      }
       break;
    default:
      dirSnake=0;
  }
  if(ySnake[0]%2){
    if(ySnake[0]<0 || ySnake[0]>=cellsRows || xSnake[0]<0 || xSnake[0]>=cellsCols-1){
      state=2;
    }
  }
  else{
    if(ySnake[0]<0 || ySnake[0]>=cellsRows || xSnake[0]<0 || xSnake[0]>=cellsCols){
      state=2;
    }
  }
  for(i=1;i<lSnake;i++){
    if(ySnake[0]==ySnake[i] && xSnake[0]==xSnake[i]){
      state=2;
      i=lSnake;
    }
  }
  if(state==2){
    bonk.play();
  }
  if(ySnake[0]==yFood && xSnake[0]==xFood){
    switch(lSnake){
      case 5:
        m2to3.play();
        break;
      case 10:
        m2to3.play();
        break;
      case 15:
        m2to3.play();
        break;
      default:
        bite.play();
    }
    ySnake[lSnake]=ySnake[lSnake-1];
    xSnake[lSnake]=xSnake[lSnake-1];
    lSnake++;
    bringFood();
    sp+=acc;
  }
}
////////////////////////////////////////////////////////////////
function updateSnake(){
  for(i=lSnake-1;i>0;i--){
    xSnake[i]=xSnake[i-1];
    ySnake[i]=ySnake[i-1];
  }
}
////////////////////////////////////////////////////////////////
function updateMap(){
  for(i=0;i<cellsRows;i++){
    for(j=0;j<cellsCols;j++){
      cells[i][j]=1;
    }
  }
  for(i=1;i<cellsRows;i+=2){
    cells[i][cellsCols-1]=0;
  }
  for(i=1;i<lSnake;i++){
    cells[ySnake[i]][xSnake[i]]=11;
  }
  cells[ySnake[0]][xSnake[0]]=10;
  cells[yFood][xFood]=2;
}
///////////////////////////////////////////////////////////////////
function bringFood(){
  do{
    notGood=false;
    xFood=int(random(cellsCols));
    yFood=int(random(cellsRows));
    if(cells[yFood][xFood]!=1){
      notGood=true;
    }
  }while(notGood);
  cells[yFood][xFood]=2;
}
//////////////////////////////////////////////////////////////////////
function actualGame(){
  for(i=0;i<cellsRows;i++){
    for(j=0;j<cellsCols;j++){
      hexDraw((j*3+1+(i%2)*1.5)*hexSide,(i+1)*hexSide*sqrt(3/4),hexSide,i,j);
    }
  }
  if(cur>1){
    cur=0;
    updateSnake();
    moveSnakeHead();
    if(state==1){
      updateMap();
    }
  }
  else{
    cur+=sp;
  }
}
///////////////////////////////////////////////////////////////////
function showStart(){
  background(140,240,65);
  textStyle(BOLDITALIC);
  fill(255,240,100);
  stroke(100,120,80);
  strokeWeight(hexSide);
  textSize(hexSide*5);
  textAlign(CENTER,CENTER); 
  text("HeXnake",width/2,height/6);
  strokeWeight(hexSide/5);
  textSize(hexSide*1.5);
  text("The garden of tunes",width/2,height/3.5);
  hexahexa(width/2,height*0.6,width/8);
  translate(width/2,height*0.6);
  strokeWeight(hexSide/3);
  for(i=0;i<6;i++){
    line(0,width/12,0,width/25);
    line(0,width/12,width/40,width/16);
    line(0,width/12,width/(-40),width/16);
    rotate(PI/3);
  }
  translate(width/(-2),height*(-0.6));
  fill(100,120,80);
  textSize(hexSide*2);
  textStyle(BOLD);
  noStroke();
  text("Q",width*0.39,height*0.45);
  text("W",width*0.5,height*0.35);
  text("E",width*0.61,height*0.45);
  text("A",width*0.39,height*0.75);
  text("S",width*0.5,height*0.87);
  text("D",width*0.61,height*0.75);
  noStroke();
  fill(140,240,65,200);
  rect(width*0.3,height*0.3155,width*0.7,height*0.8);
  textStyle(ITALIC);
  stroke(100,120,80,map(sin(someSortOfFuckingVariable),-1,1,0,255));
  fill(255,240,100,map(sin(someSortOfFuckingVariable),-1,1,0,255));
  text("Press any key to Start",width/2,height*0.95);
  someSortOfFuckingVariable+=0.1;
  textStyle(NORMAL);
}
///////////////////////////////////////////////////////////////////
function gameOver(){
  m1.stop();
  m2.stop();
  m3.stop();
  background(140,240,65);
  textStyle(BOLDITALIC);
  fill(255,70,0);
  stroke(100,0,0);
  strokeWeight(hexSide/5);
  textSize(hexSide*5);
  text("GAME",width*0.49,height*0.1);
  text("OVER",width*0.51,height*0.22);
  textStyle(ITALIC);
  textSize(hexSide);
  text("Press 'R' to restart",width/2,height*0.95);
  fill(255,240,100);
  stroke(250,230,80);
  rect(width*0.4,height*0.4,width*0.2,height*0.2,100);
  textSize(hexSide*2);
  stroke(100,120,80);
  text("Tip: Try being better",width/2,height*0.75);
  fill(140,240,65);
  textStyle(NORMAL);
  text("Score\n"+(lSnake-1),width/2,height*0.5);
}
///////////////////////////////////////////////////////////////////
function resetGame(){
  m1l=true;
  m2l=true;
  state=0;
  lSnake=1;
  dirSnake=3;
  sp=0.05;
  cur=0;
  for(i=0;i<cellsRows;i++){
    cells[i]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(j=0;j<cellsCols;j++){
      cells[i][j]=1;
    }
  }
  for(i=1;i<cellsRows;i+=2){
    cells[i][cellsCols-1]=0;
  }
  xSnake[0]=8;
  ySnake[0]=4;
  cells[ySnake[0]][xSnake[0]]=10;
  bringFood();
}
///////////////////////////////////////////////////////////////////
function keyPressed(){
  switch(state){
    case 0:
      state=1;
      break;
    case 1:
      switch(keyCode){
        case 87:
          if(dirSnake!=3){
            dirSnake=0;
          }
          break;
        case 69:
          if(dirSnake!=4){
            dirSnake=1;
          }
          break;
        case 68:
          if(dirSnake!=5){
            dirSnake=2;
          }
          break;
        case 83:
          if(dirSnake!=0){
            dirSnake=3;
          }
          break;
        case 65:
          if(dirSnake!=1){
            dirSnake=4;
          }
          break;
        case 81:
          if(dirSnake!=2){
            dirSnake=5;
          }
          break;
      }
      break;
    case 2:
      if(keyCode==82){
        resetGame();
      }
  }
}

function soundManagement(){
  if(lSnake>=2 && m1l){
    m1.loop();
    m1l=false;
  }
  if(lSnake>=6 && m2l){
    m1.stop();
    if(m2to3.isPlaying()==false){
      m2.loop();
      m2l=false;
   }
  }
  if(lSnake>=11 && m3l){
    m2.stop();
    if(m2to3.isPlaying()==false){
      m3.loop();
      m3l=false;
    }
  }
}
