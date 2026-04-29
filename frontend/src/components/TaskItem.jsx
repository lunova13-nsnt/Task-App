import { useState } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'pending': { label: 'Pending', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  'in-progress': { label: 'In Progress', color: 'bg-sage-400/10 text-sage-400 border-sage-400/20' },
  'completed': { label: 'Completed', color: 'bg-ink-600 text-ink-500 border-ink-600' },
};

const PRIORITY_CONFIG = {
  'high': { label: '↑ High', color: 'text-rose-400' },
  'medium': { label: '→ Med', color: 'text-amber-400' },
  'low': { label: '↓ Low', color: 'text-ink-500' },
};

const STATUS_NEXT = {
  'pending': 'in-progress',
  'in-progress': 'completed',
  'completed': 'pending',
};

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isCompleted = task.status === 'completed';

  const handleStatusCycle = async () => {
    setIsUpdating(true);
    try {
      const nextStatus = STATUS_NEXT[task.status];
      const { data } = await tasksAPI.update(task.id, { status: nextStatus });
      onUpdate(data.task);
      toast.success(`Status → ${STATUS_CONFIG[nextStatus].label}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tasksAPI.delete(task.id);
      onDelete(task.id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`card p-4 transition-all duration-300 animate-slide-up group
      ${isCompleted ? 'opacity-60' : 'hover:border-ink-600'}
      ${isDeleting ? 'scale-95 opacity-0' : ''}
    `}>
      <div className="flex items-start gap-3">
        {/* Checkbox-style status toggle */}
        <button
          onClick={handleStatusCycle}
          disabled={isUpdating}
          className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center
            transition-all duration-200
            ${isCompleted
              ? 'bg-sage-500 border-sage-500'
              : 'border-ink-600 hover:border-sage-500 bg-transparent'
            }
          `}
          title="Click to cycle status"
        >
          {isCompleted && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isUpdating && !isCompleted && (
            <div className="w-3 h-3 border border-sage-500 border-t-transparent rounded-full animate-spin" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-display font-semibold text-sm leading-snug
              ${isCompleted ? 'line-through text-ink-500' : 'text-white'}
            `}>
              {task.title}
            </h3>
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger py-1 px-2 text-xs"
              >
                {isDeleting ? '...' : 'Delete'}
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-ink-500 text-xs mt-1 font-body leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className={`status-badge border ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className={`text-xs font-mono font-medium ${priorityCfg.color}`}>
              {priorityCfg.label}
            </span>
            {task.dueDate && (
              <span className="text-xs text-ink-500 font-mono">
                Due {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
