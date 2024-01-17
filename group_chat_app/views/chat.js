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

  
   function onPageLoading(e){
    
       e.preventDefault();
       

     const getMessages = async() => {
      try{
        let count=0;
        let oldMessages = JSON.parse(localStorage.getItem('oldmessage'));
        console.log(oldMessages);

       if(!oldMessages)
           oldMessages = [];
      else{

       for(let i=0;i<oldMessages.length;i++){ 
        showOldMessageOnScreen(oldMessages[i]);
        count=count+1;
        }
      } 

       const token = localStorage.getItem('token'); 
       let id = localStorage.getItem('lastid');
       if(!id)
         id=0;
              
        const response = await axios.get(`http://localhost:3000/chat/get-message?lastmessageid=${id}`, {headers: {'Authorization': token} })
         
       console.log(response);

        for(let i=0;i<response.data.length;i++){ 
                showNewMessageOnScreen(response.data[i]);
                count=count+1;
            }


            if(!response.data){
                stringifiedOldMessages = JSON.stringify(oldMessages);
            }
            else{
              oldMessages.push(...response.data);
              stringifiedOldMessages = JSON.stringify(oldMessages);
    
            }
            
            
        
            if(count>10){
              oldMessages.splice(0, count-10);
              stringifiedOldMessages = JSON.stringify(oldMessages);
              console.log(stringifiedOldMessages);
          
            }            
            
            localStorage.setItem('oldmessage', stringifiedOldMessages);
            localStorage.setItem('numberofmessages', count);
            parentNode.innerHTML='';
            
          
                    
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
        }

      } 
       
      const myInterval = setInterval(getMessages, 1000);

       if(myInterval==1)
        clearInterval(myInterval);

 }

 

 
 function showOldMessageOnScreen(message){ 
  
  let parentNode=document.getElementById('chat');
  let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}
       
     
function showNewMessageOnScreen(message){ 

  localStorage.setItem('lastid', message.id);
               
  let parentNode=document.getElementById('chat');
  let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}