import { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { fetchDashboardStats } from '../services/api';

function DashboardPage() {
  const [stats, setStats] = useState({ students: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats()
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load dashboard data. Start the Spring Boot backend on localhost:8081.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      {loading ? (
        <p className="state-text">Loading dashboard...</p>
      ) : error ? (
        <p className="alert-box error">{error}</p>
      ) : (
        <div className="stats-grid">
          <StatsCard label="Students" value={stats.students || 0} tone="primary" />
          <StatsCard label="Certificates" value={stats.certificates || 0} tone="secondary" />
          <StatsCard label="Status" value="Active" tone="success" />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
