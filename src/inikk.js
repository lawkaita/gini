var database = [
    {name: 'uthal', inikka: 5},
    {name: 'kobold123', inikka: 36, hp: 77}
]

function addMonster(name, initiative, hp) {
    var monster = {name: name, inikka: initiative, hp: hp};
    database.push(monster);
}

function init() {
    console.log(11345);
    addMonster('Aboleth', 12, 100);
    var foo = document.getElementById('main');
    var text = createUi(database);
    foo.appendChild(text);
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

    var row = document.createElement('tr');
    row.appendChild(nameCell);
    row.appendChild(initiativeCell);
    return row;
}

function addClicked() {
    var nameElement = document.getElementById('name');
    var name = nameElement.value;
    addMonster(name, 0, 0);

    updateUi();
    console.log('pekka ' + name);
}

function createAddUi() {
    var nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'name');
    var nameCell = document.createElement('td');
    nameCell.appendChild(nameInput);

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.addEventListener('click', addClicked);

    var buttonCell = document.createElement('td');
    buttonCell.appendChild(button);
    
    var row = document.createElement('tr');
    row.appendChild(nameCell);
    row.appendChild(buttonCell);

    return row;
}

function byInitiative(creature1, creature2) {
    var initiative1 = creature1['inikka'];
    var initiative2 = creature2['inikka'];

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



window.addEventListener('load', init);

