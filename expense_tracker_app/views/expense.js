const myForm = document.querySelector('#my-form');
const itemNameInput = document.querySelector('#itemName'); 
const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');

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
        const response = await axios.post("http:localhost:3000/expense/add-expense",myObj, {headers: {'Authorization': token} })
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
    
window.addEventListener('DOMContentLoaded', onPageLoading);

async function onPageLoading(e){
    try{
       e.preventDefault();

       const token = localStorage.getItem('token');
       const response = await axios.get("http:localhost:3000/expense/get-expense", {headers: {'Authorization': token} })
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
           const response = await axios.delete(`http:localhost:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
            removeExpenseFromScreen(expenseId); 
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            }
        
}

    async function editExpense(expenseId,itemName,amount,description,category){
        try{ 
    
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http:localhost:3000/expense/delete-expense/${expenseId}`, {headers: {'Authorization': token} })
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