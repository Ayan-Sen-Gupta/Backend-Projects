const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name'); 
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

myForm.addEventListener('submit', onSignup);

async function onSignup(e) {
   
try{
    e.preventDefault();
    
    let myObj={
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };    

    const response = await axios.post("http://localhost:3000/user/signup",myObj)

    console.log(response);
    if(response.status ===201)
        window.location.href = "./login.html"
      else
        throw new error('Failed to sinup') 
    }catch(err){
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err}</div>`;
            console.log(err);
         }

   nameInput.value='';
   emailInput.value='';
   passwordInput.value='';
   confirmPasswordInput.value='';
} 

