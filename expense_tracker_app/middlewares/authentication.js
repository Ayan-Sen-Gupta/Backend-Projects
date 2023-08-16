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