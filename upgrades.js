
class Upgrade{
	constructor (params){
	this.isActive = params.isActive;
	this.level = params.level;
	this.btName = params.btName;
	this.ttName = params.ttName;
	this.costValue = params.costValue;
	this.costType = params.costType;
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
		if(this.isActive == false && this.isAffordable()){
			this.enableButton();
		} else {
			this.disableButton();
		}
	}

	activateUpgrade(){
		if(this.isActive !== true){
			this.isActive = true;
			// activeUpg.push(this.btName);
			if (this.level >= 0){
				// Update and scale cost
				this.costValue = this.costValue / this.level; // Put the cost/gain back to it's base value, in order to scale it geometricaly.
				this.gainValue = this.gainValue / this.level; 
				this.level = this.level + 1;
				this.costValue = this.costValue * this.level; // Scale the cost depending on the level.
				this.gainValue = this.gainValue * this.level;
				document.getElementById(this.ttName).innerHTML = this.costValue;
			}
			this.disableButton();
			return[this.costType, this.costValue, this.gainType, this.gainValue, this.gainType2, this.gainValue2];
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
// var activeUpg = [];


const revenueSharing = new Upgrade({
isActive: false,
btName: "btRevenueSharing",
costValue: 500,
costType: "faith",
gainValue: 0.1,
gainType: "passiveIncome"});

const askARaise = new Upgrade({
isActive: false,
level: 1,
btName: "btAskARaise",
ttName: "askARaiseCost",
costValue: 100,
costType: "money",
gainValue: 0.05,
gainType: "moneyPerWorkDayMultiplier"});

const buyComputer = new Upgrade({
isActive: false,
btName: "btBuyComputer",
ttName: "buyComputerCost",
costValue: 500,
costType: "money",
gainValue: 10,
gainType: "recruitChance"});

const socialNetworking = new Upgrade({
isActive: false,
btName: "btSocialNetworking",
costValue: 500,
costType: "experience",
gainValue: 10,
gainType: "recruitChance"});

const selfBetterment = new Upgrade({
isActive: false,
btName: "btSelfBetterment",
costValue: 10000,
costType: "faith"});

const increasedWorkHour = new Upgrade({
isActive: false,
btName: "btIncreasedWorkHour",
costValue: 50000,
costType: "faith",
gainType: "workerGain",	
gainValue: 1,
gainType2: "control",
gainValue2: 10});


function updateClickables(){
    upgradeList.forEach(instances => instances.isClickable());
}

function initializeUpg(){
	for(i = 0; i < upgradeList.length; i++){
		for(y = 0; y < loadedList.length; y++){
			if(loadedList[y].btName == upgradeList[i].btName){
				upgradeList[i].isActive = loadedList[y].isActive;
				upgradeList[i].costValue = loadedList[y].costValue;
				upgradeList[i].gainValue = loadedList[y].gainValue;
				if(upgradeList[i].ttName != null){
					console.log(upgradeList[i].costValue);
					document.getElementById(upgradeList[i].ttName).innerHTML = upgradeList[i].costValue;
				}
			}
		}
	}
}


