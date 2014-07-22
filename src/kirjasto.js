var database = [];
var initiativeIndex;
var nextCreatureId = 0;
var success = "[OK]";
var fail = "[FAIL]";

function addCreature(name, initiative, hp) {
    var creature = {id: nextCreatureId, name: name, inikka: initiative, hp: hp, maxHp: hp};
    database.push(creature);
    nextCreatureId++;
    return success;
}

function initWindow() {
    addCreature('Aboleth', 12, 100);
    addCreature('uthal', 5, 6);
    addCreature('kobold123', 36, 77);

    var foo = document.querySelector("#creaturesWindow");
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
    return success;
  }
  return fail;
}

function changeCreatureInitiativeByName(name, initiative) {
  var index = getCreatureIndex(name, 'name');
  if (index === undefined) {
    return fail;
  }
  database[index].inikka = initiative;
  updateUi();
  return success;
}

function damageCreatureByName(name, dmg) {
  var index = getCreatureIndex(name, 'name');
  var creature = database[index];
  creature.hp = creature.hp - dmg;
  updateUi();
  return success;
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

function createRow(creature) {    
    var name = creature['name'];
    var nameText = document.createTextNode(name);
    var nameCell = document.createElement('td');
    var nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'nameDiv');
    nameDiv.appendChild(nameText);
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

