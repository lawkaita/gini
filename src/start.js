/* start.js */

function startScript() {
	var pelikertaOpasUrl = "https://docs.google.com/document/d/1wYSLhXI8FWcE20FHvhJZuYCUiD6OVO_p4WcKPDZRttA/edit";
	var greetingString = "Muista aloittaa peli noudattamalla ohjeita:";
	printLine(greetingString, 'soutRow');
	printLine(pelikertaOpasUrl, 'urlRow');
}

var monZombieRotter = "" 
+ "Zombie Rotter Level 3 Minion\n"
+ "Medium natural animate (undead) XP 38\n"
+ "Initiative –2 Senses Perception –1; darkvision\n"
+ "HP 1; a missed attack never damages a minion.\n"
+ "AC 13; Fortitude 13, Refl ex 9, Will 10\n"
+ "Immune disease, poison\n"
+ "Speed 4\n"
+ "m Slam (standard; at-will)\n"
+ "+6 vs. AC; 5 damage.\n"
+ "Alignment Unaligned Languages —\n"
+ "Str 14 (+2) Dex 6 (–2) Wis 8 (–1)\n"
+ "Con 10 (+0) Int 1 (–5) Cha 3 (–4)\n"
+ "Zombie Rotter Tactics\n"
+ "Zombie\n";

var mons = {
	//grayOoze: monGrayOoze,
	rotter: monZombieRotter
	//corruption: monCorruptionCorpse,
	//skeleton: monSkeleton,
	//orcheJelly: monOrcheJelly
}

