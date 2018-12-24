var Web3 = require('web3');
//ggf. npm uninstall --save -g web3
//npm install web3@0.20.2

var fs = require('fs');
var jsonFile = "../build/contracts/HonestClock.json";
var parsed= JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

var algo = require('./Algorithmus');

//Connect Database and import database modules__________________________________
var db = require('./ConnectDB');
var cre = require('./CreateDB');
var ins = require('./InsertDB');
var upd = require('./UpdateDB');
var sel = require('./SelectDB');
var res = require('./ResetDB');


var path =__dirname + "/Database.db";
console.log("hcEL: Using Database at: "+path);

//Checker um festzuhalten, dass die DB neu erstellt wurde
var checker = false;

fs.access(path, (err) => {
  if (err) { 
	cre.Create();
	checker = true;	
 }
});

db.Connect();

//initate Contract______________________________________________________________
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {

    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
}
console.log("hcEL: Frau Detection Starting ...");
web3.eth.getAccounts().then(e => {
 web3.eth.defaultAccount = e[4];
 console.log("hcEL: FD using DefaultAccount: " + web3.eth.defaultAccount);
})

web3.eth.net.getId()
  .then(networkId => {
    const contractAddr = parsed.networks[networkId].address;
    const contract = new web3.eth.Contract(parsed.abi, contractAddr);
    contract.options.from = web3.eth.defaultAccount;

var DBblock;
var DBaddress;
var currentBlock;

web3.eth.getBlockNumber()
  .then(blocknum => {
try{
	var currentBlock = parseInt(blocknum);
	console.log('Current Block is: ' + currentBlock);
}catch(err){
    console.log('Blocknummer wurde nicht aufgerufen');
  }

ResetDB();

async function ResetDB(){

try{
	var DBaddress = await RecieveLastAddress();
	//console.log('recieved Old Address is ' + DBaddress);
}catch(err){
    console.log('recieving Old Address from DB failed');
  }

try{
	var DBblock = await RecieveLastBlock();
	//console.log('recieved Old Block is ' + DBblock);
}catch(err){
    console.log('recieving Old Block from DB failed');
 }

if (checker === false) {	
	//Check if blockchain was restarted	
	if (contractAddr === DBaddress) {
		console.log('Old Address: ' + DBaddress + ' and New Address: ' + contractAddr + ' are equal');
		if (currentBlock < DBblock) {
			console.log('Old Block: ' + DBblock + ' is larger then New Block: ' + currentBlock + ' are equal');
			res.Reset(contractAddr, currentBlock);
		}else{
			console.log('DB is not Reset, Old Block: ' + DBblock + ' is smaller then New Block: ' + currentBlock + ' AND Old Address: ' 				+ contractAddr + ' is equal to New Address: ' + DBaddress);
			//Do Nothing
		}
	}else{
		console.log('DB Reset because Old Address: ' + DBaddress + ' and New Address: ' + contractAddr + ' are NOT equal');
		res.Reset(contractAddr,currentBlock);
	}
}else{
		ins.NewDB(currentBlock,contractAddr);
		console.log('In Tabelle saveaddress wurde neu angelegt New Address: ' + contractAddr + ' und aktuelle Blocknummer: ' + 			currentBlock);
} 

};	
})

    //____________Update Event________________________________________
    contract.events.updated( function(error, event){ if(error!==null) console.log("hcEL: error: "+error) })
      .on('data', async (log) => {
        try{
          km = log.returnValues.km;
          fin = log.returnValues.fin;
          block = log.blockNumber;

          console.log("hcEL: EVENT UPDATED  DETECTED:"+km+" "+fin+" "+block);
          //Write new km into databse

          await ins.Insert(fin, parseInt(km), parseInt(block), null, null, contractAddr);
          //validate the new new km input
          let metrics = await processFraudDetectionDecision(fin,km, block);
          console.log("hcEL: metrics: " + metrics)
          let valid_type = metrics[0];
          let valid;
          if(metrics[1]==0){
            valid = false;
          }else{
            valid = true;
          }
          //write validation back to the blockchain
          console.log("hcEL: __Tries to write back to BC: "+fin+","+ km+","+ block+","+ valid+","+valid_type);


          contract.methods.validate(fin, km, block, valid, valid_type).send( function(err, transactionHash){
            if(err != null){
              console.log("hcEL: " + err);
            }else{
              console.log("hcEL: __Successfull written... transaction-hash:" + transactionHash);
            }
          console.log("hcEL: writing back FD-Decision to database...")
          //receicling the update method here... Nicht sehr schön aber funktional
          upd.Update(fin, km, km, valid, valid_type, contractAddr, block)



          });
        }catch(e){
          console.log("hcEL: "+ e);
        }

      })
      .on('changed', (log) => {
        console.log(`hcEL: Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`hcEL: error:  ${log}`)
    });

    //____________Validated Event________________________________________
    contract.events.validated( function(error, event){ if(error!==null)console.log("hcEL: error: " + error) })
      .on('data', async (log) => {
        try{
          fin = log.returnValues.fin;
          aktzepiert = log.returnValues.akzeptiert;

          console.log("hcEL: EVENT VALIDATED  DETECTED: fin: "+fin+" validiert: "+aktzepiert);

        }catch(e){
          console.log("hcEL: " + e);
        }

      })
      .on('changed', (log) => {
        console.log(`hcEL: Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`hcEL: error:  ${log}`)
    });

    //____________Corrected Event________________________________________
    contract.events.corrected( function(error, event){ if(error!==null) console.log("hcEL: error: " + (error)) })
      .on('data', async (log) => {
        try{
          fin = log.returnValues.fin;
          oldValue = log.returnValues.oldValue;
          newValue = log.returnValues.newValue;

          console.log("hcEL: EVENT CORRECTED  DETECTED:"+fin+" "+oldValue+" "+newValue);
          //Da es vom Tuev corregiert wurde schreiben wir valide true mit der metrik 4
          upd.Update(fin, oldValue, newValue, true, 4, contractAddr, block);

        }catch(e){
          console.log("hcEL: " + e);
        }

      })
      .on('changed', (log) => {
        console.log(`hcEL: Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`hcEL: error:  ${log}`)
    })

  })


async function processFraudDetectionDecision(fin, km,block){
  var data = await sel.Select(fin);
  try{
    //console.log("SQLITE:" + data);
    let kms = [];
    let blocknrs = [];
    let metrics = [];

    //console.log("erster Km: "+ data[0].Km);

    let c=0;
    for(var i = 0; i < data.length; i++){
      //wir wollen nur valid=true werte mit einbeziehen
      if(data[i].Flag == 1){
        kms[c] = data[i].Km;
        blocknrs[c] = data[i].BlockNummer;
        metrics[c] = data[i].Metrik;
        c++;
      }
    }

    kms[c]=parseInt(km);
    blocknrs[c]=parseInt(block);

    for(var i = 0; i < kms.length; i++){
      console.log("PROCESSFRAUDDETEC: km "+ kms[i]);
      console.log("PROCESSFRAUDDETEC: block "+ blocknrs[i]);
    }
    console.log("PROCESSFRAUDDETEC: length of FD input" + kms.length + " " + blocknrs.length)

    let results = algo.validitaetspruefung(kms,blocknrs, metrics);
    console.log("hcEL: Entry for FIN: "+fin+" and KM: "+km+" is valid:"+ results[1] +" with metric: "+ results[0]);
    return results;
  }catch(err){
    console.log("hcEL: ERROR: data in db not valid" + err);
    return null;
  }

}

function getLatestContractAddress(jsonABI){
  let contractsHistory = jsonABI.networks;
  let latestContract;
  for (contract in contractsHistory){
    latestContract = contract;
  }
  return contractsHistory[latestContract].address;
}

async function RecieveLastAddress(){
	let lastaddress = await sel.LastAddress();
try{
	//console.log("SQLITE: last address selected " + lastaddress[0].Address);
	return lastaddress[0].Address;
}catch(err){
    //console.log('recieving Old Block Number from DB failed');
    return null;
  }
}

async function RecieveLastBlock(){
	let lastblock = await sel.LastBlock();
try{
	//console.log("SQLITE: last block selected " + lastblock[0].BlockNummer);
	return lastblock[0].BlockNummer;
}catch(err){
    //console.log('recieving Old Block Number from DB failed');
    return null;
  }
}

console.log("hcEL: Fraud Detection started successful!")
