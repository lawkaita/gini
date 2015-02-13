/* time.js */

function Clock() {
  this.seconds = 0;
  this.minutes = 0;

  this.isOn = false;
  this.battery;
  this.toInvoke = [];
}

Clock.prototype.secondPassed = function() {
  this.seconds++;

  if (this.seconds === 60) {
    this.seconds = 0;
    this.minutes++;
  }

  for (var i in this.toInvoke) {
    this.toInvoke[i].secondPassed();
  }

  return true;
}

function tickerSecondPassed() {
  this.seconds++;

  if(this.tick !== 0) {
    if (this.seconds === (Math.floor(this.tick/2))) {
      bzz.play();
    }

    if (this.seconds === Math.floor(this.tick*(3/4))) {
      bzz3.play();
    }

    if (this.seconds === (this.tick - 7)){
    }

    if (this.seconds >= this.tick) {
      if (!this.overTime) {
        this.seconds = 0;
        doSend("next");
      } else {
        initiateOvertimeCount();
      }
    }
  }
}

var overtimeTracker = [];
function initiateOvertimeCount() {
  var currentIndex = initiativeIndex;
  var creatureOvertimeClock = overtimeTracker[currentIndex];
  if (creatureOvertimeClock === undefined) {
    creatureOvertimeClock = new Clock();
    overtimeTracker[currentIndex] = creatureOvertimeClock;
  }
  creatureOvertimeClock.secondPassed();
}

function turnTrackerSecondPassed() {
  this.seconds++;

  if (this.seconds === 60) {
    this.seconds = 0;
    this.minutes++;
  }
}

Clock.prototype.start = function() {
  this.isOn = true;
  var that = this;
  this.battery = setInterval(function() {that.secondPassed()}, 1000);
}

function asd() {
  console.log("asd");
}

Clock.prototype.stop = function() {
  this.isOn = false;
  //debugger;
  clearInterval(this.battery);
}

Clock.prototype.takeToInvoke = function(target) {
  this.toInvoke.push(target);
}

function turnTrackerTurnPassed() {
  this.turns++;
  this.seconds = 0;
  this.minutes = 0;
  if (initiativeIndex === database.length - 1) {
    this.rounds++;
  }
}

function zeroTick() {
  this.seconds = 0;
}

function setTick(param) {
  if (param >= 0) {
    this.tick = param;
    var msg = {
      label: ok,
      text: "tick is set to " + param + " seconds",
      rowClass: 'soutRow'
    }
    return msg;
  } else {
    var msg = {
      label: fail,
      text: "tick must be greater than or equal to 0",
      rowClass: 'error'
    };
    return msg;
  }
}

function getOverTimeMsg() {
  var bool = this.overTime;
  var onOrOffString = 'off';
  if (bool) {
    onOrOffString = 'on';
  }
  var msg = {
    label: ok,
    text: "overtime is " + onOrOffString,
    rowClass: 'soutRow'
  }
  return msg;
}

function setOverTime(bool) {
  this.overTime = bool;
  return this.getOverTimeMsg();
}

Clock.prototype.outWrite = function() {
  var totalTime = timeFormat(this.minutes) + ":" + timeFormat(this.seconds);
  var turnTime = timeFormat(turnTracker.minutes) + ":" + timeFormat(turnTracker.seconds);
  var totalSeconds = this.minutes*60 + this.seconds;
  var totalSecondsPerTurn = Math.floor(totalSeconds / turnTracker.turns);
  var minutesPerTurn = Math.floor(totalSecondsPerTurn/60);
  var secondsPerTurn = totalSecondsPerTurn - minutesPerTurn*60;
  var timePerTurn = timeFormat(minutesPerTurn) + ":" + timeFormat(secondsPerTurn);

  var toReturn =  "last turn time = " + turnTime + "\n"
                + "total time     = " + totalTime + "\n"
                + "turns played   = " + turnTracker.turns + "\n"
                + "rounds played  = " + turnTracker.rounds + "\n"
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
var ticker = new Clock();
var turnTracker = new Clock();
ticker.tick = 0;
ticker.overTime = true;
ticker.secondPassed = tickerSecondPassed;
ticker.setTick = setTick;
ticker.zeroTick = zeroTick;
ticker.setOverTime = setOverTime;
ticker.getOverTimeMsg = getOverTimeMsg;
turnTracker.turns = 0;
turnTracker.rounds = 0;
turnTracker.secondPassed = turnTrackerSecondPassed;
turnTracker.turnPassed = turnTrackerTurnPassed;
clock.takeToInvoke(ticker);
clock.takeToInvoke(turnTracker);

var bzz = null;
var bzz3 = null;
var bzzOver = null;
var bzzp1 = null;
var bzzp2 = null;
var audioArr = [];
var globalVolumeNumber = 0.5;

function loadSound() {
  bzz = document.getElementById("bzz");
  bzz3 = document.getElementById("bzz3");
  bzzOver = document.getElementById("bzzOver");
  bzzp1 = document.getElementById("bzzp1");
  bzzp2 = document.getElementById("bzzp2");
  audioArr.push(bzz);
  audioArr.push(bzz3);
  audioArr.push(bzzOver);
  audioArr.push(bzzp1);
  audioArr.push(bzzp2);
  assignVolumeToAudio(globalVolumeNumber);
}

function assignVolumeToAudio(volume) {
  globalVolumeNumber = volume;
  audioArr.map(function(audioVar) {
    audioVar.volume = volume;
  });
}

function setVolume(volume) {
  if (volume > 1 || volume < 0) {
    var msg = {
      label: fail,
      text: "volume must be between 0 and 100",
      rowClass: 'error',
    };
    return msg;
  }

  assignVolumeToAudio(volume);
  bzz.play();

  return msg = {
    label: ok,
    text: "volume: " + volume*100 + " percent"
  };
}


