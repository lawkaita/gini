var diceRegex = /\b[1-9]?d([1-9]|(1[0-9])|20)\b/;
var alphaNumericCharacterRegex = /\b\w\b/;

function addCreatureCommand(params) {
  var name = params[0];
  var initiativeToBeResolved = params[1];
  var initiative = runParsed(initiativeToBeResolved);
  
  var hpToBeResolved = params[2];
  var hp = runParsed(hpToBeResolved);
  
  var feedback = addCreature(name, initiative, hp);
  updateUi();
  
  return feedback;
  
}

function lastIndexOf(string, char) {
  lastIndex = undefined;
  
  for (var i in string){
    if (string[i] === char) {
      lastIndex = i;
    }
  }
  
  return parseInt(lastIndex);
}

function splitAtIndex(string, index) {
  var first = string.slice(0, index);
  var second = string.slice(index + 1);
  
  return [first, second];
}

function removeCreatureCommand() {
  
}

var changeInitiativeCommand;
var dealDamageCommand;
var clearEncounterCommand;
var printHelpCommand;
var commentCreatureCommand;
var uncommentCreatureCommand;

function returnAsNumber(param) {
  return parseInt(param);
}

function sumCommand(params) {
  var summands = params.map(runParsed);
  
  return calc.sum(summands);
}

function throwDiceCommand(params) {
  var times = params[0];
  var diceSize = params[1];
  
  return calc.throwDice(times, diceSize);
}

var verbs = {
  "add": addCreatureCommand, 
  "remove": removeCreatureCommand, 
  "init":changeInitiativeCommand, 
  "dmg": dealDamageCommand,
  "clear": clearEncounterCommand, 
  "print": printHelpCommand, 
  "comment": commentCreatureCommand, 
  "uncomment": uncommentCreatureCommand,
  
  //math
  "sum": sumCommand,
  "dice": throwDiceCommand,
  "number": returnAsNumber
};

function parse(command) {
  var parsed;
  
  /*
  var parsed = {
    command: parts[0],
    params: parts.slice(1)
  }
  
  var parsed = {
    command: "add",
    params: ["pekka", {
      command: "sum",
      params: [{
        command: "dice",
        params: [1, 20]
      }, 4]
    }]
  }
  */
  
  if (isSentence(command)) {
    parsed = parseSentence(command);
  }
  
  if (isMath(command)) {
    parsed = parseMath(command);
  }
  
  return parsed;
}

function isMath(command) {
  return isSumAndOnlySum(command) || isDice(command) || isNumberString(command);
}

function isMathNotSum(command) {
  return isDice(command) || isNumberString(command);
}
 
function isSumAndOnlySum(command) {
  if (isMathNotSum(command)) {
    return false;
  }
  
  var summands = splitToSummands(command);
  
  return areSummamble(summands);
}

function splitToSummands(command) {
  var summands = command.split('+');
  
  for (var i = 0; i < summands.length; i++) {
    var trimmed = summands[i].trim();
    summands[i] = trimmed;
  }
  
  return summands;
}

function areSummamble(summands) {
  var isTrue = true;
  
  for(var i = 0; i < summands.length; i++) {
    var supposedMathString = summands[i];
    
    if (!isMathNotSum(supposedMathString)) {
      isTrue = false;
    }
  }
  
  return isTrue;
}

function arrayIsDice(parts) {
  if (parts.length === 1) {
    var diceString =  parts[0];
    return isDice(diceString);
  }
  
  return false;
}

function isDice(string) {
  return diceRegex.test(string) && (string.length <= 4);
}

function isNumberString(string) {
  return !isNaN(string) && (typeof(string) === "string") && !isBlank(string);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function isNumber(object) {
  return !isNaN(object) && (typeof(object) === "number");
}

function parseMath(command) {
  var parsed;
  
  if (isSumAndOnlySum(command)) {
    parsed = parseSum(command);
  }
  
  if(isDice(command)) {
    parsed = parseDice(command);
  }
  
  if(isNumberString(command)) {
    parsed = parseNumber(command);
  }
  
  return parsed;
}

function parseSum(command) {
  var summands = splitToSummands(command);
  var parsedSummands = parseSummands(summands);
  
  var parsed = {
    command: "sum",
    params: parsedSummands
  }
  
  return parsed;
}

function parseSummands(summands) {
  var parsedSummands = [];
  
  for (i = 0; i < summands.length; i++) {
    var summand = summands[i];
    
    if (isNumberString(summand)) {
      parsedSummands[i] = parseNumber(summand);
    }
    
    if(isDice(summand)) {
      parsedSummands[i] = parseDice(summand);
    }
  }
  
  return parsedSummands;
}

function parseDice(command) {
  var parts = command.split("d");
  
  if (parts[0] === "") {
    parts[0] = "1";
  }
  
  var parsed = {
    command: "dice",
    params: parts
  }
  
  return parsed;
}

function parseNumber(command) {
  var parsed = {
    command: "number",
    params: command
  }
  
  return parsed;
}

function isSentence(command) {
  var parts = command.split(" ");
  var supposedVerb = parts[0];
  
  return objectContainsKey(verbs, supposedVerb);
}

function parseAdd(splitted) {
  var verb = splitted[0];
  var rest = splitted[1];
  
  var nameAndMath = splitByWhitespaceOnce(rest);
  var name = nameAndMath[0];
  var math = nameAndMath[1];

  var lastWhitespaceIndex = lastIndexOf(math, ' ');
  var initAndHp = splitAtIndex(math, lastWhitespaceIndex);
  var initiativeString = initAndHp[0];
  var hpString = initAndHp[1];
  
  var parsed = {
    command: verb,
    params: [name, parseMath(initiativeString), parseMath(hpString)]
  }
  
  return parsed;  
}

function parseSentence(commands) {
  var splitted = splitByWhitespaceOnce(commands);
  var verb = splitted[0];
  var rest = splitted[1];
  
  if(verb === "add") {
    return parseAdd(splitted);
  }
  
  var restSplitted = splitByWhitespaceOnce(rest);
  
  var restToMathIfMath = [];
  for(i = 0; i < restSplitted.length; i++) {
    var param = restSplitted[i];
    
    restToMathIfMath[i] = parseIfMath(param);
  }
  
  var parsed = {
    command: verb,
    params: restToMathIfMath
  }
  
  return parsed;
}

function scanFirstSumLike(string) {
  var firstPlusIndex = string.indexOf("+");
  var prefix = string.slice(0, firstPlusIndex);
  var trimmed = prefix.trim();
  var lastWhiteSpaceIndexBeforeFirstRelevantSymbol = trimmed.lastIndexOf(" ");
  var firstRelevantIndex = lastWhiteSpaceIndexBeforeFirstRelevantSymbol + 1;
  
  var toRead = string.slice(firstRelevantIndex);
  
  var readSymbol = "";
  var proceed = true;
  var expectingPlus = false;
  var expectingAlNuChar = true;
  var lastReadWasWhiteSpace = false;
  var readpoint = 0;
  var lastRelevantSymbolPoint = -1;
  

  while(proceed) {
    readSymbol = toRead[readpoint];
    
    if (alphaNumericCharacterRegex.test(readSymbol)) {
      if (lastReadWasWhiteSpace && !expectingAlNuChar) {
        proceed = false;
      } else {
        lastRelevantSymbolPoint = readpoint;
        expectingAlNuChar = false;
        expectingPlus = true;
        lastReadWasWhiteSpace = false;
      }
    }
    
    if (readSymbol === " ") {
      lastReadWasWhiteSpace = true;
    }
    
    if (readSymbol === "+") {
      if (!expectingPlus) {
        proceed = false;
      } else {
        expectingAlNuChar = true;
        expectingPlus = false;
      }
    }
    
    readpoint++;
    
    if (readpoint >= toRead.length) {
      proceed = false;
    }
  }
  
  var lastRelevantIndex = firstRelevantIndex + lastRelevantSymbolPoint;
  
  return [firstRelevantIndex, lastRelevantIndex];
} 

function parseIfMath(param) {
  if (isMath(param)) {
    return parseMath(param);
  } else {
    return param;
  }
}

function splitByWhitespaceOnce(string) {
  var parts = string.split(" ");
  var first = parts[0];
  var restParts = parts.slice(1);
  var rest = restParts.join(" ");
  
  return [first, rest];
}

/*
function interpretSentence(params) {
  var verb = verbs[params[0]];
  var restOfParams = params.slice(1);
  verb(restOfParams);
}
*/

function arrayContainsObject(array, object) {
  var contains = false;
  
  for (var index = 0; index < array.length; index++) {
    if (array[index] === object) {
      contains = true;
    }
  }
  
  return contains;
}

function objectContainsKey(object, key) {
  return !(typeof(object[key]) === typeof(undefined));
}

function runCommandString(command) {
  var parsed = parse(command);
  var commandName = parsed['command'];
  var command = verbs[commandName];
  var params = parsed['params'];
  
  return command(params);
}

function runParsed(parsed) {
  var commandName = parsed['command'];
  var command = verbs[commandName];
  var params = parsed['params'];
  
  return command(params);
}






