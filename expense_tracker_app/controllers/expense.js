const Expense = require('../models/expense');
const User = require('../models/user');


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
     
    const promise1 = Promise.resolve(
      Expense.create({
        itemName: itemName,
        expenseAmount: amount,
        description:description,
        category: category,
        userId: req.user.id,
       
    })
    )
     
    const promise2 = new Promise((resolve, reject) => {
          
           aggregatedExpense = req.user.totalExpense + JSON.parse(amount);

        const result = User.update(
            {totalExpense: aggregatedExpense}, { where: {id: req.user.id}}
        )

        resolve(result);
      })

    Promise.all([promise1,promise2])
          .then((values) => {
            return res.status(201).json(values[0]);
          })
          .catch(err => console.log(err));
     
          
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


    const data = await Expense.findOne({where: {id: expenseId, userId: req.user.id}});
     const response = await Expense.destroy({where: {id: expenseId, userId: req.user.id}});
     if(response == 0)
        return res.status(404).json({error: "Expense does not belong to the user"})

        const amount = data.expenseAmount;
        aggregatedExpense = req.user.totalExpense - amount;
        const result = await User.update(
           {totalExpense: aggregatedExpense}, { where: {id: req.user.id}}
       )

     res.status(200).json(response);
    }catch(err){
        console.log('Issue in deleteExpense', JSON.stringify(err));
        res.status(500).json({
          error: "Internal server error"
        })
    }

} 

