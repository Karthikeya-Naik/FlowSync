import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register({ name, email, password });
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Left Panel — Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="white" fillOpacity="0.15" />
              <path d="M10 18L16 24L26 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={styles.logoText}>FlowSync</span>
          </div>

          <div style={styles.heroText}>
            <h1 style={styles.heroHeading}>Start flowing<br />in minutes</h1>
          </div>
          <p style={styles.heroSubtext}>
            Create your workspace and manage projects effortlessly.
          </p>
        </div>

        <div style={styles.blob1} />
        <div style={styles.blob2} />
      </div>

      {/* Right Panel — Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                required
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="signup-email">Work email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} />
                  Creating account…
                </span>
              ) : 'Create free account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
      `}</style>
    </div>
  );
};

const DARK_BLUE = '#0f1f3d';
const MID_BLUE = '#1a3460';
const ACCENT_BLUE = '#2563eb';
const WHITE = '#ffffff';

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: '#f8fafc',
  },

  /* ── Left Panel ── */
  leftPanel: {
    flex: '1 1 45%',
    background: `linear-gradient(145deg, ${DARK_BLUE} 0%, ${MID_BLUE} 60%, #1e4080 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 3.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  leftInner: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '420px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '22px',
    fontWeight: '700',
    color: WHITE,
    letterSpacing: '-0.3px',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  heroHeading: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '38px',
    fontWeight: '700',
    color: WHITE,
    lineHeight: '1.15',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  blob1: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(37,99,235,0.2)',
    zIndex: 1,
  },
  blob2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(37,99,235,0.12)',
    zIndex: 1,
  },

  /* ── Right Panel ── */
  rightPanel: {
    flex: '1 1 55%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    backgroundColor: '#f8fafc',
  },
  formCard: {
    background: WHITE,
    borderRadius: '18px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
    padding: '2rem',
    width: '100%',
    maxWidth: '390px',
  },
  formHeader: {
    marginBottom: '1.5rem',
  },
  formTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px',
    letterSpacing: '-0.3px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 13px',
    fontSize: '15px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    width: '100%',
    padding: '10px 13px',
    fontSize: '15px',
    border: `1.5px solid ${ACCENT_BLUE}`,
    borderRadius: '10px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: WHITE,
    boxShadow: `0 0 0 3px rgba(37,99,235,0.12)`,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  submitBtn: {
    marginTop: '0.25rem',
    width: '100%',
    padding: '11px',
    backgroundColor: ACCENT_BLUE,
    color: WHITE,
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    letterSpacing: '0.1px',
  },
  submitBtnDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: WHITE,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '14px',
    color: '#64748b',
  },
  switchLink: {
    color: ACCENT_BLUE,
    fontWeight: '500',
    textDecoration: 'none',
  },
  heroSubtext: {
  fontSize: '15px',
  color: 'rgba(255,255,255,0.72)',
  lineHeight: '1.7',
  margin: 0,
  maxWidth: '340px',
  },
};

export default Signup;