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
          
  
      }catch(err){
              console.log(err);
              document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
           }
  
     messageInput.value='';
  
  } 