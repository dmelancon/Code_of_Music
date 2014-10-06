var oscillators = [];
var envelopes = [];
var current = 0;
// midi notes
var noteArray = [0, 2, 4, 7, 9, 12, 13, 15, 18, 20, 23];
var root = 40;
var beatLength = 1/8;
var wDiv = 16;
var bpm = 180;
var beatsPerMeasure;
var currentMeasure;
var currentBeat; 
var howFarInMeasure;
var circles = [];
var cirNum = 6;


function setup() {
  createCanvas(1000, 1000);
  beatsPerMeasure = 16;
  beatLeng = 60000.0/bpm;
  for (var i = 0; i <= beatsPerMeasure; i++) {
    oscillators.push( new p5.Oscillator());
    envelopes.push( new p5.Env(0.005, 0.65, random(.2,.4), random(0.2, .4) ));
  }
  mySeq = new p5.Part(beatsPerMeasure, beatLength);
  mySeq.setBPM(bpm);
  mySeq.onStep(increment);
  mySeq.loop();
  for (var i = 0; i < cirNum; i++){
    circles.push(new Circle(width/2,height/2,cirNum*50-50*i,wDiv));
  }

}

function draw() {
  background(0); 
  push();
    translate(width/2,height/2);
     for (var i = 0; i < cirNum; i++){
    circles[i].draw();
    }
  pop();
}

var step = 0;

function increment() {
  step++;
  currentBeat = step % beatsPerMeasure;
  currentMeasure = step / beatsPerMeasure;
  //circle.playNote(noteArray[0] + root);
  for (var i = 0; i < cirNum; i++){
    circles[i].playNote(noteArray[11-i*2] + root);
  }
}

//Functions to determine if point is within Arch

function normalizeAngle(angle)
{
  var nA = angle % (2 * PI);
  if (nA < 0) nA = 2*PI + nA;
  return nA;
}

function IsPointInsideArc(place, pointX, pointY, centerX, centerY, diam, angle1, angle2)
{
  var dist = sqrt(sq(pointX - centerX) + sq(pointY - centerY));
  dist = dist +50;  
  if (dist < (diam/2)+50 &&  dist> (cirNum-place)*50){
     console.log(dist);
     console.log(diam);

     console.log((cirNum-place)*50);
     console.log(place);
     //console.log((cirNum-place)*50);
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
    for (var i = 0; i < circles.length; i++) {
      for (var j =0;  j < circles[i].arcs.length; j++){
        if (IsPointInsideArc(i,mouseX-width/2, mouseY-height/2, 0, 0, circles[i].arcs[j].diam, circles[i].arcs[j].place*circles[i].arcs[j].angle, (circles[i].arcs[j].place*circles[i].arcs[j].angle) + circles[i].arcs[j].angle)){
            circles[i].arcs[j].isOn =! circles[i].arcs[j].isOn;
        }
      }
    }
  }
}

function mouseDragged() {
  if (mousePressed){
    for (var i = 0; i < circles.length; i++) {
      for (var j =0;  j < circles[i].arcs.length; j++){
        if (IsPointInsideArc(i,mouseX-width/2, mouseY-height/2, 0, 0, circles[i].arcs[j].diam, circles[i].arcs[j].place*circles[i].arcs[j].angle, (circles[i].arcs[j].place*circles[i].arcs[j].angle) + circles[i].arcs[j].angle)){
            circles[i].arcs[j].isOn =! circles[i].arcs[j].isOn;
        }
      }
    }
  }
}

//================================================//                
//============CIRCLE THAT HOLDS ARCS==============//
//================================================//

var Circle = function(x, y, seqRadius,  wDiv) {
  this.x = x;
  this.y = y;
  this.wDiv = wDiv;
  this.rad = seqRadius;
  this.c = color(random(127,255), random(127,255), random(127,255));
  this.arcs = [];
  for (var i = 0; i < beatsPerMeasure; i++) {
    this.arcs.push( new Arc(i,this.rad*2, TWO_PI/beatsPerMeasure,this.c) );
   }
  }

Circle.prototype.draw = function() {
    stroke(100);
    fill(this.c );
    ellipse(0,0,this.rad*2, this.rad*2);
    var beatAngle = TWO_PI/beatsPerMeasure;
    //draw grid lines
    for(var i = 0; i < beatsPerMeasure; i++){
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

Circle.prototype.playNote = function(n) {
    this.osc = oscillators[current % (oscillators.length- 1)];
    this.env = envelopes[current % (envelopes.length - 1)];
    //this.osc.setType('triangle');
    this.osc.freq(midiToFreq(n));
    if(this.arcs[currentBeat].isOn){
        this.env.play(this.osc);
      }
    current++;
}



//================================================//                
//==========ARC THAT Contain Step State===========//
//================================================//
var Arc = function(place, diam, angle, color) {
  this.place = place;
  this.diam = diam;
  this.angle = angle;
  this.c = color;
  this.isOn = false;
}

Arc.prototype.draw = function() {
  if (this.isOn == true) fill(this.c);
  else fill(0,0,0);
  strokeWeight(3);
  stroke(0);
  arc(0, 0, this.diam, this.diam, this.place*this.angle, (this.place*this.angle) + this.angle);
}





