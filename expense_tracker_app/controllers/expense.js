const Expense = require('../models/expense');


exports.getExpense = async(req, res, next) => {
  try{
    const expenses = await Expense.findAll({where: {userId: req.user.id}});
    res.status(200).json(expenses);
  
  }catch(err){
    console.log('Issue in getExpense', JSON.stringify(err));
    res.status(500).json({
      error: "Internal server error"
    })
  }

}

exports.addExpense = async(req, res, next) => {
  try{

    const itemName = req.body.itemName;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    if(!itemName || !amount || !category){
        return res.status(400).json({error: "Some fields are missing"});
    }
     
    const data = await Expense.create({
        itemName: itemName,
        expenseAmount: amount,
        description:description,
        category: category,
        userId: req.user.id,
       
    })
          res.status(201).json(data);
  }catch(err){
    console.log('Issue in addExpense', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  } 
      
}


exports.deleteExpense = async (req, res, next) => {
  try{
    const expenseId = req.params.expenseId;
    if(!expenseId){
       console.log('expenseId is missing');
       return res.status(400).json({
         error: 'Expense not found'
       })
       
    }
     const response = await Expense.destroy({where: {id: expenseId, userId: req.user.id}});
     if(response == 0)
        return res.status(404).json({error: "Expense does not belong to the user"})

     res.status(200).json(response);
    }catch(err){
        console.log('Issue in deleteExpense', JSON.stringify(err));
        res.status(500).json({
          error: "Internal server error"
        })
    }

} 

