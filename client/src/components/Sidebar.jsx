import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects',  label: 'Projects',  icon: FolderKanban  },
    { path: '/tasks',     label: 'Tasks',     icon: CheckSquare   },
    { path: '/members',   label: 'Members',   icon: Users         },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .fs-sidebar {
          width: 240px;
          height: 100vh;
          background: #fafaf8;
          border-right: 1px solid #e8e6e0;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }

        .fs-logo {
          padding: 22px 20px 18px;
          border-bottom: 1px solid #e8e6e0;
        }
        .fs-logo-wordmark {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fs-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
          flex-shrink: 0;
          margin-bottom: 1px;
        }
        .fs-logo-sub {
          font-size: 11px;
          font-weight: 400;
          color: #94a3b8;
          margin-top: 2px;
          letter-spacing: 0.3px;
        }

        .fs-user {
          padding: 14px 16px;
          margin: 12px 12px 4px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e8e6e0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fs-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          flex-shrink: 0;
        }
        .fs-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-user-role {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
        }

        .fs-nav {
          flex: 1;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }
        .fs-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          color: #b0b8c4;
          text-transform: uppercase;
          padding: 8px 8px 4px;
        }
        .fs-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .fs-link:hover {
          background: #f1f0eb;
          color: #0f172a;
        }
        .fs-link.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }
        .fs-link-icon {
          color: #94a3b8;
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .fs-link:hover .fs-link-icon {
          color: #475569;
        }
        .fs-link.active .fs-link-icon {
          color: #2563eb;
        }

        .fs-footer {
          padding: 12px;
          border-top: 1px solid #e8e6e0;
        }
        .fs-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .fs-logout:hover {
          background: #fff1f2;
          color: #e11d48;
        }
        .fs-logout-icon {
          color: #c4c9d4;
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .fs-logout:hover .fs-logout-icon {
          color: #e11d48;
        }
      `}</style>

      <aside className="fs-sidebar">
        {/* Logo */}
        <div className="fs-logo">
          <div className="fs-logo-wordmark">
            <div className="fs-logo-dot" />
            FlowSync
          </div>
          <div className="fs-logo-sub">Team Task Manager</div>
        </div>

        {/* User chip */}
        <div className="fs-user">
          <div className="fs-avatar">{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div className="fs-user-name">{user?.name || 'User'}</div>
            <div className="fs-user-role">
              {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="fs-nav">
          <div className="fs-nav-label">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `fs-link${isActive ? ' active' : ''}`}
              >
                <Icon size={17} className="fs-link-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="fs-footer">
          <button className="fs-logout" onClick={handleLogout} aria-label="Logout">
            <LogOut size={17} className="fs-logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;