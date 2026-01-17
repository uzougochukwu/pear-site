const auth = document.getElementById("auth");
const login = document.getElementById("login");

document.getElementById("wallet-test-outcome").setAttribute("hidden","");

document.getElementById("invalid-address").setAttribute("hidden", "");

document.getElementById("sneaky-metamask").setAttribute("hidden", "");

document.getElementById("cancel-signature").setAttribute("hidden", "");

document.getElementById("same-timestamp").setAttribute("hidden", "");

document.getElementById("sign-in-error").setAttribute("hidden", "");

// setting up positions variable so we can clear out the positions and update them when the user closes one
//const positions = document.querySelectorAll(".position"); // we use querySelectorAll because if we use getElementsByClassName the result has to be converted to an array before calling forEach()
//const positions = Array.from(document.getElementsByClassName("position"));
var positions = document.getElementById("position");

var walletAddress="";
var timestamp = 0;
var signHash = "";
var message = "";
var signText = "";
var signature = "";
var chainNum = "";
var accessToken = "";

// getEIP712 message 
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

        timestamp = data.timestamp;
        message = data.message;
        chainNum = data.domain.chainId

        console.log(data)

        clearUpErrorMessagesBeneathConfirmButton();

        eip712Sign();

    }

    
    })
}
}
)

// sign the eip712 message
const eip712Sign = async () => {


const web3 = new Web3(window.ethereum);

const chainId = chainNum;

    // eip-712 typed data structure

    const data = JSON.stringify({
        domain: {
            name: 'Pear Protocol',
            version: '1',            
            chainId: chainId,
            verifyingContract: '0x0000000000000000000000000000000000000001'
        },
        message: {
            address: document.getElementById('addresstext').value, 
            clientId: 'SYSVIEW',
            timestamp: parseInt(timestamp),
            action: 'authenticate'
        },
        primaryType: 'Authentication',
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Authentication: [
                { name: 'address', type: 'address' },
                { name: 'clientId', type: 'string' },
                { name: 'timestamp', type: 'uint256' },
                { name: 'action', type: 'string'},
            ]
        }
    })

    web3.currentProvider.sendAsync(
        {
            method: "eth_signTypedData_v4",
            params: [walletAddress, data],
            from: walletAddress
        },
        function(err, result) {
            if (err) {
                 //-32602 means invalid wallet address
                 // 4100 means account not authorised
                 // 4001 means user cancelled

                switch(err.code){
                    case -32602:
                    document.getElementById("invalid-address").removeAttribute("hidden", "");
                    break;

                    case 4100:
                    document.getElementById("sneaky-metamask").removeAttribute("hidden", "");
                    break;

                    case 4001:
                    document.getElementById("cancel-signature").removeAttribute("hidden", "");
                    break;
                }

                return console.log(err);
            }
            //if (result.error) return console.log(result.error)
            console.log(result)
            signature = result.result
            if (signature == ""){
                // display message telling user to start all over again, and make sure you sign in to rabby wallet 
                document.getElementById("sign-in-error").removeAttribute("hidden", "");
            }

            document.getElementById("cancel-signature").setAttribute("hidden", "");
            document.getElementById("wallet-test-outcome").removeAttribute("hidden","");
            console.log(signature)    
        }
    )

}

// authenticate user, using eip712 signature
login.addEventListener("click", (e) => {


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
            "signature": signature,
            "timestamp": timestamp
        }
    })
}).then(res => res.json())
.then(data => {
    console.log(data)
    if (data.message == "Timestamp already used"){
        document.getElementById("same-timestamp").removeAttribute("hidden", "")
    }
    accessToken = data.accessToken;
    getPositions();
})
.catch(error => {
    //console.log(error.message)
})
}
})

//get a list of processed positions
const getPositions = async () => {
    fetch('https://hl-v2.pearprotocol.io/positions', {
    method: 'GET', 
    headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "*/*"
    },
})
.then(res => res.json())
.then(data => {
console.log(data)
showPositions(data);
})
.catch(error => {

})
}

// close entire position
 window.closeEntirePos = function(positionID){
    console.log("entered closeEntirePos func")
 fetch(`https://hl-v2.pearprotocol.io\
/positions/\
${positionID}\
/close`, {
    method: 'POST'
,
headers: {
"Authorization": `Bearer ${accessToken}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
    "executionType": "MARKET"
})
})
.then(res => res.json())
.then(data => {
    console.log(data)
    
    // need to clear out previous positions before updating them
    clearPositions();

    // update positions
    //getPositions();
})
.catch(error => {
    console.log(error)
})
}


// clear positions
const clearPositions = async () => {

    console.log("in clear pos func");

    document.getElementById("position").setAttribute("hidden", "")

    //positions.parentNode.removeChild(positions);
// positions.forEach(position => {
    //positions.remove();
// })

}
 

// clear error messages below confirm button, if user successfully confirms wallet address
const clearUpErrorMessagesBeneathConfirmButton = async () => {
    document.getElementById("invalid-address").setAttribute("hidden", "");
    document.getElementById("sneaky-metamask").setAttribute("hidden", "");
    
}

//const clearUpErrorMessagesBeneathLoginButton
const clearUpErrorMessagesBeneathLoginButton = async () => {
    document.getElementById("same-timestamp").removeAttribute("hidden", "");
}