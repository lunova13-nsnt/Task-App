// Central file that imports all models and defines associations
const User = require('./User');
const Task = require('./Task');

// ── One-to-Many Relationship ──────────────────────────────────────────────────
// One User has Many Tasks
User.hasMany(Task, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  as: 'tasks',
  onDelete: 'CASCADE', // deleting a user removes all their tasks
});

// Each Task belongs to one User
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = { User, Task };
