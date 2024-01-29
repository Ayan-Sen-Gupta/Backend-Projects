const myForm = document.querySelector('#my-form');
const messageInput = document.querySelector('#message');
let parentNode=document.getElementById('chat');
const createGroupButton = document.getElementById('creategroup');
const groupNameInput = document.querySelector('#groupname');
const addMembersButton = document.querySelector('#addmembers');
const createButton = document.querySelector('#create');
const addMembersCloseButton = document.querySelector('.addmembersclose');
const createGroupCloseButton = document.querySelector('.creategroupclose');
const addButton = document.querySelector('#add'); 
const addMemberInput = document.querySelector('#addmemberinput');

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
              
    let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
    parentNode.innerHTML=parentNode.innerHTML + childHTML;

}

  window.addEventListener('DOMContentLoaded', onPageLoading);

  async function onPageLoading(e){

    try{
    
       e.preventDefault();

       const token = localStorage.getItem('token'); 

      const response = await axios.get('http://localhost:3000/group/get-groups', {headers: {'Authorization': token} });
      console.log(response);
         
      for(let i=0;i<response.data.length;i++){ 
              showExistingGroupsOnScreen(response.data[i]);
          }
       
     const getMessages = async() => {
      try{
        let count=0;
        let oldMessages = JSON.parse(localStorage.getItem('oldmessage'));
        console.log(oldMessages);
        
    
        
       if(!oldMessages)
           oldMessages = [];
      else{
       parentNode.innerHTML = '';
       for(let i=0;i<oldMessages.length;i++){ 
        showOldMessageOnScreen(oldMessages[i]);
        count=count+1;
        }
  
      } 

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
                 
                    
        }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
        }

      } 
       
      const myInterval = setInterval(getMessages, 1000);

       if(myInterval==1)
        clearInterval(myInterval);

    }catch(err){
      console.log(err);
      document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
  }

 }

 function showExistingGroupsOnScreen(group){ 
  
  let parentNode=document.querySelector('.group-list');
  let childHTML=`<li id=${group.id}>${group.groupName}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}


 function showOldMessageOnScreen(message){ 

  let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}
       
     
function showNewMessageOnScreen(message){ 

  localStorage.setItem('lastid', message.id);
               
  let childHTML=`<li id=${message.id}>${message.userName} - ${message.message}</li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}

createGroupButton.addEventListener('click', openCreateGroupModal);
function openCreateGroupModal(e){
  e.preventDefault();
  const modal = document.getElementById('createGroupModal');
  modal.style.display = 'block';
}

createGroupCloseButton.addEventListener('click', closeCreateGroupModal);
function closeCreateGroupModal(e){
  e.preventDefault();
  const modal = document.getElementById('createGroupModal');
  modal.style.display = 'none';
}

addMembersButton.addEventListener('click', openAddMembersModal);
function openAddMembersModal(e){
  e.preventDefault();
  const modal = document.getElementById('addMembersModal');
  modal.style.display = 'block';
}

addMembersCloseButton.addEventListener('click', closeAddMembersModal);
function closeAddMembersModal(e){
  e.preventDefault();
  const modal = document.getElementById('addMembersModal');
  modal.style.display = 'none';
}

addButton.addEventListener('click', addMember);
async function addMember(e){
  try{
    e.preventDefault();

    let myObj={
      addmember: addMemberInput.value,
    };  

    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('groupid');
    const response = await axios.post(`http://localhost:3000/group/add-member/${groupId}`,myObj, {headers: {'Authorization': token} })
    console.log(response);
    
    }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }

   groupNameInput.value='';
}


createButton.addEventListener('click', onCreatingGroup);
async function onCreatingGroup(e) {
   
  try{
      e.preventDefault();

      let myObj={
        groupname: groupNameInput.value,
      };  
  
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3000/group/create-group",myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      showNewGroupOnScreen(response.data);
          
  
      }catch(err){
              console.log(err);
              document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
           }
  
     groupNameInput.value='';
  
  } 

  function showNewGroupOnScreen(group){ 

    let parentNode=document.querySelector('.group-list');
    let childHTML=`<li id=${group.id}>${group.groupName}</li>`;
    parentNode.innerHTML=parentNode.innerHTML + childHTML;
  
  }

