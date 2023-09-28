const sequelize = require('../utilities/database');
const Expense = require('../models/expense');
const User = require('../models/user');

const itemsPerPage = 10;

exports.getExpense = async(req, res, next) => {
 try{
    const page = +req.query.page; 
    const promise1 = new Promise((resolve,reject) => {
      const expenses = Expense.findAll({
         offset: (page-1) * itemsPerPage,
         limit: itemsPerPage,
         where: {userId: req.user.id}
        });
        resolve(expenses);
    });
    
    const promise2 = new Promise((resolve, reject) => {
      const totalItems = Expense.count();
      resolve(totalItems);
    });

    const values = await Promise.all([promise1,promise2]);
    
    const expenses = values[0];
    const totalItems =  values[1];
           
    res.status(200).json({
              expenses: expenses,
              previousPage: page-1,
              currentPage: page, 
              nextPage: page+1, 
              hasPreviousPage: page>1,
              hasNextPage: (itemsPerPage*page) < totalItems, 
              lastPage: Math.ceil(totalItems/itemsPerPage),
               
             })
          }catch(err){
            console.log('Issue in getExpense', JSON.stringify(err));
            res.status(500).json({
              error: "Internal server error"
            })
          }

}

exports.addExpense = async(req, res, next) => {
  const t = await sequelize.transaction();
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
       
    }, {transaction: t})
    )
     
    const promise2 = new Promise((resolve, reject) => {
          
           aggregatedExpense = req.user.totalExpense + JSON.parse(amount);

        const result = User.update(
            {totalExpense: aggregatedExpense}, { where: {id: req.user.id}, transaction: t}
        )

        resolve(result);
      })

    const values = await Promise.all([promise1,promise2]);
          
             await t.commit();
            return res.status(201).json(values[0]);    
          
  }catch(err){
    await t.rollback();
    console.log('Issue in addExpense', JSON.stringify(err));
    res.status(500).json({
        error: "Internal server error"
    })
  }
      
}


exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try{
    const expenseId = req.params.expenseId;
    if(!expenseId){
       console.log('expenseId is missing');
       return res.status(400).json({
         error: 'Expense not found'
       })
       
    }


    const data = await Expense.findOne({where: {id: expenseId, userId: req.user.id}, transaction: t });
     const response = await Expense.destroy({where: {id: expenseId, userId: req.user.id}, transaction: t });
     if(response == 0)
        return res.status(404).json({error: "Expense does not belong to the user"})

        const amount = data.expenseAmount;
        aggregatedExpense = req.user.totalExpense - amount;
        const result = await User.update(
           {totalExpense: aggregatedExpense}, { where: {id: req.user.id}, transaction: t }
       );
      
     await t.commit();
     res.status(200).json(response);
    }catch(err){  
        await t.rollback();
        console.log('Issue in deleteExpense', JSON.stringify(err));
        res.status(500).json({
          error: "Internal server error"
        })
    }

} 

