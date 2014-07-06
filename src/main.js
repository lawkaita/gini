var greeting = document.querySelector('#greeting');

function init() {
  
  var input = document.querySelector('#mainInput');
  console.log(input);

  input.addEventListener('keydown', keypress);
  
  initWindow();
  
}

function keypress(event) {
  console.log(event);
  
  var input = document.querySelector('#mainInput');
  var textWindow = document.querySelector('#textWindow');
  
  if (event.keyCode === 13) {
    
    
    var inputText = input.value;
    mainInput.value = "";
    
    if(inputText !== "") {
      var rowCount = textWindow.rows.length;
      var row = textWindow.insertRow(rowCount);
      var cell = row.insertCell(0);
      var textNode = document.createTextNode(inputText);
      cell.appendChild(textNode);
    }

  }
}

document.addEventListener('DOMContentLoaded', init);
