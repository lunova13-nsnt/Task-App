const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats,
} = require('../controllers/taskController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// ALL task routes are protected by verifyToken middleware
router.use(verifyToken);

// Validation rules
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),

  body('description')
    .optional({ nullable: true })
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true })
    .isDate().withMessage('Due date must be a valid date (YYYY-MM-DD)'),
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true })
    .isDate().withMessage('Due date must be a valid date (YYYY-MM-DD)'),
];

// Routes
router.get('/stats', getStats);             // GET  /api/tasks/stats
router.get('/', getTasks);                  // GET  /api/tasks
router.get('/:id', getTask);                // GET  /api/tasks/:id
router.post('/', createTaskValidation, createTask);           // POST /api/tasks
router.put('/:id', updateTaskValidation, updateTask);         // PUT  /api/tasks/:id
router.delete('/:id', deleteTask);          // DELETE /api/tasks/:id

module.exports = router;
