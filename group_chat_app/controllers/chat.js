const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const sequelize = require('../utilities/database');
const Chat = require('../models/chat');
const User = require('../models/user');


exports.onConnection = (io,socket) => {

      
       socket.on('send-message', async(myObj,groupId) => {

       const t = await sequelize.transaction();
  try{

    const message = myObj.message;

    if(groupId==0)
       return res.status(400).json({error: "Please open a group"})
  
    const data = await Chat.create({
        userName: socket.user.name,
        message: message,
        userId: socket.user.id,
        groupId: groupId
       
    }, {transaction: t});

    console.log(data);
     
             await t.commit();
            socket.emit('received-message', data); 
          
  }catch(err){
    await t.rollback();
    console.log('Issue in sendMessage', JSON.stringify(err));
    
       }
  });    
};




exports.getMessage = async(req, res, next) => {

  try{
       const lastmessageid = req.query.lastmessageid;
       const groupId = req.params.groupId;

       const messages = await Chat.findAll({ 
          order:['id'],  
          where: {
            groupId : groupId,
            id: {[Op.gt]: lastmessageid} } 
        });
       
       res.status(200).json(messages);
      }catch(err){
             console.log('Issue in getMessage', JSON.stringify(err));
             res.status(500).json({
               error: "Internal server error"
             })
           }
 
 }


 



