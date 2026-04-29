const { validationResult } = require('express-validator');
const { Task } = require('../models');
const { Op } = require('sequelize');

// ── GET /api/tasks ────────────────────────────────────────────────────────────
// Fetch only the logged-in user's tasks (with optional filters)
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort = 'createdAt', order = 'DESC' } = req.query;

    // Build dynamic WHERE clause
    const where = { userId: req.user.id };

    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      where.status = status;
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      where.priority = priority;
    }
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` }; // case-insensitive search
    }

    // Validate sort column to prevent injection
    const allowedSorts = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'createdAt';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const tasks = await Task.findAll({
      where,
      order: [[safeSort, safeOrder]],
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    return res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/tasks ───────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id, // CRITICAL: link task to logged-in user
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => e.msg),
      });
    }

    // Find task that belongs to this user
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Only update fields that were provided
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description?.trim() || null;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.destroy();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/tasks/stats ──────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.count({ where: { userId: req.user.id } }),
      Task.count({ where: { userId: req.user.id, status: 'pending' } }),
      Task.count({ where: { userId: req.user.id, status: 'in-progress' } }),
      Task.count({ where: { userId: req.user.id, status: 'completed' } }),
    ]);

    return res.status(200).json({
      success: true,
      stats: { total, pending, inProgress, completed },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };
