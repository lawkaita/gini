/* kirjasto.js */

function initSaveStateVars() {
	database = [];
	turnNumber = undefined;
	nextCreatureId = 0;
	saveState = {};
}

var ok = "[OK]";
var fail = "[FAIL]";
var okmsg = {
	label: ok,
	rowClass: 'soutRow'
}
var noCreatureWithNameMsg = {
	label: fail,
	text: "no creature with such name",
	rowClass: 'error'
}

function writeSave() {
	saveState['database'] = database;
	saveState['turnNumber'] = turnNumber;
	saveState['nextCreatureId'] = nextCreatureId;
	saveState['combatClock'] = combatClock;
	saveState['ticker'] = ticker;
	saveState['turnTracker'] = turnTracker;
}
//pysyv�mm�n tallennuksen lyhyt oppim��r�
// tallentaminen
function save() {
	//var asia = database;
	writeSave();
	var seivi = {};
	seivi['asia'] = saveState;
	jsonSeivi = JSON.stringify(seivi);
	localStorage.setItem('munSeivi', jsonSeivi);
}
// lataaminen
function load() {
	seiviJson = localStorage.getItem('munSeivi');
	if (seiviJson === null) {
		return null;
	} else {
		seivi = JSON.parse(seiviJson);
		asia = seivi['asia'];
		return asia;
	}
}

function getCreatureIdByTurnNumber() {
	if (database.length > 0) {
		var sortedCreatures = sortByInitiative(database);
		var creatureByTurnNumber = sortedCreatures[turnNumber];
		var creatureId = creatureByTurnNumber['id'];
		return creatureId;
	}
}

function getTurnNumberByCreatureId(id) {
	var sortedCreatures = sortByInitiative(database);
	for (var i in sortedCreatures) {
		var creature = sortedCreatures[i];
		var creatureId = creature['id'];
		if (creatureId === id) {
			return i;
		}
	}
}

function addCreature(name, initiative, hp) {
	if (creatureWithNameExists(name)) {
		var msg = {
			label: fail,
			text: "creature with name exists",
			rowClass: 'error'
		};
		return msg;
	}
	
	if(hp == 0) {
		var msg = {
			label: fail,
			text: "hp cannot be zero",
			rowClass: 'error',
		}
		return msg;
	}
	
	var creature = {
		id: nextCreatureId,
		name: name,
		inikka: initiative,
		hp: hp, 
		maxHp: hp,
		remarks: []
	};

	if(turnNumber === undefined) {
		database.push(creature);
	} else {
		var idInTurn = getCreatureIdByTurnNumber();
		database.push(creature);
		turnNumber = getTurnNumberByCreatureId(idInTurn);
	}
	nextCreatureId++;
	return okmsg;
}

function initWindow() {
	//addCreature('Aboleth', 12, 100);
	//addCreature('uthal', 5, 6);
	//addCreature('kobold123', 36, 77);

	var foo = document.querySelector("#creaturesWindow");
	
	var bar = document.createElement('tr');
	bar.setAttribute('class', 'creatureTableColumnNames');
	
	var baz = document.createElement('table');
	baz.setAttribute('class', 'columnNamesRow');

	var nameCell = document.createElement('td');
	var nameText = document.createTextNode('name');
	var nameDiv = document.createElement('div');
	nameDiv.appendChild(nameText);
	nameDiv.setAttribute('style', 'max-width: 140px');
	nameCell.setAttribute('class', 'nameColumn');
	nameCell.appendChild(nameDiv);
	
	var initCell = document.createElement('td');
	var initText = document.createTextNode('init');
	initCell.setAttribute('class', 'numberColumn');
	initCell.appendChild(initText);
	
	var hpCell = document.createElement('td');
	var hpText = document.createTextNode('hp/maxHp');
	hpCell.setAttribute('class', 'numberColumn');
	hpCell.appendChild(hpText);
	
	var hpPerCell = document.createElement('td');
	var hpPerText = document.createTextNode('hp %');
	hpPerCell.setAttribute('class', 'numberColumn');
	hpPerCell.appendChild(hpPerText);
	
	/*
	var addRemoveCell = document.createElement('td');
	var addRemoveText = document.createTextNode('add/remove');
	addRemoveCell.setAttribute('class', 'numberColumn');
	addRemoveCell.appendChild(addRemoveText);
	*/
	
	bar.appendChild(nameCell);
	bar.appendChild(initCell);
	bar.appendChild(hpCell);
	bar.appendChild(hpPerCell);
	//bar.appendChild(addRemoveCell);
	
	baz.appendChild(bar);
	foo.appendChild(baz);
	
	var text = createUi(database);
	foo.appendChild(text);
}

function initWindow_old() {
	//addCreature('Aboleth', 12, 100);
	//addCreature('uthal', 5, 6);
	//addCreature('kobold123', 36, 77);

	var foo = document.querySelector("#creaturesWindow");
	
	var bar = document.createElement('tr');
	bar.setAttribute('class', 'creatureTableColumnNames');
	
	var baz = document.createElement('table');
	baz.setAttribute('class', 'columnNamesRow');

	var nameCell = document.createElement('td');
	var nameText = document.createTextNode('name');
	var nameDiv = document.createElement('div');
	nameDiv.appendChild(nameText);
	nameDiv.setAttribute('style', 'max-width: 140px');
	nameCell.setAttribute('class', 'nameColumn');
	nameCell.appendChild(nameDiv);
	
	var initCell = document.createElement('td');
	var initText = document.createTextNode('init');
	initCell.setAttribute('class', 'numberColumn');
	initCell.appendChild(initText);
	
	var hpCell = document.createElement('td');
	var hpText = document.createTextNode('hp/maxHp');
	hpCell.setAttribute('class', 'numberColumn');
	hpCell.appendChild(hpText);
	
	var hpPerCell = document.createElement('td');
	var hpPerText = document.createTextNode('hp %');
	hpPerCell.setAttribute('class', 'numberColumn');
	hpPerCell.appendChild(hpPerText);
	
	var addRemoveCell = document.createElement('td');
	var addRemoveText = document.createTextNode('add/remove');
	addRemoveCell.setAttribute('class', 'numberColumn');
	addRemoveCell.appendChild(addRemoveText);
	
	bar.appendChild(nameCell);
	bar.appendChild(initCell);
	bar.appendChild(hpCell);
	bar.appendChild(hpPerCell);
	bar.appendChild(addRemoveCell);
	
	baz.appendChild(bar);
	foo.appendChild(baz);
	
	var text = createUi(database);
	foo.appendChild(text);
}

function nextTurnNumber() {
	if (turnNumber === undefined) {
		turnNumber = 0;
	} else if (turnNumber >= database.length - 1) {
		turnNumber = 0;
	} else {
		turnNumber++;
	}
}

function highlightCreatureRow(index) {
	database[index].setAttribute('class', 'selectedRow')
}

function unhighlightCreatureRow(index) {
	
}

function deleteCreatureByName(name) {
	var index = getCreatureIndex(name, 'name');
	if(index !== undefined) {
		if (turnNumber === undefined) {
			deleteCreatureFromIndex(index);
		} else {
			var indexAsInt = parseInt(index);
			var creatureToDelete = database[indexAsInt];
			var creatureToDeleteId = creatureToDelete['id'];
			var idInTurn = getCreatureIdByTurnNumber();
			var toReturn = okmsg;
			if (idInTurn === creatureToDeleteId) {
				//printLine("0",'devRow');
				toReturn = nextCommand();
				idInTurn = getCreatureIdByTurnNumber();
			}
			deleteCreatureFromIndex(index);
			turnNumber = getTurnNumberByCreatureId(idInTurn);
		}
		updateUi();
		return toReturn;
	}
	return noCreatureWithNameMsg;
}

function changeCreatureInitiativeByName(name, initiative) {
	var index = getCreatureIndex(name, 'name');
	if (index === undefined) {
		return noCreatureWithNameMsg;
	} else {
		creatureToInit = database[index];
		var creatureToInitId = creatureToInit['id'];
		var idInTurn = getCreatureIdByTurnNumber();
		var toReturn = okmsg;
		if (idInTurn === creatureToInitId) {
			toReturn = nextCommand();
			idInTurn = getCreatureIdByTurnNumber();
		}
	}
	database[index].inikka = initiative;
	turnNumber = getTurnNumberByCreatureId(idInTurn);
	updateUi();
	return okmsg;
}

function damageCreatureByName(name, dmg) {
	var index = getCreatureIndex(name, 'name');
		if (index === undefined) {
		return noCreatureWithNameMsg;
	}
	var creature = database[index];
	if (creature.hp === "-") {
		creature.hp = -dmg;
	} else {
		creature.hp = creature.hp - dmg;
	}
	updateUi();
	var msgToReturn = {
		label: ok,
		text: creature.name + " suffered " + dmg + " damage",
		rowClass: "soutRow"
	}
	return msgToReturn;
}

function remarkCreature(name, remark) {
	var index = getCreatureIndex(name, 'name');
	if (index === undefined) {
		return noCreatureWithNameMsg;
	}
	var creature = database[index];
	var remarks = creature.remarks;
	var remarkIndex = getRemarkIndex(remarks, remark);
	if(remarkIndex === undefined) {
		remarks.push(remark);
		updateUi();
		return okmsg;
	} else {
		var msg = {
			label: fail,
			text: "creature already has this mark",
			rowClass: 'error'
		};
		return msg;
	}
}

function unremarkCreature(name, remark) {
	var index = getCreatureIndex(name, 'name');
	if (index === undefined) {
		return noCreatureWithNameMsg;
	}
	var creature = database[index];
	var remarks = creature.remarks;
	if (remark === 'all') {
		creature.remarks = [];
		updateUi();
		return okmsg;
	}
	var remarkIndex = getRemarkIndex(remarks, remark);
	if (remarkIndex === undefined) {
		var msg = {
			label: fail,
			text: "creature does not have this mark",
			rowClass: 'error'
		};
		return msg;
	}
	remarks.splice(remarkIndex, 1);
	updateUi();
	return okmsg;	
}

function getRemarkIndex(remarkArray, remarkToSearch) {
	for (var i in remarkArray) {
		var remark = remarkArray[i];
		if (remark === remarkToSearch) {
			return i;
		}
	}
}

function getCreatureIndex(attribute, attributeName) {
	for(var i in database) {
		var creature = database[i];
		var currentAttribute = creature[attributeName];

		if (currentAttribute == attribute) {
			return i;
		}
	}
}

function getDeleteClicked(creatureId) {
	var deleteClicked = function() {
		var index = getCreatureIndex(creatureId, 'id');

		console.assert(index != null);

		deleteCreatureFromIndex(index);
		updateUi();
	};

	return deleteClicked;
}

function deleteCreatureFromIndex(index) {
	var parsed = parseInt(index);
	database.splice(parsed, 1);
}

function createRemarkSmall(remarks) {
	var small = document.createElement('small');
	var remarkStr = "";

	for (var i = 0; i < remarks.length; i++) {
		remarkStr = remarkStr + remarks[i] + ", ";
	}

	remarkStr = remarkStr.slice(0, remarkStr.length-2);
	var textNode = document.createTextNode(remarkStr);

	small.appendChild(textNode);
	return small;
}

function createRow(creature) {	
	var name = creature['name'];
	var nameText = document.createTextNode(name);
	var nameCell = document.createElement('td');
	var nameDiv = document.createElement('div');
	nameDiv.setAttribute('class', 'nameDiv');
	nameDiv.appendChild(nameText);
	var br = document.createElement('br');
	nameDiv.appendChild(br);
	var remarkStrSmall = createRemarkSmall(creature.remarks);
	nameDiv.appendChild(remarkStrSmall);

	nameCell.setAttribute('class', 'nameCell');
	nameCell.appendChild(nameDiv);

	var initiative = creature['inikka'];
	var initiativeText = document.createTextNode(initiative);
	var initiativeCell = document.createElement('td');
	initiativeCell.setAttribute('class', 'numberCell');
	initiativeCell.appendChild(initiativeText);
	
	var hp = creature['hp'];
	var maxHp = creature['maxHp'];
	var hpText = document.createTextNode(hp + '/' + maxHp);
	var hpCell = document.createElement('td');
	hpCell.setAttribute('class', 'numberCell');
	hpCell.appendChild(hpText);
	
	var hpPercent = calc.permilDivision(hp, maxHp);
	var hpPercentText = document.createTextNode(hpPercent);
	var hpPercentCell = document.createElement('td');
	hpPercentCell.setAttribute('class', 'numberCell');
	hpPercentCell.appendChild(hpPercentText);
	
	/*
	var button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('value', 'remove');
	var creatureId = creature['id'];
	var deleteClicked = getDeleteClicked(creatureId);
	button.addEventListener('click', deleteClicked);
	var buttonCell = document.createElement('td');
	buttonCell.setAttribute('class', 'numberCell');
	buttonCell.appendChild(button);	
	*/

	var row = document.createElement('tr');
	row.appendChild(nameCell);
	row.appendChild(initiativeCell);
	row.appendChild(hpCell);
	row.appendChild(hpPercentCell);
	//row.appendChild(buttonCell);
	return row;
}

function addClicked() {
	var nameElement = document.getElementById('name');
	var name = nameElement.value;
	
	var initiativeElement = document.getElementById('initiative');
	var initiative = initiativeElement.value;
	
	var hpElement = document.getElementById('hp');
	var hp = hpElement.value;

	addCreature(name, initiative, hp);

	updateUi();
	console.log(name);
}

function createAddUi() {
	var nameInput = document.createElement('input');
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('id', 'name');
	var nameCell = document.createElement('td');
	nameCell.appendChild(nameInput);

	var initiativeInput = document.createElement('input');
	initiativeInput.setAttribute('type', 'text');
	initiativeInput.setAttribute('id', 'initiative');
	var initiativeCell = document.createElement('td');
	initiativeCell.appendChild(initiativeInput);
	
	var hpInput = document.createElement('input');
	hpInput.setAttribute('type', 'text');
	hpInput.setAttribute('id', 'hp');
	var hpCell = document.createElement('td');
	hpCell.appendChild(hpInput);
	
	/*
	var emptyInput = document.createElement('input');
	emptyInput.setAttribute('type', 'text');
	emptyInput.setAttribute('id', 'emptyCell');
	*/

	var emptyCell = document.createElement('td');
	//emptyCell.appendChild(emptyInput);

	var button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('value', 'add');
	button.addEventListener('click', addClicked);
	var buttonCell = document.createElement('td');
	buttonCell.appendChild(button);
	
	var row = document.createElement('tr');
	row.appendChild(nameCell);
	row.appendChild(initiativeCell);
	row.appendChild(hpCell);
	row.appendChild(emptyCell);
	row.appendChild(buttonCell);

	return row;
}

function byInitiative(creature1, creature2) {
	var initiative1 = creature1['inikka'];
	var initiative2 = creature2['inikka'];
	console.assert(!isNaN(initiative1) && !isNaN(initiative2));
	return 1 * (initiative2 - initiative1);
}

function sortByInitiative(creatures) {
	var newList = creatures.slice();
	newList.sort(byInitiative);
	return newList;
}

function createUi(creatures) {
	var sortedCreatures = sortByInitiative(creatures);
	var table = document.createElement('table');
	table.setAttribute('id', 'ui');
	for(var i in sortedCreatures) {
		var creature = sortedCreatures[i];
		var testRow = createRow(creature);
		
		if (i == turnNumber) {
			testRow.setAttribute('class', 'selectedRow');
		} else {
			testRow.setAttribute('class', 'notSelectedRow');
		}
		table.appendChild(testRow);
	}
	//var addUi = createAddUi();
	//table.appendChild(addUi);
	return table;	
}

function updateUi() {
	var newTable = createUi(database);
	var oldTable = document.getElementById('ui');
	var container = oldTable.parentElement;
	container.replaceChild(newTable, oldTable);	
}

function creatureWithNameExists(nameToSearch) {
	var exists = false;
	for (i = 0; i < database.length; i++) {
		var creature = database[i];
		var name = creature['name'];
		if(name === nameToSearch) {
			exists = true;
		}
	}
	return exists;
}

