var canvas = document.getElementById('exampleCanvas');
var context = canvas.getContext('2d');
var f = 0;

var width = 200;
var height = 50;

var xCenter = canvas.width/2+0.5;
var yCenter = canvas.height/2+0.5;

var xOffset = xCenter-width*0.5;
var yOffset = yCenter;
var rOffset = 0;

var resolutionDensity = 1;
var numPoints = width*resolutionDensity;

var  xPrev = xOffset;
var  yPrev = yOffset;

var fps = 60;
var intervalTime = 1000/fps;

var rPhase = 2*Math.PI/4;
var speed = intervalTime/200;
var maxSize = 1;

setInterval(onEnterFrame, intervalTime);

function onEnterFrame()
{
  //width=Math.cos(f*0.01)*200
  height=Math.sin(f*0.01)*40;
  f ++;
  context.clearRect(0,0,canvas.width,canvas.height);
  draw();
}

function draw()
{
  var xDelta = width/numPoints;
  var rDelta = 2*Math.PI/numPoints;
  rOffset = rOffset + speed;
  
  for(var i = 0; i<= numPoints; i++)
    { 
      var amplitude = height*0.5;
      var r = rOffset + rDelta * i;
      var x = xOffset + xDelta * i;
      var y = yOffset + Math.sin(r) * amplitude;
      var size =  (Math.cos(rPhase*2 + rDelta*i) * 0.5 + 0.5)*maxSize ;
      
      if(i!=0)
      drawSegment(x, y, xPrev ,yPrev, size);
        xPrev = x;
      yPrev = y;
    }
}

function drawSegment(x0, y0, x1, y1, s)
{
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineWidth = s;
  context.strokeStyle="#aaaaaa";
  context.stroke();
}