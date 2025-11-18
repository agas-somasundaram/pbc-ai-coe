import React, { useState } from 'react';
import './Tasks.css';

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Design homepage mockup',
      description: 'Create initial design concepts for the new homepage',
      projectId: 1,
      projectName: 'Website Redesign',
      assignedTo: 'John Doe',
      dueDate: '2025-11-20',
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: 2,
      title: 'Set up authentication',
      description: 'Implement user login and registration',
      projectId: 2,
      projectName: 'Mobile App Development',
      assignedTo: 'Jane Smith',
      dueDate: '2025-11-05',
      priority: 'high',
      status: 'overdue',
    },
    {
      id: 3,
      title: 'Write blog posts',
      description: 'Create 5 blog posts for Q4 campaign',
      projectId: 3,
      projectName: 'Marketing Campaign',
      assignedTo: 'Mike Johnson',
      dueDate: '2025-11-25',
      priority: 'medium',
      status: 'todo',
    },
    {
      id: 4,
      title: 'Database schema design',
      description: 'Design new database schema',
      projectId: 4,
      projectName: 'Database Migration',
      assignedTo: 'Sarah Williams',
      dueDate: '2025-10-28',
      priority: 'high',
      status: 'overdue',
    },
    {
      id: 5,
      title: 'Update API documentation',
      description: 'Document all API endpoints',
      projectId: 2,
      projectName: 'Mobile App Development',
      assignedTo: 'John Doe',
      dueDate: '2025-11-30',
      priority: 'low',
      status: 'todo',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectName: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const task: Task = {
        id: tasks.length + 1,
        title: newTask.title,
        description: newTask.description,
        projectId: 1,
        projectName: newTask.projectName || 'Unassigned',
        assignedTo: newTask.assignedTo,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: 'todo',
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        projectName: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
      });
      setShowModal(false);
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-todo';
    }
  };

  // Get unique users for filter
  const users = ['all', ...new Set(tasks.map((t) => t.assignedTo))];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const userMatch = filterUser === 'all' || task.assignedTo === filterUser;
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    return userMatch && statusMatch;
  });

  // Group tasks by user
  const tasksByUser = filteredTasks.reduce((acc, task) => {
    if (!acc[task.assignedTo]) {
      acc[task.assignedTo] = [];
    }
    acc[task.assignedTo].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const overdueTasks = tasks.filter((t) => t.status === 'overdue');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p className="subtitle">Manage team tasks and assignments</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </header>

      {/* Task Stats */}
      <div className="task-stats">
        <div className="stat-box">
          <h3>{inProgressTasks.length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-box overdue">
          <h3>{overdueTasks.length}</h3>
          <p>Overdue Tasks</p>
        </div>
        <div className="stat-box completed">
          <h3>{completedTasks.length}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <div className="alert-box">
          <h3>⚠️ Overdue Tasks</h3>
          <p>You have {overdueTasks.length} task(s) that are past their due date.</p>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Filter by User:</label>
          <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            {users.map((user) => (
              <option key={user} value={user}>
                {user === 'all' ? 'All Users' : user}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Tasks by User */}
      <div className="tasks-by-user">
        {Object.entries(tasksByUser).map(([user, userTasks]) => (
          <div key={user} className="user-section">
            <h2 className="user-name">
              {user} <span className="task-count">({userTasks.length} tasks)</span>
            </h2>
            <div className="tasks-list">
              {userTasks.map((task) => (
                <div key={task.id} className={`task-card ${getStatusClass(task.status)}`}>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="project-tag">{task.projectName}</span>
                    <span className="due-date">Due: {task.dueDate}</span>
                  </div>
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value as Task['status'])
                      }
                      className={`status-select ${getStatusClass(task.status)}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={newTask.projectName}
                onChange={(e) =>
                  setNewTask({ ...newTask, projectName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Assigned To *</label>
              <input
                type="text"
                placeholder="Enter team member name"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleCreateTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
