/* main.js */

var greeting = document.querySelector('#greeting');
//var input = document.querySelector('#mainInput');
var input = document.getElementById('inputArea');
var recentCommands = [];
var vars = {};
var rci = new RecentCommandIterator();
var charWidth = 7;
var devMode = false;

function init() {
	console.log(input);
	input.addEventListener('keydown', keypress);
	var textField = document.querySelector('#textField');
	textField.addEventListener('click', inputFocus);
	//input.addEventListener('overflow', expandInputArea);
	/*
	var mainInput = document.getElementById('mainInput');
	mainInput.addEventListener('keydown', keypress);
	*/
	loadSession();
	initWindow();
	loadSound();
	declareFontSize();
	startClock();
	input.focus();
}

function loadSession() {
	database = load();
}

function startClock() {
	initClock();
	mainClock.start();
	var now = Date();
	printText(now);
}

function declareFontSize() {
	var testSpan = document.querySelector('#fontSizeTest');
	var height = testSpan.offsetHeight;
	var width = testSpan.offsetWidth/3;
	charWidth = width;
	printText("Char dimensions: " + height + "x" + width, 'soutRow');
}

function inputFocus() {
	input.focus();
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
			processInput(inputText);
		}
		//var div = document.getElementById('textWindow');
		var div = document.getElementById('textField');
		scrollDown(div);
	} else {
		countAndExpandInputArea();
	}
}

function processInput(inputText) {
	refreshInputArea();
	printText(inputText, 'inputRow');
	var outputmsgs = comAssigner.assign(inputText);
	//var outputmsgs = send(inputText);
	var label = outputmsgs['label'];
	if (label !== "[SYNTAX ERROR]") {
		recentCommands.push(inputText);
		rci.index++;
	}
	printOutputmsgs(outputmsgs);
	save();
}

function printOutputmsgs(outputmsgs) {
	var opened = openMsg(outputmsgs);
	var label = opened['label'];
	var text = opened['text'];
	var rowClass = opened['rowClass'];
	var output = label + text;
	printLineBreakText(output, rowClass);
}

function openMsg(msg) {
	var paramNames = ['label', 'text', 'rowClass',];
	var opened = {
		label: '',
		text: '',
		rowClass: 'soutRow'
	}

	for (var i in paramNames) {
		var paramName = paramNames[i];
		if (msg[paramName] !== undefined) {
			opened[paramName] = msg[paramName];
		}
	}

	if((opened['label'] !== '') && (opened['text'] !== '')) {
		opened['label'] = opened['label'] + ': ';
	}

	return opened;
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

function addNewInputArea_dec() {
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

function printInput_dec() {
	var textRows = document.querySelector('#textRows');
	input.disabled = true;
	input.setAttribute('id','oldInputArea');
	textRows.appendChild(input);
}

function printOutput_old2(string) {
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
	return Math.floor(parseInt(lineLengthInPX/charWidth)) - 1;
}

function printText(text, rowClass) {
	var toPrint = text;
	var textRows = document.querySelector('#textRows');
	var lineLengthInChars = countLineLengthInChars(textRows);
	while(toPrint.length > lineLengthInChars) {
		var lineToPrint = toPrint.slice(0, lineLengthInChars);
		toPrint = toPrint.slice(lineLengthInChars);
		printLine(lineToPrint, rowClass);
	}
	printLine(toPrint, rowClass);
}

function printLineBreakText(text, rowClass) {
	var toPrint = text.split("\n");
	for (var i in toPrint) {
		printLine(toPrint[i], rowClass);
	}
}

function sout(line) {
	printLineBreakText(line, 'soutRow');
}

function soutMath(line) {
	printText("		" + line, 'mathRow');
}

function printLine(line, rowClass) {
	var textRows = document.querySelector('#textRows');
	var div =	document.createElement('div');
	var divClass;
	if (rowClass === undefined) {
		divClass = 'textRow';
	} else {
		divClass = rowClass;
	}

	div.setAttribute('class', divClass);
	//var width = textRows.offsetWidth;
	//div.setAttribute('style', 'width:' + (width - 3) + "px");
	var inputNode;
	if (rowClass === 'urlRow') {
		var a = document.createElement('a');
		a.setAttribute('href', line);
		a.setAttribute('target', '_blank');
		a.innerHTML = 'link';
		a.style.backgroundColor = "white";
		inputNode = a;
	} else {
		inputNode = document.createTextNode(line);
	}
	div.appendChild(inputNode);
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
	return output;
}

function doSend(inputText) {
	var output = send(inputText);
	printOutputmsgs(output);
}

function scrollDown(myDiv) {
	myDiv.scrollTop = myDiv.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
