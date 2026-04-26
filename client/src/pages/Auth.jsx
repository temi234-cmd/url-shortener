import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
       <h1 style={styles.title}>
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '8px'}}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
  Shortly
</h1>
        <p style={styles.subtitle}>{isLogin ? 'Welcome back!' : 'Create your account'}</p>

        {error && <p style={styles.error}>{error}</p>}

       <input
  style={styles.input}
  type="email"
  placeholder="Email"
  autoComplete="off"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>
<div style={{ position: 'relative' }}>
  <input
    style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    autoComplete="off"
    value={password}
    onChange={e => setPassword(e.target.value)}
  />
  <span
  onClick={() => setShowPassword(!showPassword)}
  style={{
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#999'
  }}
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</span>
</div>
     <button 
  style={styles.button} 
  type="button"
  onClick={handleSubmit}
>
  {isLogin ? 'Login' : 'Sign Up'}
</button>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: { textAlign: 'center', fontSize: '28px', margin: 0 },
  subtitle: { textAlign: 'center', color: '#666', margin: 0 },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: { color: 'red', textAlign: 'center', margin: 0 },
  toggle: { textAlign: 'center', margin: 0 },
  link: { color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' },
};

export default Auth;