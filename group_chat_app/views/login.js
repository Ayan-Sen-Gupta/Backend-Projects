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
    console.log(response);
    
        alert(`${response.data.message}`);
        localStorage.setItem('token', response.data.token);
        window.location.href = "./expense.html"
       
       

    }catch(err){
            console.log(err);
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red;">${err.response.data.error}</div>`;
         }

   emailInput.value='';
   passwordInput.value='';

} 





