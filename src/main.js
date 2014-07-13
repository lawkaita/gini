var greeting = document.querySelector('#greeting');
//var input = document.querySelector('#mainInput');
var input = document.getElementById('textarea');
var textWindow = document.querySelector('#textRows');

var recentCommands = [];
var rci = new RecentCommandIterator();

function init() {
  console.log(input);

  input.addEventListener('keydown', keypress);
  
  /*
  var mainInput = document.getElementById('mainInput');
  mainInput.addEventListener('keydown', keypress);
  */
  
  initWindow();
  
}

function RecentCommandIterator() {
  this.index = recentCommands.length;
}

RecentCommandIterator.prototype.moveUp = function() {
  this.index--;
  if (this.index < 0) {
    this.index = 0;
  }
  
  return this.getCommand();
}

RecentCommandIterator.prototype.moveDown = function () {
  this.index++;
  if (this.index > recentCommands.length) {
    this.index = recentCommands.length;
  }
  
  return this.getCommand();
}

RecentCommandIterator.prototype.getCommand = function () {
  if (this.index === recentCommands.length) {
    return "";
  }
  
  return recentCommands[this.index];
}

function keypress(event) {
  console.log(event);
  
  if (event.keyCode === 38) {
    event.preventDefault();
    input.value = rci.moveUp();
  }
  
  if (event.keyCode == 40) {
    input.value = rci.moveDown();
  }
  
  if (event.keyCode === 13) {
    event.preventDefault();
    rci = new RecentCommandIterator();
    
    var inputText = input.value;
    
    if(inputText !== "") {
      input.value = "";
      var row = printInput(inputText);
      
      var outputCell = row.insertCell(1);
      var output = send(inputText);
      var outputTextNode = document.createTextNode(output);
      outputCell.appendChild(outputTextNode);
      
      /*
      input = document.createElement('textarea');
      input.setAttribute('id', 'textarea');
      input.setAttribute('placeholder', 'command');
      input.setAttribute('spellcheck', 'false');
      input.addEventListener('keydown', keypress);
      
      textWindow.appendChild(input);
      input.focus();
      */
      
    }
    var div = document.getElementById('textWindow');
    scrollDown(div);
  }
}

function printInput(inputText) {
  var toPrint = inputText;
  
  while(toPrint.length > 20) {
    var lineToPrint = toPrint.slice(0,20);
    toPrint = toPrint.slice(20);
    
    printInputLine(lineToPrint);
  }
  
  return printInputLine(toPrint);
  
      
}

function printInputLine(line) {
      var rowCount = textWindow.rows.length;
      var row = textWindow.insertRow(rowCount);
  
      var inputCell = row.insertCell(0);
      var inputTextNode = document.createTextNode(line);
      inputCell.appendChild(inputTextNode);
      
      return row;
}

function send(inputText) {
  var output = runCommandString(inputText);
  
  if (output !== "[SYNTAX ERROR]") {
    recentCommands.push(inputText);
    rci.index++;
  }
  
  return output;
  
}

function scrollDown(myDiv) {
  myDiv.scrollTop = myDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
