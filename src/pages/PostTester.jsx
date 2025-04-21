import { useEffect, useState } from 'react';

export default function PostTester() {
  const [riderPosts, setRiderPosts] = useState([]);
  const [driverPosts, setDriverPosts] = useState([]);

  const [formData, setFormData] = useState({
    user_id: '',
    place_from: '',
    place_to: '',
    time_from: '',
    time_to: '',
    is_rider_post: true,
    seats_needed: '',
    available_seats: '',
  });

  const fetchPosts = () => {
    fetch("http://localhost:3000/api/posts?is_rider_post=true", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRiderPosts(data));

    fetch("http://localhost:3000/api/posts?is_rider_post=false", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDriverPosts(data));
  };

  useEffect(() => {
    // Rider posts
    fetch("http://localhost:3000/api/posts?is_rider_post=true", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRiderPosts(data);
        else console.error("Invalid rider response:", data);
      })
      .catch((err) => console.error("Rider fetch error:", err));
  
    // Driver posts
    fetch("http://localhost:3000/api/posts?is_rider_post=false", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDriverPosts(data);
        else console.error("Invalid driver response:", data);
      })
      .catch((err) => console.error("Driver fetch error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: Number(formData.user_id),
      place_from: formData.place_from,
      place_to: formData.place_to,
      time_from: formData.time_from,
      time_to: formData.time_to || null,
      is_rider_post: formData.is_rider_post,
      available_seats: formData.is_rider_post ? null : Number(formData.available_seats),
      seats_needed: formData.is_rider_post ? Number(formData.seats_needed) : null,
    };

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Post created!");
      fetchPosts();
      setFormData({
        user_id: '',
        place_from: '',
        place_to: '',
        time_from: '',
        time_to: '',
        is_rider_post: true,
        seats_needed: '',
        available_seats: '',
      });
    } else {
      alert("Failed to create post.");
    }
  };

  // Graceful error display in case of issue fetching posts
  if (!Array.isArray(riderPosts)) return <p>Loading rider posts failed</p>;
  if (!Array.isArray(driverPosts)) return <p>Loading driver posts failed</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛠 Post Tester</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h2>Create a Post</h2>
        <label>User ID:
          <input type="number" name="user_id" value={formData.user_id} onChange={handleChange} required />
        </label>
        <br />
        <label>From:
          <input type="text" name="place_from" value={formData.place_from} onChange={handleChange} required />
        </label>
        <br />
        <label>To:
          <input type="text" name="place_to" value={formData.place_to} onChange={handleChange} required />
        </label>
        <br />
        <label>Time From:
          <input type="time" name="time_from" value={formData.time_from} onChange={handleChange} required />
        </label>
        <br />
        <label>Time To:
          <input type="time" name="time_to" value={formData.time_to} onChange={handleChange} />
        </label>
        <br />
        <label>
          <input type="checkbox" name="is_rider_post" checked={formData.is_rider_post} onChange={handleChange} />
          Rider Post?
        </label>
        <br />
        {formData.is_rider_post ? (
          <label>Seats Needed:
            <input type="number" name="seats_needed" value={formData.seats_needed} onChange={handleChange} required />
          </label>
        ) : (
          <label>Available Seats:
            <input type="number" name="available_seats" value={formData.available_seats} onChange={handleChange} required />
          </label>
        )}
        <br />
        <button type="submit">Create Post</button>
      </form>

      <h2>Rider Posts</h2>
      <ul>
        {riderPosts.map(post => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (needs {post.seats_needed})
          </li>
        ))}
      </ul>

      <h2>Driver Posts</h2>
      <ul>
        {driverPosts.map(post => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (seats: {post.available_seats})
          </li>
        ))}
      </ul>
    </div>
  );
}