const User = require('../models/user');

exports.signup = async(req, res, next) => {
  try{

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const emailData = await User.findAll({where: {email: email}});
    if(emailData.length){

      const dbEmail = emailData[0].dataValues.email;
      if(email === dbEmail)
         return res.status(400).json({error: "User already exists"});
    }
    

    
    if(!name || !email || !password)
        return res.status(400).json({error: "Some fields are missing"});

   
    const data = await User.create({
        name: name,
        email: email,
        password: password
       
    })
        res.status(201).json(data);
  }catch(err){
    console.log('Issue in signup', JSON.stringify(err));
    res.status(500).json({
        error: err
    })
  } 
      
}




