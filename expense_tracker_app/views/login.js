const myForm = document.querySelector('#my-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

myForm.addEventListener('submit', onLogin);

async function onLogin(e) {
   
try{
    e.preventDefault();
    
    let myObj={
      email: emailInput.value,
      password: passwordInput.value
    };    

    const response = await axios.post("http://localhost:3000/user/login",myObj)

    }catch(err){
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
            console.log(err);
         }

   emailInput.value='';
   passwordInput.value='';

} 

