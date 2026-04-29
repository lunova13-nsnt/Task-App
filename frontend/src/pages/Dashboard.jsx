import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import CreateTaskModal from '../components/CreateTaskModal';
import StatsBar from '../components/StatsBar';
import toast from 'react-hot-toast';

const FILTER_OPTIONS = [
  { value: '', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      if (search) params.search = search;

      const { data } = await tasksAPI.getAll(params);
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    }
  }, [filter, search]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await tasksAPI.getStats();
      setStats(data.stats);
    } catch {
      // silent fail for stats
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchTasks(), fetchStats()]);
    setIsLoading(false);
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      [newTask.status === 'in-progress' ? 'inProgress' : newTask.status]: prev[newTask.status === 'in-progress' ? 'inProgress' : newTask.status] + 1,
    }));
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    // Refresh stats
    fetchStats();
  };

  const handleTaskDeleted = (deletedId) => {
    const task = tasks.find((t) => t.id === deletedId);
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    if (task) {
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        [task.status === 'in-progress' ? 'inProgress' : task.status]:
          prev[task.status === 'in-progress' ? 'inProgress' : task.status] - 1,
      }));
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            {greeting()}, <span className="text-sage-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-ink-500 font-body mt-1">
            {stats.total === 0
              ? 'No tasks yet — add your first one!'
              : `You have ${stats.pending + stats.inProgress} task${stats.pending + stats.inProgress !== 1 ? 's' : ''} to work on`}
          </p>
        </div>

        {/* Stats bar */}
        <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <StatsBar stats={stats} />
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-ink-800 border border-ink-700 rounded-xl p-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-200
                  ${filter === opt.value
                    ? 'bg-sage-500 text-white shadow-sm shadow-sage-500/30'
                    : 'text-ink-500 hover:text-white'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* New Task button */}
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg leading-none">+</span>
            New Task
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {isLoading ? (
            // Skeleton loading
            [...Array(4)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-ink-700 rounded-md flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-ink-700 rounded w-3/4" />
                    <div className="h-3 bg-ink-700 rounded w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 w-16 bg-ink-700 rounded-full" />
                      <div className="h-5 w-10 bg-ink-700 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : tasks.length === 0 ? (
            <div className="card p-12 text-center animate-fade-in">
              <div className="w-14 h-14 bg-ink-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-display font-semibold text-white mb-1">
                {search || filter ? 'No tasks match your filters' : 'No tasks yet'}
              </p>
              <p className="text-ink-500 text-sm font-body mb-5">
                {search || filter ? 'Try adjusting your search or filter' : 'Create your first task to get started'}
              </p>
              {!search && !filter && (
                <button onClick={() => setShowModal(true)} className="btn-primary">
                  + Add First Task
                </button>
              )}
            </div>
          ) : (
            tasks.map((task, i) => (
              <div key={task.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <TaskItem
                  task={task}
                  onUpdate={handleTaskUpdated}
                  onDelete={handleTaskDeleted}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        {tasks.length > 0 && (
          <p className="text-center text-ink-600 text-xs font-mono mt-8">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} shown
          </p>
        )}
      </main>

      {/* Create Task Modal */}
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
