const myForm = document.querySelector('#my-form');
const messageInput = document.querySelector('#message');

myForm.addEventListener('submit', onSendingMessage);

async function onSendingMessage(e) {
   
  try{
      e.preventDefault();

      let myObj={
        message: messageInput.value,
      };  
  
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3000/chat/send-message",myObj, {headers: {'Authorization': token} })
      console.log(response);
      showMessageOnScreen(response.data);
          
  
      }catch(err){
              console.log(err);
              document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
           }
  
     messageInput.value='';
  
  } 

  function showMessageOnScreen(message){ 
              
    let parentNode=document.getElementById('chat');
    let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
    parentNode.innerHTML=parentNode.innerHTML + childHTML;

}

  window.addEventListener('DOMContentLoaded', onPageLoading);
async function onPageLoading(e){
    try{
       e.preventDefault();

       const token = localStorage.getItem('token');
       const response = await axios.get("http://localhost:3000/chat/get-message", {headers: {'Authorization': token} })
       console.log(response);

        for(let i=0;i<response.data.length;i++){ 
                showExistingMessageOnScreen(response.data[i]);
            }

                    
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
        }

}

function showExistingMessageOnScreen(message){ 
              
  let parentNode=document.getElementById('chat');
  let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}