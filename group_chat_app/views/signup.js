const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name'); 
const emailInput = document.querySelector('#email');
const contactInput = document.querySelector('#contact');
const passwordInput = document.querySelector('#password');

myForm.addEventListener('submit', onSignup);

async function onSignup(e) {
   
try{
    e.preventDefault();
    
    let myObj={
      name: nameInput.value,
      email: emailInput.value,
      contact: contactInput.value,
      password: passwordInput.value
    };    

    const response = await axios.post("http://localhost:3000/user/signup",myObj)

    console.log(response);
    
         alert(`${response.data.message}`);
        window.location.href = "./login.html"       

    }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            
         }

   nameInput.value=''; 
   emailInput.value='';
   contactInput.value='';
   passwordInput.value='';

} 

