import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, MousePointerClick, Copy, BarChart2 } from 'lucide-react';

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchUrls = async () => {
    try {
      const res = await axios.get('https://url-shortener-api-cvh5.onrender.com/api/urls/my-urls', { headers });
      setUrls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async () => {
    if (!originalUrl) return;
    setLoading(true);
    setError('');
    try {
      await axios.post('https://url-shortener-api-cvh5.onrender.com/api/urls/shorten', { originalUrl }, { headers });
      setOriginalUrl('');
      fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const copyToClipboard = (shortCode, id) => {
    navigator.clipboard.writeText(`https://url-shortener-api-cvh5.onrender.com/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '8px'}}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Shortly
        </h1>
        <div style={styles.headerRight}>
          <span style={styles.email}>{email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Shorten URL Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Shorten a URL</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="url"
            placeholder="Paste your long URL here..."
            value={originalUrl}
            onChange={e => setOriginalUrl(e.target.value)}
          />
          <button style={styles.button} onClick={handleShorten} disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </div>

      {/* URLs List */}
      <div style={styles.urlList}>
        <h2 style={styles.cardTitle}>Your Links</h2>
        {urls.length === 0 && <p style={styles.empty}>No links yet. Shorten your first URL above!</p>}
        {urls.map(url => (
          <div key={url._id} style={styles.urlCard}>
            <div style={styles.urlInfo}>
              <div style={styles.shortUrlContainer}>
                <Link size={14} style={{flexShrink: 0}} />
                <p style={styles.shortUrl}>https://url-shortener-api-cvh5.onrender.com/{url.shortCode}</p>
              </div>
              <p style={styles.originalUrl} title={url.originalUrl}>
                {url.originalUrl}
              </p>
              <p style={styles.clicks}>
                <MousePointerClick size={14} style={{marginRight: '4px', flexShrink: 0}} />
                {url.clicks.length} clicks
              </p>
            </div>
            <div style={styles.urlActions}>
              <button 
                style={{...styles.copyBtn, ...(copiedId === url._id ? styles.copiedBtn : {})}} 
                onClick={() => copyToClipboard(url.shortCode, url._id)}
              >
                {copiedId === url._id ? 'Copied!' : 'Copy'}
              </button>
              <button style={styles.analyticsBtn} onClick={() => navigate(`/analytics/${url._id}`)}>
                Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    backgroundColor: '#f0f4ff', 
    padding: '16px' 
  },
  header: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  title: { 
    margin: 0, 
    fontSize: '20px',
    flexShrink: 0,
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px',
    width: '100%',
    justifyContent: 'space-between',
  },
  email: { 
    color: '#666', 
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    padding: '6px 12px', 
    backgroundColor: '#ef4444', 
    color: 'white',
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  card: {
    background: 'white', 
    padding: '20px', 
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', 
    marginBottom: '24px',
  },
  cardTitle: { 
    margin: '0 0 16px 0', 
    fontSize: '18px',
    fontWeight: '600',
  },
  inputRow: { 
    display: 'flex', 
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    flex: 1, 
    padding: '12px 16px', 
    borderRadius: '8px',
    border: '1px solid #ddd', 
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 24px', 
    backgroundColor: '#4f46e5', 
    color: 'white',
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '14px', 
    cursor: 'pointer',
    fontWeight: '500',
  },
  error: { 
    color: 'red', 
    marginBottom: '12px',
    fontSize: '14px',
  },
  urlList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px' 
  },
  empty: { 
    color: '#999', 
    textAlign: 'center', 
    padding: '40px' 
  },
  urlCard: {
    background: 'white', 
    padding: '16px', 
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex', 
    flexDirection: 'column',
    gap: '12px',
  },
  urlInfo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px',
    width: '100%',
  },
  shortUrlContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
  },
  shortUrl: { 
    margin: 0, 
    fontWeight: 'bold', 
    color: '#4f46e5',
    fontSize: '13px',
    wordBreak: 'break-all',
    lineHeight: '1.4',
  },
  originalUrl: { 
    margin: 0, 
    color: '#999', 
    fontSize: '12px',
    wordBreak: 'break-all',
    lineHeight: '1.4',
    maxHeight: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  clicks: { 
    margin: '4px 0 0 0', 
    fontSize: '12px', 
    color: '#666',
    display: 'flex',
    alignItems: 'center',
  },
  urlActions: { 
    display: 'flex', 
    gap: '8px',
    justifyContent: 'flex-end',
  },
  copyBtn: {
    padding: '8px 16px', 
    backgroundColor: '#e0e7ff', 
    color: '#4f46e5',
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  copiedBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
  analyticsBtn: {
    padding: '8px 16px', 
    backgroundColor: '#4f46e5', 
    color: 'white',
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
};

// Media queries using window.matchMedia
const styleElement = document.createElement('style');
styleElement.textContent = `
  @media (min-width: 768px) {
    .dashboard-responsive {
      padding: 24px;
    }
  }
`;
document.head.appendChild(styleElement);

export default Dashboard;