
class Upgrade{
	constructor (params){
	this.isActive = params.isActive;
	this.isVisible = params.isVisible;

	this.btName = params.btName;
	this.ttCost = params.ttCost;
	this.tabName = params.tabName;
	this.triggerType = params.triggerType;
	this.triggerValue = params.triggerValue;
	this.triggerRes = params.triggerRes;

	this.level = params.level;
	this.costValue = params.costValue;
	this.costType = params.costType;
	this.costValue2 = params.costValue2;
	this.costType2 = params.costType2;
	this.gainValue = params.gainValue;
	this.gainType = params.gainType;
	this.gainValue2 = params.gainValue2;
	this.gainType2 = params.gainType2;


	upgradeList.push(this);
	}


	disableButton(){
		document.getElementById(this.btName).disabled = true;
	}

	enableButton(){
		document.getElementById(this.btName).disabled = false;
	}

	isClickable(){
		if(this.level != null && this.isAffordable()){
			this.enableButton();
		}else if(this.isActive == false && this.isAffordable()){
			this.enableButton();
		} else {
			this.disableButton();
		}
	}

	activateUpgrade(){
		if((this.isActive !== true || this.level >= 0) && this.isAffordable()){
			this.isActive = true;
			
	        // Déduction du coût de l'upgrade de la ressource correspondante.
	        for(let variable in v){
	            if (variable = this.costType){
	                v[variable] = v[variable] - this.costValue;
	                document.getElementById(variable).innerHTML = v[variable];
	                break;
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
			if (this.level >= 0){
				// Update and scale cost
				this.level = this.level + 1;
				this.costValue = this.costValue * this.level; // Scale the cost depending on the level.
				this.gainValue = this.gainValue * this.level;
				document.getElementById(this.ttCost).innerHTML = this.costValue;
			} 
			this.disableButton();
		}
	}

	isAffordable(){
		for(let variable in v){
			if(variable == this.costType){
				if(v[variable] >= this.costValue){
					return true;
				} else {
					return false;	
				}
			}
		}
	}
}

var loadedList = [];
var upgradeList = [];


const askARaise = new Upgrade({
	isActive: false,
	isVisible: true, 
	level: 1,
	btName: "btAskARaise",
	ttCost: "ttAskARaiseCost",
	tabName: "personnalTrainingTab",
	costValue: 100,
	costType: "experience",
	gainValue: 0.05,
	gainType: "moneyPWDM"});

const revenueSharing = new Upgrade({
	isActive: false,
	isVisible: false,
	btName: "btRevenueSharing",
	tabName: "personnalTrainingTab",
	ttCost: "ttRevenueSharingCost",
	triggerType: "resValue",
	triggerValue: "sympathizer",
	triggerRes: 10,
	costValue: 500,
	costType: "experience",
	gainValue: 0.1,
	gainType: "moneySympM"});

const buyComputer = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "resValue",
	triggerValue: "sympathizer",
	triggerRes: 1,
	btName: "btBuyComputer",
	ttCost: "ttBuyComputerCost",
	tabName: "investmentsTab",
	costValue: 500,
	costType: "money",
	gainValue: 10,
	gainType: "recruitSympChance"});

const socialNetworking = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "upgBought",
	triggerValue: "btBuyComputer",
	btName: "btSocialNetworking",
	tabName: "personnalTrainingTab",
	ttCost: "ttSocialNetworkingCost",
	costValue: 500,
	costType: "experience",
	gainValue: 10,
	gainType: "recruitSympChance"});

const selfBetterment = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 1,
	btName: "btSelfBetterment",
	tabName: "personnalTrainingTab",
	ttCost: "ttSelfBettermentCost",
	costValue: 10000,
	costType: "faith"});

const increasedWorkHour = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "upgBought",
	triggerValue: "btWeAreFamily",
	btName: "btIncreasedWorkHour",
	tabName: "personnalTrainingTab",
	ttCost: "ttIncreasedWorkHourCost",
	costValue: 50000,
	costType: "experience",
	gainType: "workerGain",	
	gainValue: 1,
	gainType2: "controlMax",
	gainValue2: 10});

const uniforms = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 5,
	btName: "btUniforms",
	ttCost: "ttUniformsCost",
	tabName: "investmentsTab",
	costValue: 5000,
	costType: "money",
	gainValue: 10,
	gainType: "controlMax"});

const deepVoice = new Upgrade({
	isActive: false,
	isVisible: false,
	triggerType: "resValue",
	triggerValue: "cultist",
	triggerRes: 1,
	btName: "btDeepVoice",
	ttCost: "ttDeepVoiceCost",
	tabName: "personnalTrainingTab",
	costValue: 1000,
	costType: "experience",
	gainValue: 0.1,
	gainType: "controlPWDM"});

const chapel = new Upgrade({
	isActive: false,
	isVisible: false,
	btName: "btChapel",
	ttCost: "ttChapelCost",
	inTab: "investmentsTab",
	triggerType: "upgBought",
	triggerValue: "btUniforms",
	tabName: "investmentsTab",
	costType: "bills",
	costValue: 1000,
	gainType: "controlMax",
	gainValue: 100});

const storyTelling = new Upgrade({
	isActive: false,
	isVisible: false,
	btName: "btStoryTelling",
	ttCost: "ttStoryTellingCost",
	inTab: "personnalTrainingTab",
	triggerType: "upgBought",
	triggerValue: "btDeepVoice",
	tabName: "personnalTrainingTab",
	costType: "experience",
	costValue: 5000,
	gainType: "controlPWDM",
	gainValue: 0.2,
	gainType2: "controlMax",
	gainValue2: 10});


const befriending = new Upgrade({
	isActive: false,
	isVisible: false,
	btName: "btBefriending",
	ttCost: "ttBefriendingCost",
	tabName: "personnalTrainingTab",
	triggerType: "upgBought",
	triggerValue: "btSelfBetterment",
	costType: "experience",
	costValue: 5000,
	gainType: "controlMax",
	gainValue: 20});


const weAreFamily = new Upgrade({
	isActive: false,
	isVisible: false,
	btName: "btWeAreFamily",
	ttCost: "ttWeAreFamilyCost",
	tabName: "personnalTrainingTab",
	triggerType: "upgBought",
	triggerValue: "btBefriending",
	costType: "experience",
	costValue: 20000,
	gainType: "controlMax",
	gainValue: 30});




function updateClickables(){
    upgradeList.forEach(instances => instances.isClickable());
}

function updateTT(){
	for(i = 0; i < upgradeList.length; i++){
		if(upgradeList[i].ttCost != null){
			document.getElementById(upgradeList[i].ttCost).innerHTML = upgradeList[i].costValue;			
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
			document.getElementById(upgradeList[i].btName).style.display = "inline";
			document.getElementById(upgradeList[i].tabName).style.display = "inline";
		} else {
			document.getElementById(upgradeList[i].btName).style.display = "none";
		}
	}
}

function upgChecker(){
	for(i = 0; i < upgradeList.length; i++){ // Boucle la liste des upgrades à afficher
		if(upgradeList[i].triggerType == "upgBought"){ // Vérifie le type d'évènement affichant l'upgrade
			for(y = 0; y < upgradeList.length; y++){ // Boucle sur les upgrades déjà actives
				if(upgradeList[i].triggerValue == upgradeList[y].btName && upgradeList[y].isActive == true && upgradeList[i].isVisible == false){ 
					upgradeList[i].isVisible = true;
					document.getElementById(upgradeList[i].tabName).style.display = "inline";					
					document.getElementById(upgradeList[i].btName).style.display = "inline";
				}
			}
		} else if(upgradeList[i].triggerType == "resValue"){
			for(let variable in v){
				if(variable == upgradeList[i].triggerValue && v[variable] >= upgradeList[i].triggerRes && upgradeList[i].isVisible == false){
					upgradeList[i].isVisible = true;
					document.getElementById(upgradeList[i].tabName).style.display = "inline";	
					document.getElementById(upgradeList[i].btName).style.display = "inline";
				}
			}
		} else if(upgradeList[i].triggerType == "time"){
			if(v.daysElapsed >= upgradeList[i].triggerValue && upgradeList[i].isVisible == false){
				upgradeList[i].isVisible = true;
				document.getElementById(upgradeList[i].tabName).style.display = "inline";	
				document.getElementById(upgradeList[i].btName).style.display = "inline";
			}
		} else if(upgradeList[i].triggerType == "upgLevel"){
			for(y = 0; y < upgradeList.length; y++){
				if(upgradeList[i].triggerValue == upgradeList[y].btName && upgradeList[y].level >= upgradeList[i].triggerRes && upgradeList[i].isVisible == false){
					upgradeList[i].isVisible = true;
					document.getElementById(upgradeList[i].tabName).style.display = "inline";					
					document.getElementById(upgradeList[i].btName).style.display = "inline";
				}	
			}
		}
	}
}

