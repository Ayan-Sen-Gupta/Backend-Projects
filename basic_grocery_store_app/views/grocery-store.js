const myForm = document.querySelector('#my-form');
const itemNameInput = document.querySelector('#itemName'); 
const descriptionInput = document.querySelector('#description');
const priceInput = document.querySelector('#price');
const quantityInput = document.querySelector('#quantity');

myForm.addEventListener('submit', onAddingItem);

async function onAddingItem(e){
  try{
    e.preventDefault();

        let myObj = {
            itemName:itemNameInput.value,
            description: descriptionInput.value,
            price: priceInput.value,
            quantity: quantityInput.value
        }; 

        const response = await axios.post("http:localhost:3000/",myObj)

        console.log(response);
        showItemOnScreen(response.data);
      }catch(err){
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
            console.log(err);
         }
         
   //Clear fields
   itemNameInput.value='';
   descriptionInput.value='';
   priceInput.value='';
   quantityInput.value='';

} 
    
window.addEventListener('DOMContentLoaded', onPageLoading);

async function onPageLoading(e){
  try{
    e.preventDefault();

    const response = await axios.get("http:localhost:3000/")

    console.log(response);
        for(let i=0;i<response.data.length;i++){ 
                showExistingItemOnScreen(response.data[i]);
            }
                    
    }catch(err){
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
            console.log(err);
        }

}
   

function showExistingItemOnScreen(item){ 
    let parentNode=document.getElementById('itemList');
    let childHTML=`<li id=${item.id}>${item.itemName} - ${item.description} - Rs.${item.price} - ${item.quantity}
                    <button onclick=buyOne(${item.id},'${item.itemName}','${item.description}',${item.price},${item.quantity})>Buy 1</button>
                    <button onclick=buyTwo(${item.id},'${item.itemName}','${item.description}',${item.price},${item.quantity})>Buy 2</button>
                    <button onclick=buyThree(${item.id},'${item.itemName}','${item.description}',${item.price},${item.quantity})>Buy 3</button>
                    <button onclick=deleteItem(${item.id})>Delete</button></li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

        
   function showItemOnScreen(item){ 
            
    let parentNode=document.getElementById('itemList');
    let childHTML=`<li id=${item.id}>${item.itemName} - ${item.description} - Rs.${item.price} - ${item.quantity}
                    <button onclick=buyOne(${item.id},'${item.itemName}','${item.description}',${item.price},'${item.quantity}')>Buy 1</button>
                    <button onclick=buyTwo(${item.id},'${item.itemName}','${item.description}',${item.price},'${item.quantity}')>Buy 2</button>
                    <button onclick=buyThree(${item.id},'${item.itemName}','${item.description}',${item.price},'${item.quantity}')>Buy 3</button>
                    <button onclick=deleteItem(${item.id})>Delete</button></li>`;
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
    }

    function removeItemFromScreen(itemId){ 
        let parentNode = document.getElementById('itemList');
        let childNodeToBeDeleted= document.getElementById(itemId);
        parentNode.removeChild(childNodeToBeDeleted);         
    }
        
   async function deleteItem(itemId){
    try{ 

        const response = await axios.delete(`http:localhost:3000/delete-item/${itemId}`)
        removeItemFromScreen(itemId); 
    }catch(err){
              document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
              console.log(err);
            }
        
}

    async function buyOne(itemId,itemName,description,price,quantity){
      try{
      
           itemNameInput.value=itemName;   
           descriptionInput.value=description;
           priceInput.value=price; 
           quantityInput.value=quantity-1;  
    

            let updatedObj = {
               quantity: quantityInput.value
              }

             //Clear fields
            itemNameInput.value='';
            descriptionInput.value='';
            priceInput.value='';
            quantityInput.value='';
  

            const response = await axios.put(`http:localhost:3000/buy/${itemId}`,updatedObj)
        
                removeItemFromScreen(itemId);
                showItemOnScreen(response.data);
            }catch(err){
    document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
    console.log(err);
  }
}

     async function buyTwo(itemId,itemName,description,price,quantity){
      
      try{
      
        itemNameInput.value=itemName;   
        descriptionInput.value=description;
        priceInput.value=price; 
        quantityInput.value=quantity-2;  
 

         let updatedObj = {
            quantity: quantityInput.value
           }

          //Clear fields
         itemNameInput.value='';
         descriptionInput.value='';
         priceInput.value='';
         quantityInput.value='';


         const response = await axios.put(`http:localhost:3000/buy/${itemId}`,updatedObj)
     
             removeItemFromScreen(itemId);
             showItemOnScreen(response.data);
         }catch(err){
             document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
             console.log(err);
           }
}

async function buyThree(itemId,itemName,description,price,quantity){
  try{
      
    itemNameInput.value=itemName;   
    descriptionInput.value=description;
    priceInput.value=price; 
    quantityInput.value=quantity-3;  


     let updatedObj = {
        quantity: quantityInput.value
       }

      //Clear fields
     itemNameInput.value='';
     descriptionInput.value='';
     priceInput.value='';
     quantityInput.value='';


     const response = await axios.put(`http:localhost:3000/buy/${itemId}`,updatedObj)
 
         removeItemFromScreen(itemId);
         showItemOnScreen(response.data);
     }catch(err){
          document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
           console.log(err);
     }
}
      