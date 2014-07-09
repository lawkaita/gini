function Calculator() {
  this.ans = 0;
  
  this.setAndGiveAns = function(result) {
    this.ans = result;
    return result;
  }
}

Calculator.prototype.getAns = function(){
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
  
  return this.setAndGiveAns(resultSum);
}

Calculator.prototype.sum = function(summands) {
  var sum = 0;
  
  for (var i = 0; i < summands.length; i++) {
    sum = sum + summands[i];
  }
  
  return this.setAndGiveAns(sum);
}

var calc = new Calculator();