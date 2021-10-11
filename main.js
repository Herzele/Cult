
var v = {
  money : 0,
  faith : 0,
  experience : 0,
  bills : 400,

  moneyPerWorkDay : 20,
  faithPerWorkDay : 1,

  sympathizer : 0,
  cultist : 0,

  control : 10,
  controlAttrition : -0.1,
  controlGainPerSec : 0,
  controlPerWorkDay : 1,
  controlMax : 20,
  isControlOn : "no",
  controlEffectMultiplier : 1,
  controlLossEffect : 0.1,

  maxCultist : 0,
  inactiveCultist : 0,
  worker : 0,
  priest : 0,

  workerGain : 1,
  priestGain : 1,

  moneyPerSec : 0,
  faithPerSec : 0,
  experiencePerSec : 0,

  moneyMultiplier : 1,
  faithMultiplier : 1,
  experienceMultiplier : 1,

  passiveFaith : 0.1,
  passiveIncome : 0,
  passiveExperience : 0,

  recruitChance : 10,
  recruitNumber : 1,

  sympToCultCost : 1000,

  timeMultiplier : 1,

  daysElapsed: 0,

  logsList : [],

  isXpOn : false,

/* ----- UPGRADES ----- */

  revenueSharing : false,
  revenueSharingCost : 500,
  revenueSharingGain : 0.1,
  revenueSharingModif : "passiveIncome",

  askARaise : false,
  askARaiseLevel : 0,
  askARaiseCost : 100,
  askARaiseGain : 0.05,
  askARaiseModif : "moneyMultiplier",

  buyComputer : false,
  buyComputerGain : 10,
  buyComputerCost : 500,
  buyComputerModif : "recruitChance",

  socialNetworking : false,
  socialNetworkingGain : 10,
  socialNetworkingCost : 500,
  socialNetworkingModif : "recruitChance",

  selfBetterment : false,
  selfBettermentGain : 10,
  selfBettermentCost : 2000,
  selfBettermentModif : "moneyPerSec",
  selfBettermentMultiplier : 0,


}

options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};


var currentDay = new Date("01/01/2000");
var dateString = "dateDuJour";

var currentAction = "none";

var modeTest = "no";

/* ----- LAUNCH ----- */



function initialize() {
    document.body.style.zoom = 0.7;

	if (localStorage.getItem("save") !== null) {
		loadGame();
		currentDay.setDate(currentDay.getDate() + v.daysElapsed);
	}

	if (v.revenueSharing === true) {
		document.getElementById("btRevenueSharing").disabled = true;
	}
	if (v.buyComputer === true){
		document.getElementById("btBuyComputer").disabled = true;
		document.getElementById("btsocialNetworking").style.display = "inline";
	}
	if (v.socialNetworking === true){
		document.getElementById("btsocialNetworking").disabled = true;
	}
	if (v.selfBetterment === true){
		document.getElementById("btSelfBetterment").disabled = true;
	}


    document.getElementById("experience").innerHTML = v.experience;
    document.getElementById("sympathizer").innerHTML = v.sympathizer;
    document.getElementById("maxCultist").innerHTML = v.maxCultist;
    document.getElementById("controlMax").innerHTML = v.controlMax;
    document.getElementById("cultist").innerHTML = v.cultist;
    document.getElementById("countWorker").value = v.worker;
    document.getElementById("countPriest").value = v.priest;
    document.getElementById("countInactive").value = v.inactiveCultist;

    document.getElementById("moneyPerSec").innerHTML = v.moneyPerSec;
    document.getElementById("faithPerSec").innerHTML = v.faithPerSec;
    document.getElementById("bills").innerHTML = v.bills;

    document.getElementById("moneyClickGain").innerHTML = v.moneyPerWorkDay;
    document.getElementById("faithClickGain").innerHTML = v.faithPerWorkDay;
    document.getElementById("recruitChance").innerHTML = v.recruitChance;

    document.getElementById("askARaiseCost").innerHTML = v.askARaiseCost;
    document.getElementById("askARaiseGain").innerHTML = (v.askARaiseGain * 100);
    document.getElementById("cultistUpgradeCost").innerHTML = v.sympToCultCost;

    document.getElementById("buyComputerCost").innerHTML  = v.buyComputerCost;

    document.getElementById("revenueSharingGain").innerHTML = v.revenueSharingGain;

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
		if (v.sympathizer > 0 && v.faith >= v.sympToCultCost){
				v.sympathizer = v.sympathizer - value;
				v.faith = v.faith - v.sympToCultCost;
				v.cultist = v.cultist + value;
				v.inactiveCultist = v.inactiveCultist + value;
			document.getElementById("countInactive").value = numberFormating(v.inactiveCultist, 0);			
			document.getElementById("sympathizer").innerHTML = numberFormating(v.sympathizer, 0);
			document.getElementById("cultist").innerHTML = numberFormating(v.cultist, 0);
		}
		break;
	}
}


function changeWorker(value) {
    if (v.inactiveCultist > 0 && value > 0 || value < 0 && v.worker > 0) {
        v.worker = v.worker + value;
        v.inactiveCultist = v.inactiveCultist - value;
        calcMoneyPerSec();
        document.getElementById("countInactive").value = numberFormating(v.inactiveCultist, 0);
        document.getElementById("countWorker").value = v.worker;
        document.getElementById("inactiveCultist").innerHTML = v.inactiveCultist;
    }
}

function changePriest(value) {
    if (v.inactiveCultist > 0 && value > 0 || value < 0 && v.priest > 0) {
        v.priest = v.priest + value;
        v.inactiveCultist = v.inactiveCultist - value;
        calcFaithPerSec();
        document.getElementById("countInactive").value = numberFormating(v.inactiveCultist, 0);
        document.getElementById("countPriest").value = v.priest;
        document.getElementById("inactiveCultist").innerHTML = v.inactiveCultist;
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
	if(v.money >= v.buyComputerCost){
		v.recruitChance = v.recruitChance + v.buyComputerGain;
		v.money = v.money - v.buyComputerCost;
		v.buyComputer = true;
		document.getElementById("recruitChance").innerHTML = v.recruitChance;
		document.getElementById("btBuyComputer").disabled = true;
	}
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
  if (v.faith >= v.revenueSharingCost) {
      v.faith = v.faith - v.revenueSharingCost;
      v.passiveIncome = v.passiveIncome + v.revenueSharingGain;
      document.getElementById("btRevenueSharing").disabled = true;
      v.revenueSharing = true;
  }
}

function changeAskARaise(){
	if (v.experience >= v.askARaiseCost){
		v.experience = v.experience - v.askARaiseCost;
		v.moneyMultiplier = v.moneyMultiplier * (v.askARaiseGain + 1) ;
		v.moneyPerWorkDay = v.moneyPerWorkDay * v.moneyMultiplier;
		v.askARaiseCost = v.askARaiseCost *2;
		askARaiseLevel = askARaiseLevel + 1;
		document.getElementById("askARaiseCost").innerHTML = v.askARaiseCost;
		v.askARaise = true;
	}
}

function socialNetworking(){
	if(v.experience >= v.socialNetworkingCost){
		v.experience = v.experience - v.socialNetworkingCost;
		v.recruitChance = v.recruitChance + v.socialNetworkingGain;
		socialNetworking = true;
		document.getElementById('ttrecruitChance').innerHTML = v.recruitChance;
		document.getElementById("btsocialNetworking").disabled = true;
	}
}


function selfBetterment(){
	if(v.faith >= v.selfBettermentCost){
		v.faith = v.faith - v.selfBettermentCost;
		v.selfBetterment = true;
		document.getElementById("btSelfBetterment").disabled = true;
	}
}



/* ----- MOTEUR VROOM VROOM ----- */

// Calculate every ressource

function calcMoneyPerSec() {
    if (currentAction == "workForMoney") {
        v.moneyPerSec = v.worker * v.workerGain
         + v.passiveIncome * v.sympathizer
         + v.moneyPerWorkDay
    } else {
        v.moneyPerSec = v.worker * v.workerGain
         + v.passiveIncome * v.sympathizer
         + (v.selfBettermentMultiplier * v.cultist); // if selfBetterment is not bought, or player isn't preaching, multiplier is 0.
    }
    document.getElementById("moneyPerSec").innerHTML = numberFormating(v.moneyPerSec, 1);
}

function calcFaithPerSec() {
    if (currentAction == "workForFaith") {
        v.faithPerSec = v.priest * v.priestGain
         + v.sympathizer * v.passiveFaith
         + v.faithPerWorkDay * v.faithMultiplier;
    } else {
        v.faithPerSec = v.priest * v.priestGain
         + v.sympathizer * v.passiveFaith;
    }
    document.getElementById("faithPerSec").innerHTML = numberFormating(v.faithPerSec, 1);
}

function calcControlPerSec() {
  if (currentAction == "preach") {
    	v.experiencePerSec = 1 * v.experienceMultiplier;
    	v.controlGainPerSec = v.controlAttrition * v.cultist + v.controlPerWorkDay;
    	if(v.selfBetterment === true){
    		v.selfBettermentMultiplier = 1; // Activate money gain from selfBetterment upgrade.
    	}
   } else {
   		v.controlGainPerSec = v.controlAttrition * v.cultist;
   		v.selfBettermentMultiplier = 0; // Deactivate money gain from preaching if action <> from "preach".
   }
   if (v.controlGainPerSec > 0){
   	document.getElementById("controlSign").innerHTML = "+";
   } 
   v.maxCultist = v.control * v.controlEffectMultiplier;   
   document.getElementById("controlPerSec").innerHTML = numberFormating(v.controlGainPerSec, 1);
   document.getElementById("maxCultist").innerHTML = numberFormating(v.maxCultist, 0);
}

function calcExperiencePerSec() {
    if (currentAction != "none") {
    	v.experiencePerSec = 1 * v.experienceMultiplier;
   }
   document.getElementById("experiencePerSec").innerHTML = numberFormating(v.experiencePerSec, 1);
}



function calcCultistLoss(){
	let controlFinal = v.controlEffectMultiplier * v.control;

	if(v.control <= 0){
		cultistRemover();
		}

	/* Roll version of the loss management. */

	// if(v.cultist >= controlFinal){
	// 	let cultistLossChance = (v.cultist - controlFinal);
	// 	let roll = rollChances();
	// 	document.getElementById("testDisplay1").innerHTML = cultistLossChance;
	// 	document.getElementById("testDisplay2").innerHTML = roll;
	// 	if(roll < cultistLossChance){
	// 		v.cultist = v.cultist -1;
	// 		document.getElementById("cultist").innerHTML = v.cultist;
	// 		cultistRemover();
	// 	}
	// } 
	}


function calcRecruitmentPerSec(){

}

// Add the current gain/loss to each ressource

function autoGainMoney() {
    v.money = v.money + v.moneyPerSec * v.timeMultiplier;
    document.getElementById("money").innerHTML = numberFormating(v.money, 1);
}

function autoGainFaith() {
    v.faith = v.faith + v.faithPerSec * v.timeMultiplier;
    document.getElementById("faith").innerHTML = numberFormating(v.faith, 1);
}

function autoGainExperience() {
    v.experience = v.experience + v.experiencePerSec * v.timeMultiplier;
    document.getElementById("experience").innerHTML = numberFormating(v.experience, 1);
}

function autoGainControl(){
	v.control = v.control + v.controlGainPerSec;
	if (v.control >= v.controlMax){
		v.control = v.controlMax;
	}
	document.getElementById("controlValue").innerHTML = numberFormating(v.control, 1)
	if (v.control < 0){
		document.getElementById("control").style.color = "red";
	} else {
		document.getElementById("control").style.color = "black";
	}
}

function autoRecruit(){
	if (currentAction == "recruit"){
		let roll = rollChances();
	  if (roll <= v.recruitChance){
	  	v.sympathizer = v.sympathizer + v.recruitNumber * v.timeMultiplier;
	  	document.getElementById("sympathizer").innerHTML = numberFormating(v.sympathizer, 0);
	  }
	}
}



function cultistRemover(){
	v.cultist = v.cultist - 1;
    document.getElementById("cultist").innerHTML = v.cultist;
	if(v.inactiveCultist > 0){
		v.inactiveCultist = v.inactiveCultist - 1;
		document.getElementById("countInactive").value = v.inactiveCultist;
	} else if(v.worker > 0) {
		v.worker = v.worker - 1;
		document.getElementById("countWorker").value = v.worker;
	} else if(v.priest > 0) {
		v.priest = v.priest - 1;
		document.getElementById("countPriest").value = v.priest;
	}
}


function payBills() {
    if (currentDay.getDate() == 1) {
        v.money = v.money - v.bills;
    }
}

function numberFormating(value, decimals){
	var output = Math.round(value * 1e12) / 1e12;
	output = output.toFixed(decimals);
	return output;
}

function updateLogs(newLogString, whoSpeaks) {
    log = "";
    v.logsList.push(newLogString);
    for (let i = v.logsList.length - 1; i >= 0; i--) {
        log += v.logsList[i] + "<br>";
    }
    document.getElementById("logsDisplay").innerHTML = log;
}

function rollChances(){
	roll = Math.floor((Math.random() * 100) + 1);
	return roll;
}

function noMoney(){
    changeWork;
}


/* ----- EVENTS CHECKER -----*/

function eventLogChecker() {
    if (currentDay.getFullYear() == 2000 && currentDay.getDate() == 5 && currentDay.getMonth() == 0) {
      updateLogs("My life is boring", "me");
    }
    if (currentDay.getFullYear() == 2000 && currentDay.getDate() == 8 && currentDay.getMonth() == 0) {
      updateLogs("I want more", "me");
    }
    if (currentDay.getFullYear() == 2000 && currentDay.getDate() == 13 && currentDay.getMonth() == 0) {
      updateLogs("I have more", "voice");
      $("#btPray").fadeIn(3000);
    }
}

function eventDisplayChecker() {
  // Color indicators
  if (v.money <= v.bills){
  	document.getElementById("moneyDiv").style.color = "red";
  } else {
   	document.getElementById("moneyDiv").style.color = "black"
  }

  // Tabs
  if (v.experience >= 50 || v.isXpOn == true) {
    document.getElementById("personnalTrainingTab").style.display = "inline";
  v.isXpOn = true;
  }
  if (v.sympathizer > 0){
  	document.getElementById("faithProofsTab").style.display = "inline";
  }
  if (v.sympathizer > 9){
  	document.getElementById("humanRessourcesTab").style.display = "inline";
  }
  if (v.money >= 2000){
  	document.getElementById("investmentsTab").style.display = "inline";
  }


  // Divs 
  if (v.faith > 49){
  	document.getElementById("btRecruit").style.display = "inline";
  	document.getElementById("sympathizerDiv").style.display = "inline";
  }


  // Upgrades, display buttons if stage is reached
  if(v.cultist > 0){
    document.getElementById("btSelfBetterment").style.display = "inline";
  }


  // Upgrades, enable button if you have enough ressources.
  if (v.askARaiseCost > v.experience){
    document.getElementById("btAskARaise").disabled = true;
  } else {
    document.getElementById("btAskARaise").disabled = false;
  }

  if (socialNetworking == false && v.experience >= v.socialNetworkingCost){
    document.getElementById("btsocialNetworking").disabled = false;
  } else {
    document.getElementById("btsocialNetworking").disabled = true;
  }
  if(v.revenueSharingCost > v.faith){
    document.getElementById("btRevenueSharing").disabled = true;
  }


  // Ressources
  if (v.cultist > 0){
  	document.getElementById("cultistDiv").style.display = "inline";
  	document.getElementById("control").style.display = "inline";
  	document.getElementById("workerRepartition").style.display = "inline";
  	document.getElementById("btPreach").style.display = "inline";
  	v.isControlOn="yes";
  } 
  if (currentDay.getFullYear() >= 2000 && currentDay.getDate() >= 17 && currentDay.getMonth() >= 0){
  	document.getElementById("btPray").style.display = "inline";
  }
}

function addDay() {
	v.daysElapsed = v.daysElapsed + 1;
  currentDay.setDate(currentDay.getDate() + 1);
  dateString = currentDay.getDate() + " / " + (currentDay.getMonth() + 1) + " / " + currentDay.getFullYear();
  document.getElementById("dateJour").innerHTML = dateString;
}

function saveGame() {
	localStorage.setItem("save",JSON.stringify(v));
	// document.getElementById("saveGameDisplay").innerHTML = Object.values(v);
	}


function loadGame(){
	v = JSON.parse(localStorage.getItem("save"));
	// document.getElementById("saveGameDisplay").innerHTML = Object.values(v);
}

function deleteSave(){
	localStorage.removeItem("save");
}


/* ----- UPDATES -----*/

// function updateRoomsCost() {
//     roomsCost = rooms * roomsBaseCost;
//     document.getElementById("ttRoomsCost-").innerHTML = roomsCost;
//     document.getElementById("ttRoomsCost+").innerHTML = ((rooms + 1) * roomsBaseCost);
// }


function activateTestMode(){
	if(modeTest === "no"){
		v.timeMultiplier = 1000;
		modeTest = "yes"
		document.getElementById("saveGameDisplay").innerHTML = modeTest;
	} else {
		v.timeMultiplier = 1;
		modeTest = "no"
		document.getElementById("saveGameDisplay").innerHTML = modeTest;
	}
}


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

    if(v.isControlOn == "yes"){
    	calcControlPerSec();
    	autoGainControl();
    	if(v.cultist > 0){
    		calcCultistLoss();
    	}
    }

    if(v.money <= 0 && currentAction !== "workForMoney"){
        changeWork("work");
    }

}, 1000);

window.setInterval(function timeDay(){
	saveGame();
}, 60000);