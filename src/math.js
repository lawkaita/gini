function Calculator() {
  this.ans = 0;
}

Calculator.prototype.setAns = function(result) {
  this.ans = result;
}

Calculator.prototype.getAns = function() {
  return this.ans;
}

Calculator.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Calculator.prototype.throwDice = function(timesToThrow, diceSize) {
  var resultSum = 0;
  
  for (var i = 1; i <= timesToThrow; i++) {
    var result = this.getRandomInt(1, diceSize);
    resultSum = resultSum + result;
  }
  
  sout(timesToThrow + "d" + diceSize + " gives " + resultSum);
  return resultSum;
}

Calculator.prototype.sum = function(summands) {
  var sum = 0;
  
  for (var i = 0; i < summands.length; i++) {
    sum = sum + summands[i];
  }
  
  return sum;
}

Calculator.prototype.permilDivision = function(numerator, denominator) {
  if (denominator === 0) {
    return undefined;
  }
  
  return (Math.floor((numerator/denominator)*1000))/10;
}

var calc = new Calculator();