import { useState } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrors(['Task title is required']);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      };
      const { data } = await tasksAPI.create(payload);
      onCreated(data.task);
      toast.success('Task created!');
      onClose();
    } catch (err) {
      const msgs = err.response?.data?.errors || [err.response?.data?.message || 'Failed to create task'];
      setErrors(msgs);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md p-6 animate-scale-in shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl">New Task</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors text-ink-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {errors.map((e, i) => (
              <p key={i} className="text-rose-400 text-sm font-body">{e}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="input-field"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
