const User = require('../models/user');
const sequelize = require('../utilities/database');
const bcrypt = require('bcrypt');

const signup = async(req, res, next) => {
  try{

    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;

    if(!name || !email || !password || !contact)
        return res.status(400).json({error: "Some fields are missing"});

    const emailData = await User.findAll({where: {email: email}});
    if(emailData.length){

      const dbEmail = emailData[0].dataValues.email;
      if(email === dbEmail)
         return res.status(400).json({error: "User already exists"});
    }
    

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async(err,hash) =>{
      if(err){
         console.log(err);
         throw new Error("Something went wrong");
      }

      const data = await User.create({
        name: name,
        email: email,  
        password: hash
       
       })
    })
        res.status(201).json({message: "User signup successful"});
  }catch(err){
    console.log('Issue in signup', JSON.stringify(err));
    return res.status(500).json({
        error: "Internal server error"
    })
  } 
      
}


  module.exports = {
     signup
  }

 

  




