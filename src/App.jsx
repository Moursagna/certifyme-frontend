import { useState } from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import CertificatesPage from './pages/CertificatesPage';
import VerificationPage from './pages/VerificationPage';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students', label: 'Students' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'verification', label: 'Verification' },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'students':
        return <StudentsPage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'verification':
        return <VerificationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <h1>CertifyMe</h1>
          <p>Digital Certificate System</p>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activePage ? 'nav-button active' : 'nav-button'}
              onClick={() => setActivePage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
