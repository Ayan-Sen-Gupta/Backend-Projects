const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const sequelize = require('../utilities/database');

const User = require('../models/user');
const PasswordRequest = require('../models/password-request');


exports.forgotPassword = async(req, res, next) => {
    try{
  
      const email = req.body.email;

      if(!email)
          return res.status(400).json({error: "Email Id is missing"});

      const user = await User.findOne({ where: {email: email}});
      if(!user)
          return res.status(400).json({error: "Email Id is not registered"});

          const id = uuid.v4();
          const data = await PasswordRequest.create({id: id, requestActive: true, userId: user.dataValues.id});
          

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
                 subject: 'Password Reset Mail',
                 textContent: 'Reset your password',
                 htmlContent: `<a href="http://localhost:3000/password/reset-password/${id}">Reset Password</a>`
                
            })
             .then((response) => {
                console.log(response);
                return res.status(200).json({message: "Reset password link sent to mail" });
             })
              .catch(err => console.log(err))
      
    }catch(err){
      console.log('Issue in forgotPassword', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    } 
        
  }

  exports.resetPassword = async(req, res, next) => {
    try{
  
      const id = req.params.id;
      const response = await PasswordRequest.findOne({where: {id: id} });
      if(!response || response.requestActive==0)
         return res.status(400).json({error: "Invalid request"});

        const data = await PasswordRequest.update({requestActive: false}, { where: {id: id} });

        return res.status(200).send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Expense Tracker - Reset Password</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
            <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
            <style> 
              body{ 
                  margin-left:410px; margin-right:410px
              }
        </style>  
        <link rel="stylesheet" href="../public/css/expense-tracker.css">
        </head>
        <body>
           <div class = 'container'>
            <div class="border border-primary-subtle border-2 rounded border-opacity-50 p-2">
             <h2 style = "text-align:center;color:grey">Expense Tracker</h2>
             <form action="http://localhost:3000/password/update-password/${id}" method="post" style="text-align:center"> 
        
             <label for="newPassword" class="form-label">New Password:</label>
             <input type="password" id="newPassword" name="newPassword" required class="form-control" placeholder="Enter new password"><br>
                   
              <button class="btn btn-outline-dark">Submit</button><br>
             </form>
              </div>
            </div> 
        </body>
        </html>`);
  
      
    }catch(err){
      console.log('Issue in resetPassword', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    } 
        
  }

  exports.updatePassword = async(req, res, next) => {
    try{
  
      const id = req.params.id;
      const newPassword = req.body.newPassword;

      const response = await PasswordRequest.findOne({ where: {id: id} });
      if(!response)
        return res.status(400).json({error: "Invalid request"});

      const data = await User.findOne({ where: {id: response.dataValues.userId} });
      if(!data)
        return res.status(400).json({error: "User not found"});

        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, async(err,hash) =>{
          if(err){
             console.log(err);
             console.log("Something went wrong in hashing");
             throw new Error("Something went wrong");
          }
    
          const updatedData = await User.update({password: hash}, {where: {id: response.dataValues.userId} });
        })
        
        return res.status(201).json({message: "Password Updated Successfully" });
        
    }catch(err){
      console.log('Issue in updatePassword', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    } 
        
  }

