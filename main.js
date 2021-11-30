
var v = {
  firstGame : true,

// General
  actionM: 10,  

// Money 
  money: 0,
  moneyPerSec: 0,
  moneyPWD: 20,
  moneyPWDM: 1,
  moneyMultiplier: 1,
  moneySympM: 0,
  workerM: 1,
  preachMoneyM: 0,

  bills : 400,

// Faith
  faith: 0,
  faithPWD: 1,
  faithPWDM: 1,
  faithSympM: 0.1,
  faithPerSec: 0,
  allFaithM: 1,
  priestGain: 1,

// Experience
  experience: 0,
  experiencePerSec: 0,
  experiencePWD: 1,
  experiencePWDM: 1,
  passiveExperience: 0,
  passiveExperienceM: 0,


// Control
  control : 10,
  controlAttrition : -0.1,
  controlAttritionM : 1,
  controlPerSec : 0,
  controlPWD : 1,
  controlPWDM : 1,
  controlMaxBase : 20,
  controlMaxM : 1,
  isControlOn  : false,
  controlM : 1,
  controlLossEffect : 0.1,

// Sympathizers
  sympathizer : 0,
  passiveSymp : 0,
  passiveSympM : 1,
  recruitSympRate : 0.1,
  recruitSympM : 1,
  recruitSympState : 0,
  recruitSympThreshold : 100,
  sympPerSec : 0,

// Adepts
  adept : 0,
  adeptMax : 3,
  adeptPerSec : 0,
  adeptConvRate : 0.1,
  adeptConvM : 1,
  adeptConvState : 0,
  adeptConvThreshold : 100,
  passiveAdept : 0,
  passiveAdeptM : 1,
  inactiveAdept : 0,

// Cultists
  cultist : 0,
  cultistMax : 0,
  inactiveCultist : 0,
  worker : 0,
  priest : 0,
  adpToCultCost : 1000,


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

    // if (v.recruitPhase == true){
    //     document.getElementById("btRecruitSymp").style.display = "inline";
    //     document.getElementById("sympathizerDiv").style.display = "inline";
    // }

    document.getElementById("experience").innerHTML = v.experience;
    document.getElementById("sympathizer").innerHTML = v.sympathizer;
    document.getElementById("adept").innerHTML = v.adept;
    document.getElementById("maxAdp").innerHTML = v.adeptMax;
    document.getElementById("cultistMax").innerHTML = v.cultistMax;
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

    document.getElementById("cultistUpgradeCost").innerHTML = v.adpToCultCost;


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
		case "adept":
		if (v.adept > 0 && v.faith >= v.adept){
				v.adept = v.adept - value;
				v.faith = v.faith - v.adpToCultCost;
				v.cultist = v.cultist + value;
				v.inactiveCultist = v.inactiveCultist + value;
			document.getElementById("countInactive").value = numberFormating(v.inactiveCultist, 0);			
			document.getElementById("adept").innerHTML = numberFormating(v.adept, 0);
			document.getElementById("cultist").innerHTML = numberFormating(v.cultist, 0);
		}
		break;
	}
}


function changeWorker(value) {
    if (v.inactiveAdept > 0 && value > 0 || value < 0 && v.worker > 0) {
        v.worker = v.worker + value;
        v.inactiveAdept = v.inactiveAdept - value;
        calcMoney();
        document.getElementById("countInactive").value = numberFormating(v.inactiveAdept, 0);
        document.getElementById("countWorker").value = v.worker;
        document.getElementById("inactiveAdept").innerHTML = v.inactiveAdept;
    }
}

function changePriest(value) {
    if (v.inactiveAdept > 0 && value > 0 || value < 0 && v.priest > 0) {
        v.priest = v.priest + value;
        v.inactiveAdept = v.inactiveAdept - value;
        calcFaith();
        document.getElementById("countInactive").value = numberFormating(v.inactiveAdept, 0);
        document.getElementById("countPriest").value = v.priest;
        document.getElementById("inactiveAdept").innerHTML = v.inactiveAdept;
    }
}

/*----- ACTIONS -----*/

function changeWork(task) {
    switch (task) {
        case "pray":
            currentAction = "workForFaith";
            document.getElementById("btPray").disabled = true;
            document.getElementById("btWork").disabled = false;
            document.getElementById("btRecruitSymp").disabled = false;
            document.getElementById("btPreach").disabled = false;
            document.getElementById("btConvertAdp").disabled = false;
            break;
        case "work":
            currentAction = "workForMoney";
            document.getElementById("btWork").disabled = true;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruitSymp").disabled = false;
            document.getElementById("btPreach").disabled = false;
            document.getElementById("btConvertAdp").disabled = false;
            break;
        case "recruitSymp":
        	currentAction = "recruitSymp";
            document.getElementById("btWork").disabled = false;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruitSymp").disabled = true;
            document.getElementById("btPreach").disabled = false;
            document.getElementById("btConvertAdp").disabled = false;
            break;
        case "preach":
        	currentAction = "preach";
            document.getElementById("btWork").disabled = false;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruitSymp").disabled = false;
            document.getElementById("btPreach").disabled = true;
            document.getElementById("btConvertAdp").disabled = false;
            break;	
        case "convertAdp":
            currentAction = "convertAdp";
            document.getElementById("btWork").disabled = false;
            document.getElementById("btPray").disabled = false;
            document.getElementById("btRecruitSymp").disabled = false;
            document.getElementById("btPreach").disabled = false;
            document.getElementById("btConvertAdp").disabled = true;
            break;  
    }
}


/* ----- MOTEUR VROOM VROOM ----- */

// Calculate every ressource

function calcMoney(){
    let workMoney = 0;
    if(currentAction == "workForMoney"){
        workMoney = v.moneyPWD * v.moneyPWDM * v.actionM;           // Money generated by the player working.
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
        workFaith = v.faithPWD * v.faithPWDM * v.actionM;
    }
    v.faithPerSec = v.priest * v.priestGain             // Priest faith
    + v.sympathizer * v.faithSympM                      // Sympathizer faith
    + workFaith;                                        // Add the faith generated by the player, calculated above

    // Add faith gain per sec to the total money amount    
    v.faith = v.faith + (v.faithPerSec * v.allFaithM * v.timeMultiplier);

    // Update the HTML with the ressource generated by second :
    document.getElementById("faithPerSec").innerHTML = numberFormating(v.faithPerSec, 1); 
    document.getElementById("faith").innerHTML = numberFormating(v.faith, 1);
}


function calcExperience() {
    if (currentAction != "none") {
        v.experiencePerSec = v.experiencePWD * v.experiencePWDM; // If the player is active, gain xp.
    }

    // Add experience gain per sec to the total experience amount
    v.experience = v.experience + v.experiencePerSec * v.timeMultiplier;

    // Update the HTML with the ressource generated by second :
    document.getElementById("experience").innerHTML = numberFormating(v.experience, 1);
    document.getElementById("experiencePWD").innerHTML = numberFormating(v.experiencePWD, 1);
}


function calcControl(){
    v.controlMax = v.controlMaxM * v.controlMaxBase;
    document.getElementById("controlMax").innerHTML = v.controlMax;

    let workPreach = 0;
    if(currentAction == "preach"){                                // Control generated by the player preaching
        workPreach = v.controlPWD * v.controlPWDM * v.actionM;
    }

    v.controlPerSec = v.controlAttrition * v.controlAttritionM    // Calculate control attrition
    * v.cultist
    + workPreach;                                                 // Add the control gained by the player preaching

    if(selfBetterment.isActive == true){                          // Activate the money gain when preaching if the player is preaching
        v.preachMoneyM = 1;
    } else {
        v.preachMoneyM = 0;
    }

    if(v.control <= 0 && v.cultist > 0){                          // Check if you can control your cultist, and remove one if necessary
        cultistRemover();
    }

    v.control = v.control + v.controlPerSec;            // Add control gain per sec to the total control amount

    if (v.control >= v.controlMax){                     // Keep current control at max control
        v.control = v.controlMax;
    } 

    // Update the HTML with the ressource generated by second :
    document.getElementById("controlPerSec").innerHTML = numberFormating(v.controlPerSec, 1);
    document.getElementById("cultistMax").innerHTML = numberFormating(v.cultistMax, 0);
    document.getElementById("controlValue").innerHTML = numberFormating(v.control, 1);

    // Color the HTML to indicate if you risk losing cultist
    if (v.control < 0){
        document.getElementById("control").style.color = "red";
    } else {
        document.getElementById("control").style.color = "black";
    }
}

function calcRecSymp(){
    // Active recruitment management
    let currentRecruit = 0;
    if(currentAction === "recruitSymp"){ 
        v.recruitSympState = v.recruitSympState + v.recruitSympRate * v.recruitSympM * v.actionM;
    } 
    v.recruitSympState = v.recruitSympState + v.passiveSymp * v.passiveSympM;

    document.getElementById("recruitSympRate").innerHTML = numberFormating(v.recruitSympRate, 1);
    document.getElementById("recruitSympTh").innerHTML = numberFormating(v.recruitSympState, 1);

    if(v.recruitSympState >= v.recruitSympThreshold){
        currentRecruit = currentRecruit + 1;
        v.recruitSympState = v.recruitSympState -100;
    }


    // Add sympathizers gain per sec to the total sympathizers amount
    v.sympathizer = v.sympathizer + currentRecruit * v.timeMultiplier; 
    document.getElementById("sympathizer").innerHTML = numberFormating(v.sympathizer, 0);           // Update the HTML with the new sympathizer number
}

function calcConvAdp(){
    let adeptRecruit = 0;
    if(v.adept < v.adeptMax){
    if(currentAction === "convertAdp"){
        v.adeptConvState = v.adeptConvState + v.adeptConvRate * v.actionM;
        if(v.adeptConvState >= v.adeptConvThreshold && v.adept <= v.adeptMax){                       // Check if the adpet counter has reached the threshold
            v.adeptConvState = v.adeptConvState -100;                                                // Reset the adpet counter
            adeptRecruit = adeptRecruit +1;                                                         
        }
        document.getElementById("convCurrentValue").innerHTML = numberFormating(v.adeptConvState, 1);
    }

    } else {
        document.getElementById("convCurrentValue").innerHTML = "MAX";                              // If the current value of adept is = to max, stop recruiting
    }

    v.adeptPerSec = adeptRecruit 
    + v.passiveAdept * v.passiveAdeptM;

    // Add sympathizers gain per sec to the total sympathizers amount
    v.adept = v.adept + v.adeptPerSec; 
    document.getElementById("convertAdpRate").innerHTML = numberFormating(v.adeptConvRate, 1);
    document.getElementById("adept").innerHTML = numberFormating(v.adept, 0);                       // Update the HTML with the new sympathizer number
}

function adeptRemover(){
	v.adept = v.adept - 1;
    document.getElementById("adept").innerHTML = v.adept;
	if(v.inactiveAdept > 0){
		v.inactiveAdept = v.inactiveAdept - 1;
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

var cbUpgrade1 = document.querySelector("input[id=hideUpg1]");
var cbUpgrade2 = document.querySelector("input[id=hideUpg2]");
var cbUpgrade3 = document.querySelector("input[id=hideUpg3]");

cbUpgrade1.addEventListener('change', function(){hideUpgChecker(cbUpgrade1); });
cbUpgrade2.addEventListener('change', function(){hideUpgChecker(cbUpgrade2); });
cbUpgrade3.addEventListener('change', function(){hideUpgChecker(cbUpgrade3); });

function hideUpgChecker(cbName){
  console.log(cbName.checked);
  if (cbName.checked == true) {
    cbUpgrade1.checked = true;
    cbUpgrade2.checked = true;
    cbUpgrade3.checked = true;
    for(i = 0; i < upgradeList.length; i ++){
        if(upgradeList[i].isActive == true && upgradeList[i].level == null){
            document.getElementById(upgradeList[i].btName).style.display = "none";
        }
    }
  } else {
    cbUpgrade1.checked = false;
    cbUpgrade2.checked = false;
    cbUpgrade3.checked = false;
    for(i = 0; i < upgradeList.length; i ++){
        if(upgradeList[i].isActive == true && upgradeList[i].level == null){
            document.getElementById(upgradeList[i].btName).style.display = "inline";
        }
    }
  }
}




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
  	document.getElementById("btRecruitSymp").style.display = "inline";
  	document.getElementById("sympathizerDiv").style.display = "inline";
    updateLogs("Go, Sheperd, and gather your flock", "voice"); 
  }

  if(v.faith >= v.adpToCultCost){
    document.getElementById("btUpgradeToMember").disabled = false;
  } else {
    document.getElementById("btUpgradeToMember").disabled = true;
  }

  // Ressources
  if(v.sympathizer > 10){
    document.getElementById("humanRessourcesTab").style.display = "inline";
  }

  if (v.adept >= 10){
  	document.getElementById("cultistDiv").style.display = "inline";
  	document.getElementById("control").style.display = "inline";
  	document.getElementById("btPreach").style.display = "inline";
  	v.isControlOn = true;
  }

  if (v.adept > 0){
    document.getElementById("workerRepartition").style.display = "inline";    
  } 

  if (v.daysElapsed >= 72){
  	document.getElementById("btPray").style.display = "inline";
  }

  if(v.sympathizer >= 10){
    document.getElementById("btConvertAdp").style.display = "inline";
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
    calcRecSymp();
    calcConvAdp();

    logUpdateTimer();
    eventDisplayChecker();

    updateClickables();
    updateTT();
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