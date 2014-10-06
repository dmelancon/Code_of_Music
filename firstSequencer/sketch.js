
var osc = []; 
var env; // used by playNote
var noise, noiseEnv; // used by playSnare
var part; // a part we will loop
var mSquare = [];
var sequence = [0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0]; 

function setup() {
  createCanvas(800, 800);
  for ( var i = 0; i<8; i++){
    mSquare[i] = new square(100+i*100, 100, 30);
    //mSquare[i].color = new color(random(127,255),random(127,255),random(127,255));
    //mSquare[i].size = 10;
    osc[i] = new p5.Oscillator(); // connects to master output by default
    osc[i].freq(1);
    osc[i].start(0);
    osc[i].connect();
  }

  // prepare the osc and env used by playNote()
  env = new p5.Env(0.01, 0.8, 0.2, 0);
  // osc = new p5.Oscillator(); // connects to master output by default
  // osc.freq(1);
  // osc.start(0);
  // osc.connect();

  // prepare the noise and env used by playSnare()
  noise = new p5.Noise();
  noise.amp(0);
  noise.start();
  noiseEnv = new p5.Env(0.01, 0.5, 0.1, 0);
  part = new p5.Part(8, 1/64);
  part.addPhrase('melody', playNote, sequence);
  part.setBPM(100);
  part.loop();
}


function playNote(params) {
  for ( var i = 0; i<mSquare.length; i++){
  osc[i].freq(midiToFreq(params));
  env.play(osc[i]); 
  }
}


function draw() {

  //background(255); 
  stroke(0)
  noFill();
  rect(0,0,width-1,height-1);
  for ( var i = 0; i<mSquare.length; i++){
    fill(mSquare[i].color)
    rect(mSquare[i].posX,mSquare[i].posY, mSquare[i].size,mSquare[i].size)
    //console.log(mSquare[i]);
    sequence[Math.round(map(mSquare[i].posX,0,width,0,64))] = Math.round(map(mSquare[i].posY, 0, height,50,128)); 
  }
  //console.log(sequence);
  // var bpm = constrain(map(mouseX, 0, width, 50, 100), 5, 400);
  part.setBPM(60);

}

function square(posX, posY, size) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.color = color(random(127,255),random(127,255),random(127,255));
}

function mouseDragged() { // Move gray circle
    moveX = mouseX;
    moveY = mouseY;
    //console.log(moveY);
    console.log(moveX);
    console.log(mSquare[0].posX);
    console.log(moveY);
    console.log(mSquare[0].posY);
    for ( var i = 0; i<mSquare.length; i++){
      if (moveX>mSquare[i].posX && moveX < (mSquare[i].posX + 30)){
   
       if (moveY> mSquare[i].posY && moveY < (mSquare[i].posY + 30)){
          mSquare[i].posX = mouseX-15;
          mSquare[i].posY = mouseY-15;
        }
      }
    }
  }





