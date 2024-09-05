class Player{
  constructor(x, y, kind, id){
    this.x = x
    this.y = y
    this.vx 
    this.vy
    this.id = id
    if(kind == 0){this.kind = "rock"}
    else if (kind == 1){this.kind = "paper"}
    else if (kind == 2){this.kind = "scissors"}
  }
  draw(){
    push()
    fill(0)
    stroke(0)
    textSize(30)
    // if (this.kind == "rock"){text(this.id+"R",this.x,this.y)}
    // else if (this.kind == "paper"){text(this.id+"P",this.x,this.y)}
    // else if (this.kind == "scissors"){text(this.id+"S",this.x,this.y)}
    if (this.kind == "rock"){image(rock_texture,this.x - (15 * scaleslider.value()),this.y - (15 * scaleslider.value()),30 * scaleslider.value(),30 * scaleslider.value())}
    else if (this.kind == "paper"){image(paper_texture,this.x - (15 * scaleslider.value()),this.y - (15 * scaleslider.value()),30 * scaleslider.value(),30 * scaleslider.value())}
    else if (this.kind == "scissors"){image(scissors_texture,this.x - (15 * scaleslider.value()),this.y - (15 * scaleslider.value()),30 * scaleslider.value(),30 * scaleslider.value())}
    pop()
  }
  update(){

    if(this.x < 50){this.x = 51}
    else if(this.x > ww - 50){this.x = ww -51}
    if(this.y < 50){this.y = 51 }
    else if(this.y > wh - 50){this.y = wh - 51}
    // if(this.x < 100){this.vx = this.vx + this.x/100}
    // else if(this.x > ww - 100){this.vx = this.vx - ((this.x-(ww-100))/100)}
    // if(this.y < 100){this.vy = this.vy + this.y/100}
    // else if(this.y > wh - 100){this.vy = this.vy - ((this.y-(wh-100))/100)}
    this.x = this.x + this.vx
    this.y = this.y + this.vy



  }
}

var ww = 1000
var wh = 1000
var mouseX_c
var mouseY_c
var cssscale
var allPlayers = []
var rocks = []
var papers = []
var scissors = []
var mainDistanceList
var rock_texture
var paper_texture
var scissors_texture
var defaultrange = 500
var sight_range = defaultrange
var hunting
var finished = false
var playercount
var button
var scaleslider

function distance(x1,y1,x2,y2){
  return(Math.sqrt((Math.pow(x1 - x2 , 2) + Math.pow(y1 - y2 , 2))))
}
function recalculateMouseCoordinates(){
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'));
  document.documentElement.style.setProperty('--zoomscale', zoomslider.value());
  mouseX_c = mouseX / cssscale
  mouseY_c = mouseY / cssscale
  posxmouse = mouseX_c
}
function setStartingPlayersRandomly(count, storearray){
  for (var i = 0; i<count ; i++ ){8
    var cls = Math.floor(Math.random()*3)
    p = new Player((Math.random()*(ww-100))+50,(Math.random()*(wh-100))+50,cls,i)
    if(cls == 0){rocks.push(p)}
    else if (cls == 1){papers.push(p)}
    else if (cls == 2){scissors.push(p)}
    storearray.push(p)
  }
  // for (var key in storearray){console.log(storearray[key])}
}
function calculateBehaviour(){
  var arrayy = []
  for (var key in allPlayers){
    var k1 = key
    var current = allPlayers[k1]
    var array1 = []
    for (var key in allPlayers){
      var k2 = key
      var target = allPlayers[k2]
      if (current.kind !== target.kind){
        var behave = ""
        if(current.kind == "rock"){if (target.kind == "paper"){behave = "flee"}else{behave ="hunt"}}
        else if (current.kind == "paper"){if (target.kind == "scissors"){behave = "flee"}else{behave ="hunt"}}
        else if (current.kind == "scissors"){if (target.kind == "rock"){behave = "flee"}else{behave ="hunt"}}
        let d = distance(current.x,current.y,target.x,target.y)
        var c = current
        let t = target
        let payload = {"current":c,"target":t,"distance":d,"behaviour":behave}
        array1.push(payload)
      }
    }
    if(array1[0] != undefined){
    var min = array1[0].distance
    var minIndex = 0
    var a = -1
    array1.forEach(element => {
      a++
      if(element.distance < min){
        min = element.distance
        minIndex = a
      }
    });

    let t = array1[minIndex].target
    var payload2 = {"current": c, "target": t, "behave": array1[minIndex].behaviour, "dis":min}
    // console.log(payload2)
    arrayy.push(payload2)
    }else{
      drawFinishScreen()
    }

  }
  // console.log(arrayy)
  return arrayy

}
function calculateSpeed(i){
  if(!finished){
  let id = i
  let c = mainDistanceList[id].current
  let t = mainDistanceList[id].target
  if(mainDistanceList[id].dis < sight_range * scaleslider.value()){
  hunting = true
  let vx = (t.x - c.x)
  let vy = (t.y - c.y)
  let v = 1/Math.sqrt((vx*vx)+(vy*vy))
  if(mainDistanceList[id].behave == "flee"){v = -v}
  let speedrandomness = speedrandomnesslider.value()
  vx = vx*v*speedslider.value() + ((Math.random()*speedrandomness) - (speedrandomness/2))
  vy = vy*v*speedslider.value() + ((Math.random()*speedrandomness) - (speedrandomness/2))
  c.vx = vx 
  c.vy = vy 
  } else {
    c.vx = Math.random()*2 -1
    c.vy = Math.random()*2 -1
  }
  // console.log(c)
}
}
function checkCapture(i){
  if(!finished){
  let id = i
  let c = mainDistanceList[id]

  if(c.behave == "flee" && c.dis < 20 * scaleslider.value()){
    if(c.current.kind == "rock"){c.current.kind = "paper";rocks.shift();papers.push("a")}
    else if(c.current.kind == "paper"){c.current.kind = "scissors";papers.shift();scissors.push("a")}
    else if(c.current.kind == "scissors"){c.current.kind = "rock";scissors.shift();rocks.push("a")}
    
  }
}
}
function drawFinishScreen(){
    finished = true
    background(255)
    fill(220)
    rect(0,0,ww,wh)
    let winner = allPlayers[0].kind  + "s won" 
    push()
    textSize(60)
    fill(0)
    strokeWeight(0)
    stroke(0)
    text(winner,ww/2 - 250,wh/2)
    textSize(40)
    text("click to restart",ww/2 - 250,wh/2+50)
    pop()

}
function preload(){
  rock_texture = loadImage("https://raw.githubusercontent.com/dehphos/rpc/a12b021fb9d705e9f550db35f166e9806a252449/r.png")
  paper_texture = loadImage("https://raw.githubusercontent.com/dehphos/rpc/a12b021fb9d705e9f550db35f166e9806a252449/p.png")
  scissors_texture = loadImage("https://raw.githubusercontent.com/dehphos/rpc/a12b021fb9d705e9f550db35f166e9806a252449/s.png")
}
function mouseClicked(){
  if(finished && mouseX_c < ww && mouseY_c < wh){
    // window.location.reload()
    reset()
  }
}
function reset(){
  finished = false
  background(255)
  allPlayers = []
  mainDistanceList = []
  rocks = []
  papers = []
  scissors = []
  sight_range = defaultrange
  setStartingPlayersRandomly(playercount.value(),allPlayers)
}
function setup() {
  frameRate(60)
  fill(255)
  createCanvas(ww +120, wh + 100);
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'));
  zoomslider = createSlider(0.01,1,cssscale,0.01)
  createSliderNames()
  reset()
}
function createSliderNames(){
  speedrandomnesslider = createSlider(0,5,3,0.5)
  playercount = createSlider(3,1000,30,1)
  scaleslider = createSlider(0.2,8,2,0.2)
  speedslider = createSlider(0, 20, 1, 0.5)
  t1 = createDiv("Zoom : ")
  t2 = createDiv("Speed Randomness : ")
  t3 = createDiv("Player Count : ")
  t4 = createDiv("Symbol Scale : ")
  t4_2 = createDiv("(this changes the capture range and sight range too!)")
  t5 = createDiv("Speed :")
  button = createButton('Reset animation');
  button.mousePressed(reset);
  resetbutton = createButton('Reset to default');
  resetbutton.mousePressed(resetSliders);
}
function resetSliders(){
  t1.remove()
  t2.remove()
  t3.remove()
  t4.remove()
  t4_2.remove()
  t5.remove()
  zoomslider.position(135,cssscale * wh_c +122)
  speedrandomnesslider.remove()
  playercount.remove()
  scaleslider.remove()
  speedslider.remove()
  button.remove()
  resetbutton.remove()
  createSliderNames()
}
function drawSliderNames(){
  fill(255)
  rect(0,1000,3000,3000)
  push()
  textSize(35)
  fill(0)
  text(`number of players :${allPlayers.length}   rocks :${rocks.length}   papers :${papers.length}   scissors :${scissors.length}`, 40, 1030 )
  text(`speed :${speedslider.value()}  speed randomness :${speedrandomnesslider.value()} symbol scale :${scaleslider.value()/2}  player count :${playercount.value()}`, 40, 1070 )
  pop()
  wh_c = wh + 100
  t1.position(50,cssscale * wh_c +122)
  t2.position(2,cssscale * wh_c +32)
  t3.position(20 , cssscale * wh_c +62)
  t4.position(20 , cssscale * wh_c +92)
  t4_2.position(275 , cssscale * wh_c +92)
  t5.position(50, cssscale * wh_c +2)
  zoomslider.position(135,cssscale * wh_c +122)
  speedrandomnesslider.position(135,cssscale * wh_c +32)
  playercount.position(135,cssscale * wh_c +62)
  scaleslider.position(135, cssscale * wh_c + 92)
  speedslider.position(135, cssscale * wh_c + 2)
  button.position(300 , cssscale * wh_c +62)
  resetbutton.position(200 , cssscale * wh_c +152)
}
function draw() {
  push()
  background(255)
  fill(220)
  rect(0,0,ww,wh)
  pop()
  recalculateMouseCoordinates()
  mainDistanceList = calculateBehaviour()
  hunting = false
  for (var key in allPlayers){
    let c = allPlayers[key]
    checkCapture(key)
    calculateSpeed(key)
    allPlayers[key].update()
    if(!finished){
    allPlayers[key].draw() }
  }
  if (hunting == false){
    sight_range = sight_range + 100
  }else{
    sight_range = defaultrange}
    fill(255)
    rect(ww,0,3000,wh)
    drawSliderNames()
}
