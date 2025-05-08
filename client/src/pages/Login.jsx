import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/styles.css';

function Login() {
  const { login, loginWithGoogle } = useAuth();;
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (!success) setError('Login failed. Try again.');
    else navigate('/');
  };

  return (
    <div className="center-item">
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} className="flex-container-column" style={{ minWidth: '300px' }}>
        <input
          name="email"
          type="email"
          placeholder="UMass Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-box"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input-box"
        />
        <button type="submit" className="red-button">Log In</button>
        {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      </form>

      <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
        If you signed up with Google, please use <strong>Google Sign-In</strong> below.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await fetch('/api/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: credentialResponse.credential }),
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.error);

              loginWithGoogle(data.token, data.user);
              navigate('/');
            } catch (err) {
              setError(err.message);
            }
          }}
          onError={() => setError('Google Sign-In failed')}
          text="signin_with"
        />
      </div>

      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default Login;