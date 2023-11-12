import { Router } from 'express';
import { Todo } from '../models/todo';

const router = Router();
let todos: Todo[] = [];

router.get('/', (req,res,next) => {
   res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
  const newTodo: Todo = {
       id: new Date().toISOString(),
       text: req.body.text
};

todos.push(newTodo);
res.status(201).json({ message: 'Added Todo', todo: newTodo, todos: todos });

});

router.put('/edit-todo/:todoId', (req, res, next) => {
    const params = req.params;
    const id = params.todoId;
    const body = req.body;

    const todoIndex = todos.findIndex((todoItem) => todoItem.id === id);

    if(todoIndex>=0){
        todos[todoIndex] = {id: id, text: body.text};
        return res.status(200).json({ message: 'Updated todo', todos: todos });
    }

  res.status(404).json('Item Not Found');
  
  });

router.post('/delete-todo/:todoId', (req, res, next) => {
    const params = req.params;
  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({ message: 'Deleted todo', todos: todos });
  
  });

export default router;