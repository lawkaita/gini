function CommandAssigner() {
  this.target = send;
}

CommandAssigner.prototype.assign = function(command) {
  return this.target(command);
}

CommandAssigner.prototype.reset = function() {
  this.target = send;
}

CommandAssigner.prototype.set = function(theTarget) {
  this.target = theTarget;
}

function initiateCBD(startStr) {
  cbd = new CommandBuildDialog();
  cbd.append(startStr);
  comAssigner.set(cbdAppender);
}

function cbdAppender(str) {
  cbd.append(str);
  return cbd.run();
}

function CommandBuildDialog() {
  this.commandString = "";
}

CommandBuildDialog.prototype.append = function(string) {
  this.commandString = this.commandString + " " + string;
}

CommandBuildDialog.prototype.clear = function() {
  this.commandString = "";
}

CommandBuildDialog.prototype.run = function() {
  var userInput = this.commandString;
  if (userInput === undefined) {
    var undefinedMsg = {
      label: '[FAIL]',
      text: "undefined input",
      rowClass: 'error'
    };

    comAssigner.reset();
    return undefinedMsg;
  }

  comAssigner.reset();
  return runCommandString(userInput);
}

/*
function caputreInput() {
  comAssigner.set(setInputVar);
  var toReturn = undefined;
  var weWait = true; 
  while(weWait) {
    if (inputVar !== undefined) {
      var toReturn = inputVar;
      setInputVar(undefined);
      comAssigner.reset();
      weWait = false;
    }
  }

  return toReturn;
}


function askAnswer(returnTo) {
  grt = returnTo;
  comAssigner.set(passerFunction);
}

function passerFunction(receivedInput) {
  inputVar = edit;
}

function identity() {
  var t = identity;
  return t;
}

function callMe(varble) {
  if (varble === undefined) {
    return tellMe(callMe, 1);  
  }
  
  if (varble === 1) {
    return [this];
  }

  if (varble === 2) {
    return "asd";
  }
}

function tellMe(a, b) {
  return a(b);
}
*/
var cbd = new CommandBuildDialog();
var comAssigner = new CommandAssigner();
