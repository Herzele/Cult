
class Upgrade{
	constructor (params){
	this.isActive = params.isActive;
	this.isVisible = params.isVisible;

	this.upgName = params.upgName;
	this.btName = params.btName;
	this.ttCost = params.ttCost;
	this.tabName = params.tabName;
	this.divName = params.divName;
	this.ttName = params.ttName;
	this.ttTitle = params.ttTitle;
	this.ttText = params.ttText;
	this.ttLevel = params.ttLevel;

	this.triggerType = params.triggerType;
	this.triggerValue = params.triggerValue;
	this.triggerRes = params.triggerRes;
	this.triggerType2 = params.triggerType2;	
	this.triggerValue2 = params.triggerValue2;
	this.triggerRes2 = params.triggerRes2;

	this.level = params.level;
	this.costScaling = params.costScaling;
	this.costValue = params.costValue;
	this.costType = params.costType;
	this.costValue2 = params.costValue2;
	this.costType2 = params.costType2;
	this.gainValue = params.gainValue;
	this.gainType = params.gainType;
	this.gainValue2 = params.gainValue2;
	this.gainType2 = params.gainType2;

	this.divDisplay = params.divDisplay;


	upgradeList.push(this);

	}


	disableButton(){
		document.getElementById(this.btName).disabled = true;
	}

	enableButton(){
		document.getElementById(this.btName).disabled = false;
	}

	isClickable(){
		if(this.isVisible == true){										//First filter on the visible, because is the uprgade isn't the html doesn't exist
			if(this.level != null && this.isAffordable()){
				this.enableButton();
			}else if(this.isActive == false && this.isAffordable()){
				this.enableButton();
			} else {
				this.disableButton();
			}
		}
	}

	activateUpgrade(){
		if((this.isActive !== true || this.level >= 0) && this.isAffordable()){
			this.isActive = true;
			
	        // Déduction du coût de l'upgrade de la ressource correspondante.
	        for(let variable in v){
	            if (variable == this.costType && this.costType != "bills"){			// Deduce the upgrade cost from the ressource.
	                v[variable] = v[variable] - this.costValue;
	                document.getElementById(variable).innerHTML = v[variable];
	                break;
	            }else if(variable == this.costType && this.costType == "bills"){		// If the upgrade cost is a bill increased, add it instead of removing it.
	            	v[variable] = v[variable] + this.costValue;
	            	document.getElementById(variable).innerHTML = v[variable];
	            }
	        }

	        // Déduction du coût secondaire de l'upgrade de la ressource correspondante.
	        if (this.costType2 != null){
	        for(let variable in v){
	            if (variable == this.costType2 && this.costType2 != "bills"){			// Deduce the upgrade cost from the ressource.
	                v[variable] = v[variable] - this.costValue2;
	                document.getElementById(variable).innerHTML = v[variable];
	                break;
	            }else if(variable == this.costType2 && this.costType2 == "bills"){		// If the upgrade cost is a bill increased, add it instead of removing it.
	            	v[variable] = v[variable] + this.costValue2;
	            	document.getElementById(variable).innerHTML = v[variable];
	            }
	        }
	    	}

	        // Ajout du gain de l'upgrade sur la ressource correspondante.
	        for(let variable in v){
	            if (variable = this.gainType){
	                v[variable] = v[variable] + this.gainValue;
	                break;
	            }
	        }

	        // Pareil qu'au dessus mais pour le second gain, s'il existe.
	        if(this.gainType2 != null){
	            for(let variable in v){
	                if (variable = gainType2){
	                    v[variable] = v[variable] + this.gainValue2;
	                    break;
	                }
	            }
	        }

	        // Incrémente le compteur de levels.
			if(this.level != null && this.costType != "bills"){						// Bills doesn't scale like the rest of the upgrades
				this.level = this.level + 1;
				this.costValue = this.costValue * (1 + this.level);					// Scale the cost
				document.getElementById(this.ttCost).innerHTML = this.costValue;
			} else if(this.level != null && this.costType == "bills"){				// Bills cost doesn't scale
				this.level = this.level + 1;
				this.costValue = this.costValue * (1+ this.level);
			} else if(this.level == null){											// If the upgrade doesn't have levels, just label it as "bought"
				document.getElementById(this.ttLevel).innerHTML = " (bought)";
			}

			// Hide the button if the "hide bought" cb is checked
			if(cbUpgrade1.checked == true && this.level == null){
				document.getElementById(this.btName).style.display = "none";
			}

			// Display the depending divs
			if(this.divDisplay != null){
				for(i = 0; i < this.divDisplay.length; i++){
					document.getElementById(this.divDisplay[i]).style.display = "inline";
				}
			}

			this.disableButton();
		}
	}

	isAffordable(){
		for(let variable in v){
			if(variable == this.costType && this.costType != "bills"){
				if(v[variable] >= this.costValue){
					return true;
				} else {
					return false;	
				}
			}else if(this.costType == "bills"){
				return true;
			} 
		}
	}


	createHtml(){
		let levelStr = "";
		let fullStr = "";
		levelStr = "<span id='"+ this.ttLevel +"'></span>"

		fullStr ="<span class='tooltip'><button type='button' class='btn' id='" + this.btName +"' onclick='"+ this.upgName +".activateUpgrade()'>"+ this.ttTitle + 
			levelStr + "</button><span class='tooltiptext' id='"+ this.ttName +"'>"+ this.ttText + this.ttCost +"'></span> "+ this.costType +".</span></span><br>";

		document.getElementById(this.divName).innerHTML += fullStr;
	}
}


function updateClickables(){
    upgradeList.forEach(instances => instances.isClickable());
}

function checkBought(){
	if(document.getElementById("hideUpg").checked == true){
		for(i = 0; i < upgradeList.length; i++){
			if(upgradeList[i].isActive == true && upgradeList[i].level == null){
				document.getElementById(upgradeList[i].btName).style.display = "none";
			}
		}
	} else if(document.getElementById("hideUpg").checked == false){
		for(i = 0; i < upgradeList.length; i++){
			if(upgradeList[i].isActive == true && upgradeList[i].level == null){
				document.getElementById(upgradeList[i].btName).style.display = "inline";
			}
		}
	} 
}

function updateTT(){
	for(i = 0; i < upgradeList.length; i++){
		if(upgradeList[i].ttCost != null && upgradeList[i].isVisible == true){
			document.getElementById(upgradeList[i].ttCost).innerHTML = upgradeList[i].costValue;
		}

		if(upgradeList[i].isVisible == true && upgradeList[i].level > 0){
			document.getElementById(upgradeList[i].ttLevel).innerHTML = "(" + upgradeList[i].level +")";
		}
	}
}

function initializeUpg(){
	for(i = 0; i < upgradeList.length; i++){
		for(y = 0; y < loadedList.length; y++){
			if(loadedList[y].btName == upgradeList[i].btName){
				upgradeList[i].isActive = loadedList[y].isActive;
				upgradeList[i].costValue = loadedList[y].costValue;
				upgradeList[i].gainValue = loadedList[y].gainValue;
				upgradeList[i].isVisible = loadedList[y].isVisible;
				upgradeList[i].level = loadedList[y].level;
			}
		}
	}
}

function initUpgDisplay(){
	for(i = 0; i < upgradeList.length; i++){
		if(upgradeList[i].isVisible == true){
			document.getElementById(upgradeList[i].tabName).style.display = "inline";
			upgradeList[i].createHtml();
			if(upgradeList[i].divDisplay !== undefined){
				for(y = 0; y < upgradeList[i].divDisplay.length; y++){
					document.getElementById(upgradeList[i].divDisplay[y]).style.display = "inline";
				}
			}
		} 
		if(upgradeList[i].isActive == true && upgradeList[i].level == null){
			document.getElementById(upgradeList[i].ttLevel).innerHTML = " (bought)";
		}
	}
}


function upgChecker(){
	for(i = 0; i < upgradeList.length; i++){ 							// Boucle la liste des upgrades à afficher
		let trigger1 = false;											// On crée les 2 bool qui servent à valider les 2 conditions.
		let trigger2 = false;
		if(upgradeList[i].isVisible == false){							// On ne vérifie que les upgrades non-visibles.
		if(upgradeList[i].triggerType2 == null){
			trigger2 = true;											// Si pas de second trigger, on initialise tout de suite le second vérificateur à true
		}
		if(upgradeList[i].triggerType == "upgBought" || upgradeList[i].triggerType2 == "upgBought" ){ 	// Vérifie le type d'évènement affichant l'upgrade
			for(y = 0; y < upgradeList.length; y++){ 													// Boucle sur les upgrades déjà actives
				if(upgradeList[i].triggerValue == upgradeList[y].btName && upgradeList[y].isActive == true){
					trigger1 = true;
				} else if (upgradeList[i].triggerValue2 == upgradeList[y].btName && upgradeList[y].isActive == true){
					trigger2 = true;
				}
			}
		} else if(upgradeList[i].triggerType == "resValue" || upgradeList[i].triggerType2 == "resValue"){
			for(let variable in v){
				if(variable == upgradeList[i].triggerValue && v[variable] >= upgradeList[i].triggerRes){
					trigger1 = true;
				} else if(variable == upgradeList[i].triggerValue2 && v[variable] >= upgradeList[i].triggerRes2){
					trigger2 = true;
		
				}
			}
		} else if(upgradeList[i].triggerType == "time" || upgradeList[i].triggerType2 == "time"){
			if(v.daysElapsed >= upgradeList[i].triggerValue){
				trigger1 = true;
			} else if(v.daysElapsed >= upgradeList[i].triggerValue2){
				trigger2 = true;
			}
		} else if(upgradeList[i].triggerType == "upgLevel" || upgradeList[i].triggerType2 == "upgLevel"){
			for(y = 0; y < upgradeList.length; y++){
				if(upgradeList[i].triggerValue == upgradeList[y].btName && upgradeList[y].level >= upgradeList[i].triggerRes){
					trigger1 = true;
				} else if(upgradeList[i].triggerValue2 == upgradeList[y].btName && upgradeList[y].level >= upgradeList[i].triggerRes2){
					trigger2 = true;
				}
			}
		}
		if(trigger1 == true && trigger2 == true){			// Si les 2 triggers sont déjà ok (parce que l'upgrade n'a qu'un seul trigger), on arrête la boucle
			upgradeList[i].isVisible = true;
			document.getElementById(upgradeList[i].tabName).style.display = "inline";					
			upgradeList[i].createHtml();
		}
		
		}
	}
}



var loadedList = [];
var upgradeList = [];


const askARaise = new Upgrade({
	upgName: "askARaise",
	isActive: false,
	isVisible: true, 

	ttLevel: "askARaiseLvl",
	btName: "btAskARaise",
	ttCost: "ttAskARaiseCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttAskARaise",
	ttTitle: "Ask a raise",
	ttText: "Beg for a little more money.<br>--------------<br>Increase your revenue by 10%<br>--------------<br>Cost : <span id='",

	level: 0,
	costValue: 100,
	costType: "experience",
	costScaling: "multi",
	gainValue: 0.1,
	gainType: "moneyPWDM"});

const revenueSharing = new Upgrade({
	isActive: false,
	isVisible: false,

	upgName: "revenueSharing",
	divName: "Personnal Training",
	ttName: "ttRevenueSharing",
	ttTitle: "Revenue sharing",
	ttText: "Your sympathizers will share a small part of their revenues<br>--------------<br>Increase your revenue by 0.1 money per day and per sympathizer.<br>--------------<br>Cost : <span id='",
	btName: "btRevenueSharing",
	tabName: "personnalTrainingTab",
	ttCost: "ttRevenueSharingCost",
	ttLevel: "revenueSharingLvl",

	triggerType: "resValue",
	triggerValue: "sympathizer",
	triggerRes: 10,
	costValue: 500,
	costType: "experience",
	gainValue: 0.1,
	gainType: "moneySympM"});
	
const buyComputer = new Upgrade({
	upgName: "buyComputer",
	isActive: false,
	isVisible: true,

	btName: "btBuyComputer",
	ttCost: "ttBuyComputerCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttBuyComputer",
	ttTitle: "Computer",
	ttText: "Reach to the world.<br>--------------<br>Unlock further upgrades<br>--------------<br>Cost : <span id='",
	ttLevel: "buyComputerLvl",

	costValue: 500,
	costType: "money"});

const socialNetworking = new Upgrade({
	upgName: "socialNetworking",
	isActive: false,
	isVisible: false,

	divName: "Personnal Training",
	ttName: "ttSocialNetworking",
	ttTitle: "Social Networking",
	ttText: "Start using social network to recruit people<br>--------------<br>Increase your sympathizer recruitment rate by 0.1<br>--------------<br>Cost : <span id='",
	btName: "btSocialNetworking",
	tabName: "personnalTrainingTab",
	ttCost: "ttSocialNetworkingCost",
	ttLevel: "socialNetworkingLvl",

	triggerType: "upgBought",
	triggerValue: "btWebsite",

	level: 0,
	costValue: 500,
	costType: "experience",
	costScaling: "multi",
	gainValue: 0.1,
	gainType: "recruitSympRate"});

const selfBetterment = new Upgrade({
	upgName: "selfBetterment",
	isActive: false,
	isVisible: false,

	btName: "btSelfBetterment",
	tabName: "personnalTrainingTab",
	ttCost: "ttSelfBettermentCost",	
	divName: "Personnal Training",
	ttName: "ttSelfBetterment",
	ttTitle: "Self Betterment",
	ttText: "Your preaching now help people getting better<br>--------------<br>You now gain 1$ per cultist while preaching<br>--------------<br>Cost : <span id='",
	ttLevel: "selfBettermentLvl",

	triggerType: "upgBought",
	triggerValue: "btMeetingRoom",

	costValue: 10000,
	costType: "faith"});

const increasedWorkHour = new Upgrade({
	upgName: "increasedWorkHour",
	isActive: false,
	isVisible: false,

	btName: "btIncreasedWorkHour",
	tabName: "personnalTrainingTab",
	ttCost: "ttIncreasedWorkHourCost",
	divName: "Personnal Training",
	ttName: "ttIncreasedWorkHour",
	ttTitle: "Increased work hours",
	ttText: "Working keeps your flock happy.<br>--------------<br>Max control is raised by 10%, base worker revenue is doubled.<br>--------------<br>Cost : <span id='",
	ttLevel: "increasedWorkHourLvl",

	triggerType: "upgBought",
	triggerValue: "btWeAreFamily",
	costValue: 50000,
	costType: "experience",
	gainType: "workerGain",	
	gainValue: 1,
	gainType2: "controlMaxBase",
	gainValue2: 10});

const uniforms = new Upgrade({
	upgName: "uniforms",
	isActive: false,
	isVisible: false,

	btName: "btUniforms",
	ttCost: "ttUniformsCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttUniforms",
	ttTitle: "Uniforms",
	ttText: "Everyone loves uniforms, it helps to put aside what separates us.<br>--------------<br>Increase your maximum control by 10% <br>--------------<br>Cost : <span id='",
	ttLevel: "uniformsLvl",

	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 5,	
	costValue: 5000,
	costType: "money",
	gainValue: 10,
	gainType: "controlMaxBase"});

const deepVoice = new Upgrade({
	upgName: "deepVoice",
	isActive: false,
	isVisible: false,
	
	btName: "btDeepVoice",
	ttCost: "ttDeepVoiceCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttDeepVoice",
	ttTitle: "Deep Voice",
	ttText: "A deeper voice will make your word resonnates more.<br>--------------<br>Increase the effectiveness of preaching by 10%<br>--------------<br>Cost : <span id='",
	ttLevel: "deepVoiceLvl",

	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 1,	
	costValue: 1000,
	costType: "experience",
	gainValue: 0.1,
	gainType: "controlPWDM"});

const chapel = new Upgrade({
	upgName: "chapel",
	isActive: false,
	isVisible: false,

	divName: "Investments",
	ttName: "ttChapel",
	ttTitle: "Chapel",
	ttText: "A chapel is a much better place to pray.<br>--------------<br>Increase your maximum control by 100% <br>--------------<br>Adds : <span id='",
	btName: "btChapel",
	ttCost: "ttChapelCost",
	tabName: "investmentsTab",
	tabName: "investmentsTab",
	ttLevel: "chapelLvl",

	triggerType: "upgBought",
	triggerValue: "btLocalAdd",

	divDisplay: ["btConvertCult"],
	costType: "bills",
	costValue: 1000,
	gainType: "controlMaxBase",
	gainValue: 100});

const storyTelling = new Upgrade({
	upgName: "storyTelling",
	isActive: false,
	isVisible: false,
	
	btName: "btStoryTelling",
	ttCost: "ttStoryTellingCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttStoryTelling",
	ttTitle: "Story-telling",
	ttText: "The art of crafting a good story will help you get your point.<br>--------------<br>Increase the effectiveness of preaching by 20% and your maximum control by 10%.<br>--------------<br>Cost : <span id='",
	ttLevel: "storyTellingLvl",
	tabName: "personnalTrainingTab",

	triggerType: "upgBought",
	triggerValue: "btDeepVoice",

	costType: "experience",
	costValue: 5000,
	gainType: "controlPWDM",
	gainValue: 0.2,
	gainType2: "controlMaxBase",
	gainValue2: 10});


const isolation = new Upgrade({
	upgName: "isolation",
	isActive: false,
	isVisible: false,

	btName: "btIsolation",
	ttCost: "ttIsolationCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttIsolation",
	ttTitle: "Isolation",
	ttText: "The closer they are to you, the farther they are from anyone else.<br>--------------<br>Maximum control is increased by 10%<br>--------------<br>Cost : <span id='",
	ttLevel: "isolationLvl",

	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 1,

	level: 0,
	costType: "experience",
	costValue: 5000,
	costScaling: "multi",
	gainType: "controlMaxBase",
	gainValue: 10});


const weAreFamily = new Upgrade({
	upgName: "weAreFamily",
	isActive: false,
	isVisible: false,

	btName: "btWeAreFamily",
	ttCost: "ttWeAreFamilyCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttWeAreFamily",
	ttTitle: "We are family",
	ttText: "Strengthen your bond with your followers.<br>--------------<br>Maximum control is increased by 30%<br>--------------<br>Cost : <span id='",
	ttLevel: "weAreFamilyLvl",

	triggerType: "upgBought",
	triggerValue: "btBefriending",

	level: 0,
	costType: "experience",
	costValue: 20000,
	costScaling: "multi",
	gainType: "controlPWD",
	gainValue: 0.5});


const confession = new Upgrade({
	upgName: "confession",
	isActive: false,
	isVisible: false,

	btName: "btConfession",
	ttCost: "ttConfessionCost",
	tabName: "personnalTrainingTab",
	divName: "Personnal Training",
	ttName: "ttConfession",
	ttTitle: "Confession",
	ttText: "Allow your followers to alleviate their heart.<br>--------------<br>Reduce your base control attrition<br>--------------<br>Cost : <span id='",
	ttLevel: "confessionLvl",

	triggerType: "upgBought",
	triggerValue: "btChapel",

	costType: "experience",
	costValue: 20000,
	gainType: "controlAttrition",
	gainValue: 0.05});

const website = new Upgrade({
	upgName: "website",
	isActive: false,
	isVisible: false,

	btName: "btWebsite",
	ttCost: "ttWebsiteCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttWebsite",
	ttTitle: "Website",
	ttText: "Make yourself visible on the web.<br>--------------<br>Unlock sympathizers recruitment.<br>--------------<br>Cost : <span id='",
	ttLevel: "websiteLvl",

	triggerType: "upgBought",
	triggerValue: "btBuyComputer",
	divDisplay: ["btRecruitSymp", "sympathizerDiv"],

	costType: "money",
	costValue: 2000,
	costType2: "bills",
	costValue2: 100});

const fastLearner = new Upgrade({
	upgName: "fastLearner",
	isActive: false,
	isVisible: false,

	btName: "btFastLearner",
	ttCost: "ttFastLearnerCost",
	tabName: "faithProofsTab",
	divName: "Proofs of faith",
	ttName: "ttFastLearner",
	ttTitle: "Fast Learner",
	ttText: "I can help you learn things faster.<br>--------------<br>Increase your experience gained by day<br>--------------<br>Cost : <span id='",
	ttLevel: "fastLearnerLvl",

	triggerType: "resValue",
	triggerValue: "sympathizer",
	triggerRes: 1,

	level: 0,
	costType: "faith",
	costValue: 5000,
	costScaling: 1,
	gainType: "experiencePWD",
	gainValue: 1});

const mindReading = new Upgrade({
	upgName: "mindReading",
	isActive: false,
	isVisible: false,

	btName: "btMindReading",
	ttCost: "ttMindReadingCost",
	tabName: "faithProofsTab",
	divName: "Proofs of faith",
	ttName: "ttMindReading",
	ttTitle: "Mind reading",
	ttText: "You can now read the mind of your followers.<br>--------------<br>Reduce control attrition.<br>--------------<br>Cost : <span id='",
	ttLevel: "mindReadingLvl",

	triggerType: "upgLevel",
	triggerValue: "btFastLearner",
	triggerRes: 4,
	triggerType2: "resValue",
	triggerValue2: "adept",
	triggerRes2: 1,

	level: 0,
	costType: "faith",
	costValue: 10000,
	costScaling: "muti",
	gainType: "controlAttritionM",
	gainValue: 0.9});

const holySymbol = new Upgrade({
	upgName: "holySymbol",
	isActive: false,
	isVisible: false,

	btName: "btHolySymbol",
	ttCost: "ttHolySymbolCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttHolySymbol",
	ttTitle: "Holy Symbol",
	ttText: "Your new faith needs a symbol.<br>--------------<br>Passively gain sympathizers<br>--------------<br>Cost : <span id='",
	ttLevel: "holySymbolLvl",

	triggerType: "upgBought",
	triggerValue: "btChapel",

	level: 0,
	costType: "money",
	costValue: 50000,
	gainType: "allFaithM",
	gainValue: 1});

const meetingRoom = new Upgrade({
	upgName: "meetingRoom",
	isActive: false,
	isVisible: false,

	btName: "btMeetingRoom",
	ttCost: "ttMeetingRoomCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttMeetingRoom",
	ttTitle: "Meeting room",
	ttText: "A place for your followers to meet.<br>--------------<br>Allow the recruitment of adepts.<br>--------------<br>Cost : <span id='",
	ttLevel: "meetingRoomLvl",

	triggerType: "resValue",
	triggerValue: "sympathizer",
	triggerRes: 50,

	level: 0,
	costType: "bills",
	costValue: 200,
	costScaling: "addi"});

const localAddCampaign = new Upgrade({
	upgName: "localAddCampaign",
	isActive: false,
	isVisible: false,

	btName: "btLocalAdd",
	ttCost: "ttLocalAddCost",
	tabName: "investmentsTab",
	divName: "Investments",
	ttName: "ttLocalAdd",
	ttTitle: "Local add campaign",
	ttText: "Help those who need you to find your way.<br>--------------<br>Passively recruit adepts<br>--------------<br>Cost : <span id='",
	ttLevel: "localAddLvl",

	triggerType: "upgBought",
	triggerValue: "btMeetingRoom",

	level: 0,
	costType: "bills",
	costValue: 200,
	gainType: "adeptConvM",
	gainValue: 0.1});

const selfConfidence = new Upgrade({
	upgName: "selfConfidence",
	isActive: false,
	isVisible: false,

	btName: "btSelfConfidence",
	divName: "Personnal Training",
	ttName: "ttSelfConfidence",
	ttTitle: "Self Confidence",
	ttText: "To convince others, you need to trust yourself.<br>--------------<br>Double the effectiveness of your actions.<br>--------------<br>Cost : <span id='",
	ttCost: "ttSelfConfidence",
	ttLevel: "selfConfidenceLvl",
	tabName: "personnalTrainingTab",

	triggerType: "upgBought",
	triggerValue: "btForum",

	level: 0,
	costType: "experience",
	costValue: 10000,
	costScaling: "multi",
	gainType: "actionM",
	gainValue: 1});

const communityManager = new Upgrade({
	upgName: "communityManager",
	isActive: false,
	isVisible: false,

	btName: "btCommunityManager",
	divName: "Investments",
	ttName: "ttCommunityManager",
	ttTitle: "Community Manager",
	ttText: "Hire someone to manage your growing community.<br>--------------<br>Increase your sympathizer recruitment rate by 0.1<br>--------------<br>Cost : <span id='",
	ttCost: "ttCommunityManagerCost",
	ttLevel: "communityManagerLvl",
	tabName: "investmentsTab",

	triggerType: "upgBought",
	triggerValue: "btSocialNetworking",

	level: 0,
	costType: "bills",
	costValue: 1000,
	costScaling: "multi",
	gainType: "passiveSymp",
	gainValue: 0.1,
	actionUnlock: "btConvertAdp"});
