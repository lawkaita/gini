function Clock() {
  this.seconds = 0;
  this.minutes = 0;

  this.turnSeconds = 0;
  this.turnMinutes = 0;
  this.tickSeconds = 0;

  this.turns = 0;

  this.isOn = false;
  this.battery;
}

var tick = 90;

Clock.prototype.secondPassed = function() {
  this.seconds++;
  this.turnSeconds++;
  this.tickSeconds++;

  if (this.seconds === 60) {
    this.seconds = 0;
    this.minutes++;
  }

  if (this.turnSeconds === 60) {
    this.turnSeconds = 0;
    this.turnMinutes++;
  }

  if (this.tickSeconds === (Math.floor(tick/2))) {
    audioHalf.play();
  }

  if (this.tickSeconds === Math.floor(tick*(3/4))) {
    audioHurry.play();
  }

  if (this.tickSeconds === (tick - 7)){
    audioLastSeven.play();
  }

  if (this.tickSeconds === tick) {
    this.tickSeconds = 0;
    var outputMsgs = send("next");
    printOutputmsgs(outputMsgs);
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
  //debugger;
  clearInterval(this.battery);
}

Clock.prototype.turnPassed = function() {
  this.turns++;
  this.turnSeconds = 0;
  this.turnMinutes = 0;
}

Clock.prototype.zeroTick = function() {
  this.tickSeconds = 0;
}

Clock.prototype.setTick = function(param) {
  tick = param;
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

var audioHalf = null;
var audioHurry = null;
var audioLastSeven = null;

function loadSound() {
  audioHalf = document.getElementById("half");
  audioHurry = document.getElementById("hurry");
  audioLastSeven = document.getElementById("last7");
}

function setVolume(volume) {
  audioHalf.volume = volume;
  audioHurry.volume = volume;
  audioLastSeven.volume = volume;

  return okmsg;
}
