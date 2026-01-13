//import walletAddress from "/env.js";

const auth = document.getElementById("auth");

document.getElementById("wallet-test-outcome").setAttribute("hidden","");

auth.addEventListener("click", (e) => {

const walletAddress = document.getElementById('addresstext').value    

if (e.target.id === "getEIP"){ // remove the \ from the fetch url if you wish to use it in reqbin/postman/insomnia
fetch(`https://hl-v2.\
pearprotocol.io/auth/eip712\
-message?\
address=${walletAddress}&clientId=APITRADER`, {
    method: 'GET',
    headers: {"Accept": "*/*"},})
    .then(res => res.json())
    .then(data =>{
console.log(data.message.action);
    if (data.message.action == "authenticate"){
        document.getElementById("wallet-test-outcome").removeAttribute("hidden","");
    }
    })



}




}
)





