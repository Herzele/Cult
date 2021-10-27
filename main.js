
var v = {
  firstGame : true,

  money : 0,
  faith : 0,
  experience : 0,
  bills : 400,

  moneyPerWorkDay : 20,
  faithPerWorkDay : 1,

  moneyPWDM : 1,
  faithPWDM : 1,
  preachingPWDM: 1,

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

  preachingMoneyMultiplier : 0,

  timeMultiplier : 1,

  daysElapsed: 0,

  logsList : [],

  recruitPhase : false,
  isXpOn : false,


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
        v.firstGame = false;
		loadGame();
        initializeUpg();
		currentDay.setDate(currentDay.getDate() + v.daysElapsed);
	}

    updateTT();

    if (v.recruitPhase == true){
        document.getElementById("btRecruit").style.display = "inline";
        document.getElementById("sympathizerDiv").style.display = "inline";
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
    document.getElementById("preachClickGain").innerHTML = v.controlPerWorkDay;
    document.getElementById("recruitChance").innerHTML = v.recruitChance;

    document.getElementById("cultistUpgradeCost").innerHTML = v.sympToCultCost;

    document.getElementById("btSocialNetworking").disabled = true;

    // document.getElementById("revenueSharingGain").innerHTML = v.revenueSharingGain;

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



/*----- INVESTMENTS -----*/


function upgradeActivator(upgradeName){
    if(eval(upgradeName).isAffordable() == true){
        let values = eval(upgradeName).activateUpgrade();
        let costType = values[0];
        let costValue = values[1];
        let gainType = values[2]; 
        let gainValue = values[3];
        let gainType2 = values[4]; 
        let gainValue2 = values[5];

        // Déduction du coût de l'upgrade de la ressource correspondante.
        for(let variable in v){
            if (variable = costType){
                v[variable] = v[variable] - costValue;
                document.getElementById(variable).innerHTML = v[variable];
                break;
            }
        }

        // Ajout du gain de l'upgrade sur la ressource correspondante.
        for(let variable in v){
            if (variable = gainType){
                v[variable] = v[variable] + gainValue;
                break;
            }
        }

        // Pareil qu'au dessus mais pour le second gain, s'il existe.
        if(gainType2 != "undefined"){
            for(let variable in v){
                if (variable = gainType2){
                    v[variable] = v[variable] + gainValue2;
                    break;
                }
            }
        }
    } 
}



/* ----- UPGRADES -----*/




/* ----- MOTEUR VROOM VROOM ----- */

// Calculate every ressource

function calcMoneyPerSec() {
    if (currentAction == "workForMoney") {
        v.moneyPerSec = v.worker * v.workerGain
         + v.passiveIncome * v.sympathizer
         + v.moneyPerWorkDay * v.moneyPWDM;
         console.log(v.worker, v.workerGain, v.sympathizer, v.passiveIncome, v.moneyPerWorkDay, v.moneyPWDM);
    } else {
        v.moneyPerSec = v.worker * v.workerGain
         + v.passiveIncome * v.sympathizer
         + (v.preachingMoneyMultiplier * v.cultist); // if selfBetterment is not bought, or player isn't preaching, multiplier is 0.
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
    	v.controlGainPerSec = v.controlAttrition * v.cultist + v.controlPerWorkDay * preachingPWDM;
    	if(selfBetterment.isActive === true){
    		v.preachingMoneyMultiplier = 1; // Activate money gain from selfBetterment upgrade.
    	}
   } else {
   		v.controlGainPerSec = v.controlAttrition * v.cultist;
   		v.preachingMoneyMultiplier = 0; // Deactivate money gain from preaching if action <> from "preach".
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
    if(currentAction === "recruit"){
        document.getElementById("currentlyRecruiting").innerHTML = "Recruiting...";
    } else {
        document.getElementById("currentlyRecruiting").innerHTML = " ";
    }
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
	if (currentAction === "recruit"){
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
    stringToPush = "";
    if(whoSpeaks == "me"){
          stringToPush = "<span class='meTalking'>" + newLogString + "</span><br>";
        } else {
          stringToPush = "<span class='otherTalking'>" + newLogString + "</span><br>";  
        }
    v.logsList.push(stringToPush);
    for (let i = v.logsList.length - 1; i >= 0; i--) {
        log += v.logsList[i];
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

function logUpdateTimer() {
    if (v.daysElapsed == 30) {
      updateLogs("My life is boring", "me");
    }
    if (v.daysElapsed == 60) {
      updateLogs("I want more", "me");
    }
    if (v.daysElapsed == 70) {
      updateLogs("I have more", "voice");
      $("#btPray").fadeIn(3000);
    }
    if (v.daysElapsed == 80) {
      updateLogs("Pray me.", "voice");
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
  if (v.faith > 49 && v.recruitPhase != true){
    v.recruitPhase = true;
  	document.getElementById("btRecruit").style.display = "inline";
  	document.getElementById("sympathizerDiv").style.display = "inline";
    updateLogs("Go, Sheperd, and gather your flock", "voice"); 
  }


  // Upgrades, display buttons if stage is reached
  if(v.cultist > 0){
    document.getElementById("btSelfBetterment").style.display = "inline";
    document.getElementById("btIncreasedWorkHour").style.display = "inline"
  }

  if(v.recruitPhase == true){
    document.getElementById('btBuyComputer').style.display = "inline";
  }



  // Upgrades, enable button if you have enough ressources.
  if (v.askARaiseCost > v.experience){
    document.getElementById("btAskARaise").disabled = true;
  } else {
    document.getElementById("btAskARaise").disabled = false;
  }

  if(v.faith >= v.sympToCultCost){
    document.getElementById("btUpgradeToMember").disabled = false;
  } else {
    document.getElementById("btUpgradeToMember").disabled = true;
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
    localStorage.setItem("saveUpg",JSON.stringify(upgradeList));
}


function loadGame(){
	v = JSON.parse(localStorage.getItem("save"));
    loadedList = JSON.parse(localStorage.getItem("saveUpg"));
}

function deleteSave(){
	localStorage.removeItem("save");
    location.reload();
}


/* ----- UPDATES -----*/

// function updateRoomsCost() {
//     roomsCost = rooms * roomsBaseCost;
//     document.getElementById("ttRoomsCost-").innerHTML = roomsCost;
//     document.getElementById("ttRoomsCost+").innerHTML = ((rooms + 1) * roomsBaseCost);
// }


function activateTestMode(){
	if(modeTest == "no"){
		v.timeMultiplier = 1000;
		modeTest = "yes"
	} else {
		v.timeMultiplier = 1;
		modeTest = "no"
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

    logUpdateTimer();
    eventDisplayChecker();

    updateClickables();

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