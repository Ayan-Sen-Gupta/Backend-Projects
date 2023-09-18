const myForm = document.querySelector('#my-form');
const itemNameInput = document.querySelector('#itemName'); 
const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const buyPremium = document.getElementById('razorpayButton');
const leaderBoard = document.getElementById('leaderboard');
const expenseReport = document.getElementById('expenseReport');


myForm.addEventListener('submit', onAddingExpense);

async function onAddingExpense(e){

  try{
  
    e.preventDefault();

        let myObj = {
            itemName:itemNameInput.value,
            amount: amountInput.value,
            description: descriptionInput.value,
            category: categoryInput.value
        }; 

        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3000/expense/add-expense",myObj, {headers: {'Authorization': token} })
         console.log(response.data);
              showExpenseOnScreen(response.data);
            
      }catch(err){
        console.log(err);
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            
         }
   

   //Clear fields
   itemNameInput.value='';
   amountInput.value='';
   descriptionInput.value='';
   categoryInput.value='Select';

} 

function showPremiumUserMessage(){
    buyPremium.style.visibility = 'hidden';
    document.getElementById('message').innerHTML='<div style="color:blue;position:absolute; top:20px; right:20px;">Premium Member</div>';

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
    
window.addEventListener('DOMContentLoaded', onPageLoading);

async function onPageLoading(e){
    try{
       e.preventDefault();

       const token = localStorage.getItem('token');
       const decodedToken = parseJwt (token);
       console.log(decodedToken);
       const premiumUser = decodedToken.premiumUser
       if(premiumUser){
          showPremiumUserMessage();
       }else{
          leaderBoard.style.visibility='hidden';
          expenseReport.style.visibility='hidden';
       }
         
       const response = await axios.get("http://localhost:3000/expense/get-expense", {headers: {'Authorization': token} })
        console.log(response);

        for(let i=0;i<response.data.length;i++){ 
                showExistingExpenseOnScreen(response.data[i]);
            }
                    
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
        }

}
   

function showExistingExpenseOnScreen(expense){ 
    let parentNode=document.getElementById('expenses');
    let childHTML=`<li id=${expense.id}>${expense.itemName} - Rs.${expense.expenseAmount} - ${expense.description} - ${expense.category}
                    <button onclick=editExpense(${expense.id},'${expense.itemName}',${expense.expenseAmount},'${expense.description}','${expense.category}')>Edit</button>
                    <button onclick=deleteExpense(${expense.id})>Delete</button></li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

        
   function showExpenseOnScreen(expense){ 
            
        let parentNode=document.getElementById('expenses');
        let childHTML=`<li id=${expense.id}>${expense.itemName} - Rs.${expense.expenseAmount} - ${expense.description} - ${expense.category}
                        <button onclick=editExpense(${expense.id},'${expense.itemName}',${expense.expenseAmount},'${expense.description}','${expense.category}')>Edit</button>
                        <button onclick=deleteExpense(${expense.id})>Delete</button></li>`;
        parentNode.innerHTML=parentNode.innerHTML+childHTML;
    }

    function removeExpenseFromScreen(expenseId){ 
        let parentNode = document.getElementById('expenses');
        let childNodeToBeDeleted= document.getElementById(expenseId);
        parentNode.removeChild(childNodeToBeDeleted);         
    }
        
    async function deleteExpense(expenseId){ 
        try{
           const token = localStorage.getItem('token');
           const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
            removeExpenseFromScreen(expenseId); 
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            }
        
}

    async function editExpense(expenseId,itemName,amount,description,category){
        try{ 
    
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
             removeExpenseFromScreen(expenseId); 

             itemNameInput.value=itemName;   
            amountInput.value=amount; 
            descriptionInput.value=description;
            categoryInput.value=category; 
      
    }catch(err){
        console.log(err);
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
    }
}

buyPremium.addEventListener('click', onBuyingPremium );

async function onBuyingPremium(e){
    try{
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/premium/buy-premium", {headers: {'Authorization': token} })
        console.log(response.data);
       
        var options = {
            "key": response.data.key_id, 
            "order_id": response.data.order.id, 

            "handler": async function(response){
                console.log(response);
                const res = await axios.post("http://localhost:3000/premium/transaction",{ 
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization" : token}})

              alert('Transaction Successful. You are a premium user now');

             showPremiumUserMessage();

             leaderBoard.style.visibility='visible';
             expenseReport.style.visibility='visible';

              localStorage.setItem('token', res.data.token);

           }
             
        }

        const razorpay = new Razorpay(options);
        razorpay.open();
        

        razorpay.on('payment.failed', async function(response){
            console.log(response);

            await axios.post("http://localhost:3000/premium/transaction",{ 
                    order_id: options.order_id,
                    payment_id: null
            }, { headers: {"Authorization" : token}})

            alert('Payment Failed');
    
            
          });

    }catch(err){
        console.log(err);
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;

    }

}

leaderBoard.addEventListener('click', showLeaderBoard );

async function showLeaderBoard(e){
    try{
        e.preventDefault();
 
        const token = localStorage.getItem('token'); 
        const response = await axios.get("http://localhost:3000/premium/leaderboard", {headers: {'Authorization': token} });
         console.log(response);
 
         for(let i=0;i<response.data.length;i++){ 
                 showPremiumUsers(response.data[i]);
             }
                     
         }catch(err){
             console.log(err);
             document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }
}

function showPremiumUsers(users){ 
            
    let parentNode=document.getElementById('premiumUsers');
    let childHTML=`<li>${users.name} - ${users.totalExpense}</li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

expenseReport.addEventListener('click', downloadExpenseReport );

async function downloadExpenseReport(e){
    try{
        e.preventDefault();
 
        const token = localStorage.getItem('token'); 
        const response = await axios.get("http://localhost:3000/premium/expense-report", {headers: {'Authorization': token} });

       var anchorTag = document.createElement("a");
       anchorTag.href = response.data.fileUrl;
       anchorTag.download = "myexpense.csv";
       anchorTag.click();
                     
         }catch(err){
             console.log(err);
             document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }
}

