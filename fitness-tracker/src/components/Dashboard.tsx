import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityLog {
  id: number;
  activity: string;
  calories: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 1, activity: 'Running', calories: 350, date: '2025-11-15' },
    { id: 2, activity: 'Cycling', calories: 280, date: '2025-11-16' },
    { id: 3, activity: 'Swimming', calories: 420, date: '2025-11-17' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ activity: '', calories: 0 });

  // Weekly steps data
  const weeklySteps = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Steps',
        data: [8500, 10200, 9800, 12000, 7500, 11000, 9500],
        borderColor: '#FF4500',
        backgroundColor: 'rgba(255, 69, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Daily calorie intake data
  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: [2100, 2300, 1950, 2200, 2400, 2150, 2000],
        borderColor: '#FF6347',
        backgroundColor: 'rgba(255, 99, 71, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const handleLogActivity = () => {
    if (newActivity.activity && newActivity.calories > 0) {
      const newLog: ActivityLog = {
        id: activityLogs.length + 1,
        activity: newActivity.activity,
        calories: newActivity.calories,
        date: new Date().toISOString().split('T')[0],
      };
      setActivityLogs([...activityLogs, newLog]);
      setNewActivity({ activity: '', calories: 0 });
      setShowModal(false);
    }
  };

  const totalSteps = weeklySteps.datasets[0].data.reduce((a, b) => a + b, 0);
  const avgCalories = Math.round(
    calorieData.datasets[0].data.reduce((a, b) => a + b, 0) / 7
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Fitness Dashboard</h1>
        <button className="log-activity-btn" onClick={() => setShowModal(true)}>
          + Log Activity
        </button>
      </header>

      <div className="dashboard-layout">
        {/* Left Sidebar - Weekly Progress */}
        <aside className="sidebar left-sidebar">
          <h2>Weekly Progress</h2>
          <div className="stat-card">
            <h3>Total Steps</h3>
            <p className="stat-value">{totalSteps.toLocaleString()}</p>
            <span className="stat-label">This Week</span>
          </div>
          <div className="stat-card">
            <h3>Avg Calories</h3>
            <p className="stat-value">{avgCalories}</p>
            <span className="stat-label">Per Day</span>
          </div>
          <div className="stat-card">
            <h3>Active Days</h3>
            <p className="stat-value">7/7</p>
            <span className="stat-label">This Week</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="chart-container">
            <h2>Weekly Steps</h2>
            <div className="chart-wrapper">
              <Line data={weeklySteps} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <h2>Daily Calorie Intake</h2>
            <div className="chart-wrapper">
              <Line data={calorieData} options={chartOptions} />
            </div>
          </div>
        </main>

        {/* Right Sidebar - Activity Log */}
        <aside className="sidebar right-sidebar">
          <h2>Activity Log</h2>
          <div className="activity-list">
            {activityLogs.map((log) => (
              <div key={log.id} className="activity-item">
                <div className="activity-info">
                  <h4>{log.activity}</h4>
                  <p>{log.calories} cal</p>
                </div>
                <span className="activity-date">{log.date}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Modal for logging activity */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Log New Activity</h2>
            <div className="form-group">
              <label>Activity Type</label>
              <input
                type="text"
                placeholder="e.g., Running, Yoga"
                value={newActivity.activity}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, activity: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                placeholder="0"
                value={newActivity.calories || ''}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    calories: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleLogActivity}>
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
