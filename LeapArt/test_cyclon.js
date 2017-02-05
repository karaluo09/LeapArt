"use strict";

var Cylon = require("cylon");
var penUp = true;
var xPos = 0;
var yPos = 0;
var xPosMem = 0;
var yPosMem = 0;
var xDelta = 0;
var yDelta = 0;
var xAngle = 20;
var yAngle = 20;
var avg = 12;

Cylon.robot({
  connections: {
    leapmotion: { adaptor: "leapmotion" },
    arduino: { adaptor: "firmata", port: "/dev/tty.usbmodem1421" }
  },

  devices: {
    led: { driver: "led", pin: 13, connection: "arduino" }, 
    leapmotion: {driver: 'leapmotion'}, 
    servox: { driver: 'servo', pin: 7, connection: "arduino", limits: { bottom: 20, top: 150 }}, 
    servoy: {driver:'servo', pin: 12, connection: "arduino", limits: { bottom: 20, top: 150}}, 
    servoLift: {driver: 'servo', pin: 4, connection: "arduino", limits: {bottom: 10, top: 160}}
  },

  work: function(my) {
    //console.log(my);
    var app_width = 350;
    var app_height = 350;

    
    //console.log(my);
     my.servox.angle(xAngle);
     my.servoy.angle(yAngle);
     my.servoLift.angle(20);
    //set penUp to servo

    my.leapmotion.on("frame", function(frame) {

      if(frame.hands.length == 1) {
        var iBox = frame.interactionBox;
        var pos = [0, 0, 0];
        //var pos = frame.hands[0].stabilizedPalmPosition;
        for (var i =0; i<avg; i++){
          pos = [pos[0] + frame.hands[0].palmPosition[0], pos[1] + frame.hands[0].palmPosition[1], pos[2] + frame.hands[0].palmPosition[2]];
        }
        pos = [pos[0]/avg, pos[1]/avg, pos[2]/avg];
        //var pos = frame.hands[0].palmPosition;
        var normalizedPoint = iBox.normalizePoint(pos, true);
        xPos = normalizedPoint[0] * app_width;
        yPos = (normalizedPoint[2]) * app_height;
        xDelta = xPos - xPosMem;
        yDelta = yPos - yPosMem;
        xAngle = my.servox.safeAngle((xAngle + xDelta / 50 * 180 / Math.PI));
        yAngle = my.servoy.safeAngle((yAngle + yDelta / 50 * 180 / Math.PI));
        
        if (Math.abs(xDelta) > 1.5){
           my.servox.angle(xAngle);
        }

        if(Math.abs(yDelta) > 1.5){
          my.servoy.angle(yAngle);
        }


        //console.log(xDelta, yDelta);
        //console.log(xAngle, yAngle);
        xPosMem = xPos;
        yPosMem = yPos;
        //console.log(normalizedPoint[0] * app_width, (1 - normalizedPoint[1]) * app_height);
        // adjust servos 

        if(frame.hands[0].fingers[0].extended && frame.hands[0].fingers[1].extended && frame.hands[0].fingers[2].extended && frame.hands[0].fingers[3].extended && frame.hands[0].fingers[4].extended){
          my.servoLift.angle(68);
          //console.log("has finger!");
        }
        else{
          my.servoLift.angle(20);
        }
      }

    });
  }
}).start();