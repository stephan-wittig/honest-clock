const HonestClock = artifacts.require("../HonestClock");
require('truffle-test-utils').init();

///////////////////////////////////////////////////////////////////////////
//Um alle Test-Funktionen ausführen zu können, muss lokal via npm install die
//assert libraries "chai", "ajv", "mocha" installiert werden.
//Zusätzl. muss kontrolliert werden, ob diese in der package.json auch gelistet sind.
///////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////
  //    Testfälle neu
  ///////////////////////////////////////////////////////////////////////////

contract('1.x: Generell', function(accounts) {

    it("1.1: Creator should have permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
            return HC.getPermissionLevel(accounts[3]);
        }).then(function(result){
            assert.equal(result.valueOf(), "0x03", "Contract Creator do not have permission level 3");
            done();
        })
    });

    it("1.2: Token balance should be 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
            return web3.eth.getBalance(HC.address);
        }).then(function(result){
            assert.equal(result.valueOf(), 0, "Token balance is not equal 0");
            done();
        })
    });

    //Es gibt kein message-sender der token 0 hat
   /* it("1.3: Token 0 should be owned by creator", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
            return HC.ownerOf(1);
        }).then(function(result){
            assert.equal(result.valueOf(), 0, "Contract Creator do not have permission level 3");
            done();
        })
    });*/
});

contract('2.x: Create Vehicle', function(accounts) {
    
    it("2.1: Should create Vehicle with permission level 2", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            let result = await HC.createVehicle("W0L00000000000002",  10, {from: web3.eth.accounts[2], gas: 6721975}); 
            assert.web3Event(result, {
                event: 'updated',
                  args: {
                    fin: "0x57304c3030303030303030303030303032",
                    km: 10 ,
                    blocknummer: web3.eth.blockNumber
                }
              }, 'The event is emitted');
            done();
        })
    });

    it("2.3: Should create Vehicle with permission level 1", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            let result = await HC.createVehicle("W0L00000000000001",  10, {from: web3.eth.accounts[1], gas: 6721975}); 
            assert.web3Event(result, {
                event: 'updated',
                  args: {
                    fin: "0x57304c3030303030303030303030303031",
                    km: 10 ,
                    blocknummer: web3.eth.blockNumber
                }
              }, 'The event is emitted');
            done();
        })
    });

    it("2.4: Should NOT create Vehicle with permission level 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;     
        }).then(async function(){
            try{
               await HC.createVehicle("W0L00000000000000",  10, {from: web3.eth.accounts[0], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Could create vehicle with permission level 1");
            done();
        })
    });

    it("2.5: Should NOT create Vehicle with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;   
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00033000000004",  10, {from: web3.eth.accounts[3], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Could create vehicle with permission level 4");
            done();
        })
    });

    it("2.6: Should NOT create Vehicle with permission level 4", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;   
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00000000000004",  10, {from: web3.eth.accounts[4], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Could create vehicle with permission level 4");
            done();
        })
    });

    it("2.7: Should NOT create Vehicle with already registered FIN", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function(){
            HC.createVehicle("W0L00000000000005",  10, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00000000000005",  10, {from: web3.eth.accounts[2], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Created vehicle with existing FIN");
            done();
        })
    });

    /*it("2.8: Should NOT create Vehicle with negative KM", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00000000000007",  -10, {from: web3.eth.accounts[2], gas: 6721975});     
            }
            catch (error){
               //assert(true);
                done();
            }
            assert(false, "Created vehicle with negative KM");
            done();
        })
    });*/

    it("2.9: Should create Vehicle with KM equals 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;  
            HC.createVehicle("W0L00000000000006",  0, {from: web3.eth.accounts[2], gas: 6721975}); 
        }).then(function(){
            return HC.getKM("W0L00000000000006")
        }).then(function(result){   
            assert.equal(result.valueOf(), 0, "Did not create vehicle with KM value 0");
            done();
        })
    });

    it("2.10: Should NOT create Vehicle with KM != integer", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00000000000008", "test" , {from: web3.eth.accounts[2], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Created vehicle with a string as KM value");
            done();
        })
    });

    it("2.11: Should NOT create Vehicle with KM equals more than 2^32. KM Overflow", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
                await HC.createVehicle("W0L00000000000009",  999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999, {from: web3.eth.accounts[2], gas: 6721975});     
            }
            catch (error){
                done();
            }
            assert(false, "Created vehicle with KM equals more than 2^32");
            done();
        })
    });

});

contract('3.x: Update KM', function(accounts) {

    it("3.1: Should update KM with permission level 2", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000001",  KMold, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(async function(){
            KMnew = 71;
            let result = await HC.updateKM("W0L20000000000001",  KMnew, {from: web3.eth.accounts[2], gas: 6721975}); 
            assert.web3Event(result, {
                event: 'updated',
                  args: {
                    fin: "0x57304c3230303030303030303030303031",
                    km: 71 ,
                    blocknummer: web3.eth.blockNumber
                }
              }, 'The event is emitted');
            done();
        })
    });

    it("3.2: Should update KM with permission level 1", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000002",  KMold, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(async function(){
            KMnew = 71;
            let result = await HC.updateKM("W0L20000000000002",  KMnew, {from: web3.eth.accounts[1], gas: 6721975}); 
            assert.web3Event(result, {
                event: 'updated',
                  args: {
                    fin: "0x57304c3230303030303030303030303032",
                    km: 71 ,
                    blocknummer: web3.eth.blockNumber
                }
              }, 'The event is emitted');
            done();
        })
    });    

    it("3.3: Should NOT update KM with permission level 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000003",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000003",  71, {from: web3.eth.accounts[0], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was update, but should not be updated");
            done();
        })
    });

    it("3.4: Should NOT update KM with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000004",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000004",  71, {from: web3.eth.accounts[3], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was update, but should not be updated");
            done();
        })
    });

    it("3.5: Should NOT update KM with permission level 4", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000005",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000005",  71, {from: web3.eth.accounts[4], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was update, but should not be updated");
            done();
        })
    });

    it("3.7: Should NOT update KM a FIN which is not registered", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;    
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000007",  10000000, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Updated KM of a not existing FIN");
            done();
        })
    });

    it("3.8: Should NOT update to KM = 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000008",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000008",  0, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Updated KM to 0");
            done();
        })
    });

    it("3.9: Should NOT update to a lower KM", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000009",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000009",  10, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Updated KM to a lower value");
            done();
        })
    });

    /*it("3.10: Should NOT update to a negative KM", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000010",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000010",  -10, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Updated KM to negative value");
            done();
        })
    });*/

    it("3.11: Should NOT update to a KM > 2^32", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000011",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000011",  999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Updated KM to an overflow value");
            done();
        })
    });

    /*it("3.12: Should NOT update KM with to less ether", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L20000000000012",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L20000000000012",  71, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM equal or lower");
            done();
        })
    });*/

});

contract('4.x: Get KM', function(accounts) {

    it("4.1: Should get KM value", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;
            HC.createVehicle("W0L00000000000401",  10, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(function(){
            return  HC.getKM("W0L00000000000401");
        }).then(function(result){
            assert.equal(result.valueOf(), 10, "Did not return KM Value for registered FIN");
            done();
        });
    });

    it("4.2: Should not Get KM value for not registered FIN", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;    
        }).then(async function(){
            try{
               await HC.getKM("W0L00000000000402",  10000000, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Returned KM Value for not registered FIN");
            done();
        });
    });
});

contract('5.x: Correct KM', function(accounts) {
    
    it("5.1: Should correct KM with permission level 2", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function(){
            KMold = 70;
            HC.createVehicle("W0L50000000000001",  KMold, {from: web3.eth.accounts[2], gas: 6721975});  
        }).then(async function() {
            KMnew = 69;
            let result = await HC.correctKM("W0L50000000000001",  KMnew, {from: web3.eth.accounts[2], gas: 6721975});
            assert.web3Event(result, {
                event: 'corrected',
                  args: {
                    fin: "0x57304c3530303030303030303030303031",
                    newValue: 69,
                    oldValue: 70,
                }
              }, 'The event is emitted');
            done();
        })
    });

    it("5.2: Should NOT correct KM with permission level 1", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000002",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000002", 69, {from: web3.eth.accounts[1], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.3: Should NOT correct KM with permission level 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000003",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000003", 69, {from: web3.eth.accounts[0], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.4: Should NOT correct KM with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000004",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000004", 69, {from: web3.eth.accounts[3], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.5: Should NOT correct KM with permission level 4", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000005",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000005", 69, {from: web3.eth.accounts[4], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.6: Should NOT correct KM with value <0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000006",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000006", -10, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.7:  Should NOT correct KM with value 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000007",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000007", 0, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

    it("5.8: Should NOT correct KM for not existing FIN", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            KMold = 70;
            HC.createVehicle("W0L50000000000008",  KMold, {from: web3.eth.accounts[2], gas: 6721975});       
        }).then(async function(){
            try{
               await HC.updateKM("W0L2000000000009", 69, {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "KM was corrected, but it should not be corrected");
            done();
        })
    });

});

contract('6.x: finExists', function(accounts) {

    it("6.1: Should get FIN for registered FIN", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;
            HC.createVehicle("W0L00000000000601",  10, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(function(){
            return  HC.FINexists("W0L00000000000601");
        }).then(function(result){
            assert(result, "FIN does not exist");
            done();
        });
    });

    it("6.2: Should not get FIN for not registered FIN", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;    
        }).then(function(){
               return HC.FINexists("W0L00000000066602");
        }).then(function(result){
            assert.equal(false, result, "Returned FIN for not registered FIN");
            done();
        })
    });    
});

contract('7.x: getBlocknumber', function(accounts) {

    it("7.1: Should get Blocknumber for registered FIN", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;
            HC.createVehicle("W0L00000000000701",  10, {from: web3.eth.accounts[2], gas: 6721975});
        }).then(function(){
            return  HC.getBlocknumber("W0L00000000000701");
        }).then(function(result){
            assert(result.valueOf(), "Blocknumber does not exist");
            done();
        });
    });

    it("7.2: Should not get Blocknumber for not registered FIN", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;    
        }).then(async function(){
            try{
               await HC.getBlocknumber("W0L00000000000702");
            }
            catch (error){
                done();
            }
            assert(false, "Returned Blocknumber for not registered FIN");
            done();
        })
    });
});

contract('8.x: Correct KM', function(accounts) {
    
    it("8.1: Should set TUEV permission with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            HC.setPermissionLevel(accounts[5], "0x02", {from: web3.eth.accounts[3], gas: 6721975});       
        }).then(function() {
            return HC.getPermissionLevel(accounts[5]);
        }).then(function(result) {
            assert.equal(result.valueOf(), "0x02", "Permission was not set");
            done();
        })
    });

    it("8.2: Should set Werkstatt permission with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            HC.setPermissionLevel(accounts[5], "0x01", {from: web3.eth.accounts[3], gas: 6721975});       
        }).then(function() {
            return HC.getPermissionLevel(accounts[5]);
        }).then(function(result) {
            assert.equal(result.valueOf(), "0x01", "Permission was not set");
            done();
        })
    });

    it("8.3: Should set FraudDetection permission with permission level 3", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function() {
            HC.setPermissionLevel(accounts[5], "0x04", {from: web3.eth.accounts[3], gas: 6721975});       
        }).then(function() {
            return HC.getPermissionLevel(accounts[5]);
        }).then(function(result) {
            assert.equal(result.valueOf(), "0x04", "Permission was not set");
            done();
        })
    });

    it("8.4: Should NOT set permission with permission level 2", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[5], "0x04", {from: web3.eth.accounts[2], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.5: Should NOT set permission with permission level 1", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[5], "0x04", {from: web3.eth.accounts[1], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.6: Should NOT set permission with permission level 0", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[5], "0x04", {from: web3.eth.accounts[0], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.7: Should NOT set permission with permission level 4", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[5], "0x04", {from: web3.eth.accounts[4], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.8: Should NOT set permission with permission level 4", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
            HC.setPermissionLevel(accounts[6], "0x03", {from: web3.eth.accounts[3], gas: 6721975});
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[6], "0x04", {from: web3.eth.accounts[6], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.9: Should NOT set wrong permission level 69", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(accounts[5], "0x69", {from: web3.eth.accounts[3], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.10: Should NOT set permission level for wrong FIN", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel(invalidAdresse, "0x04", {from: web3.eth.accounts[3], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

    it("8.11: Should NOT set permission level for to short FIN", function(done){
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(async function(){
            try{
               await HC.setPermissionLevel("Test", "0x04", {from: web3.eth.accounts[3], gas: 6721975});
            }
            catch (error){
                done();
            }
            assert(false, "Permission was set, but it should not be set");
            done();
        })
    });

});

contract('9.x: getPermissionlevel', function(accounts) {

    it("9.1: Should get Permissionlevel for Address", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;
        }).then(function(){
            return  HC.getPermissionLevel(accounts[1]);
        }).then(function(result){
            assert.equal(result.valueOf(), "0x01" , "Address does not exist");
            done();
        });
    });

    it("9.2: Should not get Permissionlevel for not valid Address", function(done) {
        HonestClock.deployed().then(function(instance){
            HC = instance;    
        }).then(async function(){
            try{
               await HC.getPermissionLevel(invalidAdress);
            }
            catch (error){
                done();
            }
            assert(false, "Returned Permissionlevel for not valid Address");
            done();
        })
    });
});
