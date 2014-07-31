var database = [];
var initiativeIndex;
var nextCreatureId = 0;
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

function addCreature(name, initiative, hp) {
  if (creatureWithNameExists(name)) {
    var msg = {
      label: fail,
      text: "creature with name exists",
      rowClass: 'error'
    }
    return msg;
  }
  
  if(hp === 0) {
    var msg = {
      label: fail,
      text: "hp cannot be zero",
      rowClass: 'error',
    }
  }
  
  var creature = {
	  id: nextCreatureId,
	  name: name,
	  inikka: initiative,
	  hp: hp, 
	  maxHp: hp,
          remarks: []};
  database.push(creature);
  nextCreatureId++;
  return okmsg;
}

function initWindow() {
  addCreature('Aboleth', 12, 100);
  addCreature('uthal', 5, 6);
  addCreature('kobold123', 36, 77);

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

function nextInitiativeIndex() {
  switch(true) {
    case (initiativeIndex === undefined):
      initiativeIndex = 0;
      break;
    case (initiativeIndex >= database.length - 1):
      initiativeIndex = 0;
      break;
    default:
      initiativeIndex++;
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
    deleteCreatureFromIndex(index);
    updateUi();
    return okmsg;
  }
  return noCreatureWithNameMsg;
}

function changeCreatureInitiativeByName(name, initiative) {
  var index = getCreatureIndex(name, 'name');
  if (index === undefined) {
    return noCreatureWithNameMsg;
  }
  database[index].inikka = initiative;
  updateUi();
  return okmsg;
}

function damageCreatureByName(name, dmg) {
  var index = getCreatureIndex(name, 'name');
  if (index === undefined) {
    return noCreatureWithNameMsg;
  }
  var creature = database[index];
  creature.hp = creature.hp - dmg;
  updateUi();
  return okmsg;
}

function remarkCreature(name, remark) {
  var index = getCreatureIndex(name, 'name');
  if (index === undefined) {
    return noCreatureWithNameMsg;
  }
  var creature = database[index];
  creature.remarks.push(remark);
  updateUi();
  return okmsg;
}

function unremarkCreature(name) {
  var index = getCreatureIndex(name, 'name');
  if (index === undefined) {
    return noCreatureWithNameMsg;
  }
  var creature = database[index];
  creature.remarks = [];
  updateUi();
  return okmsg;
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

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'remove');
    var creatureId = creature['id'];
    var deleteClicked = getDeleteClicked(creatureId);
    button.addEventListener('click', deleteClicked);
    var buttonCell = document.createElement('td');
    buttonCell.setAttribute('class', 'numberCell');
    buttonCell.appendChild(button);    

    var row = document.createElement('tr');
    row.appendChild(nameCell);
    row.appendChild(initiativeCell);
    row.appendChild(hpCell);
    row.appendChild(hpPercentCell);
    row.appendChild(buttonCell);
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
    
    var emtyCell = document.createElement('td');

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
    row.appendChild(emtyCell);
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
        
        if (i == initiativeIndex) {
          testRow.setAttribute('class', 'selectedRow');
        } else {
          testRow.setAttribute('class', 'notSelectedRow');
        }
        table.appendChild(testRow);
    }
    var addUi = createAddUi();
    table.appendChild(addUi);
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

