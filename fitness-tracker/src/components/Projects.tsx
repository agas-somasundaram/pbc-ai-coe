import React, { useState } from 'react';
import './Projects.css';

export interface Project {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  assignedTo: string;
  taskCount: number;
}

interface ProjectsProps {
  onSelectProject?: (projectId: number) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      dueDate: '2025-12-01',
      status: 'active',
      assignedTo: 'John Doe',
      taskCount: 8,
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Build iOS and Android apps',
      dueDate: '2025-11-10',
      status: 'overdue',
      assignedTo: 'Jane Smith',
      taskCount: 12,
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q4 marketing initiatives',
      dueDate: '2025-12-15',
      status: 'active',
      assignedTo: 'Mike Johnson',
      taskCount: 5,
    },
    {
      id: 4,
      name: 'Database Migration',
      description: 'Migrate to new database system',
      dueDate: '2025-10-30',
      status: 'overdue',
      assignedTo: 'Sarah Williams',
      taskCount: 6,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    dueDate: '',
    assignedTo: '',
  });

  const handleCreateProject = () => {
    if (newProject.name && newProject.dueDate && newProject.assignedTo) {
      const project: Project = {
        id: projects.length + 1,
        name: newProject.name,
        description: newProject.description,
        dueDate: newProject.dueDate,
        status: 'active',
        assignedTo: newProject.assignedTo,
        taskCount: 0,
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '', dueDate: '', assignedTo: '' });
      setShowModal(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-active';
    }
  };

  const overdueProjects = projects.filter((p) => p.status === 'overdue');
  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  return (
    <div className="projects-container">
      <header className="projects-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">Manage your team's projects</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </header>

      {/* Project Stats */}
      <div className="project-stats">
        <div className="stat-box">
          <h3>{activeProjects.length}</h3>
          <p>Active Projects</p>
        </div>
        <div className="stat-box overdue">
          <h3>{overdueProjects.length}</h3>
          <p>Overdue Projects</p>
        </div>
        <div className="stat-box completed">
          <h3>{completedProjects.length}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Overdue Projects Alert */}
      {overdueProjects.length > 0 && (
        <div className="alert-box">
          <h3>⚠️ Overdue Projects</h3>
          <p>You have {overdueProjects.length} project(s) that are past their due date.</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card ${getStatusClass(project.status)}`}
            onClick={() => onSelectProject && onSelectProject(project.id)}
          >
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status-badge ${getStatusClass(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Due Date:</span>
                <span className="meta-value">{project.dueDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Assigned To:</span>
                <span className="meta-value">{project.assignedTo}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tasks:</span>
                <span className="meta-value">{project.taskCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Assigned To *</label>
              <input
                type="text"
                placeholder="Enter team member name"
                value={newProject.assignedTo}
                onChange={(e) =>
                  setNewProject({ ...newProject, assignedTo: e.target.value })
                }
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
