const User = require('../models/user');

exports.signup = async(req, res, next) => {
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
    
    const data = await User.create({
        name: name,
        email: email,
        password: password
       
    })
        res.status(201).json({message: "User signup successful"});
  }catch(err){
    console.log('Issue in signup', JSON.stringify(err));
    res.status(500).json({
        error: err
    })
  } 
      
}

exports.login = async(req, res, next) => {
    try{
  
      const email = req.body.email;
      const password = req.body.password;

      if(!email || !password)
          return res.status(400).json({error: "Some fields are missing"});
  
      const userData = await User.findAll({where: {email: email}});
      if(userData.length){
  
           const dbPassword = userData[0].dataValues.password;
           if(password === dbPassword)
               return res.status(200).json({message: "User Login Successful"});
            else
            return res.status(401).json({error: "Password is incorrect"});

      }else
           return res.status(404).json({error: "User Not Found"});
      
    }catch(err){
      console.log('Issue in login', JSON.stringify(err));
      res.status(500).json({
          error: err
      })
    } 
        
  }




