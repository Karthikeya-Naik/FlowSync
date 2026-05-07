import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'User';
  const initial   = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .fs-navbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #fafaf8;
          border-bottom: 1px solid #e8e6e0;
          padding: 0 28px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Left */
        .fs-nb-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .fs-nb-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-nb-sub {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Right */
        .fs-nb-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .fs-nb-avatar {
          width: 40px;
          height: 40px;
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
      `}</style>

      <header className="fs-navbar">
        <div className="fs-nb-left">
          <span className="fs-nb-title">Welcome back, {firstName}!</span>
          <span className="fs-nb-sub">Here's what's happening with your tasks today.</span>
        </div>

        <div className="fs-nb-right">
          <div className="fs-nb-avatar">{initial}</div>
        </div>
      </header>
    </>
  );
};

export default Navbar;