const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const emailInput = document.querySelector('#email');

forgotPasswordForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
   
  try{
      e.preventDefault();
      
      let myObj={
        email: emailInput.value,
      };    
  
      const response = await axios.post("http://localhost:3000/password/forgot-password",myObj)
      console.log(response);
      
          alert(`${response.data.message}`);       
  
      }catch(err){
              console.log(err);
              document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
           }
  
     emailInput.value='';
  
  } 