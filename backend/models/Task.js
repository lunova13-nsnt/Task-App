const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Task title cannot be empty' },
        len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'in-progress', 'completed']],
          msg: 'Status must be pending, in-progress, or completed',
        },
      },
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    // userId is set via the association below — Sequelize adds it automatically
  },
  {
    tableName: 'tasks',
    timestamps: true,
  }
);

module.exports = Task;
