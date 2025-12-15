import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import './App.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <h2>🏋️ FitTrack Pro</h2>
        <span className="tagline">Your Personal Fitness Companion</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive('/')}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/projects" className={isActive('/projects')}>
            🎯 Projects
          </Link>
        </li>
        <li>
          <Link to="/tasks" className={isActive('/tasks')}>
            ✅ Tasks
          </Link>
        </li>
      </ul>
      <div className="nav-actions">
        <button className="btn-secondary">Settings</button>
        <button className="btn-primary">Upgrade</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
