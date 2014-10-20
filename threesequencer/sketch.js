var bpm = 180;
var mSeq, mSeq1, mSeq2;
var mCirc;
var mCirc1;
var mCirc2;
var mySeq, mySeq1, mySeq2;
var root = 57;
var root2 = 45;
var root1 = 52;

function setup() {
  createCanvas(1200, 600);
  mCirc = new circleInterface(4*width/5,height/2,6, 16,30,root);
  mCirc1 = new circleInterface(width/2,height/2, 6 , 6,20,root1);
  
  mCirc2 = new circleInterface(width/5,height/2, 4, 7, 40, root2);
  mSeq = new Sequencer(bpm, mCirc, 1/8, 16 );        //bpMeasure * beatLengh have to = each otehr to be same measurelength
  mSeq1 = new Sequencer(bpm, mCirc1,  1/3, 6);
  mSeq2 = new Sequencer(bpm, mCirc2,  2/7, 7);
 
  mySeq = new p5.Part(mSeq.beatsPerMeasure, mSeq.beatLength);
  mySeq.setBPM(bpm);
  mySeq.onStep(function(d){
    mSeq.increment(d);
  });
  mySeq.loop();

  mySeq1 = new p5.Part(mSeq1.beatsPerMeasure, mSeq1.beatLength);
   mySeq1.setBPM(bpm);
  mySeq1.onStep(function(d){
    mSeq1.increment(d);
  });
  mySeq1.loop();

  mySeq2 = new p5.Part(mSeq2.beatsPerMeasure, mSeq2.beatLength);
  mySeq2.setBPM(bpm);
  mySeq2.onStep(function(d){
    mSeq2.increment(d);
  });
  mySeq2.loop();


}

function draw() {
  background(0); 
  mCirc1.draw(mSeq1.currentBeat);
  mCirc.draw(mSeq.currentBeat);
  mCirc2.draw(mSeq2.currentBeat);

}


//MOUSE HELPER FUNCTIONS

function normalizeAngle(angle)
{
  var nA = angle % (2 * PI);
  if (nA < 0) nA = 2*PI + nA;
  return nA;
}

function IsPointInsideArc(place, pointX, pointY, centerX, centerY, diam, angle1, angle2, cirNum, ringWidth)
{
  var dist = sqrt(sq(pointX - centerX) + sq(pointY - centerY));
  dist = dist +ringWidth;  
  if (dist < (diam/2)+ringWidth &&  dist> (cirNum-place)*ringWidth){
     var nA1 = normalizeAngle(angle1);
     var nA2 = normalizeAngle(angle2);
      // Find the angle between the point and the x axis from the center of the circle
     var a = normalizeAngle(atan2(pointY - centerY, pointX - centerX));
     var between;
     if (nA1 < nA2){
        between = nA1 <= a && a <= nA2;
      } else {
        between = !(nA2 <= a && a <= nA1);
      }
      return between;
  }else{
      return false;
  }
}

function mousePressed() {
  if (mousePressed){
    console.log("mouseX : " + mouseX + " mouseY: " + mouseY)
    for (var i = 0; i<mCirc.circles.length; i++){
      for (var j =0;  j < mCirc.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }
     for (var i = 0; i<mCirc1.circles.length; i++){
      for (var j =0;  j < mCirc1.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc1.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }
    for (var i = 0; i<mCirc2.circles.length; i++){
      for (var j =0;  j <mCirc2.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc2.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }

  }
}

function mouseDragged() {
  if (mousePressed){
    console.log("mouseX : " + mouseX + " mouseY: " + mouseY)
    for (var i = 0; i<mCirc.circles.length; i++){
      for (var j =0;  j < mCirc.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }
    for (var i = 0; i<mCirc2.circles.length; i++){
      for (var j =0;  j < mCirc2.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc2.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }
    for (var i = 0; i<mCirc1.circles.length; i++){
      for (var j =0;  j < mCirc1.circles[i].arcs.length; j++){
        //console.log(mCirc.circles[i].arcs[j]);
          mCirc1.circles[i].arcs[j].play(mouseX, mouseY);
        }
    }

  }
}


//================================================//                
//================SEQUENCER//CLOCK================//
//================================================//
var Sequencer = function(bpm, interFace,  beatLength, beatsPerMeasure) {
  this.step = 0;
  this.beatLength = beatLength;
  this.bpm = bpm;
  this.beatsPerMeasure = beatsPerMeasure;
  this.currentMeasure;
  this.currentBeat; 
  this.howFarInMeasure;
  this.interFace = interFace;
  ///console.log('Sequencer:', this.interFace);
}
 
Sequencer.prototype.increment = function() {                   
  this.step++;
  this.currentBeat = this.step % this.beatsPerMeasure;
  this.currentMeasure = this.step / this.beatsPerMeasure;
  // console.log('Sequencer.prototype.increment.step:',this.step); 
  // console.log('Sequencer.prototype.increment:',this.interFace);   
  //console.log("is this getting called");
   this.interFace.play(this.currentBeat);

}


//================================================//                
//====================INTERFACE===================//
//================================================//
var circleInterface = function(x,y,cirNum, beatsPerMeasure, ringWidth, root){
  // midi notes
  this.x = x;
  this.y = y;
  this.ringWidth = ringWidth;
  this.noteArray = [0, 2, 4, 7, 9,12];
  this.root = root;
  this.circles = [];
  this.cirNum = cirNum;
  this.beatsPerMeasure  = beatsPerMeasure;
  for (var i = 0; i < this.cirNum; i++){
    this.circles.push(new Circle(x,y,this.cirNum*this.ringWidth-this.ringWidth*i,this.beatsPerMeasure,i, this.cirNum, this.ringWidth));
  }
}


circleInterface.prototype.draw = function(currentBeat) {
  push();
    translate(this.x,this.y);
    for (var i = 0; i < this.cirNum; i++){
      this.circles[i].draw(currentBeat);
    }
  pop();
}

circleInterface.prototype.play = function(currentBeat){
  for (var i = 0; i < this.cirNum; i++){                        
    this.circles[i].playNote(this.noteArray[5-i] + this.root, currentBeat);         
  }
}

//================================================//                
//============CIRCLE THAT HOLDS ARCS==============//
//================================================//

var Circle = function(x, y, seqRadius, beatsPerMeasure, cirNum, cirAmt, ringWidth) {
  this.x = x;
  this.y = y;
  this.cirNum = cirNum;
  this.cirAmt = cirAmt;
  this.ringWidth = ringWidth;
  this.beatsPerMeasure = beatsPerMeasure;
  this.rad = seqRadius;
  this.c = color(random(127,255), random(127,255), random(127,255));
  this.arcs = [];
  this.osc = [];
  this.env = [];
  this.cur = 0;                                   //cur Oscillator Index
  for (var i = 0; i < this.beatsPerMeasure; i++) {
    this.arcs.push( new Arc(i,this.rad*2, TWO_PI/this.beatsPerMeasure,this.c, this.x, this.y, this.cirNum, this.cirAmt, this.ringWidth) );
   }
  for (var i = 0; i <= this.beatsPerMeasure; i++) {
    this.osc.push( new p5.Oscillator());
    this.env.push( new p5.Env(0.05, 0.65, random(.2,.6), random(0.1, .8) ));
   }
   for (var i = 0; i <= this.osc.length; i++) {

  }

}

Circle.prototype.draw = function(currentBeat) {

    stroke(100);
    fill(this.c );
    ellipse(0,0,this.rad*2, this.rad*2);
    var beatAngle = TWO_PI/this.beatsPerMeasure;
    //draw grid lines
    for(var i = 0; i < this.beatsPerMeasure; i++){
      stroke(0);  
      strokeWeight(3);
      var curBeatAngle = beatAngle * i;
      var beat_x = cos(curBeatAngle) * this.rad;
      var beat_y = sin(curBeatAngle) * this.rad;
      line(0, 0, beat_x, beat_y);
      this.arcs[i].draw();
      if(i == currentBeat ){ 
        noFill();
        strokeWeight(3);
        stroke(255);
        arc(0, 0, this.rad*2, this.rad*2, curBeatAngle, curBeatAngle + beatAngle);
      }
    }  
}

Circle.prototype.playNote = function(n, currentBeat) {
    var curOsc = this.osc[this.cur % (this.osc.length- 1)];
    var curEnv = this.env[this.cur % (this.env.length - 1)];
    //var connectOsc = new p5.Oscillator()
    //this.osc.setType('triangle');
    curOsc.freq(midiToFreq(n));
    if (this.ringWidth == 40) curOsc.setType('sine');
    if (this.ringWidth == 20){
      curOsc.setType('triangle');
      curOsc.pan(.6);
    }
    if (this.ringWidth == 30){
      curOsc.setType('sine');
      curOsc.pan(-.6)
    }
    if(this.arcs[currentBeat].isOn){
        curEnv.play(curOsc);
      }
    this.cur++;
}


//================================================//                
//==========ARC THAT Contain Step State===========//
//================================================//

var Arc = function(place, diam, angle, color, offsetX, offsetY, cirNum, cirAmt, ringWidth) {
  this.x = offsetX;
  this.y = offsetY;
  this.place = place;
  this.cirNum = cirNum;
  this.cirAmt  = cirAmt;
  this.diam = diam;
  this.ringWidth = ringWidth;
  //console.log(cirNum)
  this.angle = angle;
  this.c = color;
  this.isOn = false;
}

Arc.prototype.draw = function() {
  if (this.isOn == true) fill(this.c);
  else fill(0,0,0);
  strokeWeight(3);
  stroke(0,0,0,.2);
  arc(0, 0, this.diam, this.diam, this.place*this.angle, (this.place*this.angle) + this.angle);
}

Arc.prototype.play = function(mouseX, mouseY, ringWidth) {
  if ( IsPointInsideArc(this.cirNum, mouseX-this.x, mouseY-this.y, 0, 0, this.diam, this.place*this.angle, (this.place*this.angle + this.angle), this.cirAmt, this.ringWidth) ) {
    this.isOn =!this.isOn;
  }
}




