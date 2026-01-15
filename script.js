//import walletAddress from "/env.js";
//import web3 as ('web3');
//import { Web3 } from './node_modules/web3/dist/web3.min.js';
//const Web3 = require(["web3"])
//import { Web3 } from 'web3';
//import Web3 from 'web3'

//const { default: Connector } = require("@rabby-wallet/wc-core");
//const { Sign, sign } = require("crypto");
//import RabbyWcClient from '@rabby-wallet/wc-client';



//const { log } = require("console");


const auth = document.getElementById("auth");
const login = document.getElementById("login");

document.getElementById("wallet-test-outcome").setAttribute("hidden","");

var walletAddress="";
var timestamp = 0;
var signHash = "";
var message = "";
var signText = "";
var signature = "";

// getEIP712 message api call
auth.addEventListener("click", (e) => {

walletAddress = document.getElementById('addresstext').value    

if (e.target.id === "getEIP"){ // remove the \ from the fetch url if you wish to use it in reqbin/postman/insomnia
fetch(`https://hl-v2.\
pearprotocol.io/auth/eip712\
-message?\
address=${walletAddress}&clientId=SYSVIEW`, {
    method: 'GET',
    headers: {"Accept": "*/*"},})
    .then(res => res.json())
    .then(data =>{

    if (data.message.action == "authenticate"){
        document.getElementById("wallet-test-outcome").removeAttribute("hidden","");
        timestamp = data.timestamp;
        message = data.message;
        
        //connectRabbyWallet();
        //onSubmitWalletSign();// comment out connectRabbyWallet, then have onSubmitWalletSign do the POST /auth/login call
        eip712Sign();
        //wallet712sign();
    }
    // console.log(data, timestamp, walletAddress);
    //console.log(timestamp);
    
    })
}
}
)

// authenticate user
login.addEventListener("click", (e) => {

 const codeWalletSignature = document.getElementById('code-wallet-signature');

    if (e.target.id == "auth-login"){
fetch('https://hl-v2.pearprotocol.io/auth/login', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "method": "eip712",
        "address": walletAddress,
        "clientId": "SYSVIEW",
        "details": {
            "signature": codeWalletSignature.innerHTML,
            "timestamp": timestamp
        }
    })
}).then(res => res.json())
.then(data => {
   // console.log(data);
})
}
})


async function connectRabbyWallet() {
  if (window.ethereum && window.ethereum.isRabby) {
    try {
      // Request user authorization
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);
      //console.log(window.ethereum);
      //signHash = accounts[0].sign("Hello World", walletAddress);
      
    } catch (error) {
      console.error("Failed to connect to Rabby wallet:", error);
    }
  } else {
    console.error("Rabby wallet is not installed");
  }
}

const onSubmitWalletSign = async (event) => {
    console.group('onSubmitWalletSign');
    //event.preventDefault();

    // Retrieve message from input form with name "message"
    //const message = event.currentTarget.message.value;
    //console.log({ message });

    // Store the message in a global variable
    //MESSAGE = message;
   // console.log(typeof(message));
   // console.log(walletAddress);

    // Get the element we want to output the result 
    // of prompting the wallet for signature
    const codeWalletSignature = document.getElementById('code-wallet-signature');
    

    // Prompt wallet for signature
    try {
       // console.log(JSON.stringify(message));
        

        // Perform a personal sign with the original message and the wallet address
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [JSON.stringify(message), walletAddress] // check that the message is valid
         //     method: "eth_signTypedData_v4",
          //    params: [walletAddress, JSON.stringify(message)]
        });
        //console.log({ signature });
        //console.log(signature);
        //signText = signature;

        // Show the signature
        codeWalletSignature.innerHTML = signature;
        //SIGNATURE = signature;
        //console.log({ SIGNATURE });
        console.log(codeWalletSignature.innerHTML);
        
        
    } catch (error) {
        console.log({ error });
       // codeWalletSignature.innerHTML = error?.message ?? 'Unknown wallet signature error.'
    }

    console.groupEnd();
};

const eip712Sign = async () => {

   

    // message = {"address": "0xb414b76604b3708160df936ef20be497e24dd387", "clientId": "SYSVIEW", "timestamp": 1768492898, "action": "authenticate"}
    // message = "yh"
     console.log(JSON.stringify(message, null, 2))
    //console.log(walletAddress)
    //Web3.eth.signTypedData(message, walletAddress);
    
    web3.currentProvider.sendAsync(
        {
            method: "eth_signTypedData_v4",
            params: [walletAddress, JSON.stringify(message, null, 2)],
            from: walletAddress
        },
        function(err, result) {
            if (err) {
                //return console.error(err);
                console.log(err)
            }
            //console.log(result);
            
            // const signature = result.result.substring(2);
            // const r = "0x" + signature.substring(0,64);
            // const s = "0x" + signature.substring(64, 128);
            // const v = parseInt(signature.substring(128, 130), 16);
        }
    )
}

const wallet712sign = async () => {

    connector.signTypedData([walletAddress, message])
    .then(result => {
        console.log(result)
    })
    .catch(error => {
        console.error(error);
    })
}

