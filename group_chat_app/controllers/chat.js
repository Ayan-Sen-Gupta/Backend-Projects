const sequelize = require('../utilities/database');
const Chat = require('../models/chat');
const User = require('../models/user');


exports.sendMessage = async(req, res, next) => {
  const t = await sequelize.transaction();
  try{

    const message = req.body.message;
  
    const data = await Chat.create({
        userName: req.user.name,
        message: message,
        userId: req.user.id,
       
    }, {transaction: t});
     
             await t.commit();
            return res.status(201).json(data);    
          
  }catch(err){
    await t.rollback();
    console.log('Issue in sendMessage', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }
      
}




