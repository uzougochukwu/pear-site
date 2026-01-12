import walletAddress from "/env.js";

const auth = document.getElementById("auth");

auth.addEventListener("click", (e) => {

if (e.target.id === "getEIP"){ // remove the \ from the fetch url if you wish to use it in reqbin/postman/insomnia
    fetch(`https://hl-v2.\
pearprotocol.io/auth/eip712\
-message?\
address=${walletAddress}&clientId=APITRADER`, {
    method: 'GET',
    headers: {"Accept": "*/*"},})
}

}
)





