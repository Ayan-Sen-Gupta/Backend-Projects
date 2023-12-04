const Razorpay = require('razorpay');
const sequelize = require('../utilities/database');
const Order = require('../models/premium');
const Expense = require('../models/expense');
const User = require('../models/user');
const ExpenseFile = require('../models/expense-file');
const userController = require('./user');
const UserServices = require('../services/user');
const S3Services = require('../services/s3');  


exports.buyPremium = async (req, res) => {
    try {
        
        var razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
         
        
        razorpay.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
        
          
            const promise = Order.create({ orderId: order.id, status: 'Pending', userId: req.user.id})
                        .then(() => {
                            return res.status(201).json({ order, key_id : razorpay.key_id});
                        }).catch(err => {
                            throw new Error(err);
                        })
                
      })

    }catch(err){
        console.log('Issue in buyPremium', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Something went wrong'
        })
    }
}

exports.onTransaction = async (req, res ) => {
    try {
        const userId = req.user.id;
        const orderId = req.body.order_id;
        const paymentId = req.body.payment_id;
        
        const order  = await Order.findOne({where : {orderId : orderId}})

        if(!paymentId){
          const response = await order.update({status: 'Failed'});
          return res.status(200).json(response);
        }

        const promise1 =  order.update({ paymentId: paymentId, status: 'Successful'});
        const promise2 =  req.user.update({ isPremiumUser: true }); 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined,true) });
        }).catch((error) => {
            throw new Error(error);
        })      
                
    } catch (err) {
        console.log('Issue in onTransaction', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Transaction Failed'
        })

    }
}

exports.getLeaderBoard = async (req, res) => {
    try{
        const userId = req.user.id;
        const leaderBoard = await User.findAll({
            
            attributes: ['id', 'name','totalExpense'],
            order:[['totalExpense', 'DESC']],

        })
       
        res.status(200).json(leaderBoard);
     
     }catch(err) {
        console.log('Issue in getLeaderBoard', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Something went wrong'
        });

    }
}

exports.downloadExpenseReport = async(req,res, next) => {
    try{
  
     const expenses = await UserServices.getExpenses(req); 
     const stringifiedExpenses = JSON.stringify(expenses); 
  
     const userId = req.user.id;
     const fileName = `Expense${userId}/${new Date()}.txt`;
     const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, fileName);
        
     const data = await ExpenseFile.create({
            fileUrl: fileUrl,
            userId: req.user.id
        });
     res.status(200).json({ fileUrl, success: true});
      }catch(err){
          console.log(err);
          res.status(500).json({fileUrl:'', success: false, error: 'Something went wrong'});
   }
  }

  exports.getDownloadedExpenseReports = async(req,res, next) => {
    try{
  
     const expenseReports = await ExpenseFile.findAll({
               attributes: ['fileUrl', 'createdAt'],
               where: {userId: req.user.id}, 
               order:[['createdAt', 'DESC']],
               limit: 5, 
            });
   
     res.status(200).json({ expenseReports, success: true});
      }catch(err){
          console.log(err);
          res.status(500).json({fileUrl:'', success: false, error: 'Something went wrong'});
   }
  }
  
