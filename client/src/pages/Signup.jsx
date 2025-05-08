import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/styles.css'; // Make sure global styles are applied

function Signup() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      loginWithGoogle(data.token, data.user);
      navigate('/');
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="center-item">
      <h1>Sign Up</h1>
      {err && <p style={{ color: 'var(--red)' }}>{err}</p>}

      <form onSubmit={handleSubmit} className="flex-container-column" style={{ minWidth: '300px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="input-box"
        />
        <input
          type="email"
          placeholder="UMass Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input-box"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="input-box"
        />
        <button type="submit" className="red-button">Sign Up</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>— OR —</p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
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

              login(data.token, data.user);
              navigate('/');
            } catch (err) {
              setErr(err.message);
            }
          }}
          onError={() => setErr('Google Sign-Up failed')}
        />
      </div>

      <p style={{ marginTop: '1rem' }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}

export default Signup;
