import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";

const STATE = [
    'Harvested',  // 0
    'Processed',  // 1
    'Packed',     // 2
    'ForSale',    // 3
    'Sold',       // 4
    'Shipped',    // 5
    'Received',   // 6
    'Purchased'   // 7
]

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;
    
        try {
          // get contract instance
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = supplyChainArtifact.networks[networkId];
          this.meta = new web3.eth.Contract(
            supplyChainArtifact.abi,
            deployedNetwork.address,
          );
          console.log("this.meta==", this.meta)
    
          // get accounts
          const accounts = await web3.eth.getAccounts();
          this.account = accounts[0];
        } catch (error) {
          console.error("Could not connect to contract or chain.");
        }
      },

    havestItem: async function(){
      const { harvestItem } = this.meta.methods;
      const { Harvested } = this.meta.events;
      const upc = parseInt(document.getElementById("harvest_upcId").value);
      const farmerId = document.getElementById("harvest_farmerId").value;
      const farmerName = "test farmer";
      const originFarmInformation = "";
      const originFarmLatitude = "";
      const originFarmLongitude = "";
      const productNotes = "";

      await harvestItem(upc, farmerId, farmerName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
    };
      Harvested(options).on('data', event => alert("Havest done!"))
      
    },

    processItem: async function(){
      const { processItem } = this.meta.methods;
      const { Processed } = this.meta.events;
      const upc = parseInt(document.getElementById("process_upcId").value);

      await processItem(upc).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Processed(options).on('data', event => alert("Process done!"))
      
    },

    packItem: async function(){
      const { packItem } = this.meta.methods;
      const { Packed } = this.meta.events;
      const upc = parseInt(document.getElementById("pack_upcId").value);

      await packItem(upc).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Packed(options).on('data', event => alert("Pack done!"))
      
    },

    saleItem: async function(){
      const { sellItem } = this.meta.methods;
      const { ForSale } = this.meta.events;
      const upc = parseInt(document.getElementById("forSale_upcId").value);
      const price = parseInt(document.getElementById('forSale_price').value);

      await sellItem(upc, price).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      ForSale(options).on('data', event => alert("ForSale done!"))
      
    },

    buyItem: async function(){
      const { buyItem } = this.meta.methods;
      const { Sold } = this.meta.events;
      const upc = parseInt(document.getElementById("buy_upcId").value);
      const price = parseInt(document.getElementById('buy_price').value);

      await buyItem(upc).send({from: this.account, value: price});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Sold(options).on('data', event => alert("Buy done!"))
      
    },

    shipItem: async function(){
      const { shipItem } = this.meta.methods;
      const { Shipped } = this.meta.events;
      const upc = parseInt(document.getElementById("ship_upcId").value);

      await shipItem(upc).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Shipped(options).on('data', event => alert("Ship done!"))
      
    },
    
    receiveItem: async function(){
      const { receiveItem } = this.meta.methods;
      const { Received } = this.meta.events;
      const upc = parseInt(document.getElementById("receive_upcId").value);

      await receiveItem(upc).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Received(options).on('data', event => alert("Receive done!"))
      
    },

    purchaseItem: async function(){
      const { purchaseItem } = this.meta.methods;
      const { Purchased } = this.meta.events;
      const upc = parseInt(document.getElementById("purchase_upcId").value);

      await purchaseItem(upc).send({from: this.account});

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };
      Purchased(options).on('data', event => alert("Receive done!"))
      
    },

    modifyRole: async function(methodName, inputId){
      console.log([methodName, inputId])
      const updateRoleMethod= this.meta.methods[methodName];
      const { addRole, removeRole } = this.meta.events;
      const address = document.getElementById(inputId).value;

      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };

      if(methodName.indexOf('renounce')==0){
        await updateRoleMethod().send({from: this.account});
        removeRole(options).on('data', event => alert("Remove done!"));
      }
      else{
        await updateRoleMethod(address).send({from: this.account});
        addRole(options).on('data', event => alert("Add done!"));
      }
      
    },

    fetch: async function(){
      const { fetchItemBufferOne, fetchItemBufferTwo } = this.meta.methods;
      const upc = parseInt(document.getElementById("fetch_upc").value);

      let resultOne, resultTwo;
      await Promise.all([
        fetchItemBufferOne(upc).call(),
        fetchItemBufferTwo(upc).call(),
      ]).then(res => {
        console.log(res)
        resultOne = res[0];
        resultTwo = res[1];
      })

      const itemData = document.getElementById("itemData");
      itemData.innerHTML = `
        <td style="border: 1px solid; text-align: center;">${resultOne[1]}</td>
        <td style="border: 1px solid; text-align: center;">${resultOne[0]}</td>
        <td style="border: 1px solid; text-align: center;">${resultTwo[2]}</td>
        <td style="border: 1px solid; text-align: center;">${resultTwo[4]}</td>
        <td style="border: 1px solid; text-align: center;">${resultOne[2]}</td>
        <td style="border: 1px solid; text-align: center;">${STATE[resultTwo[5]]}</td>
      `;
    }

    // <tr>
    // <th style="border: 1px solid">upc</th>
    // <th style="border: 1px solid">sku</th>
    // <th style="border: 1px solid">Product Id</th>
    // <th style="border: 1px solid">Price</th>
    // <th style="border: 1px solid">owner</th>
    // <th style="border: 1px solid">state</th>
}

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3bc0da104e35493bb779e24ea2da361e"),);
  }

  App.start();
});