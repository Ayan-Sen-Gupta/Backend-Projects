const { Op } = require('sequelize');
const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const sequelize = require('../utilities/database');
const Group = require('../models/group');
const User = require('../models/user');
const Chat = require('../models/chat');
const UserGroup = require('../models/user-group');
const GroupInvitation = require('../models/group-invitation');


exports.inviteMember = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
  
        const groupId = req.params.groupId;
        const memberEmail = req.body.memberEmail;
  
        if(!groupId || !memberEmail){
          return res.status(400).json({error: "Some fields are missing"});
      }
  
      const groupName = await Group.findOne({
                                attributes: ['groupName'],
                                 where: {id: groupId}
                                })
  
      const user = await User.findOne({ where: {email: memberEmail}});
      if(!user)
            return res.status(400).json({error: "Email Id is not registered"});
  
            const id = uuid.v4();
            const data = await GroupInvitation.create({id: id, requestActive: true, userId: user.dataValues.id}, {transaction: t});
            
  
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
          email: `${memberEmail}`,
       },
       ]
  
        const response = await transactionEmailApi
             .sendTransacEmail({
                 sender,
                  to: receivers,
                   subject: 'Group Invitation',
                   textContent: 'You are invited to join the group. Please click on the below link',
                   htmlContent: `<a href="http://localhost:3000/group-invitation/join-group/${groupId}/${id}">Join Group</a>`
                  
              })
  
                  await t.commit();
                  return res.status(200).json({message: "Member invite link sent to mail" }); 
          
                 
                
        }catch(err){
          await t.rollback();
          console.log('Issue in inviteMember', JSON.stringify(err));
          res.status(500).json({
              error: "Internal server error"
          })
        }
      }
  
      exports.joinGroup = async(req, res, next) => {
        const t = await sequelize.transaction();
        try{
      
          const id = req.params.id;
          const groupId = req.params.groupId;
         
          const response = await GroupInvitation.findOne({where: {id: id} });
          if(!response || response.requestActive==0)
             return res.status(400).json({error: "Invalid request"});
    
            const data = await GroupInvitation.update({requestActive: false}, { where: {id: id} }, {transaction: t});

            await t.commit;
        
            return res.status(200).send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Group Chat - Join Group</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
                <style> 
                  body{ 
                      margin-left:410px; margin-right:410px
                  }
            </style>  
            <link rel="stylesheet" href="../public/css/group-chat.css">
            </head>
            <body>
               <div class = 'container'>
                <div class="border border-primary-subtle border-2 rounded border-opacity-50 p-2">
                 <h2 style = "text-align:center;color:grey">Group Chat</h2>
                 <form action="http://localhost:3000/group-invitation/join-member/${groupId}" method="post"  style="text-align:center"> 
            
                  <label for="email" class="form-label">Email:</label>
                  <input type="text" id="email" name="email" required class="form-control" placeholder="Enter Email"><br>
                       
                  <button class="btn btn-outline-dark">Join Group</button><br>
                  <a href="./signup.html">New User? Signup</a><br>
                  <a href="./forgot-password.html">Forgot Password</a><br>
                 </form>
                  </div>
                </div>    
            </body>
            </html>`);
                    
            }catch(err){
              await t.rollback();
              console.log('Issue in joinGroup', JSON.stringify(err));
              res.status(500).json({
                  error: "Internal server error"
              })
            }
        
            
      }
  
      exports.joinMember = async(req, res, next) => {
        const t = await sequelize.transaction();
        try{
      
            const groupId = req.params.groupId;
            const emailId = req.body.email;

            console.log(groupId);
      
            if(!groupId || !emailId){
              return res.status(400).json({error: "Some fields are missing"});
          }
      
          const response = await User.findOne({where: { email: emailId} });
          if(!response)
             return res.status(400).json({error: "User not found"});
        
        
           const promise1 =  UserGroup.create({
                              groupId: groupId,
                               userId: response.dataValues.id,
        
                    }, {transaction: t});

            const promise2 = Chat.create({
                      userName: response.dataValues.name,
                      message: 'Joined the group',
                       userId: response.dataValues.id,
                       groupId: groupId,

            }, {transaction: t});

          
            Promise.all([promise1, promise2]).then(()=> {
              t.commit();
              return res.status(201).json({message: "You joined the group successfully. Please Login"});
          }).catch((error) => {
              throw new Error(error);
          }) 
    
                    
            }catch(err){
              await t.rollback();
              console.log('Issue in joinMember', JSON.stringify(err));
              res.status(500).json({
                  error: "Internal server error"
              })
            }      
            
      }