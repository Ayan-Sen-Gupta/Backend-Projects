const Sib = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
const Password = require('../models/manage-password');

dotenv.config();

const forgotPassword = async(req, res, next) => {
    try{
  
      const email = req.body.email;

      if(!email)
          return res.status(400).json({error: "Email Id is missing"});

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications['api-key'];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const transactionEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
         email: 'ayansengupta560@gmail.com',
          name: 'Ayan',
        }

      const receivers = [
     {
        email: 'ayansengupta560@gmail.com',
     },
     ]

      transactionEmailApi
           .sendTransacEmail({
               sender,
                to: receivers,
                 subject: 'Sending mail',
                 textContent: `Sending forgot password mail`,
                
            })
             .then((response) => {
                console.log(response);
                return res.status(200).json({message: "Forgot password mail sent" });
             })
              .catch(err => console.log(err))
      
    }catch(err){
      console.log('Issue in forgotPassword', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    } 
        
  }

  module.exports = {
    forgotPassword
 }