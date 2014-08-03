function Clock() {
  this.seconds = 0;
  this.minutes = 0;
  
  this.turnSeconds = 0;
  this.turnMinutes = 0;
  
  this.turns = 0;
  
  this.isOn = false;
  this.battery;
}

Clock.prototype.secondPassed = function() {
  this.seconds++;
  this.turnSeconds++;
  
  if (this.seconds === 60) {
    this.seconds = 0;
    this.minutes++;
  }
  
  if (this.turnSeconds === 60) {
    this.turnSeconds = 0;
    this.turnMinutes++;
  }
  
  return true;
}

Clock.prototype.start = function() {
  this.isOn = true;
  var t = this;
  this.battery = setInterval(function() {t.secondPassed()}, 1000);
}

function asd() {
  console.log("asd");
}

Clock.prototype.stop = function() {
  this.isOn = false;
  clearInterval(this.battery);
}

Clock.prototype.turnPassed = function() {
  this.turns++;
  this.turnSeconds = 0;
  this.turnMinutes = 0;
}

Clock.prototype.outWrite = function() {
  var totalTime = timeFormat(this.minutes) + ":" + timeFormat(this.seconds);
  var turnTime = timeFormat(this.turnMinutes) + ":" + timeFormat(this.turnSeconds);
  var totalSeconds = this.minutes*60 + this.seconds;
  var totalSecondsPerTurn = Math.floor(totalSeconds / this.turns);
  var minutesPerTurn = Math.floor(totalSecondsPerTurn/60);
  var secondsPerTurn = totalSecondsPerTurn - minutesPerTurn*60;
  var timePerTurn = timeFormat(minutesPerTurn) + ":" + timeFormat(secondsPerTurn);
  
  var toReturn =  "last turn time = " + turnTime + "\n"
                + "total time     = " + totalTime + "\n"
                + "turns played   = " + this.turns + "\n"
                + "time per turn  = " + timePerTurn;
                
  return toReturn;
}

function timeFormat(unit) {
  if (unit < 10) {
    return "0" + unit;
  }
  
  return "" + unit;
}

var clock = new Clock();
