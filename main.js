
var money = 0;
var faith = 0;
var experience = 0;
var bills = 400;

var moneyPerWorkDay = 20;
var faithPerWorkDay = 1;

var sympathizer = 0;
var cultist = 0;

var control = 1;
var controlAttrition = -0.1;
var controlGainPerSec = 0;
var controlPerWorkDay = 1;
var controlMax = 20;
var isControlOn = "no"
var controlEffectMultiplier = 1;
var controlLossEffect = 0.1;


var maxCultist = 0;
var inactiveCultist = 0;
var worker = 0;
var priest = 0;

var workerGain = 1;
var priestGain = 1;

var moneyPerSec = 0;
var faithPerSec = 0;
var experiencePerSec = 0;

var moneyMultiplier = 1;
var faithMultiplier = 1;
var experienceMultiplier = 1;

var passiveFaith = 0.1;
var passiveIncome = 0;
var passiveExperience = 0;

var recruitChance = 10;
var recruitNumber = 1;

var sympToCultCost = 1000;

var currentAction = "none";

var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
var dateJour = new Date(2000, 0, 1);
var dateString = "dateDuJour";

var logsList = [];



/* ----- UPGRADES VARIABLES ----- */

var revenueSharing = false;
var revenueSharingCost = 500;
var revenueSharingGain = 0.1;

var askARaise = false;
var askARaiseCost = 100;
var askARaiseGain = 0.05;






/* ----- LAUNCH ----- */



function initialize() {
    inactiveCultist = cultist;
    // updateRoomsCost();

    document.getElementById("experience").innerHTML = experience;
    document.getElementById("sympathizer").innerHTML = sympathizer;
    document.getElementById("maxCultist").innerHTML = maxCultist;
    document.getElementById("controlMax").innerHTML = controlMax;

    document.getElementById("moneyPerSec").innerHTML = moneyPerSec;
    document.getElementById("faithPerSec").innerHTML = faithPerSec;
    document.getElementById("bills").innerHTML = bills;

    document.getElementById("moneyClickGain").innerHTML = moneyPerWorkDay;
    document.getElementById("faithClickGain").innerHTML = faithPerWorkDay;
    document.getElementById("recruitChance").innerHTML = recruitChance;

    document.getElementById("askARaiseCost").innerHTML = askARaiseCost;
    document.getElementById("askARaiseGain").innerHTML = (askARaiseGain * 100);

    document.getElementById("revenueSharingGain").innerHTML = revenueSharingGain;



}


window.onload = initialize();


/* ----- DISPLAY TABS ----- */

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
/*----- RESOURCES -----*/

function moveControlBar(value){

}

/*----- HUMAN RESOURCES -----*/

function convertPeople(from, value){
	switch(from){
		case "sympathizer":
		if (sympathizer > 0 && faith >= sympToCultCost){
				sympathizer = sympathizer - value;
				faith = faith - sympToCultCost;
				cultist = cultist + value;
				inactiveCultist = inactiveCultist + value;
			document.getElementById("countInactive").value = numberFormating(inactiveCultist, 0);			
			document.getElementById("sympathizer").innerHTML = numberFormating(sympathizer, 0);
			document.getElementById("cultist").innerHTML = numberFormating(cultist, 0);
		}
		break;
	}
}


function changeWorker(value) {
    if (inactiveCultist > 0 && value > 0 || value < 0 && worker > 0) {
        worker = worker + value;
        inactiveCultist = inactiveCultist - value;
        calcMoneyPerSec();
        document.getElementById("countInactive").value = numberFormating(inactiveCultist, 0);
        document.getElementById("countWorker").value = worker;
        document.getElementById("inactiveCultist").innerHTML = inactiveCultist;
    }
}

function changePriest(value) {
    if (inactiveCultist > 0 && value > 0 || value < 0 && priest > 0) {
        priest = priest + value;
        inactiveCultist = inactiveCultist - value;
        calcFaithPerSec();
        document.getElementById("countInactive").value = numberFormating(inactiveCultist, 0);
        document.getElementById("countPriest").value = priest;
        document.getElementById("inactiveCultist").innerHTML = inactiveCultist;
    }
}

/*----- ACTIONS -----*/

function changeWork(task) {
    switch (task) {
        case "pray":
            currentAction = "workForFaith";
            document.getElementById("btPray").disabled = true;
            document.getElementById("btWork").disabled = false;
            document.getElementById("btRecruit").disabled = false;
            document.getElementById("btPreach").disabled = false;
            break;
        case "work":
            currentAction = "workForMoney";
            document.getElementById("btWork").disabled = true;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruit").disabled = false;
            document.getElementById("btPreach").disabled = false;
            break;
        case "recruit":
        		currentAction = "recruit";
            document.getElementById("btWork").disabled = false;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruit").disabled = true;
            document.getElementById("btPreach").disabled = false;
            break;
        case "preach":
        		currentAction = "preach";
            document.getElementById("btWork").disabled = false;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruit").disabled = false;
            document.getElementById("btPreach").disabled = true;
            break;	

    }
}


function buttonActivator(activeButton){

}

/*----- INVESTMENTS -----*/

function buyComputer(){

}

// function changeRooms(value) {
//     if (value > 0 && money > roomsCost || value < 1 && rooms > 0) {
//         if (value > 0) {
//             rooms = rooms + value;
//             updateRoomsCost();
//             money = money - (value * roomsCost);
//         } else if (value < 1) {
//             rooms = rooms + value;
//             money = money - (value * roomsCost);
//             updateRoomsCost();
//         }
//         maxCultist = 3 + rooms;
//         document.getElementById("maxCultist").innerHTML = maxCultist;
//         document.getElementById("countRooms").value = rooms;
//     }
// }

/* ----- UPGRADES -----*/

function changeRevenueSharing() {
  if (experience > revenueSharingCost) {
      experience = experience - revenueSharingCost;
      passiveIncome = passiveIncome + revenueSharingGain;
      document.getElementById("btRevenueSharing").disabled = true;
  }
}

function changeAskARaise(){
	if (experience > askARaiseCost){
		experience = experience - askARaiseCost;
		moneyMultiplier = moneyMultiplier * (askARaiseGain + 1) ;
		moneyPerWorkDay = moneyPerWorkDay * moneyMultiplier;
		askARaiseCost = askARaiseCost *2;
		document.getElementById("askARaiseCost").innerHTML = askARaiseCost;
	}
}



/* ----- MOTEUR VROOM VROOM ----- */

function calcMoneyPerSec() {
    if (currentAction == "workForMoney") {
        moneyPerSec = worker * workerGain + passiveIncome * sympathizer + moneyPerWorkDay;
    } else {
        moneyPerSec = worker * workerGain + passiveIncome * sympathizer;
    }
    document.getElementById("moneyPerSec").innerHTML = numberFormating(moneyPerSec, 1);
}

function calcFaithPerSec() {
    if (currentAction == "workForFaith") {
        faithPerSec = priest * priestGain + sympathizer * passiveFaith + faithPerWorkDay * faithMultiplier;
    } else {
        faithPerSec = priest * priestGain + sympathizer * passiveFaith;
    }
    document.getElementById("faithPerSec").innerHTML = numberFormating(faithPerSec, 1);
}

function calcControlPerSec() {
    if (currentAction == "preach") {
    	experiencePerSec = 1 * experienceMultiplier;
    	controlGainPerSec = controlAttrition + controlPerWorkDay;
   } else {
   		controlGainPerSec = controlAttrition;
   }
   if (controlGainPerSec > 0){
   	document.getElementById("controlSign").innerHTML = "+";
   } 
   maxCultist = control * controlEffectMultiplier;   
   document.getElementById("controlPerSec").innerHTML = numberFormating(controlGainPerSec, 1);
   document.getElementById("maxCultist").innerHTML = numberFormating(maxCultist, 0);
}

function calcExperiencePerSec() {
    if (currentAction != "none") {
    	experiencePerSec = 1 * experienceMultiplier;
   }
   document.getElementById("experiencePerSec").innerHTML = numberFormating(experiencePerSec, 1);
}



function calcRecruitmentPerSec(){

}

function autoGainMoney() {
    money = money + moneyPerSec;
    document.getElementById("money").innerHTML = numberFormating(money, 1);
}

function autoGainFaith() {
    faith = faith + faithPerSec;
    document.getElementById("faith").innerHTML = numberFormating(faith, 1);
}

function autoGainExperience() {
    experience = experience + experiencePerSec;
    document.getElementById("experience").innerHTML = numberFormating(experience, 1);
}

function autoGainControl(){
	if (control >= controlMax){
		control = controlMax
	} else {
		control = control + controlGainPerSec;
	}
	document.getElementById("controlValue").innerHTML = numberFormating(control, 1)
	if (control < cultist){
		document.getElementById("control").style.color = "red";
	} else {
		document.getElementById("control").style.color = "black";
	}
}

function autoRecruit(){
	if (currentAction == "recruit"){
		let roll = rollChances();
	  if (roll <= recruitChance){
	  	sympathizer = sympathizer + recruitNumber;
	  	document.getElementById("sympathizer").innerHTML = numberFormating(sympathizer, 0);
	  }
	}
}


function calcCultistLoss(){
	let controlFinal = controlEffectMultiplier * control;
	if(cultist >= controlFinal){
		let cultistLossChance = (cultist - controlFinal);
		let roll = rollChances();
		document.getElementById("testDisplay1").innerHTML = cultistLossChance;
		document.getElementById("testDisplay2").innerHTML = roll;
		if(roll < cultistLossChance){
			cultist = cultist -1;
			document.getElementById("cultist").innerHTML = cultist;
			cultistRemover();
		}
	} 
}


function cultistRemover(){
	if(inactiveCultist>=0){
		inactiveCultist = inactiveCultist - 1;
		document.getElementById("countInactive").value = inactiveCultist;
	} else if(worker > 0) {
		worker = worker - 1;
		document.getElementById("countWorker").value = worker;
	} else if(priest > 0) {
		priest = priest - 1;
		document.getElementById("countPriest").value = priest;
	}
}

function addDay() {
    dateJour.setDate(dateJour.getDate() + 1);
    dateString = dateJour.getDate() + " / " + (dateJour.getMonth() + 1) + " / " + dateJour.getFullYear();
    document.getElementById("dateJour").innerHTML = dateString;
}

function payBills() {
    if (dateJour.getDate() == 1) {
        money = money - bills;
    }
}

function numberFormating(value, decimals){
	var output = Math.round(value * 1e12) / 1e12;
	output = output.toFixed(decimals);
	return output;
}

function updateLogs(newLogString, whoSpeaks) {
    log = "";
    logsList.push(newLogString);
    for (let i = logsList.length - 1; i >= 0; i--) {
        log += logsList[i] + "<br>";
    }
    document.getElementById("logsDisplay").innerHTML = log;
}

function rollChances(){
	roll = Math.floor((Math.random() * 100) + 1);
	return roll;
}

/* ----- EVENTS CHECKER -----*/

function eventLogChecker() {
    if (dateJour.getFullYear() == 2000 && dateJour.getDate() == 5 && dateJour.getMonth() == 0) {
      updateLogs("My life is boring", "me");
    }
    if (dateJour.getFullYear() == 2000 && dateJour.getDate() == 8 && dateJour.getMonth() == 0) {
      updateLogs("I want more", "me");
    }
    if (dateJour.getFullYear() == 2000 && dateJour.getDate() == 13 && dateJour.getMonth() == 0) {
      updateLogs("I have more", "voice");
      $("#btPray").fadeIn(3000);
    }
}

function eventDisplayChecker() {
	// Color indicators
	if (money <= bills){
		document.getElementById("moneyDiv").style.color = "red";
	} else {
		document.getElementById("moneyDiv").style.color = "black"
	}
	if (experience >= 50) {
    document.getElementById("personnalTrainingTab").style.display = "inline";
  }
  if (faith > 49){
  	document.getElementById("btRecruit").style.display = "inline";
  	document.getElementById("sympathizerDiv").style.display = "inline";
  }
  if (sympathizer > 0){
  	document.getElementById("faithProofsTab").style.display = "inline";
  }
  if (sympathizer > 9){
  	document.getElementById("humanRessourcesTab").style.display = "inline";
  }
	// Buttons
  if (askARaiseCost > experience){
		document.getElementById("btAskARaise").disabled = true;
	} else {
		document.getElementById("btAskARaise").disabled = false;
	}
  // Ressources
  if (cultist > 0){
  	document.getElementById("liCultist").style.display = "inline";
  	document.getElementById("control").style.display = "inline";
  	document.getElementById("workerRepartition").style.display = "inline";
  	document.getElementById("btPreach").style.display = "inline";
  	isControlOn="yes";
  } 
}


/* ----- UPDATES -----*/

// function updateRoomsCost() {
//     roomsCost = rooms * roomsBaseCost;
//     document.getElementById("ttRoomsCost-").innerHTML = roomsCost;
//     document.getElementById("ttRoomsCost+").innerHTML = ((rooms + 1) * roomsBaseCost);
// }



window.setInterval(function timeDay() {
    addDay();
    payBills();

    calcMoneyPerSec();
    autoGainMoney();

    calcFaithPerSec();
    autoGainFaith();

    calcExperiencePerSec();
    autoGainExperience();

    calcRecruitmentPerSec();
    autoRecruit();

    eventLogChecker();
    eventDisplayChecker();

    if(isControlOn == "yes"){
    	calcControlPerSec();
    	autoGainControl();
    	if(cultist > 0){
    		calcCultistLoss();
    	}
    }



}, 1000);