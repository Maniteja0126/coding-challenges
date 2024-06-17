import express from 'express'


export const TodoRouter = express.Router();
interface Todo {
    id : number;
    todo :string;
    completed : boolean;
}
let currentTodoId = 1;

const todos : Todo[]=[
    {
        id:currentTodoId,
        todo:"Complete the task",
        completed : false
    },
];

TodoRouter.get('/todos',(req,res)=>{
    res.json(todos);
})

TodoRouter.post('/todos', (req, res) => {
    try {
        const { todo, completed } = req.body;
    
        if (typeof todo !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid todo or completed status' });
        }
    
        console.log("todo:", todo);
        console.log("completed:", completed);
    
        const newTodo: Todo = { id: currentTodoId++,  todo, completed: completed || false };
        todos.push(newTodo);
        res.json({ message: "Todo added" });

    } catch (error) {
        res.status(404).json({message : "internal error"});
    }
    
  });

TodoRouter.get('/todos/:id' , (req,res)=>{
    try {
        const id = parseInt(req.params.id);
        const todo = todos.find(x => x.id === id);

        res.json({todo});
    } catch (error) {
        res.status(404).json({message : "internal error"});
    }
    
});

TodoRouter.put('/todos/:id' , (req,res)=>{
    try {
        const id = parseInt(req.params.id);
        const todoIndex = todos.findIndex(x => x.id === id);
        if (!todoIndex) {
            return res.status(404).json({ message: 'Todo not found' });
            }
        const {todo , completed } = req.body;
        if(todoIndex !== -1){
            todos[todoIndex] = {id , todo , completed};
            res.json(todos[todoIndex]);
        }

                
    } catch (error) {
        res.status(404).json({message : "internal error"});
    }
})

TodoRouter.delete('/todos/:id' , (req,res)=>{
    const id = parseInt(req.params.id);

    const todo = todos.findIndex(x => x.id === id);
    if(todo !== -1){
        todos.splice(todo, 1);
        res.json({ message: 'Todo deleted' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
})

