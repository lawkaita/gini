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
  var textWindow = document.querySelector('#textRows');
  
  if (event.keyCode === 13) {
    
    
    var inputText = input.value;
    mainInput.value = "";
    
    if(inputText !== "") {
      var rowCount = textWindow.rows.length;
      var row = textWindow.insertRow(rowCount);
      var cell = row.insertCell(0);
      var textNode = document.createTextNode(inputText);
      cell.appendChild(textNode);
      
      var div = document.getElementById('textWindow');
      scrollDown(div);
    }

  }
}

function scrollDown(myDiv) {
  myDiv.scrollTop = myDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
window.re
