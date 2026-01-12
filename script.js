import walletAddress from "/env.js";

function getEIP712Message(){
    fetch(`https://hl-v2.pearprotocol.io/auth/eip712-message?address=${walletAddress}&clientId=APITRADER`, {
     method: 'GET',
     headers: {
         "Accept": "*/*"
     },
})
}

const EIPdata = getEIP712Message();


