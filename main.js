
var v = {
  firstGame : true,

// Money 
  money : 5000,
  moneyPWD : 20,
  moneyPerSec : 0,
  moneyPWDM : 1,
  moneyMultiplier : 1,
  moneySympM : 0,
  workerM : 1,
  preachMoneyM : 0,

  bills : 400,

// Faith
  faith : 5000,
  faithPWD : 1,
  faithPWDM : 1,
  faithPWDM : 1,
  faithSympM : 0.1,
  faithPerSec : 0,
  priestGain : 1,

// Experience
  experience : 0,
  experiencePWD : 0,
  experiencePWDM : 1,
  passiveExperience : 0,
  passiveExperienceM : 0,


// Control
  control : 10,
  controlAttrition : -0.1,
  controlAttritionM : 1,
  controlPerSec : 0,
  controlPWD : 1,
  controlPWDM: 1,
  controlMax : 20,
  isControlOn : false,
  controlM : 1,
  controlLossEffect : 0.1,

// Sympathizers
  sympathizer : 0,
  passiveSymp : 0,
  passiveSympM : 1,
  recruitSympChance : 10,
  recruitSympValue : 1,
  sympPerSec : 0,

// Adepts
  adept : 0,
  passiveAdept : 0,
  passiveAdeptM : 1,

// Cultists
  cultist : 0,
  maxCultist : 0,
  inactiveCultist : 0,
  worker : 0,
  priest : 0,
  sympToCultCost : 1000,


  timeMultiplier : 1,

  daysElapsed: 0,

  logsList : [],

  recruitPhase : false,
  isXpOn : false,

  //Tab display status
  faithProofsTab: false,
  investmentsTab: false,
  personnalTrainingTab: false,
  humanRessourcesTab: false,


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

    initUpgDisplay();
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

    document.getElementById("moneyClickGain").innerHTML = v.moneyPWD;
    document.getElementById("faithClickGain").innerHTML = v.faithPWD;
    document.getElementById("preachClickGain").innerHTML = v.controlPWD;
    document.getElementById("recruitSympChance").innerHTML = v.recruitSympChance;

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
        calcMoney();
        document.getElementById("countInactive").value = numberFormating(v.inactiveCultist, 0);
        document.getElementById("countWorker").value = v.worker;
        document.getElementById("inactiveCultist").innerHTML = v.inactiveCultist;
    }
}

function changePriest(value) {
    if (v.inactiveCultist > 0 && value > 0 || value < 0 && v.priest > 0) {
        v.priest = v.priest + value;
        v.inactiveCultist = v.inactiveCultist - value;
        calcFaith();
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




/* ----- MOTEUR VROOM VROOM ----- */

// Calculate every ressource

function calcMoney(){
    let workMoney = 0;
    if(currentAction == "workForMoney"){
        workMoney = v.moneyPWD * v.moneyPWDM;           // Money generated by the player working.
    }
    v.moneyPerSec = v.worker * v.workerM                // Cultist working
    + v.sympathizer * v.moneySympM                      // Sympathizer money
    + v.cultist * v.preachMoneyM                        // Money generated by preaching
    + workMoney;                                        // Add the money generated by the player, calculated above

    // Add money gain per sec to the total money amount
    v.money = v.money + v.moneyPerSec * v.timeMultiplier;

    // Update the HTML with the ressource generated by second :
    document.getElementById("moneyPerSec").innerHTML = numberFormating(v.moneyPerSec, 1);
    document.getElementById("money").innerHTML = numberFormating(v.money, 1);
}

function calcFaith(){
    let workFaith = 0;
    if(currentAction == "workForFaith"){
        workFaith = v.faithPWD * v.faithPWDM;
    }
    v.faithPerSec = v.priest * v.priestGain             // Priest faith
    + v.sympathizer * v.faithSympM                      // Sympathizer faith
    + workFaith;                                        // Add the faith generated by the player, calculated above

    // Add faith gain per sec to the total money amount    
    v.faith = v.faith + v.faithPerSec * v.timeMultiplier;

    // Update the HTML with the ressource generated by second :
    document.getElementById("faithPerSec").innerHTML = numberFormating(v.faithPerSec, 1); 
    document.getElementById("faith").innerHTML = numberFormating(v.faith, 1);
}


function calcExperience() {
    if (currentAction != "none") {
        v.experiencePWD = 1 * v.experiencePWDM; // If the player is active, gain xp.
    }

    // Add experience gain per sec to the total experience amount
    v.experience = v.experience + v.experiencePWD * v.timeMultiplier;

    // Update the HTML with the ressource generated by second :
    document.getElementById("experience").innerHTML = numberFormating(v.experience, 1);
    document.getElementById("experiencePWD").innerHTML = numberFormating(v.experiencePWD, 1);
}


function calcControl(){
    let workPreach = 0;
    if(currentAction == "preach"){                              // Control generated by the player preaching
        workPreach = v.controlPWD * v.controlPWDM;
    }

    v.controlPerSec = v.controlAttrition * controlAttritionM    // Calculate control attrition
    * v.cultist
    + workPreach;                                               // Add the control gained by the player preaching

    if(selfBetterment.isActive == true){                        // Activate the money gain when preaching if the player is preaching
        v.preachMoneyM = 1;
    } else {
        v.preachMoneyM = 0;
    }

    if(v.control <= 0 && v.cultist > 0){                        // Check if you can control your cultist, and remove one if necessary
        cultistRemover();
    }

    v.control = v.control + v.controlPerSec;            // Add control gain per sec to the total control amount

    if (v.control >= v.controlMax){                     // Keep current control at max control
        v.control = v.controlMax;
    } 

    // Update the HTML with the ressource generated by second :
    document.getElementById("controlPerSec").innerHTML = numberFormating(v.controlPerSec, 1);
    document.getElementById("maxCultist").innerHTML = numberFormating(v.maxCultist, 0);
    document.getElementById("controlValue").innerHTML = numberFormating(v.control, 1);

    // Color the HTML to indicate if you risk losing cultist
    if (v.control < 0){
        document.getElementById("control").style.color = "red";
    } else {
        document.getElementById("control").style.color = "black";
    }
}

function calcRecruitment(){
    // Active recruitment management
    let activeRecruit = 0;
    if(currentAction === "recruit"){
        document.getElementById("currentlyRecruiting").innerHTML = "Recruiting...";                 // Indicate that the current action is recruiting
        let roll = rollChances();                                                                     
        if (roll <= v.recruitSympChance){                                                               // Roll to know if you recruit someone
            activeRecruit = activeRecruit + v.recruitSympValue;                                        // If the roll is successful, add a sympathizer           
        } 
    } else {
        document.getElementById("currentlyRecruiting").innerHTML = " ";                             // Hide recruiting text if you're not recruiting
    }
    v.sympPerSec = activeRecruit 
    + v.passiveSymp * v.passiveSympM;

    // Add sympathizers gain per sec to the total sympathizers amount
    v.sympathizer = v.sympathizer + v.sympPerSec * v.timeMultiplier; 
    document.getElementById("sympathizer").innerHTML = numberFormating(v.sympathizer, 0);           // Update the HTML with the new sympathizer number
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


  // Divs 
  if (v.faith > 49 && v.recruitPhase != true){
    v.recruitPhase = true;
  	document.getElementById("btRecruit").style.display = "inline";
  	document.getElementById("sympathizerDiv").style.display = "inline";
    updateLogs("Go, Sheperd, and gather your flock", "voice"); 
  }

  if(v.faith >= v.sympToCultCost){
    document.getElementById("btUpgradeToMember").disabled = false;
  } else {
    document.getElementById("btUpgradeToMember").disabled = true;
  }

  // Ressources
  if(v.sympathizer > 10){
    document.getElementById("humanRessourcesTab").style.display = "inline";
  }

  if (v.cultist > 0){
  	document.getElementById("cultistDiv").style.display = "inline";
  	document.getElementById("control").style.display = "inline";
  	document.getElementById("workerRepartition").style.display = "inline";
  	document.getElementById("btPreach").style.display = "inline";
  	v.isControlOn = true;
  } 

  if (v.daysElapsed >= 72){
  	document.getElementById("btPray").style.display = "inline";
  }

  //Update TT
  document.getElementById("recruitSympChance").innerHTML = v.recruitSympChance;
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

    calcMoney();
    calcFaith();
    calcExperience();
    calcRecruitment();

    logUpdateTimer();
    eventDisplayChecker();

    updateClickables();
    upgChecker();

    if(v.isControlOn == true){
    	calcControl();
    }

    if(v.money <= 0 && currentAction !== "workForMoney"){
        changeWork("work");
    }

}, 1000);

window.setInterval(function timeDay(){
	saveGame();
}, 60000);