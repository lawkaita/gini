var database = [];

var nextCreatureId = 0;

var success = "[OK]"

function addCreature(name, initiative, hp) {
    var creature = {id: nextCreatureId, name: name, inikka: initiative, hp: hp, maxHp: hp};
    database.push(creature);
    nextCreatureId++;
    
    return success;
}

function initWindow() {
    addCreature('Aboleth', 12, 100);
    addCreature('uthal', 5, 0);
    addCreature('kobold123', 36, 77);

    var foo = document.querySelector("#creaturesWindow");
    var text = createUi(database);
    foo.appendChild(text);
}

function getCreatureIndex(attribute, attributeName) {
    for(var i in database) {
        var creature = database[i];
        var currentAttribute = creature[attributeName];

        if (currentAttribute == attribute) {
            return i;
        }
    }

    return null;        
}

function getDeleteClicked(creatureId) {
    var deleteClicked = function() {
        var index = getCreatureIndex(creatureId, 'id');

        console.assert(index != null);

        database.splice(index, 1);
        updateUi();
    };

    return deleteClicked;
}

function createRow(creature) {    
    var name = creature['name'];
    var nameText = document.createTextNode(name);
    var nameCell = document.createElement('td');
    nameCell.appendChild(nameText);

    var initiative = creature['inikka'];
    var initiativeText = document.createTextNode(initiative);
    var initiativeCell = document.createElement('td');
    initiativeCell.appendChild(initiativeText);
    
    var hp = creature['hp'];
    var maxHp = creature['maxHp'];
    var hpText = document.createTextNode(hp + '/' + maxHp);
    var hpCell = document.createElement('td');
    hpCell.appendChild(hpText);
    
    var hpPercent = calc.permilDivision(hp, maxHp);
    var hpPercentText = document.createTextNode(hpPercent);
    var hpPercentCell = document.createElement('td');
    hpPercentCell.appendChild(hpPercentText);
    

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'remove')
    var creatureId = creature['id'];
    var deleteClicked = getDeleteClicked(creatureId);
    button.addEventListener('click', deleteClicked);
    var buttonCell = document.createElement('td');
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

