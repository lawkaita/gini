function CommandAssigner() {
  this.target = send;
}

CommandAssigner.prototype.assign = function(command) {
  return this.target(command);
}

var comAssigner = new CommandAssigner;
