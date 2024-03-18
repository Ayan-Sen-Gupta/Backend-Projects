const cron = require('node-cron');
const { Op } = require('sequelize');
const sequelize = require('../utilities/database');
const Chat = require('../models/chat');
const ArchivedChat = require('../models/archived-chat');

  
  const cronJob = cron.schedule('0 0 * * *', async() => {

    const t = await sequelize.transaction();
    try{

      const todaysDate = new Date();

      const chatData = await Chat.findAll({  
        where: {
          createdAt: {[Op.lt]: todaysDate} 
        } 
      });

      for(let chat of chatData){
    
      const data = await ArchivedChat.create({
          userName: chat.dataValues.username,
          message: chat.dataValues.message,
          userId: chat.dataValues.userId,
          groupId: chat.dataValues.groupId
         
      }, {transaction: t});

      chat.destroy();

    }
       
       await t.commit();

       console.log('Messages have been archived');
        
            
    }catch(err){
      await t.rollback();
      console.log('Issue in cronJob', JSON.stringify(err));
      
         } 
  },
  {
    timezone:'Asia/Kolkata',
  }
 );

  module.exports = cronJob;