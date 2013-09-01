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
    var cell = document.createElement('td');
    cell.appendChild(nameText);
    var row = document.createElement('tr');
    row.appendChild(cell);
    return row;
}

function addClicked() {
    var nameElement = document.getElementById('name');
    var name = nameElement.value;
    addMonster(name, 0, 0);

    console.log('pekka' + name);
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

function createUi(creatures) {
    var table = document.createElement('table');
    table.setAttribute('id', 'ui');
    for(var i in creatures) {
        var creature = creatures[i];
        var testRow = createRow(creature);
        table.appendChild(testRow);
    }
    var addUi = createAddUi();
    table.appendChild(addUi);
    return table;    
}

window.addEventListener('load', init);

