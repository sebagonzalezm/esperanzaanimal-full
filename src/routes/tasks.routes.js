const { Router} = require('express');
const {getAllTask,getTask, createTask, deleteTask, updateTask,loginUser,signupUser} = require('../controllers/tasks.controller')

const pool = require('../db');

const router = Router();

router.get('/tasks', getAllTask)
router.get('/tasks/:id', getTask)
router.post('/tasks', createTask)
router.delete('/tasks/:id', deleteTask)
router.put('/tasks/:id',updateTask )
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;