var Cylon = require("cylon");

// Initialize the robot
Cylon.robot({
  // Change the port to the correct port for your Arduino.
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }, 
    servo: {driver: 'servo', pin: 7}
    // servo: { driver: 'servo', pin: 12}, 
    // servo2: {driver: 'servo', pin: 7}
  },

  work: function(my) {
    console.log(my);
    var angle = 45;
    every((1).second(), function() {
      angle = angle + 45;
      if(angle > 135){
        angle = 45
      }
      my.servo.angle(20);
      //my.servo2.angle(angle);
    });
  }
}).start();