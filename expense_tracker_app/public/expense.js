const myForm = document.querySelector('#my-form');
const itemNameInput = document.querySelector('#itemName'); 
const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const buyPremium = document.getElementById('razorpayButton');
const leaderBoard = document.getElementById('leaderboard');
const expenseReport = document.getElementById('expenseReport');
const pagination = document.querySelector('.pagination');
const rowsPerPage = document.getElementById('rows');


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
        const response = await axios.post("http://54.253.203.18:3000/expense/add-expense",myObj, {headers: {'Authorization': token} })
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

function showExpenseOnScreen(expense){ 
              
    let parentNode=document.getElementById('expenses');
    let childHTML=`<li id=${expense.id}>${expense.itemName} - Rs.${expense.expenseAmount} - ${expense.description} - ${expense.category}
                    <button onclick=editExpense(${expense.id},'${expense.itemName}',${expense.expenseAmount},'${expense.description}','${expense.category}')>Edit</button>
                    <button onclick=deleteExpense(${expense.id})>Delete</button></li>`;
    parentNode.innerHTML=childHTML + parentNode.innerHTML;

    let sentItemsPerPage = localStorage.getItem('sentItemsPerPage');
    let rows = localStorage.getItem('rows');
    if(sentItemsPerPage==rows){
       let lastExpenseOfPage = parentNode.lastElementChild;
        parentNode.removeChild(lastExpenseOfPage);
    }
}


window.addEventListener('DOMContentLoaded', onPageLoading);
async function onPageLoading(e){
    try{
       e.preventDefault();

       const token = localStorage.getItem('token');
       const decodedToken = parseJwt (token);
       const premiumUser = decodedToken.premiumUser
       if(premiumUser){
          showPremiumUserMessage();
       }else{
          leaderBoard.style.visibility='hidden';
          expenseReport.style.visibility='hidden';
          
       }

       const page=1;
       localStorage.setItem('page', page);
       let rows = localStorage.getItem('rows');
       if(!rows){
           rows = 5;
           localStorage.setItem('rows', rows);
       }

       const response = await axios.get(`http://54.253.203.18:3000/expense/get-expense?page=${page}&rows=${rows}`, {headers: {'Authorization': token} })
       console.log(response);
       localStorage.setItem('sentItemsPerPage', response.data.sentItemsPerPage);

        for(let i=0;i<response.data.expenses.length;i++){ 
                showExistingExpenseOnScreen(response.data.expenses[i]);
            }

            showPagination(response.data);
                    
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
        }

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumUserMessage(){
    buyPremium.style.visibility = 'hidden';
    document.getElementById('message').innerHTML='<div style="color:blue;position:absolute; top:20px; right:20px;">Premium Member</div>';

}

function showExistingExpenseOnScreen(expense){ 
    let parentNode=document.getElementById('expenses');
    let childHTML=`<li id=${expense.id}>${expense.itemName} - Rs.${expense.expenseAmount} - ${expense.description} - ${expense.category}
                    <button onclick=editExpense(${expense.id},'${expense.itemName}',${expense.expenseAmount},'${expense.description}','${expense.category}')>Edit</button>
                    <button onclick=deleteExpense(${expense.id})>Delete</button></li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

function showPagination({previousPage,currentPage, nextPage, hasPreviousPage, hasNextPage, lastPage}){
         pagination.innerHTML = '';

         if(hasPreviousPage){
             const button1 = document.createElement('button');
             button1.innerHTML = previousPage;
             button1.addEventListener('click', () => getExpenses(previousPage));
             pagination.appendChild(button1);
         }

         const button2 = document.createElement('button');
             button2.innerHTML = `<h6>${currentPage}</h6>`;
             button2.addEventListener('click', () => getExpenses(currentPage));
             pagination.appendChild(button2);

        if(hasNextPage && nextPage<lastPage){
            const button3 = document.createElement('button');
             button3.innerHTML = nextPage;
             button3.addEventListener('click', () => getExpenses(nextPage));
             pagination.appendChild(button3);
        }
        

        if(hasNextPage && nextPage<(lastPage-1)){
            const button4 = document.createElement('button');
            button4.innerHTML = '...';
            pagination.appendChild(button4);
           }
        
  
        if(+currentPage<lastPage){
             const button5 = document.createElement('button');
             button5.innerHTML = lastPage;
             button5.addEventListener('click', () => getExpenses(lastPage));
             pagination.appendChild(button5);
        }
        
}

async function getExpenses(page){
     try{
        let parentNode=document.getElementById('expenses');
        parentNode.innerHTML = '';

        const token = localStorage.getItem('token'); 
        localStorage.setItem('page', page);
        const rows = localStorage.getItem('rows');
        const response = await axios.get(`http://54.253.203.18:3000/expense/get-expense?page=${page}&rows=${rows}`, {headers: {'Authorization': token} })
        console.log(response);

        for(let i=0;i<response.data.expenses.length;i++){ 
            showExistingExpenseOnScreen(response.data.expenses[i]);
        }
 
             showPagination(response.data);
                     
         }catch(err){
             console.log(err);
             document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }
        }

        
    async function deleteExpense(expenseId){ 
        try{
           const token = localStorage.getItem('token');
           const response = await axios.delete(`http://54.253.203.18:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
            removeExpenseFromScreen(expenseId); 
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            }
        
}


    async function editExpense(expenseId,itemName,amount,description,category){
        try{ 
    
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://54.253.203.18:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
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

function removeExpenseFromScreen(expenseId){ 
    let parentNode = document.getElementById('expenses');
    let childNodeToBeDeleted= document.getElementById(expenseId);
    parentNode.removeChild(childNodeToBeDeleted);         
}


buyPremium.addEventListener('click', onBuyingPremium );
async function onBuyingPremium(e){
    try{
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        const response = await axios.get("http://54.253.203.18:3000/premium/buy-premium", {headers: {'Authorization': token} })
        console.log(response.data);
       
        var options = {
            "key": response.data.key_id, 
            "order_id": response.data.order.id, 

            "handler": async function(response){
                console.log(response);
                const res = await axios.post("http://54.253.203.18:3000/premium/transaction",{ 
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

            await axios.post("http://54.253.203.18:3000/premium/transaction",{ 
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
        const response = await axios.get("http://54.253.203.18:3000/premium/leaderboard", {headers: {'Authorization': token} });
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
        const response1 = await axios.get("http://54.253.203.18:3000/premium/download-expense-report", {headers: {'Authorization': token} });
        console.log(response1);

       var link = document.createElement("a");
        link.href = response1.data.fileUrl;
        link.download = "myexpense.csv";
        link.click();

        var parentNode = document.getElementById('downloadReport');
        parentNode.innerHTML = '<h4 class="title" style="text-align: left;color:blueviolet">Downloaded Expense Report: </h4>'

        showDownloadedLink(response1.data);
 

        const response2 = await axios.get("http://54.253.203.18:3000/premium/downloaded-expense-reports", {headers: {'Authorization': token} });
        console.log(response2);
        for(let i=0; i<response2.data.expenseReports.length;i++){
            showExistingDownloadedLink(response2.data.expenseReports[i]);
        }
                 
         }catch(err){
             console.log(err);
             document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }
}

function showDownloadedLink(link){ 
            
    let parentNode=document.getElementById('downloadReport');
    let childHTML=`<li>Date - ${new Date()}} -> Link - ${link.fileUrl}</li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;

    let sentItemsPerPage = localStorage.getItem('sentItemsPerPage');
    let rows = localStorage.getItem('rows');
    if(sentItemsPerPage==rows){
       let lastDownloadedLinkOfPage = parentNode.lastElementChild;
        parentNode.removeChild(lastDownloadedLinkOfPage);
    }
}

function showExistingDownloadedLink(link){

    let parentNode=document.getElementById('downloadReport');
    let childHTML=`<li>Date - ${link.createdAt} -> Link - ${link.fileUrl} </li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;

}


rowsPerPage.addEventListener('change', getRowsPerPage);
async function getRowsPerPage(){
   
    const page = localStorage.getItem('page');
    localStorage.setItem('rows', rowsPerPage.value);
    getExpenses(page);
}

