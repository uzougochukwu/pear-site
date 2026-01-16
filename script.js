const auth = document.getElementById("auth");
const login = document.getElementById("login");

document.getElementById("wallet-test-outcome").setAttribute("hidden","");

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
            if (err) return console.log(err);
            if (result.error) return console.log(result.error)
            signature = result.result
            
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

    accessToken = data.accessToken;
    showPositions();
})
}
})

// get a list of open positions
const showPositions = async () => {
    
}