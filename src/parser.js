var diceRegex = /\b[1-9]?d([1-9]|(1[0-9])|20)\b/;
var alphaNumericCharacterRegex = /\b\w\b/;
var syntaxErrorMsg = {
  label: "[SYNTAX ERROR]",
  rowClass: 'syntaxError'
};
var areYouSureMsg = {
  text: "ARE YOU SURE? (y/n)",
  rowClass: 'areYouSureRow'
};
var verbs = {
  "add": addCreatureCommand,
  "remove": removeCreatureCommand,
  "init":changeInitiativeCommand,
  "dmg": dealDamageCommand,
  "harm": dealDamageCommand,
  "hurt": dealDamageCommand,
  "heal": healCommand,
  "clear": clearCommand,
  "help": printHelpCommand,
  "remark": remarkCommand,
  "unremark": unremarkCommand,
  "next": nextCommand,
  "drive": getFileIdCommand,

  //clock
  "tick": tickCommand,
  "overtime": overtimeCommand,
  "pause": pauseCommand,
  "continue": continueCommand,
  "volume": volumeCommand,

  //math
  "sum": sumCommand,
  "dice": throwDiceCommand,
  "minus": minusCommand,
  "number": returnAsNumber,
  "ans": ansCommand
};
var syntaxList = {
  "add": function(params) {
    var name = params[0];
    var initiative = params[1];
    var hp = params[2];
    if (typeof(name) !== "string") {
      return false;
    }
    if (!wasParsedAsMath(initiative)) {
      return false;
    }
    if (hp !== undefined && !wasParsedAsMath(hp)) {
      return false;
    }

    return true;
  },
  "init": function(params) { return nameMathCheck(params) },
  "dmg": function(params) { return nameMathCheck(params) },
  "harm": function(params) { return nameMathCheck(params) },
  "hurt": function(params) { return nameMathCheck(params) },
  "heal": function(params) { return nameMathCheck(params) },
  "tick": function(params) {
    var number = params[0];
    if (!wasParsedAsMath(number)) {
      return false;
    }
    return true;
  }
};

function nameMathCheck(params) {
  var name = params[0];
  var math = params[1];
  if (typeof(name) !== "string") {
    return false;
  }
  if (!wasParsedAsMath(math)) {
    return false;
  }
  return true;
}

function wasParsedAsMath(object) {
  if (object === undefined) {
    return false;
  }
  var booleanArray = (["number","dice","sum","minus"].map(
        function(x) {return object.command === x}));
  return arrayContainsObject(booleanArray, true);
}

function getFileIdCommand(params) {
  var url = params[0];
  var matched = url.match(/[-\w]{25,}/)[0];
  var msgToReturn = {
    text: "http://drive.google.com/uc?export=view&id=" + matched,
    rowClass: 'url'
  } 
  return msgToReturn;
}  

function addCreatureCommand(params) {
  var name = params[0];
  var initiativeToBeResolved = params[1];
  var initiative = runParsed(initiativeToBeResolved);
  var hpToBeResolved = params[2];
  var hp;
  if (hpToBeResolved === undefined) {
    hp = "-";
  } else {
    hp = runParsed(hpToBeResolved);
  }
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

function firstIndexOf(string, chars) {
  for (var i in string){
    if (arrayContainsObject(chars, string[i])) {
      return i;
    }
  }
  return -1;
}

function splitAtIndex(string, index) {
  var first = string.slice(0, index);
  var second = string.slice(index + 1);
  return [first, second];
}

function removeCreatureCommand(params) {
  var name = params[0];
  var feedback = deleteCreatureByName(name);
  return feedback;
}

function changeInitiativeCommand(params) {
  var name = params[0];
  var initiativeToBeResolved = params[1];
  var initiative = runParsed(initiativeToBeResolved);
  var feedback = changeCreatureInitiativeByName(name, initiative);
  return feedback;
}

function dealDamageCommand(params) {
  var name = params[0];
  var dmgToBeResolved = params[1];
  var damage = runParsed(dmgToBeResolved);
  var feedback = damageCreatureByName(name, damage);
  return feedback;
}

function healCommand(params) {
  var name = params[0];
  var dmgToBeResolved = params[1];
  var damage = 0 - runParsed(dmgToBeResolved);
  var feedback = damageCreatureByName(name, damage);
  return feedback;
}

function clearCommand(params) {
  var param = params[0];
  if (param === undefined) {
    //sout("clear what?");
    //param = caputreInput();
    var msgToReturn = {
      text: "clear what?"
    };
    initiateCBD("clear");
    return msgToReturn;
  }

  if(param === 'encounter') {
    return clearEncounterCommand(params[1]);
  }

  if (param === 'console') {
    return clearConsoleCommand();
  }

  return syntaxErrorMsg;
}

function clearEncounterCommand(sure) {
  if (sure === 'n') {
    var emptyMsg = {
      label: ''
    };
    comAssigner.reset();
    return emptyMsg;
  }

  if (sure !== 'y') {
    initiateCBD("clear encounter");
    return areYouSureMsg;
  }

  database = [];
  clock = new Clock();
  updateUi();
  initiativeIndex = undefined;
  return okmsg;
}

function clearConsoleCommand() {
  var fromWhereToClear = document.getElementById('textField');
  var toClear = document.getElementById('textRows');
  var toAdd = document.createElement('div');
  toAdd.setAttribute('id', 'textRows');
  fromWhereToClear.replaceChild(toAdd, toClear);
  return okmsg;
}

var printHelpCommand;

function remarkCommand(params) {
  var name = params[0];
  var remarkStrs = params.slice(1, params.length);
  var remark = collapseArrayToString(remarkStrs);
  var feedback = remarkCreature(name, remark);
  return feedback;
}

function collapseArrayToString(array) {
  var str = array[0];
  for(var i = 1; i < array.length; i++) {
    str = str + " " + array[i];
  }
  return str;
}

function unremarkCommand(params) {
  var name = params[0];
  var feedback = unremarkCreature(name);
  return feedback;
}

function nextCommand() {
  if(!clock.isOn) {
    clock.start();
  }
  ticker.zeroTick();
  nextInitiativeIndex();
  updateUi();
  var toReturn = clock.outWrite();
  turnTracker.turnPassed();
  return toReturn;
}

function tickCommand(params) {
  var intToBeResolved = params[0];
  var int = runParsed(intToBeResolved);
  ticker.setTick(int);
  return okmsg;
}

function overtimeCommand(params) {
  var onOrOffString = params[0];
  if (onOrOffString === 'on') {
   ticker.setOverTime(true);
  }
  if (onOrOffString === 'off') {
   ticker.setOverTime(false);
  } 
  return okmsg;
}

function pauseCommand() {
  clock.stop();
  return okmsg;
}

function continueCommand() {
  clock.start();
  return okmsg;
}

function volumeCommand(params){
  var volumeToBeResolved = params[0];
  var volumePercent = runParsed(volumeToBeResolved);
  var volume = volumePercent/100;
  return setVolume(volume);
}

function returnAsNumber(param) {
  return parseInt(param);
}

function sumCommand(params) {
  var summands = params.map(runParsed);
  return calc.sum(summands);
}

function minusCommand(params) {
  var toMinusToBeResolved = params[0];
  var toMinus = runParsed(toMinusToBeResolved);
  return (-1)*toMinus;
}

function throwDiceCommand(params) {
  var timesToBeResolved = params[0];
  var diceSizeToBeResolved = params[1];
  var times = runParsed(timesToBeResolved);
  var diceSize = runParsed(diceSizeToBeResolved);
  return calc.throwDice(times, diceSize);
}

function ansCommand() {
  return calc.getAns();
}

function parse(command) {
  var parsed;
  if (isSentence(command)) {
    parsed = parseSentence(command);
  }
  if (isMath(command)) {
    parsed = parseMath(command);
  }
  return parsed;
}

function isMath(command) {
  return isSumAndOnlySum(command) || isDice(command) || isMinus(command) ||isNumberString(command) || isAns(command);
}

function isMathNotSum(command) {
  return isDice(command) || isMinus(command) || isNumberString(command) || isAns(command);
}

function isSumAndOnlySum(command) {
  if (isMathNotSum(command)) {
    return false;
  }
  var summands = splitToSummands(command);
  return areSummamble(summands);
}

function addPlusBeforeMinus(command) {
  if (command[0] === "-") {
    command = "0 " + command;
  }
  readpoint = 0;
  while(readpoint < command.length) {
    symbolAtPoint = command[readpoint];
    if (symbolAtPoint === "-") {
      parts = splitAtIndex(command, readpoint);
      var toAppend = "+ -";
      command = parts[0] + toAppend + parts[1];
      readpoint++;
      readpoint++;
    }
    readpoint++;
  }
  return command;
}

function splitToSummands(command) {
  var toProcess = addPlusBeforeMinus(command);
  var summands = toProcess.split('+');
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

function isMinus(string) {
  if (string[0] === "-") {
    var rest = string.slice(1);
    var trimmed = rest.trim();

    return isMathNotSum(rest);
  }

  return false;
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

function isAns(string) {
  return (string === "ans");
}

function parseMath(command) {
  var parsed;

  if (isSumAndOnlySum(command)) {
    parsed = parseSum(command);
  }

  if (isDice(command)) {
    parsed = parseDice(command);
  }

  if (isMinus(command)) {
    parsed = parseMinus(command);
  }

  if (isNumberString(command)) {
    parsed = parseNumber(command);
  }

  if (isAns(command)) {
    parsed = parseAns(command);
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

    parsedSummands[i] = parseMath(summand);

    /*
    if (isNumberString(summand)) {
      parsedSummands[i] = parseNumber(summand);
    }

    if(isDice(summand)) {
      parsedSummands[i] = parseDice(summand);
    }

    if (isMinus(command)) {
      parsedSummands[i] = parseMinus(command);
    }

    if(isAns(summand)) {
      parsedSummands[i] = parseAns(summand);
    }
    */
  }

  return parsedSummands;
}

function parseDice(command) {
  var parts = command.split("d");

  if (parts[0] === "") {
    parts[0] = "1";
  }

  var parsedParts = parts.map(parse);

  var parsed = {
    command: "dice",
    params: parsedParts
  };

  return parsed;
}

function parseMinus(command) {
  var toMinus = command.slice(1).trim();
  var toMinusParsed = parse(toMinus);

  var parsed = {
    command: "minus",
    params: [toMinusParsed]
  };

  return parsed;
}

function parseNumber(command) {
  var parsed = {
    command: "number",
    params: command
  };

  return parsed;
}

function parseAns(command) {
  var parsed = {
    command: "ans",
    params: []
  };

  return parsed;
}

function isSentence(command) {
  var parts = command.split(" ");
  var supposedVerb = parts[0];

  if(isAns(supposedVerb)) {
    return false;
  }

  return objectContainsKey(verbs, supposedVerb);
}

function parseAdd(splitted) {
  var verb = splitted[0];
  var rest = splitted[1];

  var nameAndMath = splitByWhitespaceOnceIfContainsWhiteSpace(rest);
  var name = nameAndMath[0];
  var math = nameAndMath[1];

  var lastWhitespaceIndex = lastIndexOf(math, ' ');
  var initAndHp = splitAtIndex(math, lastWhitespaceIndex);
  var initiativeString = initAndHp[0];
  var hpString = initAndHp[1];

  var parsed = {
    command: verb,
    params: [name, parseMath(initiativeString), parseMath(hpString)]
  };

  return parsed;
}

function parseOneWordSentence(commandString) {
  var parsed = {
    command: commandString,
    params: []
  };

  return parsed;
}

function parseSentence_old(command) {
  var commandPieces = command.split(" ");
  var numberOfPieces = commandPieces.length;

  if (numberOfPieces <= 1) {
    return parseOneWordSentence(command);
  }

  var splitted = splitByWhitespaceOnceIfContainsWhiteSpace(command);
  var verb = splitted[0];
  var rest = splitted[1];

  if(verb === "add") {
    return parseAdd(splitted);
  }

  var restSplitted = splitByWhitespaceOnceIfContainsWhiteSpace(rest);

  var restToMathIfMath = [];
  for(i = 0; i < restSplitted.length; i++) {
    var param = restSplitted[i];

    restToMathIfMath[i] = parseIfMath(param);
  }

  var parsed = {
    command: verb,
    params: restToMathIfMath
  };

  return parsed;
}

function parseSentence(command) {
  var firstSplitted = splitByWhitespaceOnceIfContainsWhiteSpace(command);
  var verb = firstSplitted[0];
  var rest = firstSplitted[1];

  var paramArray = []

  while(true) {
    if (isBlank(rest)) {
      break;
    }

    if (startsWithSumLike(rest)) {
      var scanResult = scanFirstSumLike(rest);
      var startIndexInclusive = scanResult[0];
      var endIndexExclusive = scanResult[1];

      var sumToParse = rest.slice(startIndexInclusive, endIndexExclusive);
      var parsedSum = parseSum(sumToParse);
      paramArray.push(parsedSum);

      rest = rest.slice(endIndexExclusive + 1);
      continue;
    }

    var splitted = splitByWhitespaceOnceIfContainsWhiteSpace(rest);
    var toParse = splitted[0];
    var toPush = parseIfMath(toParse);
    paramArray.push(toPush);

    rest = splitted[1];
  }

  var parsed = {
    command: verb,
    params: paramArray
  };

  return parsed;
}

function parseIfMath(param) {
  if (isMath(param)) {
    return parseMath(param);
  } else {
    return param;
  }
}

function scanFirstSumLike(string) {
  var firstPlusIndex = firstIndexOf(string, ["+", "-"]);

  if(firstPlusIndex === -1) {
    return [0,0];
  }

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

  var atLeastOnePlusSymbol = false;


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

    if (readSymbol === "+" || readSymbol === "-") {
      if (!expectingPlus) {
        proceed = false;
      } else {
        atLeastOnePlusSymbol = true;
        expectingAlNuChar = true;
        expectingPlus = false;
      }
    }

    readpoint++;

    if (readpoint >= toRead.length) {
      proceed = false;
    }
  }

  if (!atLeastOnePlusSymbol) {
    return [0, 0];
  }

  var firstNonRelevantIndex = firstRelevantIndex + lastRelevantSymbolPoint + 1;

  return [firstRelevantIndex, firstNonRelevantIndex];
}

function containsSumLike(string) {
  var scanResult = scanFirstSumLike(string);
  var scannedLength = scanResult[1] - scanResult[0];

  if (scannedLength <= 0) {
    return false;
  }

  return true;
}

function startsWithSumLike(string) {
  var scanResult = scanFirstSumLike(string);
  var startIndexInclusive = scanResult[0];
  var endIndexExclusive = scanResult[1];
  var scannedLength = endIndexExclusive - startIndexInclusive;

  if ((scannedLength >= 1) && (startIndexInclusive === 0)) {
    return true;
  }

  return false;
}

function isSumLike(string) {
  var scanResult = scanFirstSumLike(string);
  var startIndexInclusive = scanResult[0];
  var endIndexExclusive = scanResult[1];
  var scannedLength = endIndexExclusive - startIndexInclusive;

  if ((scannedLength >= 1) && (startIndexInclusive === 0) && (endIndexExclusive === string.length)) {
    return true;
  }
  return false;
}

function splitByWhitespaceOnceIfContainsWhiteSpace(string) {
  if (!(typeof(string) === "string")) {
    return undefined;
  }
  var parts = string.split(" ");
  var first = parts[0];
  var restParts = parts.slice(1);
  var rest = restParts.join(" ");
  if(isBlank(rest)) {
    return [first];
  }
  return [first, rest];
}

function interpretSentence_old(params) {
  var verb = verbs[params[0]];
  var restOfParams = params.slice(1);
  verb(restOfParams);
}

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

function checkParamsLegality(commandName, params) {
  var syntaxCheckFunction = syntaxList[commandName];

  if(syntaxCheckFunction === undefined) {
    return true;
  }

  return syntaxCheckFunction(params);
}

function runCommandString(userInput) {
  if (userInput === undefined) {
    var undefinedMsg = {
      label: '[FAIL]',
      text: "undefined input",
      rowClass: 'error'
    };

    return undefinedMsg;
  }

  var trimmed = userInput.trim();
  var parsed = parse(trimmed);
  if (parsed === undefined) {
    return syntaxErrorMsg;
  }

  var commandName = parsed['command'];
  var commandToRun = verbs[commandName];
  var params = parsed['params'];
  var paramsAreLegal = checkParamsLegality(commandName, params);

  if (!paramsAreLegal) {
    return syntaxErrorMsg;
  }

  var result = commandToRun(params);

  if(isNumber(result)) {
    calc.setAns(result);
    var msgToReturn = {
      text: "    = " + result,
      rowClass: 'mathRow'
    }
    return msgToReturn;
  }

  if(typeof(result) === 'string') {
    var msgToReturn = {
      text: result,
      rowClass: 'soutRow'
    }
    return msgToReturn;
  }

  return result;
}

function runParsed(parsed) {
  if (parsed === undefined) {
    return syntaxErrorMsg;
  }
  var commandName = parsed['command'];
  var command = verbs[commandName];
  var params = parsed['params'];
  return command(params);
}






