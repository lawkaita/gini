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
      
      var inputCell = row.insertCell(0);
      var inputTextNode = document.createTextNode(inputText);
      inputCell.appendChild(inputTextNode);
      
      var feedbackCell = row.insertCell(1);
      var feedback = commandFeedback(inputText);
      var feedbackTextNode = document.createTextNode(feedback);
      feedbackCell.appendChild(feedbackTextNode);
      
      
      var div = document.getElementById('textWindow');
      scrollDown(div);
    }

  }
}

function commandFeedback(inputText) {
  if (inputText == "fail") {
    return "[FAIL]";
  } else {
    return "[OK]";
  }
}

function scrollDown(myDiv) {
  myDiv.scrollTop = myDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
