var database = [
    {name: 'uthal', inikka: 5},
    {name: 'kobold123', inikka: 36, hp: 77}
]

function init() {
    console.log(11345);
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

function createUi(creatures) {
    var table = document.createElement('table');
    table.setAttribute('id', 'ui');
    for(var i in creatures) {
        var creature = creatures[i];
        var testRow = createRow(creature);
        table.appendChild(testRow);
    }
    return table;    
}

window.addEventListener('load', init);

