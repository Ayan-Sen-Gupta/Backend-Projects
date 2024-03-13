const sequelize = require('../utilities/database');
const Group = require('../models/group');
const User = require('../models/user');
const UserGroup = require('../models/user-group');
const Chat = require('../models/chat');


exports.makeAdmin = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
  
      const groupId = req.params.groupId;
      const email = req.body.email;
      if(!email){
        return res.status(400).json({error: "Some fields are missing"});
    }

     const user = await User.findOne({ where: {email: email} });
     if(!user)
        return res.status(400).json({error: "User does not exist"});
     

    const userId = user.dataValues.id;


    const response = await UserGroup.findOne({ 
                   where: {
                     groupId: groupId,
                     userId: userId,
                     
                    } 
                  });

     if(!response)
        return res.status(400).json({error: "User does not belong to this group"});


        const promise1 = UserGroup.update({ isAdmin: true }, {
          where: { 
            groupId: groupId,
            userId: userId 
          }
         
      }, {transaction: t});

      const promise2 = Chat.create({
        userName: user.dataValues.name,
        message: 'is now an admin',
         userId: user.dataValues.id,
         groupId: groupId,

       }, {transaction: t});

       const result = await Promise.all([promise1, promise2]);

           await t.commit();
        return res.status(201).json({message: "The member is now an admin"});

        
        
            
    }catch(err){
      await t.rollback();
      console.log('Issue in makeAdmin', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    }
 
 }

 exports.addUser = async(req, res, next) => {
  const t = await sequelize.transaction();
  try{
  
    const groupId = req.params.groupId;
    const email = req.body.email;
    if(!email){
      return res.status(400).json({error: "Some fields are missing"});
  }

   const user = await User.findOne({ where: {email: email} });
   if(!user)
      return res.status(400).json({error: "User does not exist"});

  const userId = user.dataValues.id;

  const response = await UserGroup.findOne({ 
             where: {
                groupId: groupId,
                userId: userId,
      
     } 
   });

   if(response)
      return res.status(400).json({error: "User already belongs to this group"});

  
    const promise1 = UserGroup.create({
        isAdmin: false,
        groupId: groupId,
         userId: userId
       
    }, {transaction: t});

    const promise2 = Chat.create({
      userName: user.dataValues.name,
      message: 'was added by admin',
       userId: user.dataValues.id,
       groupId: groupId,

     }, {transaction: t});

     const result = await Promise.all([promise1, promise2]);

           await t.commit();
           return res.status(201).json({message: "The member has been added"});  
        
     
              
      }catch(err){
        await t.rollback();
        console.log('Issue in addUser', JSON.stringify(err));
        res.status(500).json({
            error: "Internal server error"
        })
      }
  
      
}

exports.removeUser = async(req, res, next) => {
  const t = await sequelize.transaction();
  try{
  
    const groupId = req.params.groupId;
    const email = req.body.email;
    if(!email){
      return res.status(400).json({error: "Some fields are missing"});
  }

   const user = await User.findOne({ where: {email: email} });
   if(!user)
      return res.status(400).json({error: "User does not exist"});

  const userId = user.dataValues.id;

  const response = await UserGroup.findOne({ 
    where: {
      groupId: groupId,
      userId: userId,
      
     } 
   });

   if(!response)
      return res.status(400).json({error: "User does not belong to this group"});

  
    const promise1 = UserGroup.destroy({
        where: {
          groupId: groupId,
          userId: userId 
        }
       
    }, {transaction: t});

    const promise2 = Chat.create({
      userName: user.dataValues.name,
      message: 'was removed by admin',
       userId: user.dataValues.id,
       groupId: groupId,

     }, {transaction: t});


     const result = await Promise.all([promise1, promise2]);

           await t.commit();
           return res.status(200).json({message: "The member has been removed"});   
      
      
          
  }catch(err){
    console.log('Issue in removeUser', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }

}



 



