const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { body, validationResult } = require('express-validator');
const log = require('../bin/trash');

// GET /todo
router.get('/', (req, res) => {

        Todo.find({}, (err, todos) => {
            if (err) log(err);
    
            res.render('todo/index', {
                title: 'todo',
                todos,
            });
        })
});


// POST /todo
router.post('/', [
    body('nametodo')
    .notEmpty()
    .withMessage('Message must not be empty'),
],(req, res) => {
 
    const new_todo = new Todo(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg)
        })

        res.render('/todo', {
            title: 'Todo',
            messages: req.flash(),
            nametodo,
        })
    }

    new_todo.save((err) => {
        if (err) log(err);
        res.redirect('/todo')
    })
})

// GET /todo/id/edit

router.get('/:id/edit', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(err) log(err)
        res.render('todo/edit', {
            title: 'Edit',
            todo
        })
    })
})

// PUT /todo/:id/edit
router.put('/:id/edit', (req, res) => {
    Todo.findById(req.params.id, (err, t) => {
        if (err) log(err);

        let updateTodo = Object.assign(t, req.body);

        Todo.findByIdAndUpdate(req.params.id, updateTodo, (err, todo) => {
            if (err) log(err);
            res.redirect(`/todo`)
        })

    })
})

// DELETE /todo/:id
router.delete('/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id, (err, deletedTodo) => {
        if (err) log(err)
        res.redirect('/todo')
    })
})

module.exports = router;