const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async(req, res, next) => {

    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, '98jhsadiowjj78kasflsdk');
        
    
        const response = await User.findByPk(user.userId);

            req.user = response;
            next();
     

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    
      }

}

exports.socketAuthenticate = async(socket, next) => {

  try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, '98jhsadiowjj78kasflsdk');
      
  
      const response = await User.findByPk(user.userId);

          socket.user = response;
          next();
   

    } catch(err) {
      console.log(err);
      next(new Error(err)); 
  
    }

}