import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import "../components/PostCard/post-card-styles.css";
import "../components/PostInnerCard/post-inner-card.css";


export default function PostTester() {
  const { user } = useUser();

  const [postType, setPostType] = useState("have"); // "have" = driver
  const [formData, setFormData] = useState({
    place_from: "",
    place_to: "",
    time_from: "",  // NEED TO ADD 'date_from/to' FIELDS OR SOMETHING SIMILAR
    time_to: "",
    seats_needed: "",
    available_seats: "",
  });

  const [riderPosts, setRiderPosts] = useState([]);
  const [driverPosts, setDriverPosts] = useState([]);

  const isRider = postType === "need";

  const fetchPosts = () => {
    fetch("http://localhost:3000/api/posts?is_rider_post=true")
      .then((res) => res.json())
      .then((data) => setRiderPosts(Array.isArray(data) ? data : []));

    fetch("http://localhost:3000/api/posts?is_rider_post=false")
      .then((res) => res.json())
      .then((data) => setDriverPosts(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: 1, // hardcoded for now, can replace later
      place_from: formData.place_from,
      place_to: formData.place_to,
      time_from: formData.time_from,      // MAKE TIMESTAMP BY FUSING DATE+TIME FIELDS
      time_to: formData.time_to || null,  // DITTO
      is_rider_post: isRider,
      available_seats: isRider ? null : formData.available_seats ? Number(formData.available_seats) : null,
      seats_needed: isRider ? (formData.seats_needed ? Number(formData.seats_needed) : null) : null,
    };

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Post created!");
      setFormData({
        place_from: "",
        place_to: "",
        time_from: "",
        time_to: "",
        seats_needed: "",
        available_seats: "",
      });
      fetchPosts();
    } else {
        const data = await res.json();
        console.error("Post failed:", data);
        alert(`Failed to create post:\n${data.error || 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="flex-container-filter align-center">
        <div className="filter-container small-font post-card-container">
          I{" "}
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option value="have">HAVE</option>
            <option value="need">NEED</option>
          </select>{" "}
          A RIDE
        </div>
      </div>

      <form className="post-form small-font flex-container-column" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="place_from">From:</label>
          <input name="place_from" value={formData.place_from} onChange={handleChange} required />

          <label htmlFor="place_to">To:</label>
          <input name="place_to" value={formData.place_to} onChange={handleChange} required />
        </div>

        <div className="form-grid">
          <label htmlFor="time_from">Time From:</label>
          <input type="time" name="time_from" value={formData.time_from} onChange={handleChange} required />

          <label htmlFor="time_to">Time To:</label>
          <input type="time" name="time_to" value={formData.time_to} onChange={handleChange} />
        </div>

        <div className="form-grid">
          {isRider ? (
            <>
              <label htmlFor="seats_needed">Seats Needed:</label>
              <input type="number" name="seats_needed" value={formData.seats_needed} onChange={handleChange} required />
            </>
          ) : (
            <>
              <label htmlFor="available_seats">Available Seats:</label>
              <input type="number" name="available_seats" value={formData.available_seats} onChange={handleChange} required />
            </>
          )}
        </div>

        <input type="submit" value="Publish!" className="red-button" />
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Rider Posts</h2>
      <ul>
        {riderPosts.map((post) => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (needs {post.seats_needed})
          </li>
        ))}
      </ul>

      <h2>Driver Posts</h2>
      <ul>
        {driverPosts.map((post) => (
          <li key={post.post_id}>
            {post.place_from} → {post.place_to} (seats: {post.available_seats})
          </li>
        ))}
      </ul>
    </div>
  );
}
