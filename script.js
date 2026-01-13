//import walletAddress from "/env.js";

const auth = document.getElementById("auth");
//const login = document.getElementById("login");

document.getElementById("wallet-test-outcome").setAttribute("hidden","");

var walletAddress="";
var timestamp = 0;
var signText = "testHello";

// getEIP712 message api call
auth.addEventListener("click", (e) => {

walletAddress = document.getElementById('addresstext').value    

if (e.target.id === "getEIP"){ // remove the \ from the fetch url if you wish to use it in reqbin/postman/insomnia
fetch(`https://hl-v2.\
pearprotocol.io/auth/eip712\
-message?\
address=${walletAddress}&clientId=APITRADER`, {
    method: 'GET',
    headers: {"Accept": "*/*"},})
    .then(res => res.json())
    .then(data =>{

    if (data.message.action == "authenticate"){
        document.getElementById("wallet-test-outcome").removeAttribute("hidden","");
        timestamp = data.timestamp;
        connectRabbyWallet();
    }
    console.log(data, timestamp, walletAddress);
    })
}
}
)

// authenticate user
// login.addEventListener("click", (e) => {

//     if (e.target.id == "auth-login"){
// fetch('https://hl-v2.pearprotocol.io/auth/login', {
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         "method": "eip712",
//         "address": walletAddress,
//         "clientId": "APITRADER",
//         "details": {
//             "signature": signText,
//             "timestamp": timestamp
//         }
//     })
// }).then(res => res.json())
// .then(data => {
//     console.log(data);
// })
// }
// })


async function connectRabbyWallet() {
  if (window.ethereum && window.ethereum.isRabby) {
    try {
      // Request user authorization
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);
      console.log(window.ethereum);
      
    } catch (error) {
      console.error("Failed to connect to Rabby wallet:", error);
    }
  } else {
    console.error("Rabby wallet is not installed");
  }
}





