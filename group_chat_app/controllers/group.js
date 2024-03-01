const sequelize = require('../utilities/database');
const Group = require('../models/group');
const User = require('../models/user');
const UserGroup = require('../models/user-group');


exports.createGroup = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
  
      const groupName = req.body.groupname;

      if(!groupName){
        return res.status(400).json({error: "Some fields are missing"});
    }

     const data = await Group.findAll({ where: {groupName: groupName} });
     if(data.length){
         const dbGroupName = data[0].dataValues.groupName;
         if(groupName === dbGroupName)
           return res.status(400).json({error: "Group already exists"});
     }

    
      const groupData = await Group.create({
          groupName: groupName,
          createdBy: req.user.name,
         
      }, {transaction: t});

       await t.commit();  
       return res.status(201).json({message: "Group created successfully", groupData});  
            
    }catch(err){
      await t.rollback();
      console.log('Issue in createGroup', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    }
 
 }

 exports.addGroupOwner = async(req, res, next) => {
  const t = await sequelize.transaction();
  try{
    
    const groupName = req.body.groupname;
    if(!groupName){
      return res.status(400).json({error: "Some fields are missing"});
  }

    const data = await Group.findAll({
                    attributes: ['id'],
                     where: { groupName: groupName}
                   });

    const groupId = data[0].dataValues.id;

    const userGroupData = await UserGroup.create({
                           isAdmin: true,
                           groupId: groupId,
                           userId: req.user.id,

                          }, {transaction: t});

    
         await t.commit();
        return res.status(200).json({message: "Joined the group", userGroupData});    
              
      }catch(err){
        await t.rollback();
        console.log('Issue in addGroupOwner', JSON.stringify(err));
        res.status(500).json({
            error: "Internal server error"
        })
      }
  
      
}

exports.getGroups = async(req, res, next) => {
  try{
    
    const userId = req.user.id;

    const data = await Group.findAll({
                   
                   include: {
                    model: User,
                    where: {id: userId},
                   }
                    
                  });
     
            return res.status(200).json(data);    
          
  }catch(err){
    console.log('Issue in getGroups', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }

}


 



