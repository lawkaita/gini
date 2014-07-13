var greeting = document.querySelector('#greeting');
//var input = document.querySelector('#mainInput');
var input = document.getElementById('textarea');
var textWindow = document.querySelector('#textRows');

function init() {
  console.log(input);

  input.addEventListener('keydown', keypress);
  
  initWindow();
  
}

function keypress(event) {
  console.log(event);
  
  if (event.keyCode === 13) {
    event.preventDefault();
    
    var inputText = input.value;
    input.value = "";

    if(inputText !== "") {
      
      var row = printInput(inputText);
      
      var outputCell = row.insertCell(1);
      var output = commandOutput(inputText);
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

function commandOutput(inputText) {
  return runCommandString(inputText);
}

function scrollDown(myDiv) {
  myDiv.scrollTop = myDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
