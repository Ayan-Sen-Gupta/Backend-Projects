const GroceryItem = require('../models/grocery-item');
const path = require('path');
const rootDir = require('../utilities/path.js');
const { error } = require('console');


exports.getForm = async(req, res, next) => {
  try{
    const items = await GroceryItem.findAll();
    res.status(200).json(items);
  }catch(err){
    console.log('Issue in getForm', JSON.stringify(err));
    res.status(500).json({
        error: err
    })
  }

}

exports.postForm = async(req, res, next) => {
  try{

    const itemName = req.body.itemName;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;

    if(!itemName){
        throw new error('Item Name is mandatory');
    }

    if(!description){
        throw new error('Description is mandatory');
    }

    if(!price){
        throw new error('Price is mandatory');
    }

    if(!quantity){
        throw new error('Quantity is mandatory');
    }
     
    const data = await GroceryItem.create({
        itemName: itemName,
        description:description,
        price: price,
        quantity: quantity
       
    })
        res.status(201).json(data);
  }catch(err){
    console.log('Issue in postForm', JSON.stringify(err));
    res.status(500).json({
        error: err
    })
  } 
      
}


exports.buy = async (req, res, next) => {
    try{
    const itemId = req.params.itemId;
    const quantity = req.body.quantity;
    if(itemId === 'undefined'){
        console.log('Item Id is missing');
        res.status(400).json({
          error: 'Item Id is missing'
        })
         throw new error('Item not found');
     }
       const data = await GroceryItem.update({quantity: quantity}, {where: {id: itemId}});
       const updatedItem = await GroceryItem.findByPk(itemId);
       res.status(200).json(updatedItem);
      }catch(err){
          console.log('Issue in buy', JSON.stringify(err));
          res.status(500).json({
              error: err
          })
      }
  
  }

exports.deleteItem = async (req, res, next) => {
  try{
    const itemId = req.params.itemId;
    if(itemId === 'undefined'){
        console.log('Item Id is missing');
        res.status(400).json({
          error: 'Item Id is missing'
        })
         throw new error('Item not found');
     }
     const deletedItem = await GroceryItem.destroy({where: {id: itemId}});
     res.status(200).json(deletedItem);
    }catch(err){
        console.log('Issue in deleteItem', JSON.stringify(err));
        res.status(500).json({
            error: err
        })
    }

}

