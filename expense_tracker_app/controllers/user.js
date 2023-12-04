const User = require('../models/user');
const sequelize = require('../utilities/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id,name, premiumUserStatus) =>{
  return jwt.sign({ userId : id, name: name, premiumUser: premiumUserStatus}, '98jhsadiowjj78kasflsdk')
}


const signup = async(req, res, next) => {
  try{

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(!name || !email || !password)
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

const login = async(req, res, next) => {
    try{
  
      const email = req.body.email;
      const password = req.body.password;

      if(!email || !password)
          return res.status(400).json({error: "Some fields are missing"});
  
      const userData = await User.findAll({where: {email: email}});
     
      if(userData.length){
  
           const dbPassword = userData[0].dataValues.password;
           bcrypt.compare(password, dbPassword, (err,result) => {
               if(err){
                  console.log(err);
                  throw new Error('Something went wrong')
               }

               if(result == true)
                  return res.status(200).json({message: "User Login Successful", token: generateAccessToken(userData[0].dataValues.id, userData[0].dataValues.name, userData[0].dataValues.isPremiumUser) });
               else
                  return res.status(401).json({error: "Password is incorrect"});
           })

      }else
           return res.status(404).json({error: "User Not Found"});
      
    }catch(err){
      console.log('Issue in login', JSON.stringify(err));
      res.status(500).json({
          error: "Internal server error"
      })
    } 
        
  }



  module.exports = {
     generateAccessToken,
     signup,
     login
  }

 

  




