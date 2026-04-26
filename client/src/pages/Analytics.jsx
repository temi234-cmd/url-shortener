import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, MousePointerClick, Bot } from 'lucide-react';
function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [url, setUrl] = useState(null);
  const [insight, setInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    fetchUrl();
  }, []);

  const fetchUrl = async () => {
    try {
      const res = await axios.get('https://url-shortener-api-cvh5.onrender.com/api/urls/my-urls', { headers });
      const found = res.data.find(u => u._id === id);
      setUrl(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await axios.get(`https://url-shortener-api-cvh5.onrender.com/api/urls/${id}/insight`, { headers });
      setInsight(res.data.insight);
    } catch (err) {
      console.error(err);
    }
    setLoadingInsight(false);
  };

  if (!url) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1 style={styles.title}>🔗 Analytics</h1>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Link Details</h2>
        <p style={styles.shortUrl}><Link size={14} style={{marginRight:'4px'}} /> https://url-shortener-api-cvh5.onrender.com/{url.shortCode}</p>
        <p style={styles.originalUrl}>Original: {url.originalUrl}</p>
        <p style={styles.created}>Created: {new Date(url.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Click Statistics</h2>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <p style={styles.statNumber}>{url.clicks.length}</p>
            <p style={styles.statLabel}>Total Clicks</p>
          </div>
          <div style={styles.statBox}>
            <p style={styles.statNumber}>
              {url.clicks.filter(c => c.source === 'direct').length}
            </p>
            <p style={styles.statLabel}>Direct Visits</p>
          </div>
          <div style={styles.statBox}>
            <p style={styles.statNumber}>
              {url.clicks.length > 0
                ? new Date(url.clicks[url.clicks.length - 1].timestamp).toLocaleDateString()
                : 'N/A'}
            </p>
            <p style={styles.statLabel}>Last Click</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Click History</h2>
        {url.clicks.length === 0 && <p style={styles.empty}>No clicks yet.</p>}
        {url.clicks.map((click, i) => (
          <div key={i} style={styles.clickRow}>
            <span><MousePointerClick size={14} style={{marginRight:'4px'}} /> Click {i + 1}</span>
            <span style={styles.clickTime}>
              {new Date(click.timestamp).toLocaleString()}
            </span>
            <span style={styles.clickSource}>{click.source}</span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}><Bot size={18} style={{marginRight:'6px'}} /> AI Insight

</h2>
        {insight ? (
          <p style={styles.insight}>{insight}</p>
        ) : (
          <button style={styles.button} onClick={fetchInsight} disabled={loadingInsight}>
            {loadingInsight ? 'Generating insight...' : 'Generate AI Insight'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4ff', padding: '24px', maxWidth: '800px', margin: '0 auto' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  title: { margin: 0, fontSize: '24px' },
  backBtn: {
    padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  card: {
    background: 'white', padding: '24px', borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { margin: '0 0 16px 0', fontSize: '18px' },
  shortUrl: { margin: '0 0 8px 0', fontWeight: 'bold', color: '#4f46e5' },
  originalUrl: { margin: '0 0 8px 0', color: '#666', fontSize: '14px' },
  created: { margin: 0, color: '#999', fontSize: '13px' },
  statsRow: { display: 'flex', gap: '16px' },
  statBox: {
    flex: 1, textAlign: 'center', padding: '16px',
    backgroundColor: '#f0f4ff', borderRadius: '12px',
  },
  statNumber: { margin: '0 0 4px 0', fontSize: '28px', fontWeight: 'bold', color: '#4f46e5' },
  statLabel: { margin: 0, color: '#666', fontSize: '13px' },
  empty: { color: '#999', textAlign: 'center', padding: '20px' },
  clickRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #f0f0f0',
  },
  clickTime: { color: '#666', fontSize: '13px' },
  clickSource: {
    padding: '4px 8px', backgroundColor: '#e0e7ff',
    color: '#4f46e5', borderRadius: '4px', fontSize: '12px',
  },
  button: {
    padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer',
  },
  insight: {
    color: '#333', lineHeight: '1.6', padding: '16px',
    backgroundColor: '#f0f4ff', borderRadius: '8px', margin: 0,
  },
};

export default Analytics;