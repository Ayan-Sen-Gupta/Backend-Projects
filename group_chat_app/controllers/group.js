const { Op } = require('sequelize');
const sequelize = require('../utilities/database');
const Group = require('../models/group');
const User = require('../models/user');

exports.getGroups = async(req, res, next) => {
  try{
  
    const data = await Group.findAll({ 
                      include: User,
                      where: {id: req.user.id}
                    });
     
            return res.status(200).json(data);    
          
  }catch(err){
    console.log('Issue in getGroups', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }

}

exports.createGroup = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
  
      const groupName = req.body.groupname;
    
      const data = await Group.create({
          groupName: groupName,
          createdBy: req.user.userName,
         
      }, {transaction: t});
       
               await t.commit();
              return res.status(201).json(data);    
            
    }catch(err){
      await t.rollback();
      console.log('Issue in createGroup', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    }
 
 }

exports.addMember = async(req, res, next) => {
  const t = await sequelize.transaction();
  try{

    const addMember = req.body.addmember;
    const groupId = req.query.groupId;
  
    const data = await UserGroup.create({
        userId: req.user.id,
        groupId: groupId
       
    }, {transaction: t});
     
             await t.commit();
            return res.status(201).json(data);    
          
  }catch(err){
    await t.rollback();
    console.log('Issue in addMember', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }
      
}
 



