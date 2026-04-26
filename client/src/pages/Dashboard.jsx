import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, MousePointerClick, Copy, BarChart2 } from 'lucide-react';
function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchUrls = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/urls/my-urls', { headers });
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
      await axios.post('http://localhost:5000/api/urls/shorten', { originalUrl }, { headers });
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

  const copyToClipboard = (shortCode) => {
    navigator.clipboard.writeText(`http://localhost:5000/${shortCode}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div style={styles.container}>
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

      <div style={styles.urlList}>
        <h2 style={styles.cardTitle}>Your Links</h2>
        {urls.length === 0 && <p style={styles.empty}>No links yet. Shorten your first URL above!</p>}
        {urls.map(url => (
          <div key={url._id} style={styles.urlCard}>
            <div style={styles.urlInfo}>
              <p style={styles.shortUrl}><Link size={14} style={{marginRight:'4px'}} /> http://localhost:5000/{url.shortCode}</p>
              <p style={styles.originalUrl}>{url.originalUrl}</p>
              <p style={styles.clicks}><MousePointerClick size={14} style={{marginRight:'4px'}} /> {url.clicks.length} clicks</p>
            </div>
            <div style={styles.urlActions}>
              <button style={styles.copyBtn} onClick={() => copyToClipboard(url.shortCode)}>
                Copy
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
  container: { minHeight: '100vh', backgroundColor: '#f0f4ff', padding: '24px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px',
  },
  title: { margin: 0, fontSize: '24px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  email: { color: '#666', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
  },
  card: {
    background: 'white', padding: '24px', borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { margin: '0 0 16px 0', fontSize: '18px' },
  inputRow: { display: 'flex', gap: '12px' },
  input: {
    flex: 1, padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px', outline: 'none',
  },
  button: {
    padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer',
  },
  error: { color: 'red', marginBottom: '12px' },
  urlList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { color: '#999', textAlign: 'center', padding: '40px' },
  urlCard: {
    background: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  urlInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  shortUrl: { margin: 0, fontWeight: 'bold', color: '#4f46e5' },
  originalUrl: { margin: 0, color: '#999', fontSize: '13px', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  clicks: { margin: 0, fontSize: '13px', color: '#666' },
  urlActions: { display: 'flex', gap: '8px' },
  copyBtn: {
    padding: '8px 16px', backgroundColor: '#e0e7ff', color: '#4f46e5',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
  },
  analyticsBtn: {
    padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
  },
};

export default Dashboard;