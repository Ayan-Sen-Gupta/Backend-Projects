
const myForm = document.querySelector('#my-form');
const createGroupForm = document.querySelector('#creategroupform'); 
const inviteMemberForm = document.querySelector('#invitememberform');
const adminTaskForm = document.querySelector('#admintaskform');

const createGroupModal = document.getElementById('creategroupmodal');
const inviteMemberModal = document.getElementById('invitemembermodal');
const adminTaskModal = document.getElementById('admintaskmodal');


const createGroupButton = document.getElementById('creategroup');
const adminTaskButton = document.querySelector('#admin');
const createGroupCloseButton = document.querySelector('.creategroupclose');
const inviteMemberCloseButton = document.querySelector('.invitememberclose');
const adminTaskCloseButton = document.querySelector('.admintaskclose');
const makeAdminButton = document.getElementById('makeadminbutton');
const addUserButton = document.getElementById('adduserbutton');
const removeUserButton = document.getElementById('removeuserbutton');

const messageInput = document.querySelector('#message');
const createGroupNameInput = document.querySelector('#creategroupname');
const inviteMemberEmailInput = document.querySelector('#invitememberemail');
const memberNameInput = document.querySelector('#membername');
const adminTaskEmailInput = document.querySelector('#admintaskemail');


let parentNode = document.getElementById('chat');
let titleParentNode = document.getElementById('title');


myForm.addEventListener('submit', onSendingMessage);

async function onSendingMessage(e) {
   
  try{
      e.preventDefault();

      let myObj={
        message: messageInput.value,
      };  
  
      let groupId = localStorage.getItem('groupid');
      if(!groupId)
        groupId=0;

        const token = localStorage.getItem('token'); 
        const socket = io('http://localhost:3000', {auth: { token: token} });
   
   
            socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`);  
            
            socket.emit('send-message', myObj, groupId);
   
        });
   
        
   
         socket.on('received-message', data => {
   
         console.log(data);

        if(!data)
          alert('The message could not be sent');

          showMessageOnScreen(data);
         });
  
          
  
      }catch(err){
              console.log(err);
              alert('Message was not sent');

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

       const email = localStorage.getItem('email');
       
       await getTitle();
       await getGroups();
       await getMessages();

    }catch(err){
      console.log(err);
      document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
  }

 }

 async function getGroups(){
 try{
  const token = localStorage.getItem('token'); 
  const response = await axios.get('http://localhost:3000/group/get-groups', {headers: {'Authorization': token} });
  console.log(response);
     
  for(let i=0;i<response.data.length;i++){ 
          showExistingGroupsOnScreen(response.data[i]);
      }
  
    }catch(err){
      console.log(err);
      document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
  }

 }

 function showExistingGroupsOnScreen(group){ 
  
  let parentNode=document.querySelector('.group-list');
  let childHTML=`<li id=${group.id}>${group.groupName}
                       <button id="opengroup" class="btn btn-outline-dark" onclick=openGroup(${group.id})>Open</button>
                       <button id="invitemember" class="btn btn-outline-dark" onclick=openInviteMemberModal(${group.id})>Invite</button></li>`;
  parentNode.innerHTML=parentNode.innerHTML + childHTML;

}

async function getMessages(){
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
  
let groupId = localStorage.getItem('groupid');
 if(!groupId)
     groupId=0;
    

    const token = localStorage.getItem('token'); 
  const response = await axios.get(`http://localhost:3000/chat/get-message/${groupId}?lastmessageid=${id}`, {headers: {'Authorization': token} })
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
  
  createGroupModal.style.display = 'block';
}

createGroupCloseButton.addEventListener('click', closeCreateGroupModal);
function closeCreateGroupModal(e){
  e.preventDefault();
  
  createGroupModal.style.display = 'none';
}

createGroupForm.addEventListener('submit', onCreatingGroup);
async function onCreatingGroup(e) {
   
  try{
      e.preventDefault();

      let myObj={
        groupname: createGroupNameInput.value,
      };  
  
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3000/group/create-group",myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      alert(`${response.data.message}`);
      
      showNewGroupOnScreen(response.data.groupData);

      const response1 = await axios.post("http://localhost:3000/group/add-groupowner", myObj, {headers: {'Authorization': token} })
      console.log(response1);

      storeNewJoiningMessage(response1.data);

          
  
      }catch(err){
              console.log(err);
              alert(`${err.response.data.error}`);
           }
  
     createGroupNameInput.value='';
  
  } 

  async function storeNewJoiningMessage(message){
    
    const groupId = message.userGroupData.groupId;

    let myObj = {
        message: message.message
    }


    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/chat/send-message/${groupId}`,myObj, {headers: {'Authorization': token} })
    console.log(response);
  
  }

  function showNewJoiningMessageOnScreen(message){ 

    let childHTML=`<li>${message}</li>`;
    parentNode.innerHTML=parentNode.innerHTML + childHTML;
  
  }

  function showNewGroupOnScreen(group){ 

    let parentNode=document.querySelector('.group-list');
    let childHTML=`<li id=${group.id}>${group.groupName}
                    <button id="opengroup" class="btn btn-outline-dark" onclick=openGroup(${group.id})>Open</button>
                    <button id="invitemember" class="btn btn-outline-dark" onclick=openInviteMemberModal(${group.id})>Invite</button></li>`;
    parentNode.innerHTML=parentNode.innerHTML + childHTML;

  };
  
  async function openGroup(groupId){
    try{ 

      let otherGroupMessages=[];

      let stringifiedOtherGroupMessages = JSON.stringify(otherGroupMessages);
    
      localStorage.setItem('oldmessage', stringifiedOtherGroupMessages);  
      localStorage.setItem('groupid', groupId); 
      localStorage.setItem('lastid', 0);

       
         getTitle();
         getMessages();
  
      }catch(err){
    console.log(err);
    document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
  }
};


async function getTitle(){
  
  let groupId = localStorage.getItem('groupid');
   if(!groupId)
     groupId=0;

  
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://localhost:3000/group/get-title/${groupId}`, {headers: {'Authorization': token} })

  let childHTML = response.data.title;
  titleParentNode.innerHTML = childHTML;
}


function openInviteMemberModal(groupId){
  localStorage.setItem('groupid', groupId);
  
  inviteMemberModal.style.display = 'block';
}

inviteMemberCloseButton.addEventListener('click', closeInviteMemberModal);
function closeInviteMemberModal(e){
  e.preventDefault();

  inviteMemberModal.style.display = 'none';
}

inviteMemberForm.addEventListener('submit', onInvitingMember)
async function onInvitingMember(e) {
   
  try{
      e.preventDefault();

      let myObj={
        memberEmail: inviteMemberEmailInput.value,
      };  
  
      const token = localStorage.getItem('token');
      const groupId = localStorage.getItem('groupid');
      console.log(groupId);
      const response = await axios.post(`http://localhost:3000/group-invitation/invite-member/${groupId}`,myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      alert(`${response.data.message}`);
  
      }catch(err){
              console.log(err);
              alert(`${err.response.data.error}`);
           }
  
     inviteMemberEmailInput.value='';
  
  } 


adminTaskButton.addEventListener('click', openAdminTaskModal);
function openAdminTaskModal(e){
  e.preventDefault();
 
  adminTaskModal.style.display = 'block';
}

adminTaskCloseButton.addEventListener('click', closeAdminTaskModal);
function closeAdminTaskModal(e){
  e.preventDefault();
 
  adminTaskModal.style.display = 'none';
}

makeAdminButton.addEventListener('click', onMakingAdmin);
async function onMakingAdmin(e) {
   
  try{
      e.preventDefault();

      let myObj={
        email: adminTaskEmailInput.value,
        
      };  
  
      const groupId = localStorage.getItem('groupid');
      if(!groupId)
      groupId=0;

      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/admin/make-admin/${groupId}`,myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      alert(`${response.data.message}`);
      
  
      }catch(err){
              console.log(err);
              alert(`${err.response.data.error}`);
           }
  
     adminTaskEmailInput.value='';
   
  
  } 

addUserButton.addEventListener('click', onAddingUser);
async function onAddingUser(e) {
   
  try{
      e.preventDefault();

      let myObj={
        email: adminTaskEmailInput.value,
        
      };  
  
      const groupId = localStorage.getItem('groupid');
      if(!groupId)
      groupId=0;

      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/admin/add-user/${groupId}`,myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      alert(`${response.data.message}`);
      
  
      }catch(err){
              console.log(err);
              alert(`${err.response.data.error}`);
           }
  
     adminTaskEmailInput.value='';
  
  
  } 

removeUserButton.addEventListener('click', onRemovingUser);
async function onRemovingUser(e) {
   
  try{
      e.preventDefault();

      let myObj={
        email: adminTaskEmailInput.value,
      
      };  
  
      const groupId = localStorage.getItem('groupid');
      if(!groupId)
      groupId=0;

      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/admin/remove-user/${groupId}`,myObj, {headers: {'Authorization': token} })
      console.log(response);
      
      alert(`${response.data.message}`);
      
  
      }catch(err){
              console.log(err);
              alert(`${err.response.data.error}`);
           }
  
     adminTaskEmailInput.value='';
  
  
  } 







