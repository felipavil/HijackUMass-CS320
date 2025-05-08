import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';

function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: 'driver',
    from: '',
    to: '',
    date: '',
    seats: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create post');
      navigate('/');
    } catch (err) {
      alert('Error creating post: ' + err.message);
    }
  };

  return (
    <div className="center-item">
      <h1>Create a Ride Post</h1>
      <form onSubmit={handleSubmit} className="flex-container-column" style={{ minWidth: '300px' }}>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-box"
        >
          <option value="driver">Driver</option>
          <option value="rider">Rider</option>
        </select>

        <input
          name="from"
          type="text"
          placeholder="From Location"
          value={formData.from}
          onChange={handleChange}
          className="input-box"
          required
        />
        <input
          name="to"
          type="text"
          placeholder="To Location"
          value={formData.to}
          onChange={handleChange}
          className="input-box"
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="input-box"
          required
        />
        <input
          name="seats"
          type="number"
          value={formData.seats}
          onChange={handleChange}
          min="1"
          className="input-box"
          required
        />
        <button type="submit" className="red-button">Post Ride</button>
      </form>
    </div>
  );
}

export default CreatePost;
