var greeting = document.querySelector('#greeting');
//var input = document.querySelector('#mainInput');
var input = document.getElementById('inputArea');
var recentCommands = [];
var rci = new RecentCommandIterator();
var charWidth = 7;

function init() {
  console.log(input);
  input.addEventListener('keydown', keypress);
  input.addEventListener('overflow', expandInputArea);
  /*
  var mainInput = document.getElementById('mainInput');
  mainInput.addEventListener('keydown', keypress);
  */
  initWindow();
  declareFontSize();
}

function declareFontSize() {
  var testSpan = document.querySelector('#fontSizeTest');
  var height = testSpan.offsetHeight;
  var width = testSpan.offsetWidth/3;
  charWidth = width;
  printText("Char dimensions: " + height + "x" + width);
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
      refreshInputArea();
      printText(inputText, 'input');
      var outputText = send(inputText);
      printText(outputText, 'output');
    }
    //var div = document.getElementById('textWindow');
    var div = document.getElementById('textField');
    scrollDown(div);
  } else {
    countAndExpandInputArea();
  }
}

function countAndExpandInputArea() {
  var chars = input.value.length;
  var charsToBe = countLineLengthInChars(input);
  var rowsToBe = Math.floor(chars / charsToBe) + 1;
  input.rows = rowsToBe;
}

function expandInputArea(event) {
  console.log(event)
  input.rows++;
}

function refreshInputArea() {
  input.value = "";
  input.rows = 1;
}

function addNewInputArea() {
  input = document.createElement('textarea');
  input.setAttribute('id', 'inputArea');
  input.setAttribute('placeholder', 'command');
  input.setAttribute('spellcheck', 'false');
  input.rows = 1;
  input.addEventListener('keydown', keypress);
  
  var textWin = document.querySelector('#textRows');
  textWin.appendChild(input);
  input.focus();
}

function printInput() {
  var textRows = document.querySelector('#textRows');
  input.disabled = true;
  input.setAttribute('id','oldInputArea');
  textRows.appendChild(input);
}

function printOutput(string) {
  var textRows = document.querySelector('#textRows');
  outputArea = document.createElement('textarea');
  outputArea.setAttribute('id', 'outputArea');
  outputArea.setAttribute('placeholder', 'nullll');
  outputArea.setAttribute('spellcheck', 'false');
  outputArea.innerText = string;
  outputArea.rows = 1;
  textRows.appendChild(outputArea);
}

function countLineLengthInChars(div) {
  var lineLengthInPX = div.offsetWidth;
  return Math.floor(parseInt(lineLengthInPX)/charWidth) - 1;
}

function printText(text, direction) {
  var toPrint = text;
  var textRows = document.querySelector('#textRows');
  var lineLengthInChars = countLineLengthInChars(textRows);
  while(toPrint.length > lineLengthInChars) {
    var lineToPrint = toPrint.slice(0, lineLengthInChars);
    toPrint = toPrint.slice(lineLengthInChars);
    printLine(lineToPrint, direction);
  }
  printLine(toPrint, direction);
}

function printLine(line, direction) {
  var textRows = document.querySelector('#textRows');
  var div =  document.createElement('div');
  var divClass = 'textRow';
  if (direction === 'input') {
    divClass = 'inputRow';
  }
  if (direction === 'output') {
    divClass = 'soutRow';
  }
  div.setAttribute('class', divClass);
  //var width = textRows.offsetWidth;
  //div.setAttribute('style', 'width:' + (width - 3) + "px");
  var inputTextNode = document.createTextNode(line);
  div.appendChild(inputTextNode);
  textRows.appendChild(div);
  //return div;
}

function printOutput_old(row, output) {
    var outputCell = row.insertCell(1);
    var outputTextNode = document.createTextNode(output);
    outputCell.appendChild(outputTextNode);
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
